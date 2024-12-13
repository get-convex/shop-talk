import { useEffect } from "react"
import { FunctionCallParams, LLMHelper, RTVIClient } from "@pipecat-ai/client-js"
import { useLocation } from "react-router-dom"
import { FunctionNames } from "../../convex/http"

export const useFunctionCallHandler = (voiceClient: RTVIClient | null) => {
  const location = useLocation()

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

        // Add more function handlers here
        default:
          return { error: `Unknown function: ${functionName}` }
      }
    })

    // Cleanup
    return () => {
      voiceClient.unregisterHelper("llm")
    }
  }, [voiceClient, location.pathname])
} 