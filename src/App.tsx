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
import { MyAudio } from "@/MyAudio";
import VoiceControls from "./components/VoiceControls";
import ShoppingList from "./components/ShoppingList";
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
      <>
        {/* <main className="flex min-h-screen flex-col items-center justify-between p-24 bg-gray-100">
          <div className="flex flex-col gap-4 items-center">
            <h1 className="text-4xl font-bold">My First Daily Bot</h1>
            <Button
              onClick={() => {
                fetch(`${import.meta.env.VITE_CONVEX_SITE_URL}/hello`)
                  .then((r) => r.json())
                  .then(console.log);
              }}
            >
              Say Hello
            </Button>
            <div className="flex h-screen bg-amber-50">
              <div className="w-1/2 p-4 border-r border-amber-200">
                <VoiceControls />
              </div>
              <div className="w-1/2 p-4">
                <ShoppingList />
              </div>
            </div>
          </div>
        </main> */}
        <div className="flex h-screen bg-amber-50">
          <div className="w-1/2 p-4 border-r border-amber-200">
            <VoiceControls />
          </div>
          <div className="w-1/2 p-4">
            <ShoppingList />
          </div>
        </div>
        <RTVIClientAudio />
      </>
    </RTVIClientProvider>
  );
}

export default App;
