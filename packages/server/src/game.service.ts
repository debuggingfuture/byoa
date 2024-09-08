import { Injectable } from '@nestjs/common';
import { applyMove, CellType, findNewMovePosition, generateBaseGrid, Role } from '@repo/game';


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
        role: Role.Human,
        position: {
          x: 5,
          y: 5
        }
      }, {
        key: "player-2",
        role: Role.Dog,
        position: {
          x: 8,
          y: 8
        }
      }],
    }


    // sorry always some poops and bones around for demo

    const { x: xP, y: yP}= this.gameState.players[0].position;
    const { x: xD, y: yD}= this.gameState.players[1].position;
    this.gameState.grid = this.gameState.grid.map(cell=> {
      let distanceP =(Math.abs(cell.x - xP) + Math.abs(cell.y - yP));
      let distanceD =(Math.abs(cell.x - xD) + Math.abs(cell.y - yD));
      if(distanceP < 2 && distanceP >0 ) {
        return {
          ...cell,
          type: CellType.Poop
        };
      }

      if(distanceD < 2 && distanceD >0 ) {
        return {
          ...cell,
          type: CellType.Bone
        };
      }
      return {
        ...cell,
      };
    })

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
