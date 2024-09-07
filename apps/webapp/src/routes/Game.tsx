import { Grid } from "lucide-react";
import { useQuery, useMutation } from '@tanstack/react-query';
import fetch from 'cross-fetch';

import GameGrid from "../components/Grid";
// import { generateBaseGrid } from "@repo/game";

export const createApiUrl = (endpoint: string) => {
    return 'http://localhost:4000/' + endpoint;
}

// const baseGrid = generateBaseGrid(12);

const fetchGameState = async () => {
    const response = await fetch(createApiUrl('game/game-state'));
    if (!response.ok) {
        throw new Error('Network response was not ok');
    }
    return response.json();
};

// actually not neessary
// Function to send POST request
// const postGameMove = async (moveData: any) => {
//     const response = await fetch(createApiUrl('game/move'), {
//         method: 'POST',
//         headers: {
//             'Content-Type': 'application/json',
//         },
//         body: JSON.stringify(moveData),
//     });

//     if (!response.ok) {
//         throw new Error('Failed to post game move');
//     }

//     return response.json();
// };

const Game: React.FC = () => {

    const { data, isLoading, error, refetch } = useQuery({
        queryKey: ['gameState'],
        queryFn: fetchGameState,
    });

    console.log('data', data, isLoading);


    return (
        <div>
            {
                !isLoading && data && <GameGrid baseGrid={data.grid} players={data.players} />
            }

            {isLoading && 'Loading...'}

            <button className="btn btn-primary"
                onClick={() => {
                    refetch();
                    // postGameMove({ player: 'player-1', move: { x: 1, y: 0 } });
                }}
            >Refresh</button>
        </div>
    )
}

export default Game;