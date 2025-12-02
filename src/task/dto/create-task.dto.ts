export class CreateTaskDto {
  title: string;
  description: string;
  price: number;
  isPaid: boolean;
  createdByUserId: number;
  expectedFinishDate?: string;
  locationId?: number | null;
}
