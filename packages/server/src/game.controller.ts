import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { GameService } from './game.service';

import { DataService } from './data.service';

import { deriveEmotionByPlayerKey, Emotion, randomizeDecoration } from '@repo/game';
import { VaultService } from './vault.service';
import { UserService } from './user.service';


type MovePayload = {
  idempotentKey?: string;
  playerKey: string;
  position: {
    x: number;
    y: number;
  }
}


type RegisterPayload = {
  ownerAddress:string,
  contractAddress:string
  name: string
}

@Controller('game')
export class GameController {


  private playerByKey = new Map<string, any>();

  private idempotentKeys = new Set<string>();

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
    const {contractAddress, ownerAddress, name} = dto;

    
    // for simplicity now
    // TODO use role
    const playerId = this.playerByKey.size + 1;
    const playerKey = `player-${playerId}`;


    const agent = await this.vaultService.createAgent(contractAddress, ownerAddress, {
      playerKey,
      name
    });

    this.playerByKey.set(playerKey, {
      contractAddress: agent.contractAddress
    });


    console.log('agent registered');
    console.log(agent);

    const {inboxAddress} = agent;


    this.userService.initXmtp(agent)
    return {
      inboxAddress
    }

  }


  @Post('/move')
  async postMove(@Body() dto: MovePayload): Promise<any> {
    console.log('compute move');
    console.log(dto);
    

    const {playerKey, position, idempotentKey} = dto;

    const isExecuted = this.idempotentKeys.has(idempotentKey);
    console.log('idempotentKey', idempotentKey);
    if(isExecuted){
      console.log('isExecuted, skipping');
      return;
    }
    
    this.idempotentKeys.add(idempotentKey);
    const gameState = this.gameService.applyAction(dto);

    // TODO calculate boundaries / rocks etc 

    // only return status as reponse limit

    const emotionByPlayerKey =  deriveEmotionByPlayerKey(gameState);

    console.log('playerKey', playerKey)
    const player = this.playerByKey.get(playerKey);
    // contractAddress
    const agent = this.vaultService.getAgent(player?.contractAddress)


    // agent send message

    
    const {ownerAddress, inboxAddress} = agent;


    const xmtpClient = await this.userService.createXmtpClient(agent)

    const conversation = await xmtpClient.conversations.newConversation(
      ownerAddress
    );


    const newEmotion = emotionByPlayerKey[playerKey];

    console.log('newEmotion', newEmotion);


    if(newEmotion === Emotion.Angry){
      const message = 'I DONT LIKE DOOOOOGG!!!!!!! 💢💢💢';
      await conversation.send(message);

    }

    return emotionByPlayerKey[playerKey];
  }


  @Get('/data')
  async getData(@Query() params): Promise<any> {
    const logs = await  this.dataService.getLogs(params.contractAddress);

    console.log('logs', logs);
  
    return logs;
  }
}
