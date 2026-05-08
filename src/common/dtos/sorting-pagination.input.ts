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
@InputType()
export class SortingPaginationFieldInput<T> {
  @Field(() => Type<T>, { nullable: true }) field?: T;
  @Field(() => SortDirection, { nullable: true }) direction?: SortDirection;
}

const sortingTypeCache = new Map<Type<unknown>, Type<object>>();

export function createSortingPaginationType<TClass>(
  classRef: Type<TClass>,
): Type<object> {
  const cached = sortingTypeCache.get(classRef);
  if (cached) return cached;

  @InputType(`${classRef.name}SortingPaginationInput`, { isAbstract: true })
  class SortingPaginationInput {}

  const fieldNames: string[] =
    (Reflect.getMetadata(SORTABLE_KEY, classRef.prototype) as
      | string[]
      | undefined) ?? [];

  for (const fieldName of fieldNames) {
    Field(() => SortingPaginationFieldInput, { nullable: true })(
      SortingPaginationInput.prototype,
      fieldName,
    );
  }

  sortingTypeCache.set(classRef, SortingPaginationInput);

  return SortingPaginationInput;
}
