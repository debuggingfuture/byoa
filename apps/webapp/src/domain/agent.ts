
export type AIAgent = {
    id: string;
    name: string;
    model: string;
    contractaddress?:string;
    inboxAddress?:string;
}

export type SystemPrompt = {
    id: string;
    agentId: string;
    prompt: string;
}

export enum Model {
    GPT4o = 'gpt-4o',
    Claude = 'claude',
}

export enum TemplateType {
    CustomerService = 'customer-service',
    NewsAnchor = 'news-anchor',
}

export const SYSTEM_PROMPT_BY_TEMPLATE_TYPE = {
    [TemplateType.CustomerService]: `
You are a customer service agent.
Use a playful tone
    `,
    [TemplateType.NewsAnchor]: `
    You are an news reporting anchor.
    Use a formal tone
        `

}
