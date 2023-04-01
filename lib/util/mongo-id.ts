import { Types } from 'mongoose';

export function generateMongoIdString(): string {
  return new Types.ObjectId().toString();
}
