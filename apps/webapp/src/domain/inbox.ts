// Define types
export type Recipient = {
    id: string;
    address: string;
    name: string;
    avatarUrl?: string;
};

export type Message = {
    id: number;
    senderId: string;
    recipientId: string;
    content: string;
    timestamp: Date;
};
