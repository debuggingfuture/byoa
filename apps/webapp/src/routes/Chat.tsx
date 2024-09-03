'use client';

import logo from '../logo.svg';
import '../App.css';
import { Config, useClient as useWagmiClient } from 'wagmi'


import * as crypto from "crypto"

import React, { useState, useEffect, useCallback } from "react";
import {
    Client,
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
} from "@xmtp/react-sdk";

// import { ContentTypeId } from "@xmtp/content-type-primitives";
// import {
//     ApiUrls,
//     XmtpEnv,

// } from "@xmtp/xmtp-js";
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

// TODO Lit connect error at Next server runtime
// consider migrate to server
// https://github.com/LIT-Protocol/Issues-and-Reports/issues/17


const MessagesList = ({ conversation }: { conversation: any }) => {
    const { messages } = useMessages(conversation);

    return (
        <div>
            Messages {messages.length}
            {
                messages.map(
                    (message: any) => {
                        const { walletAddress, content } = message;
                        // content could be objects
                        return (
                            <div key={message.id}>
                                {walletAddress}
                                <span>{' | '}</span>
                                {content?.content || content}
                            </div>
                        )
                    }
                )
            }
        </div>)
}

// TODO optimize to avoid re-render

const ConversationList = () => {

    const { conversations } = useConversations();

    return (
        <div>
            Conversations
            {conversations.length}
            {JSON.stringify(conversations)}
            {
                conversations.map((conversation: any, i: any) => {
                    const { topic } = conversation;
                    return (
                        <MessagesList key={topic} conversation={conversation} />
                    )
                })
            }
        </div>
    )



}



const ChatContainer = () => {


    const LIT_PKP_PUBLIC_KEY = process.env.REACT_APP_LIT_PKP_PUBLIC_KEY || process.env.LIT_PKP_PUBLIC_KEY!;

    const signer = useEthersSigner();

    // const account = useAccount();
    // console.log('account', account);

    const provider = new ethers.providers.JsonRpcProvider({
        skipFetchSetup: true,
        url: LIT_RPC.CHRONICLE_YELLOWSTONE,
    });



    const setup = async (ethersSigner: any) => {
        console.log('setup');
        // const litNodeClient = new LitNodeClient({
        //     litNetwork: LitNetwork.DatilDev,
        //     debug: false,
        // });
        // await litNodeClient.connect();

        console.log('connected');


        const wagmiClient = useWagmiClient();
        // // https://github.com/LIT-Protocol/Issues-and-Reports/issues/17
        // const network = await provider.getNetwork();

        // console.log('network', network)
        // // invalid public or private key (argument="key", value="[REDACTED]", code=INVALID_ARGUMENT, version=signing-key/5.7.0)
        // const pkpSessionSigs = await litNodeClient.getPkpSessionSigs({
        //     pkpPublicKey: LIT_PKP_PUBLIC_KEY,
        //     authMethods: [
        //         await EthWalletProvider.authenticate({
        //             signer: ethersSigner,
        //             litNodeClient,
        //             expiration: new Date(Date.now() + 1000 * 60 * 10).toISOString(), // 10 minutes
        //         }),
        //     ],
        //     resourceAbilityRequests: [
        //         {
        //             resource: new LitActionResource("*"),
        //             ability: LitAbility.LitActionExecution,
        //         },
        //     ],
        //     expiration: new Date(Date.now() + 1000 * 60 * 10).toISOString(), // 10 minutes
        // });

    }

    const onError = useCallback((err: Error) => {
        // handle error
        console.log('onError', err);
    }, []);



    const { client, initialize, isLoading, error } = useClient();
    console.log('client', client, error);


    const { startConversation, isLoading: isLoadingStartConversation } = useStartConversation({
        // conversationId: '',
        onError,
    });

    useEffect(() => {

        const options = {

            persistConversations: true,
            // env: "dev" as XmtpEnv,
            env: "dev" as "dev"
        };




        initialize({ options, signer: signer })

    }, [signer]);

    // messages callback
    // const onMessages = useCallback((msgs: any[]) => {
    //     // do something with messages
    //     console.log('err', msgs);
    // }, []);


    console.log('isLoadingStartConversation', isLoadingStartConversation);
    const { canMessage } = useCanMessage();


    // const [history, setHistory] = useState(null);
    // // const { messages } = useMessages(conversation);


    const sendMessage = async (message: string) => {

        const peerAddress = '0x3F11b27F323b62B159D2642964fa27C46C841897';

        const { conversation } = await startConversation(peerAddress, "yo");
        // Load all messages in the conversation

        // const canMessageResult = await client?.canMessage(peerAddress)
        // console.log('canMessage', canMessageResult);

        if (!conversation || isLoadingStartConversation) {
            console.log('loading');
            return;
        }
        console.log('send messages')
        // const messages = await conversation.messages();
        // Send a message
        await conversation.send("gm");
        // Listen for new messages in the conversation
        for await (const message of await conversation.streamMessages()) {
            console.log(`[${message.senderAddress}]: ${message.content}`);
        }
    }


    console.log('isLoading', isLoading);


    // // NEXT_PUBLIC=

    // const { generatePrivateKey } = api;

    // const { pkpAddress, generatedPublicKey } = await generatePrivateKey({
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

            <button onClick={() => {
                sendMessage('hihi');
            }}>send message</button>


            Test
            Conversations

            <ConversationList />


        </div>
    )
}


const contentTypeConfigs = [
    attachmentContentTypeConfig,
    reactionContentTypeConfig,
    replyContentTypeConfig,
];


function Chat() {
    return (
        <div className="App">
            <XMTPProvider contentTypeConfigs={contentTypeConfigs}>
                <div>Talk to your newly created agent</div>
                <div className="badge">default</div>
                <ChatContainer />

            </XMTPProvider>
        </div>
    );
}

export default Chat;
