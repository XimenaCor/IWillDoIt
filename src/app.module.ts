import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TaskModule } from './task/task.module';
import { OfferModule } from './offer/offer.module';
import { LocationModule } from './location/location.module';
import { ReviewModule } from './review/review.module';
import { UserModule } from './user/user.module';
import { LogsDemoController } from './common/logs-demo.controller';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }), TaskModule, OfferModule, LocationModule, ReviewModule, UserModule],
  controllers: [LogsDemoController],
})
export class AppModule { }
