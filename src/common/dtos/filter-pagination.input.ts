import { Type } from '@nestjs/common';
import { Field, InputType, Float, GraphQLISODateTime } from '@nestjs/graphql';
import { FILTERABLE_FIELDS_KEY } from '../decorators/filterable.decorator';
import {
  BooleanFilter,
  DateFilter,
  FilterType,
  NumberFilter,
  StringFilter,
} from '../types/filter-input.type';

@InputType()
export class StringFilterInput implements StringFilter {
  @Field(() => String, { nullable: true }) eq?: string;
  @Field(() => String, { nullable: true }) ne?: string;
  @Field(() => String, { nullable: true }) like?: string;
  @Field(() => String, { nullable: true }) ilike?: string;
  @Field(() => [String], { nullable: true }) in?: string[];
}

@InputType()
export class BooleanFilterInput implements BooleanFilter {
  @Field(() => Boolean, { nullable: true }) eq?: boolean;
}

@InputType()
export class NumberFilterInput implements NumberFilter {
  @Field(() => Float, { nullable: true }) eq?: number;
  @Field(() => Float, { nullable: true }) gt?: number;
  @Field(() => Float, { nullable: true }) gte?: number;
  @Field(() => Float, { nullable: true }) lt?: number;
  @Field(() => Float, { nullable: true }) lte?: number;
}

@InputType()
export class DateFilterInput implements DateFilter {
  @Field(() => GraphQLISODateTime, { nullable: true }) eq?: Date;
  @Field(() => GraphQLISODateTime, { nullable: true }) gt?: Date;
  @Field(() => GraphQLISODateTime, { nullable: true }) gte?: Date;
  @Field(() => GraphQLISODateTime, { nullable: true }) lt?: Date;
  @Field(() => GraphQLISODateTime, { nullable: true }) lte?: Date;
}

type FilterConstructor =
  | StringConstructor
  | BooleanConstructor
  | NumberConstructor
  | DateConstructor;

type FilterInputType =
  | typeof StringFilterInput
  | typeof BooleanFilterInput
  | typeof NumberFilterInput
  | typeof DateFilterInput;

interface FilterableField {
  propertyKey: string | symbol;
  type: unknown;
}

const filterTypeCache = new Map<Type<unknown>, Type<FilterType<unknown>>>();

const FILTER_MAP = new Map<FilterConstructor, FilterInputType>([
  [String, StringFilterInput],
  [Boolean, BooleanFilterInput],
  [Number, NumberFilterInput],
  [Date, DateFilterInput],
]);

export function createFilterType<T>(classRef: Type<T>): Type<FilterType<T>> {
  const cached = filterTypeCache.get(classRef);
  if (cached) return cached;
  @InputType(`${classRef.name}FilterInput`, { isAbstract: true })
  class FilterInputBase {}

  filterTypeCache.set(classRef, FilterInputBase);

  const fields =
    (Reflect.getMetadata(
      FILTERABLE_FIELDS_KEY,
      classRef.prototype as object,
    ) as FilterableField[] | undefined) ?? [];

  for (const field of fields) {
    const type = field.type as FilterConstructor;
    let fieldGraphQLType:
      | FilterInputType
      | Type<FilterType<unknown>>
      | undefined = FILTER_MAP.get(type);

    if (!fieldGraphQLType && typeof field.type === 'function') {
      fieldGraphQLType = createFilterType(field.type as Type<object>);
    }

    if (!fieldGraphQLType) continue;

    Field(() => fieldGraphQLType, { nullable: true })(
      FilterInputBase.prototype,
      field.propertyKey,
    );
  }

  return FilterInputBase;
}
