import { isInt } from 'class-validator';

export function generateNumberOTP(length: number = 6): string {
  if (!isInt(length) || length < 0) {
    return '';
  }

  const numbers = '0123456789';
  let otp: string = '';
  for (let i = 0; i < length; i++) {
    otp += numbers.charAt(Math.floor(Math.random() * length));
  }
  return otp;
}
