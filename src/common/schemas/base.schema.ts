import { ID, ObjectType, Field } from '@nestjs/graphql';

@ObjectType()
export class BaseSchema {
  @Field(() => ID)
  _id: string;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}
