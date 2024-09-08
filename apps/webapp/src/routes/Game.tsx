import { Grid } from "lucide-react";
import { useQuery, useMutation } from '@tanstack/react-query';
import fetch from 'cross-fetch';

import GameGrid from "../components/Grid";
import { createApiUrl } from "../domain/api";
import { useAgentContext } from "../components/AgentContext";
import { clientToSigner, useEthersSigner } from "../adapters/signer";
import { useEffect } from "react";
import * as LitJsSdk from "@lit-protocol/lit-node-client";
import { LitNetwork } from "@lit-protocol/constants";
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


const Game: React.FC = () => {

    const { data, isLoading, error, refetch } = useQuery({
        queryKey: ['gameState'],
        queryFn: fetchGameState,
    });

    const { agentByContractAddress } = useAgentContext();

    const signer = useEthersSigner();


    // Unsupported network: datil-dev

    const setup = async () => {


        const litNodeClient = new LitJsSdk.LitNodeClient({
            litNetwork: LitNetwork.DatilDev,
            debug: false,
        });
        await litNodeClient.connect();
    }

    // const provider = new ethers.providers.JsonRpcProvider({
    //     skipFetchSetup: true,
    //     url: LIT_RPC.CHRONICLE_YELLOWSTONE,
    // });


    // useEffect(() => {
    //     setup();
    // }, [])

    // // invalid public or private key (argument="key", value="[REDACTED]", code=INVALID_ARGUMENT, version=signing-key/5.7.0)
    // const pkpSessionSigs = await litNodeClient.getPkpSessionSigs({
    //     pkpPublicKey: LIT_PKP_PUBLIC_KEY,
    //     authMethods: [
    //         await EthWalletProvider.authenticate({
    //             signer: ethersSigner,
    //             litNodeClient,
    //             expiration: new Date(Date.now() + 1000 * 60 * 10).toISOString(), // 10 minutes
    //         }),
    //     ],
    //     resourceAbilityRequests: [
    //         {
    //             resource: new LitActionResource("*"),
    //             ability: LitAbility.LitActionExecution,
    //         },
    //     ],
    //     expiration: new Date(Date.now() + 1000 * 60 * 10).toISOString(), // 10 minutes
    // });



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