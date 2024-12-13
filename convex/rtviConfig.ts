import { RTVIClientConfigOption } from "@pipecat-ai/client-js";

export const functions = {
  create_shopping_list: {
    name: "create_shopping_list",
    description: "Create a new shopping list with a name and optional items",
    parameters: {
      type: "object",
      properties: {
        name: {
          type: "string",
          description: "The name of the shopping list",
        },
      },
      required: ["name"],
    },
  },
} as const;

export type FunctionNames = keyof typeof functions;

export const defaultRtviConfig: RTVIClientConfigOption[] = [
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
        value: Object.values(functions).map((fn) => ({
          type: "function" as const,
          function: fn,
        })),
      },
    ],
  },
];
