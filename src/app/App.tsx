import { RouteProvider, useRoute } from "./routes";
import { RTVIClientProvider, RTVIClientAudio } from "@pipecat-ai/client-react";
import VoiceControls from "../voice/VoiceControls";
import ShoppingList from "../shoppingLists/ShoppingList";
import ShoppingListsOverview from "../shoppingLists/ShoppingListsOverview";
import { useFunctionCallHandler } from "./useFunctionCallHandler";
import { useUpdateVoiceClientContext } from "./useUpdateVoiceClientContext";
import { RTVIClient, LLMHelper } from "@pipecat-ai/client-js";
import { DailyTransport } from "@pipecat-ai/daily-transport";
import { useEffect } from "react";
import { useRTVIClient } from "realtime-ai-react";
import { useCreateLlmHelper } from "./useCreateLlmHelper";
import { VoiceClientManagement } from "@/voice/VoiceClientManagement";

function App() {
  const route = useRoute();


  return (
    <>
      <VoiceClientManagement />
      <RTVIClientAudio />
      <div className="h-screen bg-amber-50">
        <div className="w-64 fixed top-0 left-0 h-full border-r border-amber-200 bg-white">
          <VoiceControls />
        </div>
        <div className="ml-64">
          {route.name === "home" && <ShoppingListsOverview />}
          {route.name === "list" && <ShoppingList id={route.params.id} />}
        </div>
      </div>
    </>
  );
}

export default App;
