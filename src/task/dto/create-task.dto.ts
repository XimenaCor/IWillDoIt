export class CreateTaskDto {
  title: string;
  description: string;
  isPaid?: boolean;
  price?: number;
  expectedFinishDate?: Date;

  createdByUserId: number;

  locationId?: number; // ❌ NO null
}
