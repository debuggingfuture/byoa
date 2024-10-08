import React from "react";
import {
  createBrowserRouter,
  createRoutesFromElements,
  Navigate,
  Route,
  RouterProvider,
} from "react-router-dom";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import './App.css';
import Chat from "./routes/Chat";
import Root from "./routes/Root";
import { getDefaultConfig, RainbowKitProvider } from "@rainbow-me/rainbowkit";
import { mainnet, optimismSepolia, sepolia } from "wagmi/chains";
import { WagmiProvider } from "wagmi";
import Editor from "./routes/Editor";
import Game from "./routes/Game";
import { galadrielDev } from "./domain/chain";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<Root />}>
      <Route path="chat" element={<Chat />} />
      <Route path="editor" element={<Editor />} />
      <Route path="game" element={<Game />} />
      <Route path="/" element={<Navigate to="/editor" />} />
      <Route path="*" element={<Navigate to="/editor" />} />
    </Route>
  )
);

const queryClient = new QueryClient();


const wagmiConfig = getDefaultConfig({
  appName: 'BYOA',
  projectId: 'YOUR_PROJECT_ID',
  chains: [sepolia, optimismSepolia, galadrielDev],
  ssr: true, // If your dApp uses server side rendering (SSR)
});

function App() {
  return (
    <React.StrictMode>
      <WagmiProvider config={wagmiConfig}>
        <QueryClientProvider client={queryClient}>
          <RainbowKitProvider>
            <RouterProvider router={router} />
          </RainbowKitProvider>
        </QueryClientProvider>
      </WagmiProvider>
    </React.StrictMode>
  );
}

export default App;
