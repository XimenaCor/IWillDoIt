import { Injectable, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateLocationDto } from './dto/create-location.dto';

@Injectable()
export class LocationService {
  constructor(private readonly prisma: PrismaService) { }

  create(ownerId: number, dto: CreateLocationDto) {
    return this.prisma.location.create({
      data: {
        lat: dto.lat,
        lng: dto.lng,
        address: dto.address,
        ownerId,
      },
    });
  }

  findAllByUser(ownerId: number) {
    return this.prisma.location.findMany({
      where: { ownerId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOneForUser(id: number, ownerId: number) {
    const location = await this.prisma.location.findUnique({ where: { id } });

    if (!location || location.ownerId !== ownerId) {
      throw new ForbiddenException('Location not accessible');
    }

    return location;
  }
}
