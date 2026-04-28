import { Field, InputType } from '@nestjs/graphql';
import { IsNumber, IsOptional, IsString } from 'class-validator';

@InputType()
export class PaginationInput {
  @Field()
  @IsOptional()
  @IsString()
  after?: string;

  @Field()
  @IsOptional()
  @IsNumber()
  first?: number = 10;

  @Field()
  @IsOptional()
  @IsString()
  before?: string;

  @Field()
  @IsOptional()
  @IsNumber()
  last?: number;
}
