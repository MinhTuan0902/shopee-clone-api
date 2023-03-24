import { Injectable } from '@nestjs/common';
import {
  isPhoneNumber,
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

@ValidatorConstraint({ name: 'isVietnamesePhoneNumber', async: true })
@Injectable()
export class IsVietnamesePhoneNumber implements ValidatorConstraintInterface {
  validate(value: string): boolean {
    return isPhoneNumber(value, 'VN');
  }

  defaultMessage(validationArguments?: ValidationArguments): string {
    return `${validationArguments.value} is not a valid Vietnamese phone number`;
  }
}
