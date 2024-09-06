import {
    ReactFlow,
    Node,
    Handle,
    Position
} from '@xyflow/react';
import { NodeProps } from "@xyflow/react";
import { AIAgent, Model } from '../domain/agent';

type AvatarFaceNodeProps = Node<{
    label: string
}>


const AvatarFaceNode: React.FC<NodeProps<AvatarFaceNodeProps>> = (props: NodeProps<AvatarFaceNodeProps>) => {
    const { label } = props?.data;

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

            <div className="mb-1 bg-white rounded-3xl text-center">{label}</div>
            <div className="bg-white wrapper p-1">
                <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTvGb4n0ZoM8a9pwq1DRASV7XwRlbQ9GJDmjg&s" />
            </div>

        </>

    );
};

export default AvatarFaceNode;
