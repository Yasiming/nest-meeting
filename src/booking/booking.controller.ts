import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { BookingService } from './booking.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { UpdateBookingDto } from './dto/update-booking.dto';
import { RequireLogin, UserInfo } from '../utils/custom.decorator';

@Controller('booking')
// @RequireLogin()
export class BookingController {
  constructor(private readonly bookingService: BookingService) {}

  @Post()
  create(@Body() createBookingDto: CreateBookingDto, @UserInfo('userId') userId: number) {
    return this.bookingService.create(createBookingDto, userId);
  }

  @Get('init')
  init() {
    return this.bookingService.init();
  }

  @Get('detail')
  findBookingsById(@Query('id') id: number) {
    return this.bookingService.findById(+id);
  }

  @Get('list')
  async list(
    @Query('username') username: string,
    @Query('meetingRoomName') meetingRoomName: string,
    @Query('meetingRoomPosition') meetingRoomPosition: string,
    @Query('bookingTimeRangeStart') bookingTimeRangeStart: number,
    @Query('bookingTimeRangeEnd') bookingTimeRangeEnd: number,
  ) {
    return this.bookingService.find(
      username,
      meetingRoomName,
      meetingRoomPosition,
      bookingTimeRangeStart,
      bookingTimeRangeEnd,
    );
  }

  @Get('apply')
  async apply(@Query('id') id: number) {
    return this.bookingService.apply(+id);
  }

  @Get('reject')
  async reject(@Query('id') id: number) {
    return this.bookingService.reject(+id);
  }

  @Get('unbind')
  async unbind(@Query('id') id: number) {
    return this.bookingService.unbind(id);
  }

  @Get('urge/:id')
  async urge(@Param('id') id: number) {
    return this.bookingService.urge(id);
  }
}
