import { Injectable } from '@nestjs/common';
import { CreateLocationDto } from './dto/create-location.dto';
import { UpdateLocationDto } from './dto/update-location.dto';

@Injectable()
export class LocationService {
  create(createLocationDto: CreateLocationDto) {
    void createLocationDto;
    return 'This action adds a new location';
  }

  update(id: number, updateLocationDto: UpdateLocationDto) {
    void updateLocationDto;
    return `This action updates a #${id} location`;
  }

  findAll() {
    return `This action returns all location`;
  }

  findOne(id: number) {
    return `This action returns a #${id} location`;
  }

  remove(id: number) {
    return `This action removes a #${id} location`;
  }
}
