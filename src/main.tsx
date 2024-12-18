import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./app/App.tsx";
import { ConvexProvider, ConvexReactClient } from "convex/react";
import { RouteProvider } from "./app/routes.ts";
import { RTVIClient } from "@pipecat-ai/client-js";
import { RTVIClientProvider } from "@pipecat-ai/client-react";
import { DailyTransport } from "@pipecat-ai/daily-transport";

const convex = new ConvexReactClient(import.meta.env.VITE_CONVEX_URL as string);

createRoot(document.getElementById("root")!).render(
  <ConvexProvider client={convex}>
    <RouteProvider>
      <RTVIClientProvider
        client={
          new RTVIClient({
            transport: new DailyTransport(),
            params: {
              baseUrl: import.meta.env.VITE_CONVEX_SITE_URL,
              endpoints: {
                connect: "/connect",
                action: "/actions",
              },
            },
          })
        }
      >
        <App />
      </RTVIClientProvider>
    </RouteProvider>
  </ConvexProvider>
);
