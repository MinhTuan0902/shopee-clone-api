import { PipelineStage } from 'mongoose';

export interface IService {
  createOne?: (input: any) => Promise<any>;
  createMany?: (input: any) => Promise<any>;
  findOneBasic?: (input: any) => Promise<any>;
  findOneByPipelines?: (pipelines: PipelineStage[]) => Promise<any>;
  findManyBasic?: (input: any) => Promise<any>;
  findManyByPipelines?: (pipelines: PipelineStage[]) => Promise<any>;
  updateOne?: (input: any) => Promise<any>;
  updateMany?: (input: any) => Promise<any>;
  softDeleteOne?: (input: any) => Promise<any>;
  sortDeleteMany?: (input: any) => Promise<any>;
  deleteOne?: (input: any) => Promise<any>;
  deleteMany?: (input: any) => Promise<any>;
  countBasic?: (input: any) => Promise<any>;
  countByPipelines?: (pipelines: PipelineStage[]) => Promise<any>;
}
