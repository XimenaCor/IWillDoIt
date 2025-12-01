import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { OfferService } from './offer.service';
import { OfferStatus } from './offer-status.enum';
import { CreateOfferDto } from './dto/create-offer.dto';
import { TaskService } from '../task/task.service';
import { TaskStatus } from '../task/task-status.enum';

describe('OfferService', () => {
  let service: OfferService;
  let taskService: TaskService;

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
    taskService = module.get<TaskService>(TaskService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(taskService).toBeDefined();
  });

  it('should create a PENDING offer for a valid task', () => {

    (taskService.findOne as jest.Mock).mockReturnValue({
      id: 1,
      status: TaskStatus.OPEN,
    });

    const dto: CreateOfferDto = {
      taskId: 1,
      userId: 2,
      message: 'I can help on Saturday',
    };

    const offer = service.create(dto);

    expect(taskService.findOne).toHaveBeenCalledWith(1);
    expect(offer).toBeDefined();
    expect(offer.id).toBe(1);
    expect(offer.taskId).toBe(1);
    expect(offer.userId).toBe(2);
    expect(offer.status).toBe(OfferStatus.PENDING);
    expect(offer.createdAt).toBeInstanceOf(Date);
  });

  it('should not create an offer for a completed/cancelled/unconcluded task', () => {
    const invalidStatuses = [
      TaskStatus.COMPLETED,
      TaskStatus.CANCELLED,
      TaskStatus.UNCONCLUDED,
    ];

    for (const status of invalidStatuses) {
      (taskService.findOne as jest.Mock).mockReturnValue({
        id: 1,
        status,
      });

      const dto: CreateOfferDto = {
        taskId: 1,
        userId: 2,
        message: 'Test',
      };

      expect(() => service.create(dto)).toThrow(BadRequestException);
    }
  });

  it('should return all offers with findAll', () => {
    (taskService.findOne as jest.Mock).mockReturnValue({
      id: 1,
      status: TaskStatus.OPEN,
    });

    const dto1: CreateOfferDto = { taskId: 1, userId: 2, message: 'First' };
    const dto2: CreateOfferDto = { taskId: 1, userId: 3, message: 'Second' };

    service.create(dto1);
    service.create(dto2);

    const offers = service.findAll();

    expect(offers.length).toBe(2);
    expect(offers[0].userId).toBe(2);
    expect(offers[1].userId).toBe(3);
  });

  it('should find an offer by id', () => {
    (taskService.findOne as jest.Mock).mockReturnValue({
      id: 1,
      status: TaskStatus.OPEN,
    });

    const dto: CreateOfferDto = { taskId: 1, userId: 2, message: 'Test' };
    const created = service.create(dto);

    const found = service.findOne(created.id);

    expect(found).toBeDefined();
    expect(found.id).toBe(created.id);
  });

  it('should throw NotFoundException when offer does not exist', () => {
    expect(() => service.findOne(999)).toThrow(NotFoundException);
  });

  it('should update the message of an offer', () => {
    (taskService.findOne as jest.Mock).mockReturnValue({
      id: 1,
      status: TaskStatus.OPEN,
    });

    const dto: CreateOfferDto = { taskId: 1, userId: 2, message: 'Original' };
    const created = service.create(dto);

    const updated = service.update(created.id, { message: 'Updated' });

    expect(updated.message).toBe('Updated');
  });

  it('should mark an offer as WITHDRAWN when removed (if PENDING)', () => {
    (taskService.findOne as jest.Mock).mockReturnValue({
      id: 1,
      status: TaskStatus.OPEN,
    });

    const dto: CreateOfferDto = { taskId: 1, userId: 2, message: 'Test' };
    const created = service.create(dto);

    const removed = service.remove(created.id);

    expect(removed.status).toBe(OfferStatus.WITHDRAWN);
  });

  it('should not allow removing a non-PENDING offer', () => {
    (taskService.findOne as jest.Mock).mockReturnValue({
      id: 1,
      status: TaskStatus.OPEN,
    });

    const dto: CreateOfferDto = { taskId: 1, userId: 2, message: 'Test' };
    const created = service.create(dto);

    // Note: ACCEPTED status is forced
    (service as any).offers[0].status = OfferStatus.ACCEPTED;

    expect(() => service.remove(created.id)).toThrow(BadRequestException);
  });

  it('should accept a PENDING offer and assign the task', () => {
    (taskService.findOne as jest.Mock).mockReturnValue({
      id: 1,
      status: TaskStatus.OPEN,
    });

    const dto: CreateOfferDto = { taskId: 1, userId: 2, message: 'Test' };
    const created = service.create(dto);

    const accepted = service.accept(created.id);

    expect(accepted.status).toBe(OfferStatus.ACCEPTED);
    expect(taskService.assignTask).toHaveBeenCalledWith(1, 2);
  });

  it('should not accept a non-PENDING offer', () => {
    (taskService.findOne as jest.Mock).mockReturnValue({
      id: 1,
      status: TaskStatus.OPEN,
    });

    const dto: CreateOfferDto = { taskId: 1, userId: 2, message: 'Test' };
    const created = service.create(dto);

    // Note: REJECTED status is forced
    (service as any).offers[0].status = OfferStatus.REJECTED;

    expect(() => service.accept(created.id)).toThrow(BadRequestException);
  });

  it('should reject a PENDING offer', () => {
    (taskService.findOne as jest.Mock).mockReturnValue({
      id: 1,
      status: TaskStatus.OPEN,
    });

    const dto: CreateOfferDto = { taskId: 1, userId: 2, message: 'Test' };
    const created = service.create(dto);

    const rejected = service.reject(created.id);

    expect(rejected.status).toBe(OfferStatus.REJECTED);
  });

  it('should not reject a non-PENDING offer', () => {
    (taskService.findOne as jest.Mock).mockReturnValue({
      id: 1,
      status: TaskStatus.OPEN,
    });

    const dto: CreateOfferDto = { taskId: 1, userId: 2, message: 'Test' };
    const created = service.create(dto);

    (service as any).offers[0].status = OfferStatus.ACCEPTED;

    expect(() => service.reject(created.id)).toThrow(BadRequestException);
  });
});
