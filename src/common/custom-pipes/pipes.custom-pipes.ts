import {
  PipeTransform,
  Injectable,
  BadRequestException,
  ArgumentMetadata,
} from '@nestjs/common';
import { validate } from 'class-validator';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class CustomValidationPipe implements PipeTransform<any> {
  private toValidate(metatype: Function): boolean {
    const types: Function[] = [String, Boolean, Number, Array, Object];
    //return false for the types that are on the lsits or primitive type t
    //be specific
    return !types.includes(metatype);
  }

  async transform(value: any, { metatype }: ArgumentMetadata) {
    //if the body does not have any dto skip validation
    //or the data is true of not into the lists of types
    if (!metatype || !this.toValidate(metatype)) {
      return value;
    }

    //convert to object to be validated by class validator = validate
    const object = plainToInstance(metatype, value);
    const errors = await validate(object);

    if (errors.length > 0) {
      throw new BadRequestException('validation failed');
    }
    return value;
  }
}
