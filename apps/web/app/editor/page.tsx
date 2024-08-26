'use client';
import React, { useEffect } from 'react';
import { ReactFlow } from '@xyflow/react';
import { useConfig, useWalletClient, useWriteContract } from 'wagmi'
import { Abi, parseEther } from 'viem'
import { deployContract } from '@wagmi/core'
import { eip7702Actions } from 'viem/experimental';
import '@xyflow/react/dist/style.css';
import { type DeployContractParameters } from '@wagmi/core'
import { WagmiProvider } from 'wagmi';
import { WAGMI_CONFIG } from '../config';
import { TEMPLATES } from '../templates';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';


const AGENT_DEPLOYER_ADDRESS = '0x8a2CbBC7Ace80263C6d8F2758d63aD1C08BfDe0B';

const initialNodes = [
    { id: '1', position: { x: 0, y: 0 }, data: { label: '1' } },
    { id: '2', position: { x: 0, y: 100 }, data: { label: '2' } },
];
const initialEdges = [{ id: 'e1-2', source: '1', target: '2' }];

export const ABI = TEMPLATES.basic;



const ControlPanel = ({ deploy }: { deploy: any }) => {



    return (
        <div className="p-4 border rounded-lg shadow-sm">
            <h2 className="text-xl font-bold mb-4">Deploy ERC721 Contract</h2>
            <button
                onClick={() => deploy()}
                // disabled={!write || isLoading}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:opacity-50"
            >
                Deploy
                {/* {isLoading ? 'Deploying...' : 'Deploy Contract'} */}
            </button>
            {/* {isSuccess && (
                <p className="mt-2 text-green-600">Contract deployed successfully!</p>
            )} */}
        </div>
    )

    return (<div>

    </div>)
}


const Editor = () => {

    const config = useConfig();

    const { data: walletClient, isLoading } = useWalletClient({
        account: AGENT_DEPLOYER_ADDRESS,
    })



    const deployParams = {
        abi: TEMPLATES.basic.abi,
        // address: '0x6b175474e89094c44da98b954eedeac495271d0f',
        args: [
        ],

        bytecode: TEMPLATES.basic.bytecode?.object
    } as DeployContractParameters;

    async function deploy() {
        console.log('deploy')


        // const authorization = await walletClient!.signAuthorization({
        //     contractAddress: '0xFBA3912Ca04dd458c843e2EE08967fC04f3579c2',
        // })

        // @ts-ignore
        // await writeContract(contractParams)


        const result = await deployContract(config, deployParams);

        console.log('results', result)

    };



    const { writeContract } = useWriteContract();


    return (

        <div>

            <div style={{ width: '100vw', height: '80vh' }}>
                <ReactFlow nodes={initialNodes} edges={initialEdges} />

            </div>
            <ControlPanel deploy={deploy} />

        </div>
    )
}

export default function App() {


    const queryClient = new QueryClient()

    return (
        <WagmiProvider config={WAGMI_CONFIG}>
            <QueryClientProvider client={queryClient}>
                <Editor />
            </QueryClientProvider>
        </WagmiProvider>
    );
}