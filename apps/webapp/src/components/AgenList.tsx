import React from 'react';
import { AIAgent } from '../domain/agent';

const aiAgents = [
    { name: 'Claude', type: 'Language Model', description: 'An AI assistant created by Anthropic' },
    { name: 'DALL-E', type: 'Image Generation', description: 'An AI system for creating images from text descriptions' },
    { name: 'AlphaFold', type: 'Protein Folding', description: 'An AI system for predicting protein structures' },
    { name: 'GPT-4', type: 'Language Model', description: 'A large language model created by OpenAI' },
];

const AIAgentList = ({ agents }: { agents: AIAgent[] }) => {
    return (
        <div className="container mx-auto p-6 bg-gray-100">
            <div className="space-y-4">
                {aiAgents.map((agent, index) => (
                    <div key={index} className="bg-white rounded-lg p-6 border border-gray-200 transition-all">
                        <h2 className="text-xl font-semibold mb-2 text-gray-800">{agent.name}</h2>
                        <p className="text-sm text-blue-600 mb-3">{agent.type}</p>
                        {/* <p className="text-gray-600">{agent.description}</p> */}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default AIAgentList;