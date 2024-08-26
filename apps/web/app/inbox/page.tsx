'use client';

import * as crypto from "crypto"

import React, { useState, useEffect, useCallback } from "react";
import {
    Client,
    useStreamMessages,
    useClient,
    useMessages,
    useConversations,
    useCanMessage,
    useStartConversation
} from "@xmtp/react-sdk";
import {
    ApiUrls,
    XmtpEnv
} from "@xmtp/xmtp-js";
import { EthWalletProvider } from "@lit-protocol/lit-auth-client";

import * as ethers from 'ethers';

import { api } from "@lit-protocol/wrapped-keys";
import { LitNodeClient } from "@lit-protocol/lit-node-client";
import { LitNetwork, LIT_RPC } from "@lit-protocol/constants";
import {
    LitAbility,
    LitActionResource,
    LitPKPResource,
} from "@lit-protocol/auth-helpers";


// TODO Lit connect error at Next server runtime
// consider migrate to server
// https://github.com/LIT-Protocol/Issues-and-Reports/issues/17


export default function () {


    const ETHEREUM_PRIVATE_KEY = process.env.NEXT_PUBLIC_ETHEREUM_PRIVATE_KEY || process.env.ETHEREUM_PRIVATE_KEY!;
    const LIT_PKP_PUBLIC_KEY = process.env.NEXT_PUBLIC_LIT_PKP_PUBLIC_KEY || process.env.LIT_PKP_PUBLIC_KEY!;

    const provider = new ethers.providers.JsonRpcProvider({
        skipFetchSetup: true,
        url: LIT_RPC.CHRONICLE_YELLOWSTONE,
    });

    const ethersSigner = new ethers.Wallet(
        ETHEREUM_PRIVATE_KEY,
        provider
    );

    const setup = async () => {
        console.log('setup');
        const litNodeClient = new LitNodeClient({
            litNetwork: LitNetwork.DatilDev,
            debug: false,
        });
        await litNodeClient.connect();

        console.log('connected');



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


    useEffect(() => {
        setup();

    }, []);




    const { client, initialize, isLoading } = useClient();
    const { conversations } = useConversations();
    const { startConversation } = useStartConversation();
    const { canMessage } = useCanMessage();


    // const [history, setHistory] = useState(null);
    // // const { messages } = useMessages(conversation);

    const initXmtp = async () => {
        const options = {
            persistConversations: false,
            env: "dev" as XmtpEnv,
        };
        await initialize({ options, signer: ethersSigner });

        console.log('init')
    };




    console.log('isLoading', isLoading);

    const isConnected = false;
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
            {
                !isConnected && <button onClick={initXmtp}>Connect to XMTP</button>
            }

            Test
        </div>
    )
}
