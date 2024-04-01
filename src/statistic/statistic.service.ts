import { Injectable } from '@nestjs/common';
import { Booking } from '../booking/entities/booking.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../user/entities/user.entities';
import { MeetingRoom } from '../meeting-room/entities/meeting-room.entity';

@Injectable()
export class StatisticService {
  constructor(@InjectRepository(Booking) private readonly bookingRepository: Repository<Booking>) {}

  async userBookingCount(startTime: string, endTime: string) {
    return this.bookingRepository
      .createQueryBuilder('b')
      .select('u.id', 'userId')
      .addSelect('u.username', 'username')
      .addSelect('count(1)', 'bookingCount')
      .leftJoin(User, 'u', 'b.userId = u.id')
      .where('b.startTime between :time1 and :time2', {
        time1: startTime,
        time2: endTime,
      })
      .addGroupBy('b.userId')
      .getRawMany();
  }

  async meetingRoomUsedCount(startTime: string, endTime: string) {
    return this.bookingRepository
      .createQueryBuilder('b')
      .select('m.id', 'meetingRoomId')
      .addSelect('m.name', 'meetingRoomName')
      .leftJoin(MeetingRoom, 'm', 'b.roomId = m.id')
      .addSelect('count(1)', 'usedCount')
      .where('b.startTime between :time1 and :time2', {
        time1: startTime,
        time2: endTime,
      })
      .addGroupBy('b.roomId')
      .getRawMany();
  }
}
