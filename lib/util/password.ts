import { compare, hash } from 'bcrypt';

export async function encryptPassword(
  password: string,
  saltRounds: number = 10,
): Promise<string> {
  return hash(password, saltRounds);
}

export async function comparePassword(
  password: string,
  encryptedPassword: string,
): Promise<boolean> {
  return compare(password, encryptedPassword);
}
