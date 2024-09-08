import { Body, Controller, Get, Post, Query } from '@nestjs/common';

import { DataService } from './data.service';

import { randomizeDecoration } from '@repo/game';
import { UserService } from './user.service';


/*
* This should be done by user and not resided in server
 * It's to invoke script for demo purpose  
*/

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}


  /**
   * load on-chain states
   * determine and update agent state
   */

  @Get('/move-request')
  async postMove(@Query() query): Promise<any> {
    console.log('query', query)
    const contractAddress = query.contractAddress || "0x9e6fc3ef8850f97d7ffe5562a290c071d541bbfb" as `0x${string}`;

    this.userService.sendDONRequest(contractAddress);
  }


}
