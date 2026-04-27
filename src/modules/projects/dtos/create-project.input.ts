import { Field, InputType } from '@nestjs/graphql';
import { IsOptional, IsString } from 'class-validator';

@InputType()
export class CreateProjectInput {
  @IsString()
  @Field()
  title: string;

  @IsString()
  @Field()
  description: string;

  @IsOptional()
  @IsString()
  @Field()
  repositoryUrl?: string;

  @IsOptional()
  @IsString()
  @Field()
  liveUrl: string;
}
