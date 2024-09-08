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


const ChoiceNode: React.FC<NodeProps<ChoiceNodeProps>> = (props: NodeProps<ChoiceNodeProps>) => {
    const { choices } = props?.data;
    const supportedModels = Object.values(Model)
    const [currentChoiceType, setCurrentChoiceType] = React.useState(ChoiceType.Randomize);

    const [currentChoice, setCurrentChoice] = React.useState(choices[0]);
    const [choicePrompt, setChoicePrompt] = React.useState("Always selected one of the choices. respond with { choice: <choice> }");

    return (
        <>
            <Handle
                type="target"
                position={Position.Left}
                style={{ background: '#555' }}
                onConnect={(params) => console.log('handle onConnect', params)}
                isConnectable
            />
            <div className="bg-white wrapper p-1 w-full">
                <div className="inner">
                    <h3 className="text-xl text-black">💭 Action Plan</h3>
                </div>


                <h3 className="text-lg text-black">When given...</h3>
                <div className="flex gap-1">
                    {choices.map((choice) => (
                        <kbd className="kbd kbd-lg">{choice.label}</kbd>
                    ))}
                </div>
                <h3 className="text-lg text-black">Strategy</h3>
                <select
                    value={currentChoiceType}
                    onChange={(e) => {
                        setCurrentChoiceType(e.target.value as ChoiceType)
                    }}
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
                {
                    currentChoiceType === ChoiceType.Prompt && (
                        <textarea
                            value={choicePrompt}
                            rows={6}
                            cols={70}
                            // onChange={(e) => {
                            // }}
                            className="mb-2 p-2 border rounded"
                            placeholder="System Prompt"
                        />
                    )
                }
                {
                    currentChoiceType === ChoiceType.Simple && (
                        <select
                            value={currentChoice}
                            onChange={(e) => {
                                setCurrentChoice(e.target.value as ChoiceType)
                            }}
                            className="p-2 border rounded"
                        >
                            {
                                choices.map(
                                    (choice) => (
                                        <option key={choice.value} value={choice.value}>{choice.label}</option>
                                    )
                                )
                            }
                        </select>
                    )
                }





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
