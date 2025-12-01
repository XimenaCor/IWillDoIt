import { Module } from '@nestjs/common';
import { OfferService } from './offer.service';
import { OfferController } from './offer.controller';
import { TaskModule } from 'src/task/task.module';

@Module({
  controllers: [OfferController],
  providers: [OfferService],
  imports: [TaskModule],
})
export class OfferModule { }
