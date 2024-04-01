import { IsDateString, ValidateIf } from 'class-validator';

export class FindBookingDto {
  @ValidateIf((o) => o.startTime !== undefined)
  @IsDateString({}, { message: '时间格式错误' })
  startTime: string;

  @ValidateIf((o) => o.endTime !== undefined)
  @IsDateString({}, { message: '时间格式错误' })
  endTime: string;
}
