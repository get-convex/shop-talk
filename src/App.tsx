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
        requestData: {
          services: {
            stt: "deepgram",
            tts: "cartesia",
            llm: "openai",
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
                value: "gpt-4o-mini",
              },
              {
                name: "initial_messages",
                value: [
                  {
                    role: "user",
                    content: [
                      {
                        type: "text",
                        text: "You are a hippy.",
                      },
                    ],
                  },
                ],
              },
              {
                name: "run_on_config",
                value: true,
              },
              {
                name: "tools",
                value: [
                  {
                    type: "function",
                    function: {
                      name: "get_current_weather",
                      description:
                        "Get the current weather for a location. This includes the conditions as well as the temperature.",
                      parameters: {
                        type: "object",
                        properties: {
                          location: {
                            type: "string",
                            description:
                              "The city and state, e.g. San Francisco, CA",
                          },
                          format: {
                            type: "string",
                            enum: ["celsius", "fahrenheit"],
                            description:
                              "The temperature unit to use. Infer this from the users location.",
                          },
                        },
                        required: ["location", "format"],
                      },
                    },
                  },
                ],
              },
            ],
          },
        ],
      },
    });

    // Below the RTVIClient instance you created
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
