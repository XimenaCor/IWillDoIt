import { Controller, Post, Body, Get, Param } from '@nestjs/common';
import { LocationService } from './location.service';
import { CreateLocationDto } from './dto/create-location.dto';

@Controller('location')
export class LocationController {
  constructor(private readonly locationService: LocationService) { }

  @Post(':userId')
  create(
    @Param('userId') userId: string,
    @Body() dto: CreateLocationDto,
  ) {
    return this.locationService.create(+userId, dto);
  }

  @Get(':userId')
  findAll(@Param('userId') userId: string) {
    return this.locationService.findAllByUser(+userId);
  }
}
