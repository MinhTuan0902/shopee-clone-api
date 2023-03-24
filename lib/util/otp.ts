import { isInt } from 'class-validator';

/**
 *
 * @param {number} length Length of OTP
 * @returns Returns a number OTP
 */
export function generateNumberOTP(length = 6): string {
  if (!isInt(length) || length < 0) {
    return '';
  }

  const numbers = '0123456789';
  let otp = '';
  for (let i = 0; i < length; i++) {
    otp += numbers.charAt(Math.floor(Math.random() * length));
  }
  return otp;
}
