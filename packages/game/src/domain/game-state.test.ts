import { describe, expect, test } from 'vitest';
import { applyMove, findNewMovePosition } from './game-state';


const createGameStateFixture = ()=>{
    return {
        gridSize: 12,
        grid:[],
        players: [
            {
                key: '1',
                position: {
                    x: 2,
                    y: 0
                }
            },
            {
                key: '2',
                position: {
                    x: 3,
                    y: 0
                }
            }
        ]
    }
}

describe('game state', ()=>{
    test('move player', ()=>{
        const gameState = createGameStateFixture();
        const move1 = {
            playerKey: '1',
            position: {
                x: 1,
                y: 0
            }
        }
        const move2 = {
            playerKey: '1',
            position: {
                x: 0,
                y: -1
            }
        }
        const newPosition1 = findNewMovePosition(gameState, move1);
        expect(newPosition1).toEqual({x: 3, y:0})

        expect(applyMove(gameState, move1)?.players[0]?.position).toEqual({x: 3, y:0});

        const newPosition2 = findNewMovePosition(gameState, move2);
        expect(newPosition2).toEqual({x: 3, y:1})
    })
})