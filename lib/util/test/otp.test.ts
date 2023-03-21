import { isNumberString } from 'class-validator';
import { generateNumberOTP } from '../otp';

describe('generateNumberOTP', () => {
  it('should be return a number string', () => {
    const otp = generateNumberOTP();
    return isNumberString(otp);
  });

  // it('should be return true string which have length equal to input length', () => {
  //   const inputLength = 10;
  //   const otp = generateNumberOTP(inputLength);
  //   return otp.length === inputLength;
  // });
});
