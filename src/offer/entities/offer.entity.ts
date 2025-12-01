import { OfferStatus } from '../offer-status.enum';

export class Offer {
    id: number;
    taskId: number;
    userId: number; // note: this is the user making the offer
    status: OfferStatus;
    createdAt: Date;
    message?: string;
}
