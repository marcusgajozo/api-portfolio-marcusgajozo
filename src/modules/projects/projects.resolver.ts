import { PaginationInput } from '@/common/dtos/pagination.input';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CreateProjectInput } from './dtos/create-project.input';
import { ProjectFilterInput } from './dtos/project-pagination.input';
import { ProjectPaginationType } from './dtos/project-pagination.type';
import { UpdateProjectInput } from './dtos/update-project.input';
import { ProjectsService } from './projects.service';
import { Project } from './schemas/project.schema';

// TODO: tentar implementar o sorting e o filter em getProjects

@Resolver(() => Project)
export class ProjectsResolver {
  constructor(private readonly projectsService: ProjectsService) {}

  @Mutation(() => Project)
  async createProject(
    @Args('createProjectInput') createProjectInput: CreateProjectInput,
  ): Promise<Project> {
    return await this.projectsService.create(createProjectInput);
  }

  @Mutation(() => Project, { nullable: true })
  async updateProject(
    @Args('id') id: string,
    @Args('updateProjectInput') updateProjectInput: UpdateProjectInput,
  ): Promise<Project | null> {
    return await this.projectsService.update(id, updateProjectInput);
  }

  @Mutation(() => Project, { nullable: true })
  async deleteProject(@Args('id') id: string): Promise<Project | null> {
    return await this.projectsService.delete(id);
  }

  @Query(() => ProjectPaginationType)
  async getProjects(
    @Args('pagination', { nullable: true }) pagination?: PaginationInput,
    @Args('filter', { nullable: true }) filter?: ProjectFilterInput,
  ): Promise<ProjectPaginationType> {
    return await this.projectsService.findAll(pagination, filter);
  }

  @Query(() => Project, { nullable: true })
  async getProjectId(@Args('id') id: string): Promise<Project | null> {
    return await this.projectsService.findOne(id);
  }
}
