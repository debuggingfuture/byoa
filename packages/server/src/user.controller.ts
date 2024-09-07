import { Body, Controller, Get, Post } from '@nestjs/common';

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
  async postMove(): Promise<any> {

    this.userService.sendDONRequest();
  }


}
