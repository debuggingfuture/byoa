import { Injectable } from '@nestjs/common';
import * as fs from 'fs';

// import AgentTemplate from '../../agent/out/AgentTemplate.sol/AgentTemplate.json';
import { AgentTemplate } from './abi';
import { providers } from 'ethers'
import { Client as XmtpClient } from "@xmtp/xmtp-js";
 

import * as path from 'path';

import {
  SubscriptionManager,
} from '@chainlink/functions-toolkit';
import * as ethers from 'ethers';

import { createWalletClient, createPublicClient, http, Client, Transport, Chain, Account, hexToString, Hex} from 'viem'
import { privateKeyToAccount } from 'viem/accounts';
import { optimismSepolia, sepolia } from 'viem/chains';
import { waitForTransactionReceipt } from 'viem/_types/actions/public/waitForTransactionReceipt';
/**
 * 
 * Translating this https://github.com/smartcontractkit/smart-contract-examples/tree/main/functions-examples/examples/4-post-data
 */

export function clientToSigner(client: any) {
  const { account, chain, transport } = client
  const network = {
    chainId: chain.id,
    name: chain.name,
    ensAddress: chain.contracts?.ensRegistry?.address,
  }
  const provider = new providers.Web3Provider(transport, network)
  const signer = provider.getSigner(account.address)
  return signer
}

const XMTP_OPTIONS = {
  env: "dev" as "dev",
  persistConversations: true,
}



export const createXmtp = async (client:any)=>{
  const xmtp = await XmtpClient.create(client, XMTP_OPTIONS);

  return xmtp;
}


export const subscribe = async ({
  subscriptionId,
  consumerAddress,
  signer,
  linkTokenAddress,
  routerAddress,
}: {
  subscriptionId: number
  consumerAddress: string
  signer: any
  linkTokenAddress: string
  routerAddress: string
})=>{
  
      // Initialize and return SubscriptionManager
      const subscriptionManager = new SubscriptionManager({
        signer: signer,
        linkTokenAddress: linkTokenAddress,
        functionsRouterAddress: routerAddress,
      });
      await subscriptionManager.initialize();

      // create by subscription owner

      try {
         await subscriptionManager.addConsumer({ subscriptionId, consumerAddress });
        console.log('consumer added', subscriptionId, consumerAddress);

      return subscriptionManager;

      } catch(err){
        // could also error if already authorized
        console.log('err', err);
      }
      

}


@Injectable()
export class UserService {

    // chain = sepolia;
   chain = optimismSepolia

    constructor(){

    }
    
    async createXmtpClient(agent:any){
   // TODO from vault
      const {id, name, inboxPrivateKey, ownerAddress} = agent;
      const account = privateKeyToAccount(inboxPrivateKey);
      let signer = createWalletClient({
        account,
        chain: this.chain,
        transport: http(),
      });
      //  will auto register on network
      return await createXmtp(signer);
    }

    async initXmtp(agent:any){

      const {id, name, inboxPrivateKey, ownerAddress} = agent;
      const xmtpClient =await this.createXmtpClient(agent);
      const message = `GM! my name is ${name}. I'm your agent on XMTP network`;
 
      // say hi
      const conversation = await xmtpClient.conversations.newConversation(
        ownerAddress
      );
      await conversation.send(message);


      return xmtpClient;
    }


    async sendDONRequest(consumerAddress:`0x${string}`){

        console.log('send dom request to', consumerAddress);
        const abi = AgentTemplate.abi;

      // TODO load from state
        const args = ["up"];
        const gasLimit = 300000;


        /** sepolia **/
        // // TODO inside constructor
        // const routerAddress = "0xb83E47C2bC239B3bf370bc41e1459A34b41238D0";

        // const linkTokenAddress = "0x779877A7B0D9E8603169DdbD7836e478b4624789";
        // // const donId = "fun-ethereum-sepolia-1";
        // const donId = "0x66756e2d657468657265756d2d7365706f6c69612d3100000000000000000000";

        // const rpcUrl = "https://rpc.sepolia.org";
        // const subscriptionId = 3461;

        /** optimism sepolia **/
        // TODO inside constructor
        const routerAddress = "0xC17094E3A1348E5C7544D4fF8A36c28f2C6AAE28";
        const linkTokenAddress = "0xE4aB69C077896252FAFBD49EFD26B5D171A32410";
        // const donId = "fun-optimism-sepolia-1";
        const donId = "0x66756e2d6f7074696d69736d2d7365706f6c69612d3100000000000000000000";

        const rpcUrl = "https://sepolia.optimism.io";
        const subscriptionId = 231;


        const encryptedSecretsUrls = "0x";
        const donHostedSecretsSlotID = 0;
        const donHostedSecretsVersion = 0;
        const bytesArgs = [];

        const ownerPrivateKey = process.env.DEPLOYER_WALLET_PRIVATE_KEY as `0x${string}`;

        const account =  privateKeyToAccount(ownerPrivateKey);

        const provider = new ethers.providers.JsonRpcProvider(rpcUrl);

        const wallet = new ethers.Wallet(ownerPrivateKey);
        const signer = wallet.connect(provider)
        // execute at dist


        // For easier dev.
        // TODO pre-load from ipfs content instead
        const source = fs
        .readFileSync(path.resolve(__dirname, "../src/don/source.js"))
        .toString();

        console.log('===========SOURCE START=======');
        console.log('source', source);
        console.log('===========SOURCE END=======');

        // Create a public client to interact with the Ethereum network
        const walletClient = createWalletClient({
          chain: this.chain,
          transport: http(rpcUrl),
        });

        

        const publicClient = createPublicClient({
          chain: this.chain,
          transport: http(rpcUrl),
        })


        console.log("\nEstimate request costs...");

        await subscribe({
          subscriptionId,
          consumerAddress,
          signer,
          linkTokenAddress,
          routerAddress
        })        
        console.log('subscribe done');
      
      const { request } = await publicClient.simulateContract({
        account,
        address: consumerAddress,
        abi: AgentTemplate.abi,
        functionName: 'sendRequest',
        args:[
          source,
          encryptedSecretsUrls,
          donHostedSecretsSlotID,
          donHostedSecretsVersion,
          args,
          bytesArgs,
          subscriptionId,
          gasLimit,
          donId
        ]
      })

     const results =  await walletClient.writeContract(request);

     console.log('results', results)

     console.log('waiting...')
     const wait = await publicClient.waitForTransactionReceipt({
      hash: results,
     })
     console.log('completed')

     await new Promise((resolve)=>setTimeout(resolve, 10000));


    // TODO wait before read
    const readResults = await publicClient.readContract({
      address: consumerAddress,
      abi,
      functionName: 's_lastResponse',

    });

            
    const readError = await publicClient.readContract({
      address: consumerAddress,
      abi,
      functionName: 's_lastError',

    });


    console.log('readResults', hexToString(readResults as Hex));

            
    console.log('readError', readError)


    }

}