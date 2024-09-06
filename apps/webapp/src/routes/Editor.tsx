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

import { Model } from '../domain/llm';
import { on } from 'events';

// Define the structure for our AI agent
interface AIAgent {
    id: string;
    name: string;
    model: string;
}

// Define the structure for our System Prompt
interface SystemPrompt {
    id: string;
    agentId: string;
    prompt: string;
}


const edgeTypes = {
    button: ButtonEdge,
};

// Custom node properties
type AgentNodeProps = Node<{
    agent: AIAgent;
    onNameChange: (id: string, name: string) => void;
    onModelChange: (id: string, model: string) => void;
}>


type SystemPromptNodeProps = Node<{
    systemPrompt: SystemPrompt;
    onPromptInputChange: (id: string, prompt: string) => void;
}>


enum NodeType {
    Agent = 'agent',
    SystemPrompt = 'system-prompt',
    Avatar = 'avatar'
}

// Note: You have to create a new data object on a node to notify React Flow about data changes.

// Custom node component
const AgentNode: React.FC<NodeProps<AgentNodeProps>> = (props: NodeProps<AgentNodeProps>) => {
    const { agent, onNameChange, onModelChange } = props?.data;

    const supportedModels = Object.values(Model)

    return (
        <div className="gradient wrapper">
            <div className="inner">
                Agent Node
                <input
                    type="text"
                    value={agent.name}
                    onChange={(e) => onNameChange(agent.id, e.target.value)}
                    className="mb-2 p-2 border rounded"
                    placeholder="Agent Name"
                />
                <select
                    value={agent.model}
                    onChange={(e) => onModelChange(agent.id, e.target.value)}
                    className="p-2 border rounded"
                >
                    {
                        supportedModels.map(
                            (model) => (
                                <option key={model} value={model}>{model}</option>
                            )
                        )
                    }
                </select>
            </div>
        </div>
    );
};

const SystemPromptNode: React.FC<NodeProps<SystemPromptNodeProps>> = (props: NodeProps<SystemPromptNodeProps>) => {
    const { systemPrompt, onPromptInputChange } = props?.data;

    // TODO fix onchange value

    return (
        <div className="gradient wrapper">
            <div className="inner">
                <div className="p-4 bg-white rounded shadow">
                    <textarea
                        value={systemPrompt?.prompt}
                        rows={4}
                        cols={50}
                        onChange={(e) => onPromptInputChange(systemPrompt?.id, e.target.value)}
                        className="mb-2 p-2 border rounded"
                        placeholder="System Prompt"
                    />

                </div>

            </div>

        </div>
    );
};


const nodeTypes: NodeTypes = {
    [NodeType.Agent]: AgentNode,
    [NodeType.SystemPrompt]: SystemPromptNode,


};

const AIAgentFlowEditor: React.FC = () => {
    const [agents, setAgents] = useState<AIAgent[]>([]);
    const [systemPrompts, setSystemPrompts] = useState<SystemPrompt[]>([]);

    const [nodes, setNodes, onNodesChange] = useNodesState([]);
    const [edges, setEdges, onEdgesChange] = useEdgesState([]);

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




    // replace easier than ref
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

    const addNewAgent = useCallback(() => {
        const newAgent: AIAgent = {
            id: `agent-${agents.length + 1}`,
            name: `Agent ${agents.length + 1}`,
            model: Model.Claude,
        };

        setAgents((prevAgents) => [...prevAgents, newAgent]);

        const position = { x: Math.random() * 500, y: Math.random() * 500 };

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
            prompt: 'testing',
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
            source: agentNode.id,
            target: sysPromptNode.id,
            markerEnd: { type: MarkerType.ArrowClosed },
        };


        setNodes((nds) => nds.concat(...[agentNode, sysPromptNode] as any[]));


        setEdges((edges: unknown) => addEdge(newEdge as any, edges as any) as any)
        console.log('set edges', nodes, edges, addEdge(newEdge as any, edges as any))
    }, [agents, handleNameChange, handleModelChange]);

    return (
        <div style={{ height: '500px', width: '100%' }}>
            <ReactFlow
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
        </div>
    );
};

export default AIAgentFlowEditor;