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
  add_item: {
    name: "add_item",
    description: "Add a new item to the current shopping list",
    parameters: {
      type: "object",
      properties: {
        item: {
          type: "string",
          description: "The name of the item to add",
        },
      },
      required: ["item"],
    },
  },
  update_item: {
    name: "update_item",
    description: "Update an existing item in the current shopping list",
    parameters: {
      type: "object",
      properties: {
        item: {
          type: "string",
          description: "The current name of the item to update",
        },
        newName: {
          type: "string",
          description: "The new name for the item",
        },
      },
      required: ["item", "newName"],
    },
  },
  update_item_by_index: {
    name: "update_item_by_index",
    description: "Update an item in the current shopping list by its position in the list",
    parameters: {
      type: "object",
      properties: {
        index: {
          type: "number",
          description: "The position of the item in the list (1-based index)",
        },
        newName: {
          type: "string",
          description: "The new name for the item",
        },
      },
      required: ["index", "newName"],
    },
  },
  remove_item: {
    name: "remove_item",
    description: "Remove an item from the current shopping list",
    parameters: {
      type: "object",
      properties: {
        item: {
          type: "string",
          description: "The name of the item to remove",
        },
      },
      required: ["item"],
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
                text: "You are a helpful shopping list assistant.",
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
