import { Injectable } from '@nestjs/common';
import { applyMove, findNewMovePosition, generateBaseGrid } from '@repo/game';


const GRID_SIZE = 12;

@Injectable()
export class GameService {

  private gameState;

  constructor(){

    console.log('generateBaseGrid', generateBaseGrid)
    const grid = generateBaseGrid(GRID_SIZE);


    this.gameState={
      grid,
      players: [{
        key: "player-1",
        position: {
          x: 0,
          y: 0
        }
      }, {
        key: "player-2",
        position: {
          x: 0,
          y: 0
        }
      }],
    }

  }



  
  getGameState() {
    return this.gameState;
  }
c
  applyAction(move: any) {

    this.gameState = applyMove(this.gameState, move);

    return this.gameState;
  }

  getHello(): string {
    return 'Hello World!';
  }
}
