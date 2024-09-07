
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
                <h3 className="text-lg">System Prompt</h3>
                <div className="p-2 bg-white rounded shadow">
                    <textarea
                        value={systemPrompt?.prompt}
                        rows={6}
                        cols={70}
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