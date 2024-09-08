import { Link, Outlet } from "react-router-dom";
import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { mainnet } from "wagmi/chains";
import { getDefaultWallets, RainbowKitProvider, ConnectButton } from '@rainbow-me/rainbowkit';
import { AgentContextProvider, useAgentContext } from "../components/AgentContext";
import AIAgentList from "../components/AgenList";
import _ from "lodash";

import {
    useStreamMessages,
    useClient,
    useMessages,
    useConversations,
    useCanMessage,
    useStartConversation,
    XMTPProvider,

    attachmentContentTypeConfig,
    reactionContentTypeConfig,
    replyContentTypeConfig,
    Client,
    useSendMessage,
} from "@xmtp/react-sdk";



const contentTypeConfigs = [
    attachmentContentTypeConfig,
    reactionContentTypeConfig,
    replyContentTypeConfig,
];


export const DrawerButton = () => {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor">
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16M4 18h7" />
        </svg>
    )
}


const AIAgentListContainer = () => {

    const { agentByContractAddress, setAgentByContractAddress } = useAgentContext();
    return (
        <div>
            <AIAgentList agents={_.values(agentByContractAddress)} />
        </div>
    )
}

export default function Root() {

    return (
        <>
            <XMTPProvider contentTypeConfigs={contentTypeConfigs}>
                <AgentContextProvider>
                    <div id="sidebar">


                    </div>


                    <div className="navbar bg-base-100">
                        <div className="navbar-start">
                            <div className="drawer">
                                <input id="my-drawer" type="checkbox" className="drawer-toggle" />
                                <div className="drawer-content">
                                    {/* Page content here */}
                                    <label htmlFor="my-drawer" >
                                        <div tabIndex={0} role="button" className="btn btn-ghost btn-circle">
                                            <DrawerButton />
                                        </div></label>
                                </div>
                                <div className="drawer-side z-50">
                                    <label htmlFor="my-drawer" aria-label="close sidebar" className="drawer-overlay"></label>
                                    <ul className="menu z-50 bg-base-200 text-base-content min-h-full w-80 p-4 text-2xl">
                                        <li>
                                            <Link to="/editor">Editor</Link>
                                        </li>
                                        <li>
                                            {/* <a href={`/chat`}>Chat</a> */}
                                            <Link to="/chat">Chat</Link>
                                        </li>
                                        <li>
                                            <Link to="/game">Game</Link>
                                        </li>
                                        <li>
                                            <h2 className="pt-10 underline">Owned Agents</h2>
                                            <AIAgentListContainer />
                                        </li>
                                    </ul>
                                    <div>

                                    </div>


                                </div>
                            </div>
                            <div className="dropdown">
                                {/* 
                            <ul
                                tabIndex={0}
                                className="menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 p-2 shadow">


                                <li>
                                    <a href={`/chat`}>Chat</a>
                                </li>
                                <li>
                                    <a href={`/game`}>Game</a>
                                </li>
                                <li>
                                    <a href={`/editor`}>Editor</a>
                                </li>

                            </ul> */}
                            </div>
                        </div>
                        <div className="navbar-center">
                            <a className="btn btn-ghost text-xl">
                                <h2 className="title text-2xl font-bold">
                                    Build Your Owned Agent
                                </h2>


                            </a>
                        </div>
                        <div className="navbar-end">

                            <button className="btn btn-ghost btn-circle">
                                <div className="indicator">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="h-5 w-5"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor">
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                                    </svg>
                                    <span className="badge badge-xs badge-primary indicator-item"></span>
                                </div>
                            </button>
                            <div>
                                <ConnectButton />
                            </div>
                        </div>
                    </div>

                    <Outlet />
                </AgentContextProvider>
            </XMTPProvider>
        </>
    );
}