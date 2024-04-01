import { Controller, Get, Query } from '@nestjs/common';
import { StatisticService } from './statistic.service';
import { FindBookingDto } from './dto/find-booking.dto';

@Controller('statistic')
export class StatisticController {
  constructor(private readonly statisticService: StatisticService) {}

  @Get('userBookingCount')
  async userBookingCount(@Query() time: FindBookingDto) {
    const { startTime = '2000/01/01', endTime = '2099/01/01' } = time;
    return this.statisticService.userBookingCount(startTime, endTime);
  }

  @Get('meetingRoomUsedCount')
  async meetingRoomUsedCount(@Query() time: FindBookingDto) {
    const { startTime = '2000/01/01', endTime = '2099/01/01' } = time;
    return this.statisticService.meetingRoomUsedCount(startTime, endTime);
  }
}
