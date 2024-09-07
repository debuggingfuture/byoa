import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { GameService } from './game.service';
import { GameController } from './game.controller';
import { VaultService } from './vault.service';
import { DataService } from './data.service';
import { UserService } from './user.service';
import { UserController } from './user.controller';

@Module({
  imports: [],
  controllers: [AppController, GameController, UserController],
  providers: [GameService, DataService, UserService, VaultService],
})
export class AppModule {}
