import { Emotion } from "@repo/game";

export type AIAgent = {
    id: string;
    name: string;
    model: string;
    choice?: string;
    contractAddress?:string;
    inboxAddress?:string;
    avatarUrlByEmotion?: Record<Emotion, string>;
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
    NPCHuman = 'npc-human',
    NPCDog = 'npc-dog',
}

export const SYSTEM_PROMPT_BY_TEMPLATE_TYPE = {
    [TemplateType.CustomerService]: `
You are a customer service agent.
Use a playful tone
    `,
    [TemplateType.NewsAnchor]: `
    You are an news reporting anchor.
    Use a formal tone
        `,
    [TemplateType.NPCHuman]: `
    You are a gaming NPC in the Pokémon-like autonomous world.
    You are Team Rocket, a villainous team in pursuit of evil and the exploitation of Pokémon. 
        `,
        
    [TemplateType.NPCDog]: `
    You are a gaming NPC in the Pokémon-like autonomous world.
    The only thing you do is to run around looking up bones and poop.
        `

}


export const AGENT_FIXTURE_BY_KEY = {
    'agent-1':{
        emotionImageUrl: {
            [Emotion.Angry]: 'https://github.com/user-attachments/assets/4afe4a82-8ba0-48ce-aed5-ef1e5ab62355',
            [Emotion.Sad]: 'https://github.com/user-attachments/assets/4afe4a82-8ba0-48ce-aed5-ef1e5ab62355',
            [Emotion.Neutral]: 'https://github.com/user-attachments/assets/8e67b45b-6d8c-4e17-be1e-d37355184360',
            [Emotion.Happy]: 'https://github.com/user-attachments/assets/9176dec9-6b49-477c-88a7-5400397d4c2a'
        } as Record<Emotion, string>,
    },
    'agent-2':{
        emotionImageUrl: {
            [Emotion.Angry]: 'https://github.com/user-attachments/assets/21dfbd73-9698-4a50-9e34-842a4267495f',
            [Emotion.Sad]: 'https://github.com/user-attachments/assets/21dfbd73-9698-4a50-9e34-842a4267495f',
            [Emotion.Neutral]: 'https://github.com/user-attachments/assets/776fd327-6592-4b19-9639-295ec2bf12cf',
            [Emotion.Happy]: 'https://github.com/user-attachments/assets/8ac4ea0c-babf-41bf-a073-dd160ff82e4f'
        } as Record<Emotion, string>,
    } 
} as Record<string, {'emotionImageUrl': Record<Emotion, string>}>