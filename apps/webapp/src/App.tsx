import React from "react";
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from "react-router-dom";

import './App.css';
import Inbox from "./Inbox";
import Root from "./routes/Root";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<Root />}>
      <Route path="inbox" element={<Inbox />} />
      <Route path="test" element={<div> hi</div>} />

      <Route path="*" element={<div> no match</div>} />
      {/* ... etc. */}
    </Route>
  )
);

function App() {
  return (
    <React.StrictMode>
      <RouterProvider router={router} />
    </React.StrictMode>
  );
}

export default App;
