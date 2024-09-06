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
    Position
} from '@xyflow/react';
import { NodeProps } from "@xyflow/react";
import { AIAgent, Model } from '../domain/agent';

type AvatarNodeProps = Node<{
}>

// Custom node component
const AvatarNode: React.FC<NodeProps<AvatarNodeProps>> = (props: NodeProps<AvatarNodeProps>) => {
    // const { agent, onNameChange, onModelChange } = props?.data;

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
            <div className="bg-white wrapper p-1">
                <div className="inner">
                    <h3 className="text-sm text-black">🤖 Avatar</h3>
                </div>
            </div>
            <Handle
                type="source"
                position={Position.Right}
                id="a"
                style={{ top: 10, background: '#555' }}
                isConnectable
            />
        </>

    );
};

export default AvatarNode;
