import {
  ValidationArguments,
  registerDecorator,
  ValidationOptions,
} from 'class-validator';

// compare date validation endDate < startDate return error
export function IsAfter(
  property: string, // passed to constraints
  validationOptions?: ValidationOptions,
) {
  return function (object: Object, propertyName: string) {
    // propertyname is the property below this
    // decorator which is enddate
    registerDecorator({
      name: 'isAfter', // decorator name
      target: object.constructor,
      propertyName: propertyName, //endDate
      constraints: [property], // startDate
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          // value refers to the property below of this dto
          const [relatedPropertyName] = args.constraints; // get constraint => startDate
          const relatedValue = (args.object as any)[relatedPropertyName]; // Gets start value
          return new Date(value) > new Date(relatedValue); // Validates endDate > startDate
        },
      },
    });
  };
}
