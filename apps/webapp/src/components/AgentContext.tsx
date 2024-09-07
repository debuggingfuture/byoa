import React, { createContext, useEffect, useState } from 'react';
import { AIAgent } from '../domain/agent';

// TODO contract / inbox address
export type AgentState = {
    agents: AIAgent[];
};

export const AgentContext = createContext<AgentState | undefined>(undefined);


export const AgentContextProvider = ({ children }: { children: React.ReactNode }) => {
    const value = {
        agents: []
    }

    const [agentByContractAddress, setAgentByContractAddress] = useState({});


    return (
        <AgentContext.Provider value={value}>
            {children}
        </AgentContext.Provider>
    );
};


export const useAgentContext = () => {
    const context = React.useContext(AgentContext);
    if (context === undefined) {
        throw new Error('useAgentContext must be used within a AgentContextProvider');
    }
    return context;
};