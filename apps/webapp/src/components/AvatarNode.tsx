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
import { AIAgent, Model } from '../domain/agent';

type AvatarNodeProps = Node<{
}>

// Custom node component
const AvatarNode: React.FC<NodeProps<AvatarNodeProps>> = (props: NodeProps<AvatarNodeProps>) => {
    // const { agent, onNameChange, onModelChange } = props?.data;

    const supportedModels = Object.values(Model)

    return (
        <div className="">
            <h3 className="text-lg text-black">Avatar</h3>
            <div>
                Something
            </div>

        </div>
    );
};

export default AvatarNode;