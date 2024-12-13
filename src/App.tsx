import { Button } from "@/components/ui/button";
import { useEffect } from "react";
import { RTVIClient } from "@pipecat-ai/client-js";
import { useState } from "react";
import { DailyTransport } from "@pipecat-ai/daily-transport";

function App() {
  const [voiceClient, setVoiceClient] = useState<RTVIClient | null>(null);

  useEffect(() => {
    if (voiceClient) return;

    console.log(`CONNECTING TO`, import.meta.env.VITE_CONVEX_URL);

    const newVoiceClient = new RTVIClient({
      transport: new DailyTransport(),
      params: {
        baseUrl: import.meta.env.VITE_CONVEX_URL,
        requestData: {
          services: {
            stt: "deepgram",
            tts: "cartesia",
            llm: "anthropic",
          },
        },
        endpoints: {
          connect: "/connect",
          action: "/actions",
        },
        config: [
          {
            service: "tts",
            options: [
              {
                name: "voice",
                value: "79a125e8-cd45-4c13-8a67-188112f4dd22",
              },
            ],
          },
          {
            service: "llm",
            options: [
              {
                name: "model",
                value: "claude-3-5-sonnet-latest",
              },
              {
                name: "initial_messages",
                value: [
                  {
                    role: "user",
                    content: [
                      {
                        type: "text",
                        text: "You are a pirate.",
                      },
                    ],
                  },
                ],
              },
              {
                name: "run_on_config",
                value: true,
              },
            ],
          },
        ],
      },
    });

    setVoiceClient(newVoiceClient);
  }, [voiceClient]);

  return (
    <>
      <main className="flex min-h-screen flex-col items-center justify-between p-24 bg-gray-100">
        <div className="flex flex-col gap-4 items-center">
          <h1 className="text-4xl font-bold">My First Daily Bot</h1>
          <Button>Click me</Button>
        </div>
      </main>
    </>
  );
}

export default App;
