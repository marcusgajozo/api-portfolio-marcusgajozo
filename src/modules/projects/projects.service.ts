import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Project, ProjectDocument } from './schemas/project.schema';
import { CreateProjectInput } from './dtos/create-project.input';
import { UpdateProjectInput } from './dtos/update-project.input';
import { ProjectPaginationType } from './dtos/project-pagination.type';
import { PaginationHelper } from '@/common/helpers/pagination.helper';
import { PaginationInput } from '@/common/dtos/pagination.input';
import { ProjectFilterInput } from './dtos/project-pagination.input';

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

  async findAll(
    pagination?: PaginationInput,
    filter?: ProjectFilterInput,
  ): Promise<ProjectPaginationType> {
    return await PaginationHelper.paginate<Project>({
      model: this.projectModel,
      pagination,
      filter,
    });
  }

  async findOne(id: string): Promise<Project | null> {
    return await this.projectModel.findById(id).exec();
  }
}
