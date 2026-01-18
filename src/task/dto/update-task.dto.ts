import { TaskStatus } from '@prisma/client';

export class UpdateTaskDto {
  title?: string;
  description?: string;
  price?: number;
  isPaid?: boolean;
  expectedFinishDate?: Date;
  status?: TaskStatus;
  assignedUserId?: number;

  locationId?: number; // ❌ NO null
}

