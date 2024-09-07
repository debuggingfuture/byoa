import { Body, Controller, Get, Post } from '@nestjs/common';
import { GameService } from './game.service';

import { DataService } from './data.service';

import { randomizeDecoration } from '@repo/game';


type MovePayload = {
  playerKey: string;
  position: {
    x: number;
    y: number;
  }
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


  @Post('/move')
  postMove(@Body() dto: MovePayload): string {
    console.log('compute move');
    console.log(dto);


    // TODO calculate boundaries / rocks etc 
    return this.gameService.applyAction(dto);
  }


  @Get('/data')
  async getData(): Promise<any> {

    const logs = await  this.dataService.getLogs();

    console.log('logs', logs);
  
    return logs;
  }
}
