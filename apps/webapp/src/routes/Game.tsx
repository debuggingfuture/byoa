import { Grid } from "lucide-react";
import GameGrid, { generateBaseGrid } from "../components/Grid";

const baseGrid = generateBaseGrid(12);


const Game: React.FC = () => {

    // baseGrid

    return (
        <div>
            <GameGrid baseGrid={baseGrid} />
            Game
        </div>
    )
}

export default Game;