import { createSortingPaginationType } from '@/common/dtos/sorting-pagination.input';
import { Project } from '../schemas/project.schema';
import { InputType } from '@nestjs/graphql';

@InputType()
export class ProjectSortingInput extends createSortingPaginationType(Project) {}
