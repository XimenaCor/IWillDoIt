import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { Task } from './entities/task.entity';
import { TaskStatus } from './task-status.enum';

@Injectable()
export class TaskService {
  private tasks: Task[] = [];
  private idCounter = 1;

  create(createTaskDto: CreateTaskDto): Task {
    const task: Task = {
      id: this.idCounter++,
      title: createTaskDto.title,
      description: createTaskDto.description,
      price: createTaskDto.price,
      isPaid: createTaskDto.isPaid,
      createdByUserId: createTaskDto.createdByUserId,
      assignedUserId: null,
      locationId: createTaskDto.locationId ?? null,
      createdAt: new Date(),
      expectedFinishDate: createTaskDto.expectedFinishDate
        ? new Date(createTaskDto.expectedFinishDate)
        : null,
      status: TaskStatus.OPEN,
    };

    this.tasks.push(task);
    return task;
  }

  findAll(): Task[] {
    return this.tasks;
  }

  findOne(id: number): Task {
    const task = this.tasks.find((t) => t.id === id);
    if (!task) {
      throw new NotFoundException(`Task with id ${id} not found`);
    }
    return task;
  }

  update(id: number, updateTaskDto: UpdateTaskDto): Task {
    const task = this.findOne(id);

    // Note: a task can be updated only if it's not COMPLETED or CANCELLED
    if (
      task.status === TaskStatus.COMPLETED ||
      task.status === TaskStatus.CANCELLED ||
      task.status === TaskStatus.UNCONCLUDED
    ) {
      throw new BadRequestException('Completed or cancelled tasks cannot be modified');
    }

    if (updateTaskDto.title !== undefined) {
      task.title = updateTaskDto.title;
    }
    if (updateTaskDto.description !== undefined) {
      task.description = updateTaskDto.description;
    }
    if (updateTaskDto.price !== undefined) {
      task.price = updateTaskDto.price;
    }
    if (updateTaskDto.isPaid !== undefined) {
      task.isPaid = updateTaskDto.isPaid;
    }
    if (updateTaskDto.expectedFinishDate !== undefined) {
      task.expectedFinishDate = updateTaskDto.expectedFinishDate;
    }

    return task;
  }

  // Note: a task is never eliminated from the system, only its status is changed to CANCELLED
  remove(id: number): Task {
    const task = this.findOne(id);

    if (task.status === TaskStatus.COMPLETED) {
      throw new BadRequestException('Completed tasks cannot be cancelled');
    }

    task.status = TaskStatus.CANCELLED;
    return task;
  }

  markAsPendingOffer(taskId: number): Task {
    const task = this.findOne(taskId);

    if (task.status !== TaskStatus.OPEN) {
      throw new BadRequestException('Only OPEN tasks can receive offers');
    }

    task.status = TaskStatus.PENDING_OFFER;
    return task;
  }

  assignTask(taskId: number, userId: number): Task {
    const task = this.findOne(taskId);

    if (task.status !== TaskStatus.PENDING_OFFER) {
      throw new BadRequestException('Task must be in PENDING_OFFER to be assigned');
    }

    task.status = TaskStatus.ASSIGNED;
    task.assignedUserId = userId;
    return task;
  }

  markInProgress(taskId: number): Task {
    const task = this.findOne(taskId);

    if (task.status !== TaskStatus.ASSIGNED) {
      throw new BadRequestException('Only ASSIGNED tasks can be marked IN_PROGRESS');
    }

    task.status = TaskStatus.IN_PROGRESS;
    return task;
  }

  markCompleted(taskId: number): Task {
    const task = this.findOne(taskId);

    if (task.status !== TaskStatus.IN_PROGRESS && task.status !== TaskStatus.ASSIGNED) {
      throw new BadRequestException('Only IN_PROGRESS or ASSIGNED tasks can be completed');
    }

    task.status = TaskStatus.COMPLETED;
    return task;
  }

  markUnconcluded(taskId: number): Task {
    const task = this.findOne(taskId);

    if (task.status !== TaskStatus.ASSIGNED && task.status !== TaskStatus.IN_PROGRESS) {
      throw new BadRequestException('Only ASSIGNED or IN_PROGRESS tasks can be marked UNCONCLUDED');
    }

    task.status = TaskStatus.UNCONCLUDED;
    return task;
  }
}
