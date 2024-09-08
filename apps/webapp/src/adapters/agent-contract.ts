
import Contract from '@repo/agent/out/Contract.sol/Contract.json';

import AgentTemplate from '@repo/agent/out/AgentTemplate.sol/AgentTemplate.json';


const chainlinkRouterAddress = "0xb83E47C2bC239B3bf370bc41e1459A34b41238D0";

export const BY_TEMPLATE = {

    "simple":{
        abi:Contract.abi,
        bytecode: Contract.bytecode?.object,
        argsFactory: ({prompt}:{prompt:string})=>{
            // return [chainlinkRouterAddress, prompt]
            return [];
        }
    },
    "agent":{
        abi:AgentTemplate.abi,
        bytecode: AgentTemplate.bytecode?.object,
        argsFactory: ({choice, prompt}:{choice:string, prompt:string})=>{
            // return [chainlinkRouterAddress, prompt]

            // optimism sepolia
            return ["0xC17094E3A1348E5C7544D4fF8A36c28f2C6AAE28", choice];
        }
    }

}


