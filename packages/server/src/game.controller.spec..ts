import { Test, TestingModule } from '@nestjs/testing';
import { GameController } from './game.controller';
import { GameService } from './game.service';

describe('GameController', () => {
  let gameController: GameController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [GameController],
      providers: [GameService],
    }).compile();

    gameController = app.get<GameController>(GameController);
  });

  describe('root', () => {
    it('should return game state"', async () => {

      const res = await gameController.getGameState();
      // expect(res).toBe('Hello World!');
    });
  });
});
