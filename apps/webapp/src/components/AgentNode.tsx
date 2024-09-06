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
    Handle,
    Position,
} from '@xyflow/react';
import { NodeProps } from "@xyflow/react";
import { AIAgent, Model } from '../domain/agent';

// Custom node properties
type AgentNodeProps = Node<{
    agent: AIAgent;
    onNameChange: (id: string, name: string) => void;
    onModelChange: (id: string, model: string) => void;
}>

// Custom node component
const AgentNode: React.FC<NodeProps<AgentNodeProps>> = (props: NodeProps<AgentNodeProps>) => {
    const { agent, onNameChange, onModelChange } = props?.data;

    const supportedModels = Object.values(Model)

    return (
        <>
            <Handle
                type="target"
                position={Position.Left}
                style={{ background: '#555' }}
                onConnect={(params) => console.log('handle onConnect', params)}
                isConnectable
            />
            <div className="gradient wrapper">
                <div className="inner">
                    <h3 className="text-lg">Agent</h3>
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
            <Handle
                type="source"
                position={Position.Right}
                style={{ background: '#555' }}
                onConnect={(params) => console.log('handle onConnect', params)}
                isConnectable
            />

        </>

    );
};

export default AgentNode;