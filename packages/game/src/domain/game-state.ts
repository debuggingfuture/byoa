import * as _ from 'lodash';
import { Cell, CellType } from "./grid"

export enum Role {
    Dog = 'dog',
    Human = 'human'
}


export enum Emotion {
    Happy = 'happy',
    Sad = 'sad',
    Angry = 'angry',
    Neutral = 'neutral'
}

export type Player = {
    key: string,
    role: Role,
    position: {
        x: number,
        y: number
    }
}
export type GameState = {
    gridSize: number,
    grid: Cell[],
    players: Player[],

}


export const findNewMovePosition = (gameState:GameState, move: any)=>{
    // TODO case of boundary, randomize
    const {gridSize} = gameState;

    const {x: x_d, y:y_d} = move.position;


    const player1 = gameState.players.find(player => player.key === move.playerKey);
    if(!player1) return;

    const {x: x0, y: y0} = player1.position;

    let x1 = x0 + x_d;
    
    if(x1 < 0) x1 = x0+1;
    if(x1 > gridSize) x1 = x0-1;

    console.log('x1', x1);

    let y1 = y0 + y_d;
    
    if(y1 < 0) y1 = y0+1;
    if(y1 > gridSize) y1 = y0-1;

    console.log('y1', y1);

    return {
        x: x1,
        y: y1
    }

}

// pure fx
// decoupled for future state handling
export const applyMove = (gameState:GameState, move: any)=>{
    const newPosition = findNewMovePosition(gameState, move);
    const player = gameState.players.find(player => player.key === move.playerKey);

    player.position = {
        ...newPosition
    };

    return {
        ...gameState,

    }
}


const deriveEmotionWithRole = (role:Role, cellType:CellType): Emotion=>{
    if (role === Role.Human && cellType === CellType.Poop) {
        return Emotion.Angry
        
    }
    if (role === Role.Dog && cellType === CellType.Bone) {
        return  Emotion.Happy
    }

    return Emotion.Neutral;
}

export const deriveEmotionByPlayerKey = (gameState:GameState)=>{

    const { grid, players } = gameState;

    return  _.fromPairs(players
        .map(
            player=>{
                const { role, position }= player;
    
                const cell = grid.find(cell => cell.x === position.x && cell.y === position.y);

                console.log('wrong cell', cell)
    
                return [player.key, deriveEmotionWithRole(role, cell.type)]
            }
        ))

};