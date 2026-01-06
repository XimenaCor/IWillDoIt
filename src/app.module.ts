import { Module } from '@nestjs/common';
import { TaskModule } from './task/task.module';
import { OfferModule } from './offer/offer.module';
import { LocationModule } from './location/location.module';
import { ReviewModule } from './review/review.module';
import { UserModule } from './user/user.module';
import { LogsDemoController } from './common/logs-demo.controller';

@Module({
  imports: [TaskModule, UserModule, OfferModule, LocationModule, ReviewModule],
  controllers: [LogsDemoController],
})
export class AppModule { }
