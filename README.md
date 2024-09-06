# BYOA

Build Your OWNED Agent

## dependencies
- ethers v5 is required for lit as mentioned [here](https://developer.litprotocol.com/sdk/serverless-signing/quick-start#set-up-a-controller-wallet)
  - note issues like this https://github.com/ethers-io/ethers.js/issues/4469#issuecomment-1987163709
  - unsure how to skipFetchSetup in v6

## testing XMTP
- wallets need to be registered.
- Note there is production / dev network 
- use either one of below to connect and sign up
  - https://app-preview.converse.xyz/
  - https://xmtp-quickstart-reactjs.vercel.app/
- https://dev.xmtp.chat/
- Run at local https://github.com/ephemeraHQ/converse-app

## testing Lit
- to generate a PKP public key, try https://lit-pkp-auth-demo.vercel.app/

- Developement is on [Chronicle Yellowstone](https://developer.litprotocol.com/connecting-to-a-lit-network/lit-blockchains/chronicle-yellowstone).
 - add the network and claim on faucet



 ## dependencies
 - noble v2+ use web crypto   https://github.com/paulmillr/noble-secp256k1/releases/tag/2.1.0


 ## Contracts

- Note pre-built contracts are committed to the codebase 
- on changes
 - cd packages/contract
 - forge build
 - ABI and binary output at e.g. out/Contract.sol/Contract.json

- Note with galadriel, at forge build/script, compile with solc 0.8.25 and `--via-ir` https://book.getfoundry.sh/reference/forge/forge-build
  - otherwise error `Compiler run failed:
Error (1834): Copying of type struct IOracle.Content memory[] memory to storage not yet supported.`
  - and for >0.8.25 "No memoryguard was present." error as in https://github.com/ethereum/solidity/issues/14358