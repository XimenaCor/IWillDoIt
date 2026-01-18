import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateOfferDto } from './dto/create-offer.dto';
import { UpdateOfferDto } from './dto/update-offer.dto';
import { Offer } from './entities/offer.entity';
import { OfferStatus } from './offer-status.enum';
import { TaskService } from '../task/task.service';
import { TaskStatus } from '@prisma/client';

@Injectable()
export class OfferService {
  private offers: Offer[] = [];
  private idCounter = 1;

  constructor(private readonly taskService: TaskService) { }

  async create(createOfferDto: CreateOfferDto): Promise<Offer> {
    // validate that the task exists and is open for offers
    const task = await this.taskService.findOne(createOfferDto.taskId);

    // we don't allow offers on completed or cancelled tasks
    if (
      task.status === TaskStatus.COMPLETED ||
      task.status === TaskStatus.CANCELLED ||
      task.status === TaskStatus.UNCONCLUDED
    ) {
      throw new BadRequestException(
        'Cannot create offers for completed or cancelled tasks',
      );
    }

    const offer: Offer = {
      id: this.idCounter++,
      taskId: createOfferDto.taskId,
      userId: createOfferDto.userId,
      message: createOfferDto.message,
      status: OfferStatus.PENDING,
      createdAt: new Date(),
    };

    this.offers.push(offer);
    return offer;
  }

  findAll(): Offer[] {
    return this.offers;
  }

  findOne(id: number): Offer {
    const offer = this.offers.find((o) => o.id === id);
    if (!offer) {
      throw new NotFoundException(`Offer with id ${id} not found`);
    }
    return offer;
  }

  // usefull to update the message of the offer
  update(id: number, updateOfferDto: UpdateOfferDto): Offer {
    const offer = this.findOne(id);

    if (updateOfferDto.message !== undefined) {
      offer.message = updateOfferDto.message;
    }

    return offer;
  }

  // delete an offer (sets its status to WITHDRAWN)
  remove(id: number): Offer {
    const offer = this.findOne(id);

    if (offer.status !== OfferStatus.PENDING) {
      throw new BadRequestException(
        'Only PENDING offers can be withdrawn or removed',
      );
    }

    offer.status = OfferStatus.WITHDRAWN;
    return offer;
  }

  // accept an offer: changes offer status + assigns the task
  accept(id: number): Offer {
    const offer = this.findOne(id);

    if (offer.status !== OfferStatus.PENDING) {
      throw new BadRequestException('Only PENDING offers can be accepted');
    }

    offer.status = OfferStatus.ACCEPTED;

    // set the task's assignedUserId
    this.taskService.assignTask(offer.taskId, offer.userId);

    return offer;
  }

  reject(id: number): Offer {
    const offer = this.findOne(id);

    if (offer.status !== OfferStatus.PENDING) {
      throw new BadRequestException('Only PENDING offers can be rejected');
    }

    offer.status = OfferStatus.REJECTED;
    return offer;
  }
}
