import { Test, TestingModule } from '@nestjs/testing';
import { OfferController } from './offer.controller';
import { OfferService } from './offer.service';
import { TaskService } from '../task/task.service';

describe('OfferController', () => {
  let controller: OfferController;

  beforeEach(async () => {
    const taskServiceMock = {
      findOne: jest.fn(),
      assignTask: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [OfferController],
      providers: [
        OfferService,
        {
          provide: TaskService,
          useValue: taskServiceMock,
        },
      ],
    }).compile();

    controller = module.get<OfferController>(OfferController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
