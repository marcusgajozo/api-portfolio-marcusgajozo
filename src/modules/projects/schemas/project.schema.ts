import { Filterable } from '@/common/decorators/filterable.decorator';
import { BaseSchema } from '@/common/schemas/base.schema';
import { Field, ObjectType } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

// TODO: talvez adicionar um campo para ref tecnologias usadas.

@ObjectType()
@Schema({ timestamps: true, collection: 'projects' })
export class Project extends BaseSchema {
  @Filterable()
  @Field()
  @Prop({ required: true })
  title: string;

  @Filterable()
  @Field()
  @Prop({ required: true })
  description: string;

  @Filterable()
  @Field()
  @Prop({ default: false })
  star: boolean;

  @Field()
  @Prop()
  repositoryUrl: string;

  @Field()
  @Prop()
  liveUrl: string;
}

export type ProjectDocument = HydratedDocument<Project>;
export const ProjectSchema = SchemaFactory.createForClass(Project);
