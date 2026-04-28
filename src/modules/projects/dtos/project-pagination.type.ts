import { createPaginatedType } from '@/common/dtos/pagination.type';
import { Project } from '../schemas/project.schema';

export class ProjectPaginationType extends createPaginatedType(Project) {}
