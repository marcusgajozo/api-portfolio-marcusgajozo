import { Mutation, Resolver, Args } from '@nestjs/graphql';
import { Project } from './schemas/project.schema';
import { ProjectsService } from './projects.service';
import { CreateProjectInput } from './dtos/create-project.input';

@Resolver(() => Project)
export class ProjectsResolver {
  constructor(private readonly projectsService: ProjectsService) {}

  @Mutation(() => Project)
  async createProject(
    @Args('createProjectInput') createProjectInput: CreateProjectInput,
  ): Promise<Project> {
    return await this.projectsService.create(createProjectInput);
  }
}
