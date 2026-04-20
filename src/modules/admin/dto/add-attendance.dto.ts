import { IsDateString, IsNotEmpty, IsString } from "class-validator"

export class AddAttendanceDTO{

    @IsNotEmpty()
    @IsString()
    employeeId: string;
    // since utc is sent on frontend
    // its okay to use datestring, its compatible
    @IsNotEmpty()
    @IsDateString()
    timeIn: string

    @IsNotEmpty()
    @IsDateString()
    timeOut: string
}