import { privateKeyToAccount, generatePrivateKey } from 'viem/accounts'

export const createShadowInboxAccount = ()=>{
 
    const privateKey = generatePrivateKey()
    const account = privateKeyToAccount(privateKey);

    return account

}