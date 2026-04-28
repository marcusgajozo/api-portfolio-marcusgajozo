import { Type } from '@nestjs/common';
import { Field, Int, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class PageInfoType {
  @Field()
  hasNextPage: boolean;

  @Field()
  hasPreviousPage: boolean;

  @Field(() => String, { nullable: true })
  startCursor: string | null;

  @Field(() => String, { nullable: true })
  endCursor: string | null;
}

export interface EdgeShape<T> {
  node: T;
  cursor: string;
}

export interface PaginatedShape<T> {
  edges: EdgeShape<T>[];
  pageInfo: PageInfoType;
  totalCount: number;
}

export function createPaginatedType<T>(classRef: Type<T>) {
  @ObjectType()
  class EdgeType {
    @Field(() => classRef)
    node: T;

    @Field(() => String)
    cursor: string;
  }

  @ObjectType()
  class PaginatedType {
    @Field(() => [EdgeType])
    edges: EdgeType[];

    @Field(() => PageInfoType)
    pageInfo: PageInfoType;

    @Field(() => Int)
    totalCount: number;
  }

  return PaginatedType;
}
