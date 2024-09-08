import React, { useState, useCallback, useEffect, useMemo } from 'react';
import {
    ReactFlow,
    Node,
    Edge,
    Controls,
    Background,
    useNodesState,
    useEdgesState,
    addEdge,
    Connection,
    NodeTypes,
    MarkerType,
    NodeProps
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import ButtonEdge from '../components/ButtonEdge';
// import { deployContract } from '@wagmi/core'
import { on } from 'events';
import SystemPromptNode from '../components/SystemPromptNode';
import AgentNode from '../components/AgentNode';
import { AIAgent, SystemPrompt, Model, TemplateType, SYSTEM_PROMPT_BY_TEMPLATE_TYPE, AGENT_FIXTURE_BY_KEY } from '../domain/agent';
import { useAccount, useChainId, useConfig, useDeployContract, usePublicClient, useWaitForTransactionReceipt, useWalletClient } from 'wagmi';
import { BY_TEMPLATE } from '../adapters/agent-contract';
import * as _ from 'lodash';
import { waitForTransactionReceipt } from '@wagmi/core'
// import { eip7702Actions } from 'viem/experimental';
import { type DeployContractParameters } from '@wagmi/core'
import { create1ToMNodesWithEdges, createNodesAndEdges } from '../components/utils';
import AvatarNode from '../components/AvatarNode';
import AvatarFaceNode from '../components/AvatarFaceNode';
import { createShadowInboxAccount } from '../adapters/agent-inbox';
import ChoiceNode from '../components/ChoiceNode';
import { Emotion } from '@repo/game';
import { Hex, getContractAddress } from 'viem';
import { useAgentContext } from '../components/AgentContext';

import { useQuery, useMutation } from '@tanstack/react-query';


import { PlusSquareIcon } from "lucide-react";
import ScriptNode from '../components/ScriptNode';
import { createApiUrl } from '../domain/api';
import { base, baseSepolia, optimismSepolia, sepolia } from 'viem/chains';


enum EdgeType {
    Button = 'button',
}


const edgeTypes = {
    [EdgeType.Button]: ButtonEdge,
};



enum NodeType {
    Agent = 'agent',
    Choice = 'choice',
    SystemPrompt = 'system-prompt',
    Avatar = 'avatar',
    AvatarFace = 'avatar-face',
    Script = 'script',
}

// Note: You have to create a new data object on a node to notify React Flow about data changes.

const getExplorerUrl = (hash: string, type = 'tx', chainId: number = sepolia.id) => {
    // TODO util directly from viem chains
    let root = `https://sepolia.etherscan.io/${type}/`;
    if (chainId === baseSepolia.id) {
        root = `https://sepolia.basescan.org/${type}/`;

    }
    if (chainId === optimismSepolia.id) {
        root = `${optimismSepolia.blockExplorers.default.url}/${type}/`;

    }

    return root + hash;

}


const nodeTypes: NodeTypes = {
    [NodeType.Agent]: AgentNode,
    [NodeType.Avatar]: AvatarNode,
    [NodeType.AvatarFace]: AvatarFaceNode,
    [NodeType.SystemPrompt]: SystemPromptNode,
    [NodeType.Choice]: ChoiceNode,
    [NodeType.Script]: ScriptNode,

};


const DeployStatus = ({ hash }: { hash: `0x${string}` }) => {
    const { data: txnResult, isFetching, isPending, isFetched, isSuccess } = useWaitForTransactionReceipt({
        hash,
    })

    const chainId = useChainId();

    return (
        <div>
            {
                isPending && (
                    <>
                        <div>
                            <a href={getExplorerUrl(hash, 'tx', chainId)} target="_blank" >
                                View on Explorer <span className="underline"> {hash}</span>
                            </a>
                        </div>
                        {
                            isFetched && (
                                <div>Confirming...</div>
                            )
                        }
                    </>

                )
            }
            {
                isSuccess && <div>🎉Deployed!<span >&nbsp;</span>
                    <a href={getExplorerUrl(txnResult?.contractAddress!, 'address', chainId)} target="_blank">
                        Contract:  <span className="underline">{txnResult?.contractAddress}</span>
                    </a>
                </div>

            }

        </div >
    )
}


const AddButton = ({ onClick, label }: { onClick: any, label: React.ReactNode }) => {

    return (

        <button
            onClick={onClick}
            className="mt-4 p-2 bg-blue-500 text-white rounded"
        >
            <div className="flex row gap-2">
                <span className="text-pink-300">

                    <PlusSquareIcon />
                </span> <span>{label}</span>
            </div>
        </button>
    )
}


const DeployControl = ({ agentId, agent, systemPrompt }: { agentId: string, agent: any, systemPrompt: any }) => {
    const { deployContractAsync, isPending, isSuccess: isDeploySuccess, data: deployHash, isError: isDeployError } = useDeployContract();
    const { address: ownerAddress } = useAccount();

    const { agentByContractAddress, setAgentByContractAddress } = useAgentContext();

    console.log('agentByContractAddress', agentByContractAddress);
    const config = useConfig();
    const fetchRegister = async ({ contractAddress }: { contractAddress: string }) => {

        const response = await fetch(createApiUrl('game/register'), {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                ...agent,
                systemPrompt: systemPrompt?.prompt,
                ownerAddress,
                contractAddress
            })
        });

        // demo only before lit action
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    };

    // TODO give up tanstack here

    // const { data: txnResult, isFetching, isSuccess } = useWaitForTransactionReceipt({
    //     hash,
    // })

    // useEffect(() => {
    //     refetch();

    //     if (deployHash) {
    //         // TODO find contract address before wait
    //         // getContractAddress({ from: deployHash!, opcode: 'CREATE2' });

    //     }

    //     // setAgentByContractAddress()
    //     // deployHash
    // }, [isDeploySuccess])


    const deployAgent = async (agentId: string) => {
        console.log('Deploying agents',);


        // const template = BY_TEMPLATE.simple;
        const template = BY_TEMPLATE.agent;

        const { abi, argsFactory, bytecode } = template;

        const deployParams = {
            abi,
            bytecode,
            args: argsFactory({
                prompt: systemPrompt.prompt,
                choice: "up"
            }),

        } as DeployContractParameters;

        console.log('deployParams', agentId, deployParams)


        const hash = await deployContractAsync(deployParams);


        const results = await waitForTransactionReceipt(config, { hash });
        console.log('results', results);
        const { contractAddress } = results;
        if (contractAddress) {
            const registerResults = await fetchRegister({
                contractAddress
            });

            const agentData = {
                ...agent,
                id: agentId,
                contractAddress,
                inboxAddress: registerResults?.inboxAddress,
            }
            console.log('add agent', agent)

            agentByContractAddress[contractAddress] = agentData;

            setAgentByContractAddress({
                ...agentByContractAddress,
                // [contractAddress]: agentData
            });

        }

    }

    return (
        <div>
            {

                !isDeploySuccess ? (
                    <button
                        onClick={async () => {
                            deployAgent(agentId);
                        }}
                        disabled={isPending}
                        className="mt-4 p-2 ml-10 bg-blue-500 text-white text-xl rounded btn-deploy"
                    >
                        Deploy {agentId}
                    </button>
                ) : (
                    <div>
                        {<button
                            onClick={async () => {
                                deployAgent(agentId);
                            }}

                            className="mt-4 p-2 ml-10 bg-blue-500 text-white text-xl rounded btn-deploy"
                        >Talk to your agent </button>}
                    </div>
                )
            }



            <div className="p-4  text-white">
                {
                    isDeployError && <div>Deploy Error</div>
                }

                {
                    deployHash && (
                        <DeployStatus hash={deployHash} />
                    )
                }

            </div>
        </div>

    )
}

