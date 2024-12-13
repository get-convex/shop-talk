export const functions = {
  get_current_weather: {
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
} as const

export type FunctionNames = keyof typeof functions 