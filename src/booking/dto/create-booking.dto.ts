import { IsNotEmpty, IsNumber, IsDateString } from 'class-validator';

export class CreateBookingDto {
  @IsNotEmpty({ message: '会议室名称不能为空' })
  @IsNumber()
  meetingRoomId: number;

  @IsNotEmpty({ message: '开始时间不能为空' })
  @IsDateString({}, { message: '时间格式错误' })
  startTime: string;

  @IsNotEmpty({ message: '结束时间不能为空' })
  @IsDateString({}, { message: '时间格式错误' })
  endTime: string;

  note: string;
}
