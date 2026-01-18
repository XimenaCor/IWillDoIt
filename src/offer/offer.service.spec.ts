import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { OfferService } from './offer.service';
import { OfferStatus } from './offer-status.enum';
import { CreateOfferDto } from './dto/create-offer.dto';
import { TaskService } from '../task/task.service';
import { TaskStatus } from '@prisma/client';
import { Task } from '../task/entities/task.entity';

const createMockTask = (status: TaskStatus): Task => ({
  id: 1,
  title: 'Test task',
  description: 'Test description',
  price: 10,
  isPaid: true,
  status,
  createdAt: new Date(),
  expectedFinishDate: new Date(),
  createdByUserId: 1,
  assignedUserId: null,
  locationId: null,
});

describe('OfferService', () => {
  let service: OfferService;
  let taskService: jest.Mocked<TaskService>;

  beforeEach(async () => {
    const taskServiceMock = {
      findOne: jest.fn(),
      assignTask: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OfferService,
        {
          provide: TaskService,
          useValue: taskServiceMock,
        },
      ],
    }).compile();

    service = module.get<OfferService>(OfferService);
    taskService = module.get(TaskService);

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(taskService).toBeDefined();
  });

  it('should create a PENDING offer for a valid task', async () => {
    taskService.findOne.mockResolvedValue(
      createMockTask(TaskStatus.OPEN),
    );

    const dto: CreateOfferDto = {
      taskId: 1,
      userId: 2,
      message: 'I can help on Saturday',
    };

    const offer = await service.create(dto);

    expect(taskService.findOne).toHaveBeenCalledWith(1);
    expect(offer).toBeDefined();
    expect(offer.taskId).toBe(1);
    expect(offer.userId).toBe(2);
    expect(offer.status).toBe(OfferStatus.PENDING);
    expect(offer.createdAt).toBeInstanceOf(Date);
  });

  it('should not create an offer for completed, cancelled or unconcluded tasks', async () => {
    const invalidStatuses = [
      TaskStatus.COMPLETED,
      TaskStatus.CANCELLED,
      TaskStatus.UNCONCLUDED,
    ];

    for (const status of invalidStatuses) {
      taskService.findOne.mockResolvedValue(
        createMockTask(status),
      );

      const dto: CreateOfferDto = {
        taskId: 1,
        userId: 2,
        message: 'Test',
      };

      await expect(service.create(dto)).rejects.toThrow(
        BadRequestException,
      );

      jest.clearAllMocks();
    }
  });

  it('should return all offers with findAll', async () => {
    taskService.findOne.mockResolvedValue(
      createMockTask(TaskStatus.OPEN),
    );

    await service.create({ taskId: 1, userId: 2, message: 'First' });
    await service.create({ taskId: 1, userId: 3, message: 'Second' });

    const offers = service.findAll();

    expect(offers.length).toBe(2);
    expect(offers[0].userId).toBe(2);
    expect(offers[1].userId).toBe(3);
  });

  it('should find an offer by id', async () => {
    taskService.findOne.mockResolvedValue(
      createMockTask(TaskStatus.OPEN),
    );

    const created = await service.create({
      taskId: 1,
      userId: 2,
      message: 'Test',
    });

    const found = service.findOne(created.id);

    expect(found).toBeDefined();
    expect(found.id).toBe(created.id);
  });

  it('should throw NotFoundException when offer does not exist', () => {
    expect(() => service.findOne(999)).toThrow(NotFoundException);
  });

  it('should update the message of an offer', async () => {
    taskService.findOne.mockResolvedValue(
      createMockTask(TaskStatus.OPEN),
    );

    const created = await service.create({
      taskId: 1,
      userId: 2,
      message: 'Original',
    });

    const updated = service.update(created.id, {
      message: 'Updated',
    });

    expect(updated.message).toBe('Updated');
  });

  it('should mark an offer as WITHDRAWN when removed if PENDING', async () => {
    taskService.findOne.mockResolvedValue(
      createMockTask(TaskStatus.OPEN),
    );

    const created = await service.create({
      taskId: 1,
      userId: 2,
      message: 'Test',
    });

    const removed = service.remove(created.id);

    expect(removed.status).toBe(OfferStatus.WITHDRAWN);
  });

  it('should not allow removing a non-PENDING offer', async () => {
    taskService.findOne.mockResolvedValue(
      createMockTask(TaskStatus.OPEN),
    );

    const created = await service.create({
      taskId: 1,
      userId: 2,
      message: 'Test',
    });

    await service.accept(created.id);

    expect(() => service.remove(created.id)).toThrow(
      BadRequestException,
    );
  });

  it('should accept a PENDING offer and assign the task', async () => {
    taskService.findOne.mockResolvedValue(
      createMockTask(TaskStatus.OPEN),
    );

    const created = await service.create({
      taskId: 1,
      userId: 2,
      message: 'Test',
    });

    const accepted = await service.accept(created.id);

    expect(accepted.status).toBe(OfferStatus.ACCEPTED);
    expect(taskService.assignTask).toHaveBeenCalledWith(1, 2);
  });

  it('should not accept a non-PENDING offer', async () => {
    taskService.findOne.mockResolvedValue(
      createMockTask(TaskStatus.OPEN),
    );

    const created = await service.create({
      taskId: 1,
      userId: 2,
      message: 'Test',
    });

    service.reject(created.id);

    expect(() => service.accept(created.id)).toThrow(
      BadRequestException,
    );
  });

  it('should not reject a non-PENDING offer', async () => {
    taskService.findOne.mockResolvedValue(
      createMockTask(TaskStatus.OPEN),
    );

    const created = await service.create({
      taskId: 1,
      userId: 2,
      message: 'Test',
    });

    await service.accept(created.id);

    expect(() => service.reject(created.id)).toThrow(
      BadRequestException,
    );
  });
});
