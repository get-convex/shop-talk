import { httpRouter } from "convex/server";
import { httpAction } from "./_generated/server";
import { RTVIClientConfigOption } from "@pipecat-ai/client-js";

const http = httpRouter();

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "Content-Type",
  Vary: "origin",
};

http.route({
  path: "/hello",
  method: "GET",
  handler: httpAction(async (ctx, request) => {
    return new Response(JSON.stringify({ message: "Hello from Convex!" }), {
      status: 200,
      headers: {
        ...corsHeaders,
        "Content-Type": "application/json",
      },
    });
  }),
});

http.route({
  path: "/connect",
  method: "OPTIONS",
  handler: httpAction(async () => {
    return new Response(null, {
      status: 204,
      headers: corsHeaders,
    });
  }),
});

const defaultConfig: RTVIClientConfigOption[] = [
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
                    description: "The city and state, e.g. San Francisco, CA",
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
];

http.route({
  path: "/connect",
  method: "POST",
  handler: httpAction(async (ctx, request) => {
    if (!process.env.DAILY_BOTS_KEY) {
      return Response.json("Daily bots key not found", {
        status: 400,
      });
    }

    const payload = {
      bot_profile: "voice_2024_10",
      max_duration: 600,
      services: {
        stt: "deepgram",
        tts: "cartesia",
        llm: "openai",
      },
      api_keys: {
        openai: process.env.OPENAI_API_KEY,
      },
      config: defaultConfig,
    };

    const req = await fetch("https://api.daily.co/v1/bots/start", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.DAILY_BOTS_KEY}`,
      },
      body: JSON.stringify(payload),
    });

    const res = await req.json();

    if (req.status !== 200)
      return Response.json(res, { ...corsHeaders, status: req.status });

    return Response.json(res, {
      status: 200,
      headers: {
        ...corsHeaders,
        "Content-Type": "application/json",
      },
    });
  }),
});

export default http;
