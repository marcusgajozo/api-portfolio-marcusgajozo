import { Mutation, Resolver, Args, Query } from '@nestjs/graphql';
import { Project } from './schemas/project.schema';
import { ProjectsService } from './projects.service';
import { CreateProjectInput } from './dtos/create-project.input';
import { UpdateProjectInput } from './dtos/update-project.input';

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

  @Query(() => [Project])
  async getProjects(): Promise<Project[]> {
    return await this.projectsService.findAll();
  }

  @Query(() => Project, { nullable: true })
  async getProjectId(@Args('id') id: string): Promise<Project | null> {
    return await this.projectsService.findOne(id);
  }
}
