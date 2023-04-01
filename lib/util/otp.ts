/**
 *
 * @param length Length of OTP
 * @returns A number OTP
 */
export function generateNumberOTP(length = 6): string {
  const numbers = '0123456789';
  let otp = '';
  for (let i = 0; i < length; i++) {
    otp += numbers.charAt(Math.floor(Math.random() * length));
  }
  return otp;
}
