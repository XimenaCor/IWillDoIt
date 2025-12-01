import { Test, TestingModule } from '@nestjs/testing';
import { TaskService } from './task.service';
import { TaskStatus } from './task-status.enum';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';

describe('TaskService', () => {
  let service: TaskService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TaskService],
    }).compile();

    service = module.get<TaskService>(TaskService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a task with status OPEN and an auto-incremented id', () => {
    const dto: CreateTaskDto = {
      title: 'Help moving furniture',
      description: 'Need help moving a sofa this Saturday',
      price: 30,
      isPaid: true,
      createdByUserId: 1,
      locationId: 10,
      expectedFinishDate: '2025-01-20T15:00:00.000Z',
    };

    const task = service.create(dto);

    expect(task).toBeDefined();
    expect(task.id).toBe(1);
    expect(task.title).toBe(dto.title);
    expect(task.status).toBe(TaskStatus.OPEN);
    expect(task.createdByUserId).toBe(1);
    expect(task.locationId).toBe(10);
    expect(task.isPaid).toBe(true);
  });

  it('should update a task fields when calling update', () => {
    const createDto: CreateTaskDto = {
      title: 'Original title',
      description: 'Original description',
      price: 10,
      isPaid: false,
      createdByUserId: 1,
      locationId: null,
      expectedFinishDate: undefined,
    };

    const created = service.create(createDto);

    const updateDto: UpdateTaskDto = {
      title: 'Updated title',
      description: 'Updated description',
      price: 20,
      isPaid: true,
    };

    const updated = service.update(created.id, updateDto);

    expect(updated.title).toBe('Updated title');
    expect(updated.description).toBe('Updated description');
    expect(updated.price).toBe(20);
    expect(updated.isPaid).toBe(true);
  });

  it('should mark a task as CANCELLED when calling remove', () => {
    const dto: CreateTaskDto = {
      title: 'Task to cancel',
      description: 'Some description',
      price: 5,
      isPaid: false,
      createdByUserId: 2,
      locationId: null,
      expectedFinishDate: undefined,
    };

    const task = service.create(dto);
    const cancelled = service.remove(task.id);

    expect(cancelled.status).toBe(TaskStatus.CANCELLED);
  });

  it('should throw NotFoundException when task does not exist', () => {
    expect(() => service.findOne(999)).toThrow('Task with id 999 not found');
  });
});
