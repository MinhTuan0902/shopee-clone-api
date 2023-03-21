export function generateNumberOTP(length: number = 6): string {
  const numbers = '0123456789';
  let otp: string = '';
  for (let i = 0; i < length; i++) {
    otp += numbers.charAt(Math.floor(Math.random() * length));
  }
  return otp;
}