const AIAgentFlowEditor: React.FC = () => {
    const [agents, setAgents] = useState<AIAgent[]>([]);
    const [systemPrompts, setSystemPrompts] = useState<SystemPrompt[]>([]);

    const [nodes, setNodes, onNodesChange] = useNodesState([]);
    const [edges, setEdges, onEdgesChange] = useEdgesState([]);

    const [isDeploying, setIsDeploying] = useState(false);


    const [deployed, setDeployed] = useState([] as Hex[]);

    const nextAgentId = useMemo(() => `agent-${agents.length + 1}`, [agents]);

    // TODO move button  on the agent node
    const lastAgentId = useMemo(() => `agent-${agents.length}`, [agents]);

    const addNewChoice = useCallback((agentId: string) => {

        const choiceId = `choice-${agentId}`;

        const choiceNode: Node = {
            id: choiceId,
            type: NodeType.Choice,
            position: {
                x: 500 + agents.length * 500,
                y: 600
            },
            data: {
                // ⬆️⬇️⬅️➡️
                // 🔼◀️
                choices: [{
                    label: '⬆️',
                    value: '1'
                },
                {
                    label: '⬇️',
                    value: '2'
                },
                {
                    label: '⬅️',
                    value: '3'
                },
                {
                    label: '➡️',
                    value: '4'
                }
                ],

            },
        };



        const newEdge: Edge = {
            id: `edge-${agentId}-choice`,
            type: EdgeType.Button,
            source: agentId,
            target: choiceId,
            markerEnd: { type: MarkerType.ArrowClosed },
        };


        setNodes((nds) => nds.concat(...[choiceNode] as any[]));


        setEdges((edges: unknown) => addEdge(newEdge as any, edges as any) as any)


    }, [agents]);

    const onConnect = useCallback(
        (params: Connection) => setEdges((eds) => addEdge(params, eds)),
        [setEdges]
    );

    const handleNameChange = useCallback((id: string, name: string) => {
        setAgents((prevAgents) =>
            prevAgents.map((agent) =>
                agent.id === id ? { ...agent, name } : agent
            )
        );
    }, []);


    const { data: walletClient, isLoading } = useWalletClient();


    // useEffect(() => {
    //     if (isDeploySuccess && deployHash) {
    //         console.log('add')
    //         setDeployed(_.union(deployed, [deployHash]));
    //     }

    // }), [deployHash];





    // useEffect(() => {
    //     if (isDeploySuccess) {
    //         setIsDeploying(false);
    //     }

    //     // if (txnResult) {

    //     //     console.log('deploy results', txnResult);


    //     //     // TODO lit & BE
    //     //     const shadowAccount = createShadowInboxAccount();

    //     //     const contractResults = {
    //     //         contractAddress: txnResult.contractAddress,
    //     //         shadowAccountAddress: shadowAccount.address,
    //     //     }

    //     // }

    // }, [isDeploySuccess]);



    useEffect(() => {
        setNodes(
            (prevNodes: any) => {

                return prevNodes.map((node: any) => {

                    const systemPrompt = systemPrompts.find((systemPrompt: any) =>
                        systemPrompt.agentId === node.data!.systemPrompt?.agenId);

                    return {
                        ...node,
                        data: {
                            ...node.data,
                            systemPrompt: { ...systemPrompt },
                        },
                    }
                });
            }
        )

    }, [setNodes, setEdges, JSON.stringify(systemPrompts)])



    const handlePromptInputChange = useCallback((agentId: string, input: string) => {
        console.log('input', agentId, input, systemPrompts);

        setSystemPrompts((prevPrompts: SystemPrompt[]) => {

            const currPrompt = systemPrompts.find((prompt) => prompt.agentId === agentId);

            if (currPrompt) {
                currPrompt.prompt = input;
            };
            return systemPrompts;
        }
        );

    }, []);





    const handleModelChange = useCallback((id: string, model: string) => {
        setAgents((prevAgents) =>
            prevAgents.map((agent) =>
                agent.id === id ? { ...agent, model } : agent
            )
        );
    }, []);





    const AGENT_Y_INIT = 300;

    const addNewAvatar = useCallback((agentId: string) => {
        const avatarId = `avatar-${agentId}`;
        // TODO from agent node

        console.log('addNewAvatar', agentId, avatarId, agents.length);
        const avatarNode: Node = {
            id: avatarId,
            type: NodeType.Avatar,

            style: { width: 50, fontSize: 11 },
            position: { x: -650 + agents.length * 750, y: 300 + agents.length * 100 },
            data: {
                agent: null,
                label: 'Avatar',
                onNameChange: handleNameChange,
                onModelChange: handleModelChange,
            },
        };

        const avatarFaceProps = [
            {
                type: NodeType.AvatarFace,
                data: {
                    label: '🤩',
                    emotion: Emotion.Happy,
                    agentId
                }

            },
            {
                type: NodeType.AvatarFace,
                data: {
                    label: '😑',
                    emotion: Emotion.Neutral,
                    agentId
                }
            },
            {
                type: NodeType.AvatarFace,
                data: {
                    label: '😢',
                    emotion: Emotion.Angry,
                    agentId
                }
            }
        ]


        const { nodes: nodesNew, edges: edgesNew } = create1ToMNodesWithEdges(avatarNode, avatarFaceProps, `${avatarId}-face-`);

        console.log('agentId', agentId, avatarNode.id)

        // load fixture here, TODO use dpeloyed ones
        const avatarUrlByEmotion = AGENT_FIXTURE_BY_KEY[agentId]?.emotionImageUrl;


        // do not create new ref
        // setAgents((prevAgents) =>
        //     prevAgents.map((agent) =>
        //         agent.id === agentId ? { ...agent, avatarUrlByEmotion } : agent
        //     )
        // );
        const agent = agents.find((agent) => agent.id === agentId);
        if (agent) {
            console.log('extend', agent)
            agent.avatarUrlByEmotion = avatarUrlByEmotion;
        }

        const agentEdge = {
            id: `agent-${avatarId}`,
            source: agentId,
            target: avatarNode.id,
        }

        setNodes((nds) => nds.concat(...(nodesNew as any[])));

        setEdges((edges: unknown[]) => edges.concat(...edgesNew, agentEdge) as any)

    }, [agents])


    const addNewScript = useCallback((agentId: string) => {

        const scriptId = `script-${agentId}`;

        const position = { x: 200 + 750 * agents.length + Math.random() * 10, y: 300 * agents.length + Math.random() * 10 };

        const scriptNode: Node = {
            id: scriptId,
            type: NodeType.Script,
            position,
            data: {
            },
        };

        const newEdge: Edge = {
            id: `edge-${agentId}-script`,
            type: EdgeType.Button,
            source: agentId,
            target: scriptId,
            markerEnd: { type: MarkerType.ArrowClosed },
        };


        setNodes((nds) => nds.concat(...[scriptNode] as any[]));

        setEdges((edges: unknown) => addEdge(newEdge as any, edges as any) as any)


    }, [agents])



    const addNewAgent = useCallback(() => {
        const newAgent: AIAgent = {
            id: nextAgentId,
            name: nextAgentId,
            model: Model.Claude,
        };

        setAgents((prevAgents) => [...prevAgents, newAgent]);

        const position = { x: 100 + 750 * agents.length + Math.random() * 10, y: 300 * agents.length + Math.random() * 10 };

        const agentNode: Node = {
            id: newAgent.id,
            type: NodeType.Agent,
            position,
            data: {
                agent: newAgent,
                onNameChange: handleNameChange,
                onModelChange: handleModelChange,
            },
        };


        const templateType = nextAgentId === 'agent-1' ? TemplateType.NPCHuman : TemplateType.NPCDog;

        const agentSystemPrompt: SystemPrompt = {
            id: `sp-${newAgent.id}`,
            agentId: newAgent.id,
            prompt: SYSTEM_PROMPT_BY_TEMPLATE_TYPE[templateType],
        };



        systemPrompts.push(agentSystemPrompt);

        const sysPromptNode: Node = {
            id: agentSystemPrompt.id,
            type: NodeType.SystemPrompt,
            position: { x: position.x + 200, y: position.y + 100 },
            data: {
                systemPrompt: agentSystemPrompt,
                onPromptInputChange: handlePromptInputChange,
            },
        };


        const newEdge: Edge = {
            id: `edge-${newAgent.id} -${agentSystemPrompt.id} `,
            type: EdgeType.Button,
            source: agentNode.id,
            target: sysPromptNode.id,
            markerEnd: { type: MarkerType.ArrowClosed },
        };


        setNodes((nds) => nds.concat(...[agentNode, sysPromptNode] as any[]));


        setEdges((edges: unknown) => addEdge(newEdge as any, edges as any) as any)
        console.log('set edges', nodes, edges, addEdge(newEdge as any, edges as any))

        return {
            agent: newAgent
        }
    }, [agents, handleNameChange, handleModelChange]);

    return (
        <div style={{ height: '80vh', width: '100%' }}>
            <ReactFlow
                // fitView
                nodes={nodes}
                edges={edges}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                onConnect={onConnect}
                nodeTypes={nodeTypes}
                edgeTypes={edgeTypes}
            >
                <Background />
                {/* TODO pull right */}
                {/* <Controls /> */}
            </ReactFlow>
            <div className="flex justify-end p-2 gap-2">
                <AddButton
                    onClick={addNewAgent}
                    label="Agent"
                />
                <AddButton
                    onClick={() => addNewAvatar(lastAgentId)}
                    label="Avatar"
                />
                <AddButton
                    onClick={() => addNewChoice(lastAgentId)}
                    label="Choice"
                />
                <AddButton
                    onClick={() => addNewScript(lastAgentId)}
                    label="Script"
                />
                <br />


            </div >
            <div className="flex">
                {
                    agents.map((agent, i) => {
                        return (
                            <DeployControl agentId={agent.id} agent={agents[i]} systemPrompt={systemPrompts[i]} />
                        )
                    })
                }


            </div>


        </div >
    );
};

export default AIAgentFlowEditor;