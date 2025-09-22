import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import App from "./App";
import "./index.css";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <div className="dark min-h-screen bg-slate-900 text-white">
        <App />
        </div>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>
);
