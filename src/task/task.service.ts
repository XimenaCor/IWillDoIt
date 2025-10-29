import { Injectable } from '@nestjs/common';
import type { CreateTaskDto } from './dto/create-task.dto';

export interface Task {
  _id: number;
}

@Injectable()
export class TaskService {
  private tasks: Task[] = [];

  getAllTasks() {
    return this.tasks;
  }

  createTask(task: CreateTaskDto) {
    console.log(task);
    this.tasks.push({
      ...task,
      _id: this.tasks.length + 1,
    });
    return task;
  }

  updateTask() {
    return 'Task updated';
  }

  deleteTask() {
    return 'Task deleted';
  }

  updateTaskStatus() {
    return 'Task status updated';
  }
}
