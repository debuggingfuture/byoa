import React, { createContext, useEffect, useState } from 'react';
import { AIAgent } from '../domain/agent';

// TODO contract / inbox address
export type AgentState = {
    agentByContractAddress: Record<string, AIAgent>;
    setAgentByContractAddress: any;
};

export const AgentContext = createContext<AgentState | undefined>(undefined);


export const AgentContextProvider = ({ children }: { children: React.ReactNode }) => {

    const [agentByContractAddress, setAgentByContractAddress] = useState<Record<string, AIAgent>>({});

    return (
        <AgentContext.Provider value={{ setAgentByContractAddress, agentByContractAddress }}>
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