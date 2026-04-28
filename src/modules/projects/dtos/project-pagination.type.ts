import { createPaginationType } from '@/common/dtos/pagination.type';
import { Project } from '../schemas/project.schema';
import { ObjectType } from '@nestjs/graphql';

@ObjectType()
export class ProjectPaginationType extends createPaginationType(Project) {}
