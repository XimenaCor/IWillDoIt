import { Body, Controller, Get, Post } from '@nestjs/common';
import { TaskService } from './task.service';
import type { CreateTaskDto } from './dto/create-task.dto';

@Controller('/task')
export class TaskController {
    constructor(private taskService: TaskService) { }

    @Get()
    getAllTasks() {
        return this.taskService.getAllTasks();
    }

    @Post()
    createTask(@Body() task: CreateTaskDto) {
        return this.taskService.createTask(task);
    }
}
