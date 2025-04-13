import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { AuthProvider } from "./contexts/AuthContext.jsx";
import { SplashProvider } from "./contexts/SplashContext.jsx";
import { LoadingProvider } from "./contexts/LoadingContext";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <LoadingProvider>
      <SplashProvider>
        <AuthProvider>
          <App />
        </AuthProvider>
      </SplashProvider>
    </LoadingProvider>
  </StrictMode>
);
