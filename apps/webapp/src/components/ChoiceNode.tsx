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
import React from 'react';

type ChoiceNodeProps = Node<{

    choices: any[];
}>


enum ChoiceType {
    Randomize = 'randomize',
    Prompt = 'prompt',
    Simple = 'simple',
}


// Custom node component
const ChoiceNode: React.FC<NodeProps<ChoiceNodeProps>> = (props: NodeProps<ChoiceNodeProps>) => {
    const { choices } = props?.data;
    const supportedModels = Object.values(Model)
    const [currentChoiceType, setCurrentChoiceType] = React.useState(ChoiceType.Randomize);

    const [currentChoice, setCurrentChoice] = React.useState(choices[0]);

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
                    <h3 className="text-sm text-black">🤖 Choices</h3>
                </div>
                <select
                    value={currentChoiceType}
                    // onChange={(e) => onModelChange(agent.id, e.target.value)}
                    className="p-2 border rounded"
                >
                    {
                        Object.values(ChoiceType).map(
                            (choiceType) => (
                                <option key={choiceType} value={choiceType}>{choiceType}</option>
                            )
                        )
                    }
                </select>
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

export default ChoiceNode;
