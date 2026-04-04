import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { HashRouter } from "react-router-dom";
import { Toaster } from 'sonner';
import App from "./App.tsx";
import "./index.css";
import { AuthContext } from './contexts/authContext';

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <AuthContext.Provider
      value={{ isAuthenticated: true, setIsAuthenticated: () => {}, logout: () => {} }}
    >
      <HashRouter>
        <App />
        <Toaster />
      </HashRouter>
    </AuthContext.Provider>
  </StrictMode>
);
