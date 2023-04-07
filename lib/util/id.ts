import { Types } from 'mongoose';
import { v4 as UUIDv4 } from 'uuid';

export function createMongoId(id?: string): Types.ObjectId {
  return new Types.ObjectId(id || undefined);
}

export function createUUIDv4(): string {
  return UUIDv4();
}
