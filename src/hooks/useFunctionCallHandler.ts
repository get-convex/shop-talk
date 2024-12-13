import { useEffect } from "react"
import { FunctionCallParams, LLMHelper, RTVIClient } from "@pipecat-ai/client-js"
import { useLocation } from "react-router-dom"
import { FunctionNames } from "../../convex/http"
import { useMutation } from "convex/react"
import { api } from "../../convex/_generated/api"

export const useFunctionCallHandler = (voiceClient: RTVIClient | null) => {
  const location = useLocation()
  const createList = useMutation(api.shoppingLists.mutations.createList)

  useEffect(() => {
    if (!voiceClient) return

    const llmHelper = voiceClient.registerHelper(
      "llm",
      new LLMHelper({
        callbacks: {},
      })
    ) as LLMHelper

    llmHelper.handleFunctionCall(async (fn: FunctionCallParams) => {
      const args = fn.arguments as any
      const functionName = fn.functionName as FunctionNames

      console.log("----- FUNCTION CALL", fn)
      console.log("Current route:", location.pathname)

      switch (functionName) {
        case "get_current_weather":
          if (!args.location) return { error: "location is required" }
          const response = await fetch(
            `/api/weather?location=${encodeURIComponent(args.location)}`
          )
          return await response.json()

        case "create_shopping_list":
          if (!args.name) return { error: "name is required" }
          const listId = await createList({ name: args.name })
          return { 
            success: true, 
            message: `Created shopping list "${args.name}"`,
            listId
          }

        default:
          return { error: `Unknown function: ${functionName}` }
      }
    })

    // Cleanup
    return () => {
      voiceClient.unregisterHelper("llm")
    }
  }, [voiceClient, location.pathname, createList])
} 