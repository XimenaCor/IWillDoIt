import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { TaskStatus } from '@prisma/client';


@Injectable()
export class TaskService {
  constructor(private readonly prisma: PrismaService) { }

  async create(dto: CreateTaskDto) {
    if (dto.locationId !== undefined) {
      const location = await this.prisma.location.findUnique({
        where: { id: dto.locationId },
      });

      if (!location) {
        throw new NotFoundException('Location not found');
      }

      if (location.ownerId !== dto.createdByUserId) {
        throw new ForbiddenException(
          'You do not have permission to use this location',
        );
      }
    }

    const data: any = {
      title: dto.title,
      description: dto.description,
      isPaid: dto.isPaid ?? false,
      price: dto.price ?? 0,
      createdByUserId: dto.createdByUserId,
      expectedFinishDate: dto.expectedFinishDate ?? undefined,
      status: TaskStatus.OPEN,
    };

    if (dto.locationId !== undefined) {
      data.locationId = dto.locationId;
    }

    return this.prisma.task.create({ data });
  }


  async findAll() {
    return this.prisma.task.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: number) {
    const task = await this.prisma.task.findUnique({ where: { id } });
    if (!task) throw new NotFoundException(`Task with id ${id} not found`);
    return task;
  }

  async update(id: number, dto: UpdateTaskDto) {
    await this.findOne(id);

    return this.prisma.task.update({
      where: { id },
      data: {
        title: dto.title,
        description: dto.description,
        isPaid: dto.isPaid,
        price: dto.price,
        expectedFinishDate: dto.expectedFinishDate,
        //locationId: dto.locationId ?? undefined,
        status: dto.status,
        assignedUserId: dto.assignedUserId,
        ...(dto.locationId !== undefined && {
          locationId: dto.locationId,
        }),
      },
    });
  }


  async remove(id: number) {
    await this.findOne(id);

    return this.prisma.task.update({
      where: { id },
      data: { status: TaskStatus.CANCELLED },
    });
  }

  async assignTask(taskId: number, assignedUserId: number) {
    await this.findOne(taskId);

    return this.prisma.task.update({
      where: { id: taskId },
      data: {
        assignedUserId,
        status: TaskStatus.ASSIGNED,
      },
    });
  }
}
