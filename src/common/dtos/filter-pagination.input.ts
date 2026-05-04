import { Type } from '@nestjs/common';
import { Field, InputType, Float, GraphQLISODateTime } from '@nestjs/graphql';
import { FILTERABLE_FIELDS_KEY } from '../decorators/filterable.decorator';

@InputType()
export class StringFilterInput {
  @Field(() => String, { nullable: true }) eq?: string;
  @Field(() => String, { nullable: true }) ne?: string;
  @Field(() => String, { nullable: true }) like?: string;
  @Field(() => String, { nullable: true }) ilike?: string;
  @Field(() => [String], { nullable: true }) in?: string[];
}

@InputType()
export class BooleanFilterInput {
  @Field(() => Boolean, { nullable: true }) eq?: boolean;
}

@InputType()
export class NumberFilterInput {
  @Field(() => Float, { nullable: true }) eq?: number;
  @Field(() => Float, { nullable: true }) gt?: number;
  @Field(() => Float, { nullable: true }) gte?: number;
  @Field(() => Float, { nullable: true }) lt?: number;
  @Field(() => Float, { nullable: true }) lte?: number;
}

@InputType()
export class DateFilterInput {
  @Field(() => GraphQLISODateTime, { nullable: true }) eq?: Date;
  @Field(() => GraphQLISODateTime, { nullable: true }) gt?: Date;
  @Field(() => GraphQLISODateTime, { nullable: true }) gte?: Date;
  @Field(() => GraphQLISODateTime, { nullable: true }) lt?: Date;
  @Field(() => GraphQLISODateTime, { nullable: true }) lte?: Date;
}

interface FilterableField {
  propertyKey: string | symbol;
  type: unknown;
}

const filterTypeCache = new Map<Type<unknown>, Type<object>>();

export function createFilterType<T>(classRef: Type<T>): Type<object> {
  if (filterTypeCache.has(classRef)) {
    const cached = filterTypeCache.get(classRef);
    if (cached) return cached;
  }
  @InputType(`${classRef.name}FilterInput`, { isAbstract: true })
  class FilterInputBase {}

  filterTypeCache.set(classRef, FilterInputBase);

  const fields =
    (Reflect.getMetadata(FILTERABLE_FIELDS_KEY, classRef) as
      | FilterableField[]
      | undefined) ?? [];

  for (const field of fields) {
    let fieldGraphQLType: Type<unknown>;

    if (field.type === String) {
      fieldGraphQLType = StringFilterInput;
    } else if (field.type === Boolean) {
      fieldGraphQLType = BooleanFilterInput;
    } else if (field.type === Number) {
      fieldGraphQLType = NumberFilterInput;
    } else if (field.type === Date) {
      fieldGraphQLType = DateFilterInput;
    } else if (typeof field.type === 'function') {
      fieldGraphQLType = createFilterType(field.type as Type<object>);
    } else {
      continue;
    }

    Field(() => fieldGraphQLType, { nullable: true })(
      FilterInputBase.prototype,
      field.propertyKey,
    );
  }

  return FilterInputBase;
}
