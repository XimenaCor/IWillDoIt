import { Module } from '@nestjs/common';
import { TaskModule } from './task/task.module';
import { OfferModule } from './offer/offer.module';
import { LocationModule } from './location/location.module';
import { ReviewModule } from './review/review.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [TaskModule, UserModule, OfferModule, LocationModule, ReviewModule],
})
export class AppModule {}
