'use client';

import logo from '../logo.svg';
import '../App.css';
import { Config, useClient as useWagmiClient } from 'wagmi'


import * as crypto from "crypto"

import React, { useState, useEffect, useCallback, useMemo } from "react";
import {
    useStreamMessages,
    useClient,
    useMessages,
    useConversations,
    useCanMessage,
    useStartConversation,
    XMTPProvider,

    attachmentContentTypeConfig,
    reactionContentTypeConfig,
    replyContentTypeConfig,
    Client,
    useSendMessage,
} from "@xmtp/react-sdk";

// import { ContentTypeId } from "@xmtp/content-type-primitives";
import { EthWalletProvider } from "@lit-protocol/lit-auth-client";

import * as ethers from 'ethers';

import { api } from "@lit-protocol/wrapped-keys";
import { LitNodeClient } from "@lit-protocol/lit-node-client";
import { LitNetwork, LIT_RPC } from "@lit-protocol/constants";
import "@rainbow-me/rainbowkit/styles.css";

import {
    LitAbility,
    LitActionResource,
    LitPKPResource,
} from "@lit-protocol/auth-helpers";


import { useAccount, useWalletClient } from 'wagmi'
import { useEthersSigner } from '../adapters/signer';
import Inbox from '../components/Inbox';
import { Recipient } from '../domain/inbox';
import { Receipt } from 'lucide-react';
import { useAgentContext } from '../components/AgentContext';
import { Emotion } from '@repo/game';

// TODO Lit connect error at Next server runtime
// consider migrate to server
// https://github.com/LIT-Protocol/Issues-and-Reports/issues/17



// TODO optimize to avoid re-render

const InboxContainer = () => {

    const { conversations } = useConversations();

    const { agentByContractAddress } = useAgentContext();

    const { client: xmtpClient, isLoading, error } = useClient();
    const { sendMessage } = useSendMessage();
    const onError = useCallback((err: Error) => {
        console.log('on xmtp error', err);
    }, []);

    // ensure conversation started when opening thread
    const { startConversation, isLoading: isLoadingStartConversation } = useStartConversation({
        // conversationId: '',
        onError,
    });

    const recipients = useMemo(() => {

        return Object.values(agentByContractAddress).filter(a => a.inboxAddress).map((agent) => {
            const { name, id, contractAddress, inboxAddress, avatarUrlByEmotion } = agent;
            return {
                id: agent.id,
                name,
                address: inboxAddress!,
                avatarUrl: avatarUrlByEmotion?.[Emotion.Neutral] as string || name || 'Agent',
                avatarUrlByEmotion,
                contractAddress
            }
        })


    }, Object.keys(agentByContractAddress));


    const { canMessage } = useCanMessage();


    const sendXmtpMessage = async (conversation: any, messageContent: string) => {

        const peerAddress = '0x3F11b27F323b62B159D2642964fa27C46C841897';

        if (!conversation) {
            console.log('no conversation');
            return;
        }



        const canMessageResult = await canMessage(peerAddress);
        console.log('canMessage', canMessageResult, conversation);

        // // if (!conversation || isLoadingStartConversation) {
        // const { conversation } = await startConversation(peerAddress, "yo");
        // // Load all messages in the conversation

        // // const canMessageResult = await client?.canMessage(peerAddress)
        // // console.log('canMessage', canMessageResult);
        // console.log(conversation, isLoadingStartConversation)
        // if (!conversation || isLoadingStartConversation) {
        //     console.log('loading');
        //     return;
        // }
        // console.log('send messages', conversation)
        // // const messages = await conversation.messages();
        // // Send a message
        // await conversation.send("gm");

        const results = await sendMessage(conversation, messageContent);

        console.log('results', results);
        // // Listen for new messages in the conversation
        // for await (const message of await conversation.streamMessages()) {
        //     console.log(`[${message.senderAddress}]: ${message.content}`);
        // }
    }

    return (
        <div>
            <Inbox recipients={recipients} conversations={conversations}
                sendXmtpMessage={sendXmtpMessage}
            />
        </div>
    )



}



const ChatContainer = () => {


    const LIT_PKP_PUBLIC_KEY = process.env.REACT_APP_LIT_PKP_PUBLIC_KEY || process.env.LIT_PKP_PUBLIC_KEY!;

    const signer = useEthersSigner();

    const XMTP_OPTIONS = {
        env: "dev" as "dev",
        persistConversations: true,
    }



    const { client: xmtpClient, initialize, isLoading, error } = useClient();



    useEffect(() => {
        if (signer) {
            initialize({ options: XMTP_OPTIONS, signer: signer })

        }

    }, [signer]);

    // messages callback
    // const onMessages = useCallback((msgs: any[]) => {
    //     // do something with messages
    //     console.log('err', msgs);
    // }, []);


    // console.log('isLoadingStartConversation', isLoadingStartConversation);


    // const [history, setHistory] = useState(null);
    // // const { messages } = useMessages(conversation);


    //     pkpSessionSigs,
    //     network: 'evm',
    //     memo: "This is an arbitrary string you can replace with whatever you'd like",
    //     litNodeClient,
    // });

    // console.log('pkpAddress', pkpAddress);
    return (
        <div>
            {/* {
                !client && <button onClick={initXmtp}>Connect to XMTP</button>
            } */}
            {/* 
            {
                xmtpClient && (<div className="badge">XMTP connected</div>)
            } */}
            <br />

            {
                xmtpClient && (
                    <InboxContainer />
                )
            }

        </div>
    )
}


function Chat() {
    return (
        <div className="App">

            <h2 className="text-lg font-bold">
                Talk to your newly created agent!
            </h2>
            <ChatContainer />


            {/* </XMTPProvider> */}
        </div>
    );
}

export default Chat;
