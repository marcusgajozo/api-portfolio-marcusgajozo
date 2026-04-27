import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Project, ProjectDocument } from './schemas/project.schema';
import { CreateProjectInput } from './dtos/create-project.input';

@Injectable()
export class ProjectsService {
  constructor(
    @InjectModel(Project.name) private projectModel: Model<ProjectDocument>,
  ) {}

  async create(input: CreateProjectInput): Promise<Project> {
    const createdProject = new this.projectModel(input);
    // const project = await createdProject.save();
    return createdProject.save();
  }
}
