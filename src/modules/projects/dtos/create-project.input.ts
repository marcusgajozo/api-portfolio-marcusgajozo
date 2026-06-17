import { Field, InputType } from '@nestjs/graphql';
import { IsBoolean, IsOptional, IsString } from 'class-validator';

@InputType()
export class CreateProjectInput {
  @Field()
  @IsString()
  title: string;

  @Field()
  @IsString()
  description: string;

  @Field()
  @IsOptional()
  @IsBoolean()
  start?: boolean;

  @Field()
  @IsOptional()
  @IsString()
  repositoryUrl?: string;

  @Field()
  @IsOptional()
  @IsString()
  liveUrl?: string;
}
