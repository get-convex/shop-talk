import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./app/App.tsx";
import { ConvexProvider, ConvexReactClient } from "convex/react";
import { RouteProvider } from "./app/routes.ts";

const convex = new ConvexReactClient(import.meta.env.VITE_CONVEX_URL as string);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ConvexProvider client={convex}>
      <RouteProvider>
        <App />
      </RouteProvider>
    </ConvexProvider>
  </StrictMode>
);
