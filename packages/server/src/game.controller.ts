import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { GameService } from './game.service';

import { DataService } from './data.service';

import { deriveEmotionByPlayerKey, randomizeDecoration } from '@repo/game';
import { VaultService } from './vault.service';
import { UserService } from './user.service';


type MovePayload = {
  playerKey: string;
  position: {
    x: number;
    y: number;
  }
}


type RegisterPayload = {
  ownerAddress:string,
  contractAddress:string
}

@Controller('game')
export class GameController {
  constructor(private readonly gameService: GameService, 
    private readonly vaultService: VaultService,
    private readonly userService: UserService,
    private readonly dataService: DataService
  ) {}


  /**
   * load on-chain states
   * determine and update agent state
   */

  @Get('/game-state')
  async getGameState(): Promise<any> {

    return this.gameService.getGameState();
  }

  @Post('/register')
  async postRegister(@Body() dto: RegisterPayload):Promise<any> {
    console.log('register', dto);
    const {contractAddress, ownerAddress} = dto;

    const agent = await this.vaultService.createAgent(contractAddress, ownerAddress);

    console.log('agent registered');
    console.log(agent);

    const {inboxAddress} = agent;


    this.userService.initXmtp(agent)
    return {
      inboxAddress
    }

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
