import { Type } from '@nestjs/common';
import { Field, InputType, registerEnumType } from '@nestjs/graphql';
import { SORTABLE_KEY } from '../decorators/sortable.decorator';

export enum SortDirection {
  asc = 'asc',
  desc = 'desc',
}

registerEnumType(SortDirection, {
  name: 'SortDirection',
  description: 'Direção da ordenação (ascendente ou descendente)',
});

type DynamicEnum = Record<string, string>;

const registeredEnums = new Map<string, DynamicEnum>();

export function createSortingPaginationType<TClass>(
  classRef: Type<TClass>,
): Type<object> {
  const enumName = `${classRef.name}SortFields`;

  let dynamicEnum = registeredEnums.get(enumName);

  if (!dynamicEnum) {
    const sortableFields: string[] =
      (Reflect.getMetadata(SORTABLE_KEY, classRef.prototype) as
        | string[]
        | undefined) ??
      (Reflect.getMetadata(SORTABLE_KEY, classRef) as string[] | undefined) ??
      [];

    if (sortableFields.length === 0) {
      throw new Error(
        `A classe ${classRef.name} precisa ter pelo menos um campo com @Sortable() para gerar a paginação.`,
      );
    }

    dynamicEnum = sortableFields.reduce<DynamicEnum>((acc, field) => {
      acc[field] = field;
      return acc;
    }, {});

    registerEnumType(dynamicEnum, {
      name: enumName,
      description: `Campos permitidos para ordenação em ${classRef.name}`,
    });

    registeredEnums.set(enumName, dynamicEnum);
  }

  const resolvedEnum = dynamicEnum;

  @InputType(`${classRef.name}SortingPaginationInput`, { isAbstract: true })
  class SortingPaginationInput {
    @Field(() => resolvedEnum, { nullable: true })
    field?: string;

    @Field(() => SortDirection, { nullable: true })
    direction?: SortDirection;
  }

  return SortingPaginationInput;
}
