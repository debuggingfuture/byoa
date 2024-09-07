import {
    ReactFlow,
    Node,
    Handle,
    Position
} from '@xyflow/react';
import { NodeProps } from "@xyflow/react";
import { AGENT_FIXTURE_BY_KEY, AIAgent, Model } from '../domain/agent';
import { Emotion } from '@repo/game';

type AvatarFaceNodeProps = Node<{
    agentId: string,
    emotion: Emotion,
    label: string
}>


const AvatarFaceNode: React.FC<NodeProps<AvatarFaceNodeProps>> = (props: NodeProps<AvatarFaceNodeProps>) => {
    const { agentId, emotion, label } = props?.data;

    const supportedModels = Object.values(Model)

    // const defaultUrl = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTvGb4n0ZoM8a9pwq1DRASV7XwRlbQ9GJDmjg&s';

    const url = AGENT_FIXTURE_BY_KEY[agentId].emotionImageUrl[emotion]
    return (
        <>
            <Handle
                type="target"
                position={Position.Left}
                style={{ background: '#555' }}
                onConnect={(params) => console.log('handle onConnect', params)}
                isConnectable
            />
            <div className="w-24">
                <div className="mb-1 bg-white rounded-3xl text-center">{label}</div>
                <div className="bg-white wrapper p-1">
                    <img src={url} />
                </div>
            </div>

        </>

    );
};

export default AvatarFaceNode;
