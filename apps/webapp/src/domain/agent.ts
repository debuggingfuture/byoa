
export interface AIAgent {
    id: string;
    name: string;
    model: string;
}

export interface SystemPrompt {
    id: string;
    agentId: string;
    prompt: string;
}

export enum Model {
    GPT4o = 'gpt-4o',
    Claude = 'claude',
}

