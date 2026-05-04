import { ID, ObjectType, Field } from '@nestjs/graphql';
import { Filterable } from '../decorators/filterable.decorator';

@ObjectType()
export class BaseSchema {
  @Filterable()
  @Field(() => ID)
  _id: string;

  @Filterable()
  @Field()
  createdAt: Date;

  @Filterable()
  @Field()
  updatedAt: Date;
}
