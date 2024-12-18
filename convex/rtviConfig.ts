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
  add_items: {
    name: "add_items",
    description: "Add multiple items to the current shopping list at once",
    parameters: {
      type: "object",
      properties: {
        items: {
          type: "array",
          items: {
            type: "string",
          },
          description: "Array of item names to add to the list",
        },
      },
      required: ["items"],
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
  open_list: {
    name: "open_list",
    description: "Open a specific shopping list by its name",
    parameters: {
      type: "object",
      properties: {
        name: {
          type: "string",
          description: "The name of the shopping list to open",
        },
      },
      required: ["name"],
    },
  },
  go_back_to_lists: {
    name: "go_back_to_lists",
    description: "Navigate back to the shopping lists overview",
    parameters: {
      type: "object",
      properties: {},
      required: [],
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
                text: "You are a helpful shopping list assistant called Jane for the app Shop Talk.",
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
