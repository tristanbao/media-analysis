import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { Toaster } from 'sonner';
import App from "./App.tsx";
import "./index.css";
import { AuthContext } from './contexts/authContext';

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <AuthContext.Provider
      value={{ isAuthenticated: true, setIsAuthenticated: () => {}, logout: () => {} }}
    >
      <BrowserRouter>
        <App />
        <Toaster />
      </BrowserRouter>
    </AuthContext.Provider>
  </StrictMode>
);
