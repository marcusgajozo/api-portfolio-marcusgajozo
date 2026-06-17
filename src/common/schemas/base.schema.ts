import { ID, ObjectType, Field } from '@nestjs/graphql';
import { Filterable } from '../decorators/filterable.decorator';
import { Sortable } from '../decorators/sortable.decorator';

@ObjectType()
export class BaseSchema {
  @Filterable()
  @Field(() => ID)
  _id: string;

  @Filterable()
  @Sortable()
  @Field()
  createdAt: Date;

  @Filterable()
  @Sortable()
  @Field()
  updatedAt: Date;
}
