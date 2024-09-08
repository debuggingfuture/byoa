export enum CellType {
    Plain = 'plain',
    Grass = 'grass',
    Bone = 'bone',
    Flower = 'flower',
    Rock = 'rock',
    Poop = 'poop',
}

export  enum OverlayType {
    Player1 = 'player1',
    Player2 = 'player2',
    Dog = 'dog',
}

export type Cell = {
    x: number;
    y: number;
    type: CellType;
    overlay?: OverlayType;

}


export const DECORATION_BY_TYPE = {

    [CellType.Grass]: '🌿',
    [CellType.Rock]: '🪨',
    [CellType.Bone]: '🦴',
    [CellType.Flower]: '🌼',
    [CellType.Poop]: '💩',
    [CellType.Plain]: '',

}


export const OVERLAY_BY_TYPE = {
    [OverlayType.Dog]: '🐶',
    [OverlayType.Player1]: '👦🏽',

}



export const randomizeDecoration = () => {
    const random = Math.random();
    
    if (random < 0.5) return CellType.Bone;
    if (random < 0.15) return CellType.Rock;
    if (random < 0.3) return CellType.Flower;
    if (random < 0.6) return CellType.Plain;
    // TODO only after dog?
    if (random < 0.7) return CellType.Poop;
 
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

