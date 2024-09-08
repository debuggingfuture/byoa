import { Injectable } from '@nestjs/common';
/**
 * 
 * For Demo only, not safe until we replace with lit action
 * Shadow account not necssary after [XIP-44](https://community.xmtp.org/t/xip-44-smart-contract-wallet-support/627)
 */


import { privateKeyToAccount, generatePrivateKey } from 'viem/accounts'

export const createShadowInboxAccount = ()=>{
 
    const privateKey = generatePrivateKey()
    const account = privateKeyToAccount(privateKey);

    return {privateKey, account}

}

@Injectable()
export class VaultService {

  private agentByAddress = new Map<string, any>();

  async createAgent(contractAddress: string, ownerAddress:string, agentProps:any): Promise<any> {
    const { privateKey, account} = createShadowInboxAccount();
    const agent = {
      ...agentProps||{},
      ownerAddress,
      contractAddress,
      inboxAddress: account.address,
      inboxPrivateKey: privateKey
    }
    this.agentByAddress.set(contractAddress, agent);
    return agent;
  }


   getAgent(contractAddress: string): any {
    return this.agentByAddress.get(contractAddress);
  }

  
  getHello(): string {
    return 'Hello World!';
  }
}
