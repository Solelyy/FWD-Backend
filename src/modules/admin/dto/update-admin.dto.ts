import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-admin.dto';

export class UpdateUserDto extends PartialType(CreateUserDto) {}
