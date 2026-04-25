import { WebSocketGateway, SubscribeMessage, MessageBody } from '@nestjs/websockets';
import { CardsService } from './cards.service';
import { CreateCardDto } from './dto/create-card.dto';
import { UpdateCardDto } from './dto/update-card.dto';

@WebSocketGateway()
export class CardsGateway {
  constructor(private readonly cardsService: CardsService) {}

  @SubscribeMessage('createCard')
  create(@MessageBody() createCardDto: CreateCardDto) {
    return this.cardsService.create(createCardDto);
  }

  @SubscribeMessage('findAllCards')
  findAll() {
    return this.cardsService.findAll();
  }

  @SubscribeMessage('findOneCard')
  findOne(@MessageBody() id: number) {
    return this.cardsService.findOne(id);
  }

  @SubscribeMessage('updateCard')
  update(@MessageBody() updateCardDto: UpdateCardDto) {
    return this.cardsService.update(updateCardDto.id, updateCardDto);
  }

  @SubscribeMessage('removeCard')
  remove(@MessageBody() id: number) {
    return this.cardsService.remove(id);
  }
}
