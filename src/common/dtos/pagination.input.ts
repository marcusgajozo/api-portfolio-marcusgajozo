import { Field, InputType } from '@nestjs/graphql';
import {
  IsNumber,
  IsOptional,
  IsString,
  ValidateIf,
  IsEmpty,
} from 'class-validator';

@InputType()
export class PaginationInput {
  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  after?: string;

  @Field({ nullable: true })
  @ValidateIf((o: PaginationInput) => !!o.after)
  @IsEmpty({ message: 'O campo "before" não pode ser usado junto com "after"' })
  @IsOptional()
  @IsString()
  before?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsNumber()
  first?: number = 10;

  @Field({ nullable: true })
  @IsOptional()
  @IsNumber()
  last?: number = 10;
}
