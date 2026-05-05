import { createFilterType } from '@/common/dtos/filter-pagination.input';
import { InputType } from '@nestjs/graphql';
import { Project } from '../schemas/project.schema';

@InputType()
export class ProjectFilterInput extends createFilterType(Project) {}
