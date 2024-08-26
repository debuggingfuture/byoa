import ContractCompiled from '@repo/contract/out/Contract.sol/Contract.json'

export const TEMPLATES = {
    basic: ContractCompiled
}


// args should abide by contract
// pattern match

export enum Template {
    Basic = 'basic',
    AgentDialog6551 = 'agent-dialog-6551',
}

export const CREATE_STRATEGIES = {
    [Template.AgentDialog6551]: ()=>{


        return {
            args: []
        }
    }

}

export const createWithTemplate = ()=>{

    



    return {
        args: [],
        // abi

    }

}