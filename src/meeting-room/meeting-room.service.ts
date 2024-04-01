import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateMeetingRoomDto } from './dto/create-meeting-room.dto';
import { UpdateMeetingRoomDto } from './dto/update-meeting-room.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { MeetingRoom } from './entities/meeting-room.entity';
import { Like, Repository } from 'typeorm';
import { User } from '../user/entities/user.entities';

@Injectable()
export class MeetingRoomService {
  @InjectRepository(MeetingRoom)
  private meetingRoomRepository: Repository<MeetingRoom>;

  initData() {
    const room1 = new MeetingRoom();
    room1.name = '木星';
    room1.capacity = 10;
    room1.equipment = '白板';
    room1.location = '一层西';

    const room2 = new MeetingRoom();
    room2.name = '金星';
    room2.capacity = 5;
    room2.equipment = '';
    room2.location = '二层东';

    const room3 = new MeetingRoom();
    room3.name = '天王星';
    room3.capacity = 30;
    room3.equipment = '白板，电视';
    room3.location = '三层东';
    return this.meetingRoomRepository.insert([room1, room2, room3]);
  }

  async create(createMeetingRoomDto: CreateMeetingRoomDto) {
    const room = await this.meetingRoomRepository.findOneBy({
      name: createMeetingRoomDto.name,
    });

    if (room) {
      throw new BadRequestException('会议室名字已存在');
    }
    return this.meetingRoomRepository.insert(createMeetingRoomDto);
  }

  async update(updateMeetingRoomDto: UpdateMeetingRoomDto) {
    const meetingRoom = await this.meetingRoomRepository.findOneBy({
      id: updateMeetingRoomDto.id,
    });
    if (!meetingRoom) {
      throw new BadRequestException('会议室不存在');
    }
    meetingRoom.capacity = updateMeetingRoomDto.capacity;
    meetingRoom.location = updateMeetingRoomDto.location;
    meetingRoom.name = updateMeetingRoomDto.name;

    if (updateMeetingRoomDto.description) {
      meetingRoom.description = updateMeetingRoomDto.description;
    }
    if (updateMeetingRoomDto.equipment) {
      meetingRoom.equipment = updateMeetingRoomDto.equipment;
    }

    await this.meetingRoomRepository.update(
      {
        id: meetingRoom.id,
      },
      meetingRoom,
    );
    return '更新成功!';
  }

  async find(name: string, capacity: number, equipment: string, location: string) {
    const condition = {} as Record<Partial<keyof MeetingRoom>, any>;
    if (name) {
      condition.name = Like(`%${name}%`);
    }
    if (equipment) {
      condition.equipment = Like(`%${equipment}%`);
    }
    if (capacity) {
      condition.capacity = Like(`%${capacity}%`);
    }

    if (location) {
      condition.location = Like(`%${location}%`);
    }

    const [meetingRooms, totalCount] = await this.meetingRoomRepository.findAndCount({
      where: condition,
    });

    return {
      list: meetingRooms,
      totalCount,
    };
  }

  async findById(id: number) {
    return this.meetingRoomRepository.findOneBy({
      id,
    });
  }

  async delete(id: number) {
    await this.meetingRoomRepository.delete({
      id,
    });
    return '删除成功！';
  }
}
