
import { defineChain } from "viem";
export const galadrielDev = defineChain({
    id: 696969,
    name: 'Galadriel Devnet',
    nativeCurrency: {
      decimals: 18,
      name: 'GAL',
      symbol: 'GAL',
    },
    rpcUrls: {
      default: {
        http: ['https://devnet.galadriel.com'],
        webSocket: ['wss://devnet.galadriel.com'],
      },
    },
    blockExplorers: {
      default: { name: 'Explorer', url: 'https://explorer.galadriel.com' },
    },
    testnet: true,
  });
  