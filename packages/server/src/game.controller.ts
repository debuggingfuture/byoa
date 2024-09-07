import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { GameService } from './game.service';

import { DataService } from './data.service';

import { deriveEmotionByPlayerKey, randomizeDecoration } from '@repo/game';


type MovePayload = {
  playerKey: string;
  position: {
    x: number;
    y: number;
  }
}


type RegisterPayload = {
  contractAddress:string
}

@Controller('game')
export class GameController {
  constructor(private readonly gameService: GameService, private readonly dataService: DataService) {}


  /**
   * load on-chain states
   * determine and update agent state
   */

  @Get('/game-state')
  async getGameState(): Promise<any> {

    return this.gameService.getGameState();
  }

  @Post('/register')
  postRegister(@Body() dto: RegisterPayload): any {
    console.log('register', dto);

  }


  @Post('/move')
  postMove(@Body() dto: MovePayload): any {
    console.log('compute move');
    console.log(dto);

    
    const gameState = this.gameService.applyAction(dto);

    // TODO calculate boundaries / rocks etc 

    // only return status as reponse limit

    const emotionByPlayerKey =  deriveEmotionByPlayerKey(gameState);

    return emotionByPlayerKey;
  }


  @Get('/data')
  async getData(@Query() params): Promise<any> {
    const logs = await  this.dataService.getLogs(params.contractAddress);

    console.log('logs', logs);
  
    return logs;
  }
}
