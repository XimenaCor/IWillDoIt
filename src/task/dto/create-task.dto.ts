export interface CreateTaskDto {
    _id: number;
    title: string;
    descripttion: string;
    payable: boolean;
    price: number;
    date: Date;
}