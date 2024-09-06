
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
} from '@xyflow/react';
import { NodeProps } from "@xyflow/react";
import { AIAgent, Model, SystemPrompt } from '../domain/agent';


type SystemPromptNodeProps = Node<{
    systemPrompt: SystemPrompt;
    onPromptInputChange: (id: string, prompt: string) => void;
}>


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
                        onChange={(e) => onPromptInputChange(systemPrompt?.agentId, e.target.value)}
                        className="mb-2 p-2 border rounded"
                        placeholder="System Prompt"
                    />

                </div>

            </div>

        </div>
    );
};

export default SystemPromptNode;