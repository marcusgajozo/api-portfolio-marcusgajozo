import { Type } from '@nestjs/common';
import { Field, InputType, registerEnumType } from '@nestjs/graphql';
import {
  SORTABLE_KEY,
  SortableMetadata,
} from '../decorators/sortable.decorator';
import { SortingInput } from '../types/sorting-input.type';
import { SortDirection } from '../enums/sort-direction.enum';

registerEnumType(SortDirection, {
  name: 'SortDirection',
  description: 'Direção da ordenação (ascendente ou descendente)',
});

const sortingTypeCache = new Map<string, Type<SortingInput>>();
const enumCache = new Map<string, object>();

function getSortablePaths<T>(classRef: Type<T>, prefix = ''): string[] {
  const sortableFields: SortableMetadata[] =
    (Reflect.getMetadata(SORTABLE_KEY, classRef.prototype as object) as
      | SortableMetadata[]
      | undefined) ?? [];

  const paths: string[] = [];

  for (const field of sortableFields) {
    if (field.typeFn) {
      paths.push(
        ...getSortablePaths(field.typeFn(), `${prefix}${field.name}.`),
      );
      continue;
    }

    paths.push(`${prefix}${field.name}`);
  }

  return paths;
}

export function createSortingPaginationType<TClass>(
  classRef: Type<TClass>,
): Type<SortingInput> {
  const inputName = `${classRef.name}SortingInput`;
  const enumName = `${classRef.name}SortableFieldsEnum`;

  const cached = sortingTypeCache.get(inputName);
  if (cached) return cached;

  const paths = getSortablePaths(classRef);

  let FieldsEnum = enumCache.get(enumName);

  if (!FieldsEnum) {
    const enumObj: Record<string, string> = {};

    for (const path of paths) {
      const enumKey = path.replace(/\./g, '_');
      enumObj[enumKey] = path;
    }

    FieldsEnum = enumObj;

    registerEnumType(FieldsEnum, {
      name: enumName,
    });

    enumCache.set(enumName, FieldsEnum);
  }

  @InputType(inputName)
  class SortingPaginationInput implements SortingInput {
    @Field(() => FieldsEnum)
    field: string;

    @Field(() => SortDirection)
    direction: SortDirection;
  }

  sortingTypeCache.set(inputName, SortingPaginationInput);

  return SortingPaginationInput;
}
