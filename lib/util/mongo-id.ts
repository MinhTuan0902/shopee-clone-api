import { Types } from 'mongoose';

export function createMongoId(id?: string): Types.ObjectId {
  return new Types.ObjectId(id || undefined);
}
