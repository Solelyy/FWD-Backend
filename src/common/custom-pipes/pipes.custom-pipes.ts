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

    // errors are always an array in class vaidator
    if (errors.length > 0) {
      const messages = errors
        .map((error) => {
          if (error.constraints) {
            return Object.values(error.constraints);
          }

          return 'error validating, must something be wrong at the data';
        })
        .flat(); // returns the result as an not nested array

      throw new BadRequestException(messages);
    }

    return value;
  }
}
