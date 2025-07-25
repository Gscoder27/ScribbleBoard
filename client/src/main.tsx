import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";

const rootEl = document.getElementById("root");
if (!rootEl) throw new Error("Could not find #root container");
ReactDOM.createRoot(rootEl).render(<App />);