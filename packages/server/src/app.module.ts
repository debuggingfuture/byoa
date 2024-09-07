import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { GameService } from './game.service';
import { GameController } from './game.controller';
import { VaultService } from './vault.service';
import { DataService } from './data.service';

@Module({
  imports: [],
  controllers: [AppController, GameController],
  providers: [GameService, DataService, VaultService],
})
export class AppModule {}
