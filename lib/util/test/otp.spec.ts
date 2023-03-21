import { generateNumberOTP } from '../otp';

describe('generateNumberOTP', () => {
  test('should return empty string if input length equal to 0', () => {
    const otp = generateNumberOTP(0);
    expect(otp.length).toBe(0);
  });

  test('should return empty string if input length is negative', () => {
    const otp = generateNumberOTP(0);
    expect(otp.length).toBe(0);
  });

  test('should return empty string if input length is null', () => {
    const otp = generateNumberOTP(null);
    expect(otp.length).toBe(0);
  });

  test('should return a number string that have length equal to 6 (default length) if input length is undefined', () => {
    const otp = generateNumberOTP(undefined);
    expect(otp.length).toBe(6);
  });

  test('should return a string that have length equal to input length', () => {
    const inputLength = 10;
    const otp = generateNumberOTP(inputLength);
    expect(otp.length).toEqual(inputLength);
  });
});
