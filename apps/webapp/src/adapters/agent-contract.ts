
import Contract from '@repo/agent/out/Contract.sol/Contract.json';



export const BY_TEMPLATE = {

    "simple":{
        abi:Contract.abi,
        bytecode: Contract.bytecode?.object,
        argsFactory: ()=>{
            return []
        }
    }

}


