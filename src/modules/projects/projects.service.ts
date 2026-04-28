import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Project, ProjectDocument } from './schemas/project.schema';
import { CreateProjectInput } from './dtos/create-project.input';
import { UpdateProjectInput } from './dtos/update-project.input';

@Injectable()
export class ProjectsService {
  constructor(
    @InjectModel(Project.name) private projectModel: Model<ProjectDocument>,
  ) {}

  async create(input: CreateProjectInput): Promise<Project> {
    const createdProject = new this.projectModel(input);
    return await createdProject.save();
  }

  async update(id: string, input: UpdateProjectInput): Promise<Project | null> {
    return await this.projectModel
      .findByIdAndUpdate(id, input, { new: true })
      .exec();
  }

  async delete(id: string): Promise<Project | null> {
    return await this.projectModel.findByIdAndDelete(id).exec();
  }

  async findAll(): Promise<Project[]> {
    return await this.projectModel.find().exec();
  }

  async findOne(id: string): Promise<Project | null> {
    return await this.projectModel.findById(id).exec();
  }
}
