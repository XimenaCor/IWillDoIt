import { Injectable } from '@nestjs/common';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';

@Injectable()
export class ReviewService {
  create(createReviewDto: CreateReviewDto) {
    void createReviewDto;
    return 'This action adds a new review';
  }

  update(id: number, updateReviewDto: UpdateReviewDto) {
    void updateReviewDto;
    return `This action updates a #${id} review`;
  }

  findAll() {
    return `This action returns all review`;
  }

  findOne(id: number) {
    return `This action returns a #${id} review`;
  }

  remove(id: number) {
    return `This action removes a #${id} review`;
  }
}
