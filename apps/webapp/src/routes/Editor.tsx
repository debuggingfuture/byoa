import React, { useState, useCallback, useEffect } from 'react';
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


// import { eip7702Actions } from 'viem/experimental';
import { type DeployContractParameters } from '@wagmi/core'
import { create1ToMNodesWithEdges, createNodesAndEdges } from '../components/utils';
import AvatarNode from '../components/AvatarNode';
import AvatarFaceNode from '../components/AvatarFaceNode';


enum EdgeType {
    Button = 'button',
}


const edgeTypes = {
    [EdgeType.Button]: ButtonEdge,
};



enum NodeType {
    Agent = 'agent',
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


};


const DeployStatus = ({ hash, isDeploying }: { hash: `0x${string}`, isDeploying: boolean }) => {
    const { data, isFetching, isSuccess } = useWaitForTransactionReceipt({
        hash,
    })

    console.log('wait', data, isFetching, isSuccess);

    return (
        <div>
            {
                isDeploying && <div>Deploying...</div>
            }
            {
                isFetching && <div>Confirming...</div>
            }
            {
                isSuccess && <div>🎉Deployed <br />

                    <a href={"https://sepolia.etherscan.io/tx/" + hash} target="_blank">
                        View on Explorer {hash}
                    </a>
                    <br />
                    <a href={"https://sepolia.etherscan.io/address/" + data?.contractAddress} target="_blank">
                        Contract: {data?.contractAddress}
                    </a>
                    <br />
                    <button className="mt-4 p-2 bg-blue-500 text-white rounded">Talk to your agent </button>
                </div>

            }

        </div >
    )
}

const AIAgentFlowEditor: React.FC = () => {
    const [agents, setAgents] = useState<AIAgent[]>([]);
    const [systemPrompts, setSystemPrompts] = useState<SystemPrompt[]>([]);

    const [nodes, setNodes, onNodesChange] = useNodesState([]);
    const [edges, setEdges, onEdgesChange] = useEdgesState([]);

    const [isDeploying, setIsDeploying] = useState(false);



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

    const { deployContract, isSuccess: isDeploySuccess, data: deployHash, isError: isDeployError } = useDeployContract();

    const config = useConfig();
    console.log('useWalletClient', walletClient, isLoading);

    useEffect(() => {
        if (isDeploySuccess) {
            setIsDeploying(false);
        }
        // console.log('xxx', result)
    }, [deployHash, isDeploySuccess]);

    console.log('deploy', isDeploySuccess, deployHash)
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


    const deployAgents = async () => {
        console.log('Deploying agents', agents, systemPrompts);


        // console.log('xxx', contract);

        const deployParams = {
            ...BY_TEMPLATE.simple,
        } as DeployContractParameters;

        console.log('deployParams', deployParams)

        setIsDeploying(true);

        const result = await deployContract(deployParams);

        console.log('deploy results', result);


    }




    const addNewAvatar = useCallback((agentId: string) => {

        // TODO from agent node
        const avatarNode: Node = {
            id: 'avatar',
            type: NodeType.Avatar,

            style: { width: 50, fontSize: 11 },
            position: { x: 500, y: 100 },
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
                    label: '🤩'
                }

            },
            {
                type: NodeType.AvatarFace,
                data: {
                    label: '😊'
                }
            },
            {
                type: NodeType.AvatarFace,
                data: {
                    label: '😊'
                }
            }
        ]


        const { nodes: nodesNew, edges: edgesNew } = create1ToMNodesWithEdges(avatarNode, avatarFaceProps, 'avatar-face-');

        const agentEdge = {
            id: `agent-avatar`,
            source: agentId,
            target: avatarNode.id,
        }

        setNodes((nds) => nds.concat(...(nodesNew as any[])));

        setEdges((edges: unknown[]) => edges.concat(...edgesNew, agentEdge) as any)

    }, [])


    const addNewAgent = useCallback(() => {
        const newAgent: AIAgent = {
            id: `agent-${agents.length + 1}`,
            name: `Agent ${agents.length + 1}`,
            model: Model.Claude,
        };

        setAgents((prevAgents) => [...prevAgents, newAgent]);

        const position = { x: 100 + Math.random() * 10, y: 100 + Math.random() * 10 };

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

        const agentSystemPrompt: SystemPrompt = {
            id: `sp-${newAgent.id}`,
            agentId: newAgent.id,
            prompt: SYSTEM_PROMPT_BY_TEMPLATE_TYPE[TemplateType.CustomerService],
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
            id: `edge-${newAgent.id}-${agentSystemPrompt.id}`,
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
        <div style={{ height: '800px', width: '100%' }}>
            <ReactFlow
                fitView
                nodes={nodes}
                edges={edges}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                onConnect={onConnect}
                nodeTypes={nodeTypes}
                edgeTypes={edgeTypes}
            >
                <Background />
                <Controls />
            </ReactFlow>
            <button
                onClick={addNewAgent}
                className="mt-4 p-2 bg-blue-500 text-white rounded"
            >
                Add New Agent
            </button>
            <button
                onClick={() => addNewAvatar('agent-1')}
                className="mt-4 p-2 bg-blue-500 text-white rounded"
            >
                Add New Aavtar
            </button>
            {
                (
                    <button
                        onClick={async () => {
                            deployAgents();
                        }}
                        disabled={isDeploying}
                        className="mt-4 p-2 bg-blue-500 text-white rounded"
                    >
                        Deploy
                    </button>
                )
            }


            {
                isDeployError && <div>Deploy Error</div>
            }

            {
                deployHash && (
                    <DeployStatus hash={deployHash} isDeploying={isDeploying} />
                )
            }

        </div>
    );
};

export default AIAgentFlowEditor;