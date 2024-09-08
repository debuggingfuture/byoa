import { Injectable } from '@nestjs/common';
import { applyMove, findNewMovePosition, generateBaseGrid } from '@repo/game';
import * as fs from 'fs';

// import AgentTemplate from '../../agent/out/AgentTemplate.sol/AgentTemplate.json';
import { AgentTemplate } from './abi';
import { providers } from 'ethers'
import { Client as XmtpClient } from "@xmtp/xmtp-js";
 

import * as path from 'path';

import {
  SubscriptionManager,
  simulateScript,
  ResponseListener,
  ReturnType,
  decodeResult,
  FulfillmentCode,
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
        const add = await subscriptionManager.addConsumer({ subscriptionId, consumerAddress });
      // subscriptionManager
      console.log('ok', subscriptionManager, add);

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

    async initXmtp(agent:any){

      // TODO from vault
      const {id, name, inboxPrivateKey, ownerAddress} = agent;
      const account = privateKeyToAccount(inboxPrivateKey);
      let signer = createWalletClient({
        account,
        chain: this.chain,
        transport: http(),
      });
      // auto register on network
      const xmtp = await createXmtp(signer);
      
      // say hi
      const conversation = await xmtp.conversations.newConversation(
        ownerAddress
        // "0x3F11b27F323b62B159D2642964fa27C46C841897",
      );

      const message = `GM! my name is ${name}. I'm your agent on XMTP network`;

      conversation.send(message);


      return xmtp;
    }


    async sendDONRequest(){
      const abi = AgentTemplate.abi;
        const args = ["JP"];
        const gasLimit = 300000;
        const consumerAddress = "0x9e6fc3ef8850f97d7ffe5562a290c071d541bbfb";

        // TODO inside constructor
        const routerAddress = "0xb83E47C2bC239B3bf370bc41e1459A34b41238D0";

        const linkTokenAddress = "0x779877A7B0D9E8603169DdbD7836e478b4624789";
        // const donId = "fun-ethereum-sepolia-1";
        const donId = "0x66756e2d657468657265756d2d7365706f6c69612d3100000000000000000000";
        const explorerUrl = "https://sepolia.etherscan.io";
        const encryptedSecretsUrls = "0x";
        const donHostedSecretsSlotID = 0;
        const donHostedSecretsVersion = 0;
        const bytesArgs = [];
        const subscriptionId = 3461;

        const ownerPrivateKey = process.env.DEPLOYER_WALLET_PRIVATE_KEY as `0x${string}`;

        const account =  privateKeyToAccount(ownerPrivateKey);

        const rpcUrl = "https://rpc.sepolia.org";

        const provider = new ethers.providers.JsonRpcProvider(rpcUrl);

        const wallet = new ethers.Wallet(ownerPrivateKey);
        const signer = wallet.connect(provider)
        // execute at dist

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

        const subscribeResults = await subscribe({
          subscriptionId,
          consumerAddress,
          signer,
          linkTokenAddress,
          routerAddress
        })        
        console.log('subscribe', subscribeResults);
      
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
        
        // 0x66756e2d657468657265756d2d7365706f6c69612d3100000000000000000000

        const router = '0xb83E47C2bC239B3bf370bc41e1459A34b41238D0';

    }

}