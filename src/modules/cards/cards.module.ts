import { Module } from '@nestjs/common';
import { CardsService } from './cards.service';
import { CardsGateway } from './cards.gateway';

@Module({
  providers: [CardsGateway, CardsService],
})
export class CardsModule {}
