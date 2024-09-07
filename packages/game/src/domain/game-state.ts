import { Cell } from "./grid"

export type Player = {

    key: string,
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


    console.log('xxx', JSON.stringify(gameState));

    return {
        ...gameState,

    }

}