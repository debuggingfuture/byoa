import { describe, expect, test } from 'vitest';
import { applyMove, deriveEmotionByPlayerKey, Emotion, findNewMovePosition, Role } from './game-state';
import { CellType, generateBaseGrid } from './grid';


const createGameStateFixture = ()=>{
    const gridSize = 12;
    return {
        gridSize,
        grid: generateBaseGrid(gridSize),
        players: [
            {
                key: '1',
                role: Role.Human,
                position: {
                    x: 2,
                    y: 0
                }
            },
            {
                key: '2',
                role: Role.Dog,
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

    test('#deriveEmotion', ()=>{
        const gameState = createGameStateFixture();
        const results = deriveEmotionByPlayerKey({...gameState});
        
    
        expect(results).toEqual({
            '1': Emotion.Neutral,
            '2': Emotion.Neutral
            
        })

        gameState.grid[0].type = CellType.Poop;
        gameState.players[0].position = {x: 0, y: 0};

    

        gameState.grid[1].type = CellType.Bone;
        gameState.players[1].position = {x: 1, y: 0};


        const results2 = deriveEmotionByPlayerKey(gameState);

        expect(results2).toEqual({
            '1': Emotion.Angry,
            '2': Emotion.Happy
            
        })
        

    })
})