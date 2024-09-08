
import Contract from '@repo/agent/out/Contract.sol/Contract.json';


const chainlinkRouterAddress = "0xb83E47C2bC239B3bf370bc41e1459A34b41238D0";

export const BY_TEMPLATE = {

    "simple":{
        abi:Contract.abi,
        bytecode: Contract.bytecode?.object,
        argsFactory: ({prompt}:{prompt:string})=>{
            // return [chainlinkRouterAddress, prompt]
            return [];
        }
    }

}


