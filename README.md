# BYOA

Build Your OWNED Agent

## Short description
BYOA is a no-code tool to create on-chain trustless AI agents. From naughty dogs NPC in autonomous world that integrate with your game server, to customer service chatbots powered by LLM. 


## Description

With drag and drop, you're able to customize and deploy your AI agent with prompts, different emotion expressions with generative AI, setup up game play strategy and integrate game servers.

You can setup rules for AI to deterministically decide its action, such as selecting from a list of optionns or more complicated state machine. Such behaviours will be added onto the contract template to create a trustless, immutable contract when deployed. 

You can talk to each agent, powered by XMTP. One example is the NPC will send you a message when he steps on a poop 💩 in the game, and you can see she becomes angry on the on-chain avatar.

It is also possible to configure external plugins such as chainlink function to integrate an external game server, to maximize use cases of agents.

In the game demo, there is a Pokémon-style garden where agents will walk around. Tte game mechanics is very simple that when human step on a stone, she gets angry and when the dog step on a bone, it gets happy. 
All you need to do is to write on contract to request for movement, which they will decide according behaviour you configured on-chain -- such as always move up. Then the on-chain decision is send back to game server to progress the game and update contract status.

This tool helps us to deploy on-chain AI agents with guardrails and trustless mechanisms easily.


## How it's made

BYOA supports and deploying agents on mutliple EVM networks, namely we provide templates deployable for
- EVM L1/L2, e.g. Optimism Sepolia (Testnet)
- Galadriel (L1 for AI)

The no-code tool UI is created with react flow to enable simple drag & drop, connecting control nodes for agent similar to Retool or ComftyUI. We supports different contract agent teampltes and after configuring on tool the avatar, actions plans etc of agent, parameters will be passed to contract deployment and written on-chain. 

For the game demo, there is a custom game server built with nestjs which will control the game state, e.g. position of characters, decorations and the map. 

With use of Chainlink functions, we allow on-chain NPCs to invoke our endpoint and create movement. Agent contract is registered as consumer of chainlink function. Thus after chainlink nodes invoke game API, result is written back to the smart contract. In our case, emotion of on-chain AI agent will be updated if our server find the character step on a poop. 

XMTP is used to communicate between user and agents. With a shadow inbox account, accounts also able to send XMTP message via our server.  An inbox account is created for each agent contract. Once XIP-44 is implemented, messages can be sent to/from contract account of Agent directly.

Envio is used to listen to events from the agent contracts and update game state accordingly.

To make the agent more autonomous, Lit action can be used so once user granted rights, server can programmably trigger trustless execution of contracts 


### Future Potentials
- We could further expand customizing of agents, such as using Controlnet with stable diffusion to automatically create different expressions for an agent.  



![alt text](image.png)


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

  
### sample deploy script
  - cd packages/agent
#### optimism sepolia
  -  env-cmd -f ../../.env forge script scripts/deploy.s.sol --via-ir  --broadcast  --rpc-url https://sepolia.optimism.io  --gas-price 1000 --gas-limit 60000000000000000 --verify
  - note to verify, etherscan optimism use differeent `ETHERSCAN_API_KEY`
#### galadriel
  - env-cmd -f ../../.env forge script --legacy scripts/deploy.s.sol --via-ir --rpc-url https://devnet.galadriel.com --broadcast  --gas-price 1000000000 --gas-limit 600000000000

## Run locally
- Need hosted for the Chainlink function to access
- (source.js cannot point to localhost)
- cloudflared tunnel run <id>


