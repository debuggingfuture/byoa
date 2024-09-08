import { Grid } from "lucide-react";
import { useQuery, useMutation } from '@tanstack/react-query';
import fetch from 'cross-fetch';

import GameGrid from "../components/Grid";
import { createApiUrl } from "../domain/api";
import { useAgentContext } from "../components/AgentContext";


const fetchGameState = async () => {
    const response = await fetch(createApiUrl('game/game-state'));
    if (!response.ok) {
        throw new Error('Network response was not ok');
    }
    return response.json();
};



const fetchMoveRequest = async (contractAddress: string) => {
    const response = await fetch(createApiUrl('user/move-request?contractAddress=' + contractAddress));
    if (!response.ok) {
        throw new Error('Network response was not ok');
    }
    return response.text();
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

    const { agentByContractAddress } = useAgentContext();



    return (
        <div >
            {
                !isLoading && data && <GameGrid baseGrid={data.grid} players={data.players} />
            }

            {isLoading && 'Loading...'}

            <div className="flex gap-2 p-2">
                {
                    Object.keys(agentByContractAddress)
                        .map(contractAddress => {
                            const agent = agentByContractAddress[contractAddress];
                            return (
                                <button className="btn btn-primary"
                                    onClick={() => {
                                        fetchMoveRequest(contractAddress)
                                            .then(results => {
                                                console.log('results', results)
                                            });
                                    }}
                                >Ask {agent?.name} To Move</button>
                            )
                        })
                }


                <button className="btn btn-primary"
                    onClick={() => {
                        refetch();
                        // postGameMove({ player: 'player-1', move: { x: 1, y: 0 } });
                    }}
                >Refresh</button>

            </div>

        </div>
    )
}

export default Game;