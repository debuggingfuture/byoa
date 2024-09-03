// Define types
export type Recipient = {
    id: number;
    address: string;
    name: string;
    avatar: string;
};

export type Message = {
    id: number;
    senderId: number;
    recipientId: number;
    content: string;
    timestamp: Date;
};
