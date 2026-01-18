import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { TaskService } from './task.service';
import { PrismaService } from '../prisma/prisma.service';
import { TaskStatus } from '@prisma/client';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';

describe('TaskService', () => {
  let service: TaskService;

  const prismaMock = {
    task: {
      create: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
    location: {
      findUnique: jest.fn(),
    },
  };


  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TaskService, { provide: PrismaService, useValue: prismaMock }],
    }).compile();

    service = module.get<TaskService>(TaskService);

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a task with status OPEN', async () => {
    const dto: CreateTaskDto = {
      title: 'Help moving furniture',
      description: 'Need help moving a sofa this Saturday',
      price: 30,
      isPaid: true,
      createdByUserId: 1,
      locationId: 10,
      expectedFinishDate: new Date('2025-01-20T15:00:00.000Z'),
    };

    const createdTask = {
      id: 1,
      title: dto.title,
      description: dto.description,
      price: dto.price,
      isPaid: dto.isPaid,
      createdByUserId: dto.createdByUserId,
      assignedUserId: null,
      locationId: dto.locationId,
      expectedFinishDate: dto.expectedFinishDate ?? null,
      createdAt: new Date(),
      status: TaskStatus.OPEN,
    };

    prismaMock.task.create.mockResolvedValue(createdTask);
    prismaMock.location.findUnique.mockResolvedValue({
      id: 1,
      ownerId: dto.createdByUserId,
    });

    const task = await service.create(dto);

    expect(prismaMock.task.create).toHaveBeenCalledTimes(1);
    expect(task).toEqual(createdTask);
    expect(task.status).toBe(TaskStatus.OPEN);
  });

  it('should return all tasks ordered by createdAt desc', async () => {
    const tasks = [
      { id: 2, createdAt: new Date('2025-01-02T00:00:00Z') },
      { id: 1, createdAt: new Date('2025-01-01T00:00:00Z') },
    ];

    prismaMock.task.findMany.mockResolvedValue(tasks);

    const result = await service.findAll();

    expect(prismaMock.task.findMany).toHaveBeenCalledWith({
      orderBy: { createdAt: 'desc' },
    });
    expect(result).toBe(tasks);
  });

  it('should find a task by id', async () => {
    const existing = {
      id: 1,
      title: 'Existing',
      description: 'Existing desc',
      price: 10,
      isPaid: false,
      status: TaskStatus.OPEN,
      expectedFinishDate: null,
      createdByUserId: 1,
      assignedUserId: null,
      locationId: null,
      createdAt: new Date(),
    };

    prismaMock.task.findUnique.mockResolvedValue(existing);

    const found = await service.findOne(1);

    expect(prismaMock.task.findUnique).toHaveBeenCalledWith({ where: { id: 1 } });
    expect(found).toBe(existing);
  });

  it('should throw NotFoundException when task does not exist', async () => {
    prismaMock.task.findUnique.mockResolvedValue(null);

    await expect(service.findOne(999)).rejects.toThrow(NotFoundException);
    await expect(service.findOne(999)).rejects.toThrow('Task with id 999 not found');
  });

  it('should update task fields when calling update', async () => {
    const existing = {
      id: 1,
      title: 'Original title',
      description: 'Original description',
      price: 10,
      isPaid: false,
      status: TaskStatus.OPEN,
      expectedFinishDate: null,
      createdByUserId: 1,
      assignedUserId: null,
      locationId: null,
      createdAt: new Date(),
    };

    const updateDto: UpdateTaskDto = {
      title: 'Updated title',
      description: 'Updated description',
      price: 20,
      isPaid: true,
    };

    const updated = {
      ...existing,
      ...updateDto,
    };

    prismaMock.task.findUnique.mockResolvedValue(existing);
    prismaMock.task.update.mockResolvedValue(updated);

    const result = await service.update(existing.id, updateDto);

    expect(prismaMock.task.findUnique).toHaveBeenCalledWith({ where: { id: 1 } });
    expect(prismaMock.task.update).toHaveBeenCalledTimes(1);
    expect(result.title).toBe('Updated title');
    expect(result.description).toBe('Updated description');
    expect(result.price).toBe(20);
    expect(result.isPaid).toBe(true);
  });

  it('should mark a task as CANCELLED when calling remove', async () => {
    const existing = {
      id: 1,
      title: 'Task to cancel',
      description: 'Some description',
      price: 5,
      isPaid: false,
      status: TaskStatus.OPEN,
      expectedFinishDate: null,
      createdByUserId: 2,
      assignedUserId: null,
      locationId: null,
      createdAt: new Date(),
    };

    const cancelled = { ...existing, status: TaskStatus.CANCELLED };

    prismaMock.task.findUnique.mockResolvedValue(existing);
    prismaMock.task.update.mockResolvedValue(cancelled);

    const result = await service.remove(existing.id);

    expect(prismaMock.task.update).toHaveBeenCalledWith({
      where: { id: existing.id },
      data: { status: TaskStatus.CANCELLED },
    });

    expect(result.status).toBe(TaskStatus.CANCELLED);
  });

  it('should assign a task and set status ASSIGNED', async () => {
    const existing = {
      id: 1,
      title: 'Task',
      description: 'Desc',
      price: 0,
      isPaid: false,
      status: TaskStatus.OPEN,
      expectedFinishDate: null,
      createdByUserId: 1,
      assignedUserId: null,
      locationId: null,
      createdAt: new Date(),
    };

    const assigned = { ...existing, assignedUserId: 99, status: TaskStatus.ASSIGNED };

    prismaMock.task.findUnique.mockResolvedValue(existing);
    prismaMock.task.update.mockResolvedValue(assigned);

    const result = await service.assignTask(1, 99);

    expect(prismaMock.task.update).toHaveBeenCalledWith({
      where: { id: 1 },
      data: { assignedUserId: 99, status: TaskStatus.ASSIGNED },
    });

    expect(result.status).toBe(TaskStatus.ASSIGNED);
    expect(result.assignedUserId).toBe(99);
  });
});
