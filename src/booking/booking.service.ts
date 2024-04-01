import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateBookingDto } from './dto/create-booking.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { MeetingRoom } from '../meeting-room/entities/meeting-room.entity';
import { Booking } from './entities/booking.entity';
import { Between, LessThan, Like, MoreThan, MoreThanOrEqual, Repository } from 'typeorm';
import { User } from '../user/entities/user.entities';
import { RedisService } from '../redis/redis.service';
import { EmailService } from '../email/email.service';

@Injectable()
export class BookingService {
  constructor(
    @InjectRepository(Booking) private readonly bookingRepository: Repository<Booking>,
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    @InjectRepository(MeetingRoom) private readonly meetingRoomRepository: Repository<MeetingRoom>,
    private readonly redisService: RedisService,
    private readonly emailService: EmailService,
  ) {}

  async init() {
    const user1 = await this.userRepository.findOneBy({
      id: 1,
    });
    const user2 = await this.userRepository.findOneBy({
      id: 2,
    });
    const room1 = await this.meetingRoomRepository.findOneBy({
      id: 4,
    });
    const room2 = await this.meetingRoomRepository.findOneBy({
      id: 6,
    });
    const booking1 = new Booking();
    booking1.room = room1;
    booking1.user = user1;
    booking1.startTime = new Date();
    booking1.endTime = new Date(Date.now() + 1000 * 60 * 60);

    const booking2 = new Booking();
    booking2.room = room2;
    booking2.user = user2;
    booking2.startTime = new Date();
    booking2.endTime = new Date(Date.now() + 1000 * 60 * 60);

    const booking3 = new Booking();
    booking3.room = room1;
    booking3.user = user2;
    booking3.startTime = new Date();
    booking3.endTime = new Date(Date.now() + 1000 * 60 * 60);

    const booking4 = new Booking();
    booking4.room = room2;
    booking4.user = user1;
    booking4.startTime = new Date();
    booking4.endTime = new Date(Date.now() + 1000 * 60 * 60);

    return this.bookingRepository.insert([booking1, booking2, booking3, booking4]);
  }

  async create(createBookingDto: CreateBookingDto, userId: number) {
    const meetingRoom = await this.meetingRoomRepository.findOneBy({
      id: createBookingDto.meetingRoomId,
    });
    if (!meetingRoom) {
      throw new BadRequestException('会议室不存在');
    }
    const user = await this.userRepository.findOneBy({
      id: userId,
    });
    const booking = new Booking();
    booking.room = meetingRoom;
    booking.user = user;
    booking.startTime = new Date(createBookingDto.startTime);
    booking.endTime = new Date(createBookingDto.endTime);

    const res = await this.bookingRepository.findOneBy([
      {
        room: {
          id: meetingRoom.id,
        },
        status: '审批通过',
        startTime: LessThan(booking.endTime),
        endTime: MoreThan(booking.startTime),
      },
      {
        room: {
          id: meetingRoom.id,
        },
        status: '审批通过',
        startTime: MoreThan(booking.startTime),
        endTime: LessThan(booking.endTime),
      },
    ]);

    if (res) {
      throw new BadRequestException('该时间段已被预定');
    }

    await this.bookingRepository.save(booking);
    return '添加成功！';
  }

  async find(
    username: string,
    meetingRoomName: string,
    meetingRoomPosition: string,
    bookingTimeRangeStart: number,
    bookingTimeRangeEnd: number,
  ) {
    const condition = {} as Record<Partial<keyof Booking>, any>;

    if (username) {
      condition.user.username = Like(`%${username}%`);
    }
    if (meetingRoomName) {
      condition.room.name = Like(`%${meetingRoomName}%`);
    }
    if (meetingRoomPosition) {
      condition.room.location = Like(`%${meetingRoomPosition}%`);
    }

    if (bookingTimeRangeStart) {
      if (!bookingTimeRangeEnd) {
        bookingTimeRangeEnd = bookingTimeRangeStart + 60 * 60 * 1000;
      }
      condition.startTime = Between(new Date(bookingTimeRangeStart), new Date(bookingTimeRangeEnd));
    }

    const result = await this.bookingRepository.find({
      where: condition,
      relations: {
        user: true,
        room: true,
      },
    });

    return result.map((item) => {
      delete item.user.password;
      return item;
    });
  }

  async unbind(id: number) {
    await this.bookingRepository.delete({
      id,
    });
    return '已解除!';
  }

  async reject(id: number) {
    await this.bookingRepository.update(
      { id },
      {
        status: '审批驳回',
      },
    );
    return '审批驳回!';
  }

  async apply(id: number) {
    await this.bookingRepository.update(
      { id },
      {
        status: '审批通过',
      },
    );
    return '审批通过!';
  }

  async urge(id: number) {
    const flag = await this.redisService.get('urge_' + id);
    if (flag) {
      return '半小时内只能催办一次，请耐心等待';
    }

    let email = await this.redisService.get('admin_email');

    if (!email) {
      const admin = await this.userRepository.findOne({
        select: {
          isAdmin: true,
        },
        where: {
          isAdmin: true,
        },
      });
      email = admin.email;
      this.redisService.set('admin_email', admin.email);
    }
    this.emailService.sendMail({
      to: email,
      subject: '预定申请催办提醒',
      html: `id 为 ${id} 的预定申请正在等待审批`,
    });

    this.redisService.set('urge_' + id, 1, 60 * 30);
    return '已催办！';
  }

  async findById(id: number) {
    const today = new Date(); // 获取当前日期和时间
    today.setHours(0, 0, 0, 0);
    const res = await this.bookingRepository.find({
      where: {
        room: {
          id,
        },
        startTime: MoreThanOrEqual(today),
      },
      select: {
        user: {
          id: true,
          email: true,
          nickName: true,
          isAdmin: true,
        },
      },
      relations: {
        user: true,
      },
      order: {
        id: 'desc',
      },
    });

    if (!res) {
      throw new BadRequestException('房间不存在');
    }

    return res;
  }
}
