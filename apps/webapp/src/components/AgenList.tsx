import React from 'react';
import * as _ from 'lodash';
import { AIAgent } from '../domain/agent';
import { asShortAddress } from './utils';

const AIAgentList = ({ agents }: { agents: AIAgent[] }) => {
    console.log('agents', agents)
    return (
        <div className="container mx-auto p-4 bg-gray-100">
            <div className="space-y-4">
                {agents.map((agent, index) => {
                    const { model, name, contractAddress, inboxAddress } = agent;
                    return (
                        (
                            <div key={index} className="bg-white rounded-lg p-2 mb-4 border border-gray-200 transition-all">
                                <h2 className="text-xl font-semibold mb-2 text-gray-800">{name}<div className="badge badge-primary m-1">{model}</div></h2>

                                <p className="text-sm text-blue-600 mb-3">{asShortAddress(contractAddress)}...</p>
                                <p className="text-sm text-blue-600 mb-3">Inbox: &nbsp;{asShortAddress(inboxAddress)}...</p>
                                {/* <p className="text-gray-600">{agent.description}</p> */}
                            </div>
                        ))
                }
                )
                }
            </div>
        </div>
    );
};

export default AIAgentList;