import React from "react";
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from "react-router-dom";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import './App.css';
import Chat from "./routes/Chat";
import Root from "./routes/Root";
import { getDefaultConfig, RainbowKitProvider } from "@rainbow-me/rainbowkit";
import { mainnet, sepolia } from "wagmi/chains";
import { WagmiProvider } from "wagmi";
import Editor2 from "./routes/Editor2";
import Editor from "./routes/Editor";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<Root />}>
      <Route path="chat" element={<Chat />} />
      <Route path="test" element={<div> hi</div>} />
      <Route path="editor" element={<Editor />} />
      <Route path="editor2" element={<Editor2 />} />
      <Route path="*" element={<div> no match</div>} />
      {/* ... etc. */}
    </Route>
  )
);


const queryClient = new QueryClient();


const wagmiConfig = getDefaultConfig({
  appName: 'My RainbowKit App',
  projectId: 'YOUR_PROJECT_ID',
  chains: [sepolia],
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
