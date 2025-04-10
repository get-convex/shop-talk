import { RTVIClientConfigOption } from "@pipecat-ai/client-js";

export const functionDefinitions = {
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
  get_current_list: {
    name: "get_current_list",
    description: "Get information about the currently active shopping list including its items",
    parameters: {
      type: "object",
      properties: {},
      required: [],
    },
  },
  get_current_route: {
    name: "get_current_route",
    description:
      "Get information about the current route the user is looking at",
    parameters: {
      type: "object",
      properties: {},
      required: [],
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

export type FunctionNames = keyof typeof functionDefinitions;

export const initialSystemMessage =
  "You are a helpful shopping list assistant called Jane for the app Shop Talk. Be brief and concise and only respond with the answer to the user's question. If asked about questions that are completely unrelated to the shopping list, just say 'I'm sorry, I don't know how to help with that.'";

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
            role: "system",
            content: [
              {
                type: "text",
                text: initialSystemMessage,
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
        value: Object.values(functionDefinitions).map((fn) => ({
          type: "function" as const,
          function: fn,
        })),
      },
    ],
  },
];

export const maxSessionDurationSeconds = 180;
