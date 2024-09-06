import React, { useEffect, useMemo, useState } from 'react';
import { User, MessageCircle, Send } from 'lucide-react';
import { Message, Recipient } from '../domain/inbox';
import { useConversations, useMessages, useStartConversation } from '@xmtp/react-sdk';



const initialMessages: Message[] = [
    { id: 1, senderId: 0, recipientId: 1, content: 'Hey Alice!', timestamp: new Date() },
    { id: 2, senderId: 1, recipientId: 0, content: 'Hi there!', timestamp: new Date() },
    { id: 3, senderId: 0, recipientId: 2, content: 'Hello Bob', timestamp: new Date() },
    { id: 4, senderId: 2, recipientId: 0, content: 'Hey, how are you?', timestamp: new Date() },
];

type InboxProps = {
    recipients: Recipient[];
    conversations: any[];
    sendXmtpMessage: any
}



const MessageThread = ({ recipient, filteredMessages }: { recipient: any, filteredMessages: any[] }) => {


    return (
        <>
            {/* Chat header */}
            <div className="bg-white p-4 border-b flex items-center">
                <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold mr-3">
                    {recipient.avatar}
                </div>
                <h2 className="text-xl font-semibold">{recipient.address}</h2>
            </div>



            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {filteredMessages.map(msg => (
                    <div
                        key={msg.id}
                        className={`flex ${msg.senderId === 0 ? 'justify-end' : 'justify-start'}`}
                    >
                        <div
                            className={`max-w-xs px-4 py-2 rounded-lg ${msg.senderId === 0 ? 'bg-blue-500 text-white' : 'bg-gray-300'
                                }`}
                        >
                            {msg.content}
                        </div>
                    </div>
                ))}
            </div>


        </>
    )
}


const MessageThreadContainer = ({ recipient, conversation }: { recipient: any, conversation: any }) => {


    const { error, messages, isLoading } = useMessages(conversation, {
        // onError,
        // onMessages,
    });
    // messages callback
    // const onMessages = useCallback((msgs: DecodedMessage[]) => {
    //     // do something with messages
    // }, []);



    // non consistent data type
    const filteredMessages = messages.map((message: any) => {
        return {
            ...message,
            content: message.content?.content || message.content,
        }
    });

    return (
        <MessageThread recipient={recipient} filteredMessages={filteredMessages} />
    )
}

const Inbox: React.FC<InboxProps> = ({ recipients, sendXmtpMessage }: InboxProps) => {


    const [selectedRecipient, setSelectedRecipient] = useState<Recipient | null>(null);
    const [messages, setMessages] = useState<Message[]>(initialMessages);
    const [newMessageContentInput, setNewMessageContent] = useState<string>('');

    const [conversationByRecipientAddress, setConversationByRecipientAddress] = useState<any>({});

    const { conversations, error, isLoading } = useConversations();

    // watch out for rate limit, start lazy
    const { startConversation, isLoading: isLoadingStartConversation } = useStartConversation({
        // conversationId: '',
    });


    const selectedConversation = useMemo(() => {
        if (!selectedRecipient) {
            return;
        }
        return conversationByRecipientAddress[selectedRecipient?.address];
    }, [selectedRecipient, conversationByRecipientAddress])

    useEffect(() => {
        // for simplicity always start before message if not exists
        if (!selectedRecipient) {
            return;
        }
        console.log('startConversation', selectedRecipient)
        if (selectedConversation) {
            return;
        }
        startConversation(selectedRecipient.address, "hi")
            .then((result) => {
                console.log('conversation started', result)
                const { conversation } = result;
                setConversationByRecipientAddress({
                    ...conversationByRecipientAddress,
                    [selectedRecipient.address]: conversation
                })
            })


    }, [selectedRecipient])


    // useMemo

    // still preload to avoid start
    useEffect(() => {
        conversations.forEach((conversation: any) => {
            setConversationByRecipientAddress({
                ...conversationByRecipientAddress,
                [conversation.peerAddress]: conversation
            })
        });

    }, [conversations.length])


    const handleSendMessage = () => {

        if (!selectedConversation) {
            return;
        }
        const newMessageContent = newMessageContentInput.trim();
        if (newMessageContent.trim() && selectedRecipient) {
            const newMsg: Message = {
                id: messages.length + 1,
                senderId: 0,
                recipientId: selectedRecipient.id,
                content: newMessageContent,
                timestamp: new Date(),
            };


            const conversation = conversationByRecipientAddress[selectedRecipient.address];
            console.log('conversationByRecipientAddress', selectedRecipient, conversationByRecipientAddress, conversation)
            sendXmtpMessage(conversation, newMessageContent);
            setMessages([...messages, newMsg]);
            setNewMessageContent(newMessageContent);
        }
    };

    const filteredMessages = messages.filter(
        msg => (msg.senderId === selectedRecipient?.id && msg.recipientId === 0) ||
            (msg.senderId === 0 && msg.recipientId === selectedRecipient?.id)
    );



    return (
        <div className="flex h-screen bg-gray-100">
            {/* Sidebar */}
            <div className="w-1/4 bg-white border-r">
                <div className="p-4 border-b">
                    <h2 className="text-xl font-semibold">Chats</h2>
                </div>
                <ul>
                    {recipients.map(recipient => (
                        <li
                            key={recipient.id}
                            className={`p-4 flex items-center cursor-pointer hover:bg-gray-100 ${selectedRecipient?.id === recipient.id ? 'bg-gray-200' : ''
                                }`}
                            onClick={() => setSelectedRecipient(recipient)}
                        >
                            <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold mr-3">
                                {recipient.avatar}
                            </div>
                            <span>{recipient.name}</span>
                            <span>{recipient.address}</span>
                        </li>
                    ))}
                </ul>
            </div>

            {/* Chat area */}
            <div className="flex-1 flex flex-col">
                {selectedRecipient ? (
                    <>
                        {
                            selectedConversation && (
                                <MessageThreadContainer recipient={selectedRecipient}
                                    conversation={selectedConversation} />
                            )
                        }

                        {/* Message input */}
                        <div className="bg-white p-4 border-t flex items-center">
                            <input
                                type="text"
                                value={newMessageContentInput}
                                onChange={e => setNewMessageContent(e.target.value)}
                                className="flex-1 border rounded-full px-4 py-2 mr-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Type a message..."
                            />
                            <button
                                disabled={!selectedConversation}
                                onClick={handleSendMessage}
                                className="bg-blue-500 text-white rounded-full p-2 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <Send size={20} />
                            </button>
                        </div>
                    </>
                ) : (
                    <div className="flex-1 flex items-center justify-center bg-gray-100">
                        <div className="text-center text-gray-500">
                            <MessageCircle size={48} className="mx-auto mb-4" />
                            <p>Select a chat to start messaging</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Inbox;