import React, { useState, useCallback } from 'react';
import { ArrowUp, ArrowDown, ArrowLeft, ArrowRight } from 'lucide-react';


enum CellType {
    Plain = 'plain',
    Grass = 'grass',
    Flower = 'flower',
    Rock = 'rock',
}

enum OverlayType {
    Player1 = 'player1',
    Player2 = 'player2',
    Dog = 'dog',
}

type Cell = {
    x: number;
    y: number;
    type: CellType;
    overlay?: OverlayType;

}


const DECORATION_BY_TYPE = {

    [CellType.Grass]: '🌿',
    [CellType.Rock]: '🪨',
    [CellType.Flower]: '🌼',
    [CellType.Plain]: '',

}


const OVERLAY_BY_TYPE = {
    [OverlayType.Dog]: '🐶',
    [OverlayType.Player1]: '👦🏽',


}


// 



const randomizeDecoration = () => {
    const random = Math.random();
    if (random < 0.1) return CellType.Rock;
    if (random < 0.3) return CellType.Flower;
    if (random < 0.6) return CellType.Plain;
    return CellType.Grass;
}

export const generateBaseGrid = (gridSize: number): Cell[] => {
    const grid = [];
    for (let y = 0; y < gridSize; y++) {
        for (let x = 0; x < gridSize; x++) {
            const cellType = randomizeDecoration();

            grid.push({ x, y, type: cellType });
        }
    }
    return grid;
};




const GameGrid = ({ baseGrid }: { baseGrid: Cell[] }) => {

    const [player1Position, setPlayer1Position] = useState({ x: 7, y: 7 });
    const [player2Position, setPlayer2Position] = useState({ x: 8, y: 8 });


    const [grid] = useState(baseGrid);



    // const movePlayer = (player, dx, dy) => {
    //     const setPosition = player === 1 ? setPlayer1Position : setPlayer2Position;
    //     const otherPosition = player === 1 ? player2Position : player1Position;

    //     setPosition(prev => {
    //         const newX = Math.max(0, Math.min(gridSize - 1, prev.x + dx));
    //         const newY = Math.max(0, Math.min(gridSize - 1, prev.y + dy));

    //         const newCell = grid.find(cell => cell.x === newX && cell.y === newY);
    //         if (newCell && newCell.type !== 'rock' && !(newX === otherPosition.x && newY === otherPosition.y)) {
    //             return { x: newX, y: newY };
    //         }
    //         return prev;
    //     });
    // };

    // TODO decouple player position
    const renderGrid = () => {
        return (
            <div className="grid grid-cols-12 gap-1 p-4 bg-green-100 rounded-lg shadow-lg" style={{ width: 'fit-content' }}>
                {grid.map((cell: Cell) => {
                    const isPlayer1 = cell.x === player1Position.x && cell.y === player1Position.y;
                    const isPlayer2 = cell.x === player2Position.x && cell.y === player2Position.y;
                    let decoration = DECORATION_BY_TYPE[cell.type] || '';

                    let overlay = '';
                    if (isPlayer1) {
                        overlay = OVERLAY_BY_TYPE[OverlayType.Player1];
                    } else if (isPlayer2) {
                        overlay = OVERLAY_BY_TYPE[OverlayType.Dog];
                    }


                    const bgColor = cell.type === CellType.Plain ? 'bg-orange-100' : 'bg-green-200';

                    return (
                        <div
                            key={`${cell.x}-${cell.y}`}
                            className={`w-16 h-16 flex items-center justify-center border border-green-300 rounded ${bgColor}`}
                        >
                            <span className="z-10 text-lg">{decoration}</span>
                            <span className="z-50 text-3xl">{overlay}</span>
                        </div>
                    );
                })
                }
            </div >
        );
    };

    // const renderControls = (player) => (
    //     <div className="flex flex-col items-center mt-4">
    //         <h3 className="text-lg font-bold mb-2">Player {player} ({cellContent[`player${player}`]})</h3>
    //         <div className="grid grid-cols-3 gap-2">
    //             <div></div>
    //             <button className="btn btn-circle btn-sm" onClick={() => movePlayer(player, 0, -1)}><ArrowUp size={16} /></button>
    //             <div></div>
    //             <button className="btn btn-circle btn-sm" onClick={() => movePlayer(player, -1, 0)}><ArrowLeft size={16} /></button>
    //             <div></div>
    //             <button className="btn btn-circle btn-sm" onClick={() => movePlayer(player, 1, 0)}><ArrowRight size={16} /></button>
    //             <div></div>
    //             <button className="btn btn-circle btn-sm" onClick={() => movePlayer(player, 0, 1)}><ArrowDown size={16} /></button>
    //             <div></div>
    //         </div>
    //     </div>
    // );

    return (
        <div className="flex flex-col items-center space-y-4">
            {renderGrid()}
            {/* <div className="flex justify-around w-full">
                {renderControls(1)}
                {renderControls(2)}
            </div> */}
        </div>
    );
};

export default GameGrid;