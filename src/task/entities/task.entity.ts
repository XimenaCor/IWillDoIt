import { TaskStatus } from '@prisma/client';

export class Task {
  id: number;
  title: string;
  description: string;
  price: number;
  isPaid: boolean;
  status: TaskStatus;
  createdByUserId: number;
  assignedUserId: number | null;
  locationId: number | null;
  createdAt: Date;
  expectedFinishDate: Date | null;
}
