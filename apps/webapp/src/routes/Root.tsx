import { Outlet } from "react-router-dom";

export default function Root() {
    return (
        <>
            <div id="sidebar">
                <h1>React Router Contacts</h1>

                <nav>
                    <ul>
                        <li>
                            <a href={`/inbox`}>Inbox</a>
                        </li>
                        <li>
                            <a href={`/editor`}>editor</a>
                        </li>
                    </ul>
                </nav>
            </div>
            <Outlet />
        </>
    );
}