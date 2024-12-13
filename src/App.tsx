import { Button } from "@/components/ui/button";
import { useEffect } from "react";
import {
  FunctionCallParams,
  LLMHelper,
  RTVIClient,
} from "@pipecat-ai/client-js";
import { useState } from "react";
import { DailyTransport } from "@pipecat-ai/daily-transport";
import { RTVIClientAudio, RTVIClientProvider } from "@pipecat-ai/client-react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import VoiceControls from "./components/VoiceControls";
import ShoppingList from "./components/ShoppingList";
import ShoppingListsOverview from "./components/ShoppingListsOverview";
import { FunctionNames } from "../convex/http";

function App() {
  const [voiceClient, setVoiceClient] = useState<RTVIClient | null>(null);

  useEffect(() => {
    if (voiceClient) return;

    console.log(`CONNECTING TO`, import.meta.env.VITE_CONVEX_SITE_URL);

    const newVoiceClient = new RTVIClient({
      transport: new DailyTransport(),
      params: {
        baseUrl: import.meta.env.VITE_CONVEX_SITE_URL,
        endpoints: {
          connect: "/connect",
          action: "/actions",
        },
      },
    });

    const llmHelper = newVoiceClient.registerHelper(
      "llm",
      new LLMHelper({
        callbacks: {},
      })
    ) as LLMHelper;

    llmHelper.handleFunctionCall(async (fn: FunctionCallParams) => {
      const args = fn.arguments as any;

      const functionName = fn.functionName as FunctionNames;

      console.log("----- FUNCTION CALL", fn);

      if (functionName === "get_current_weather" && args.location) {
        const response = await fetch(
          `/api/weather?location=${encodeURIComponent(args.location)}`
        );
        const json = await response.json();
        return json;
      } else {
        return { error: "couldn't fetch weather" };
      }
    });

    setVoiceClient(newVoiceClient);
  }, [voiceClient]);

  return (
    <RTVIClientProvider client={voiceClient!}>
      <BrowserRouter>
        <div className="h-screen bg-amber-50">
          <div className="w-64 fixed top-0 left-0 h-full border-r border-amber-200 bg-white">
            <VoiceControls />
          </div>
          <div className="ml-64">
            <Routes>
              <Route path="/" element={<ShoppingListsOverview />} />
              <Route path="/list/:id" element={<ShoppingList />} />
            </Routes>
          </div>
        </div>
        <RTVIClientAudio />
      </BrowserRouter>
    </RTVIClientProvider>
  );
}

export default App;
