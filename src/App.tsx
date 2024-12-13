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

      console.log("----- FUNCTION CALL", fn);

      if (fn.functionName === "get_current_weather" && args.location) {
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
        <main className="flex min-h-screen flex-col items-center justify-between p-24 bg-gray-100">
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
            <MyAudio />
          </div>
        </main>
        <RTVIClientAudio />
      </>
    </RTVIClientProvider>
  );
}

export default App;
