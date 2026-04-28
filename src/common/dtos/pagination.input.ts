import { InputType } from '@nestjs/graphql';
import { IsNumber, IsOptional, IsString } from 'class-validator';

@InputType()
export class PaginationInput {
  @IsOptional()
  @IsString()
  after?: string;

  @IsOptional()
  @IsNumber()
  first?: number = 10;

  @IsOptional()
  @IsString()
  before?: string;

  @IsOptional()
  @IsNumber()
  last?: number;
}
