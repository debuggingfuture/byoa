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
import { AIAgent, SystemPrompt, Model, TemplateType, SYSTEM_PROMPT_BY_TEMPLATE_TYPE } from '../domain/agent';
import { useConfig, useDeployContract, useWaitForTransactionReceipt, useWalletClient } from 'wagmi';
import { BY_TEMPLATE } from '../adapters/agent-contract';
import * as _ from 'lodash';

// import { eip7702Actions } from 'viem/experimental';
import { type DeployContractParameters } from '@wagmi/core'
import { create1ToMNodesWithEdges, createNodesAndEdges } from '../components/utils';
import AvatarNode from '../components/AvatarNode';
import AvatarFaceNode from '../components/AvatarFaceNode';
import { createShadowInboxAccount } from '../adapters/agent-inbox';
import ChoiceNode from '../components/ChoiceNode';
import { Emotion } from '@repo/game';
import { Hex } from 'viem';


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
    AvatarFace = 'avatar-face'
}

// Note: You have to create a new data object on a node to notify React Flow about data changes.




const nodeTypes: NodeTypes = {
    [NodeType.Agent]: AgentNode,
    [NodeType.Avatar]: AvatarNode,
    [NodeType.AvatarFace]: AvatarFaceNode,
    [NodeType.SystemPrompt]: SystemPromptNode,
    [NodeType.Choice]: ChoiceNode,


};


const DeployStatus = ({ hash, isDeploying }: { hash: `0x${string}`, isDeploying: boolean }) => {
    const { data: txnResult, isFetching, isSuccess } = useWaitForTransactionReceipt({
        hash,
    })

    // console.log('wait', txnResult, isFetching, isSuccess);

    return (
        <div>
            {
                isDeploying && <div>Deploying...</div>
            }
            {
                isFetching && <div>Confirming...</div>
            }
            {
                (isFetching || isSuccess) && (<div>
                    <a href={"https://sepolia.etherscan.io/tx/" + hash} target="_blank" >
                        View on Explorer <span className="underline"> {hash}</span>
                    </a>
                </div>)
            }
            {
                isSuccess && <div>🎉Deployed <br />
                    <br />
                    <a href={"https://sepolia.etherscan.io/address/" + txnResult?.contractAddress} target="_blank">
                        Contract: {txnResult?.contractAddress}
                    </a>
                    <br />
                    <button className="mt-4 p-2 bg-blue-500 text-white rounded">Talk to your agent </button>
                </div>

            }

        </div >
    )
}


const DeployControl = ({ agentId, agent, systemPrompt }: { agentId: string, agent: any, systemPrompt: any }) => {
    const { deployContract, isPending, isSuccess: isDeploySuccess, data: deployHash, isError: isDeployError } = useDeployContract();

    const deployAgent = async (agentId: string) => {
        console.log('Deploying agents',);

        const deployParams = {
            ...BY_TEMPLATE.simple,
        } as DeployContractParameters;

        console.log('deployParams', agentId, deployParams)


        await deployContract(deployParams)

    }

    return (
        <div>
            <button
                onClick={async () => {
                    deployAgent(agentId);
                }}
                disabled={isPending}
                className="mt-4 p-2 ml-10 bg-blue-500 text-white text-xl rounded btn-deploy"
            >
                Deploy {agentId}
            </button>

            <div className="p-4  text-white">
                {
                    isDeployError && <div>Deploy Error</div>
                }

                {
                    deployHash && (
                        <DeployStatus hash={deployHash} isDeploying={isDeploySuccess} />
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
                x: 500,
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


    }, []);

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
                    label: '😊',
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
        const agentEdge = {
            id: `agent-${avatarId}`,
            source: agentId,
            target: avatarNode.id,
        }

        setNodes((nds) => nds.concat(...(nodesNew as any[])));

        setEdges((edges: unknown[]) => edges.concat(...edgesNew, agentEdge) as any)

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
            // isConnectable: true,
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
                <button
                    onClick={addNewAgent}
                    className="mt-4 p-2 bg-blue-500 text-white rounded"
                >
                    Add Agent
                </button>
                <button
                    onClick={() => addNewAvatar(lastAgentId)}
                    className="mt-4 p-2 bg-blue-500 text-white rounded"
                >
                    Add Aavtar
                </button>
                <button
                    onClick={() => addNewChoice(lastAgentId)}
                    className="mt-4 p-2 bg-blue-500 text-white rounded"
                >
                    Add Choice
                </button>

                <br />


            </div>
            <div className="flex">
                {
                    agents.map((agent, i) => {
                        return (
                            <DeployControl agentId={agent.id} agent={agents[0]} systemPrompt={systemPrompts[i]} />
                        )
                    })
                }


            </div>


        </div>
    );
};

export default AIAgentFlowEditor;