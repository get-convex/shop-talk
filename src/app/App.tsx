import { RouteProvider, useRoute } from "./routes";
import { RTVIClientProvider, RTVIClientAudio } from "@pipecat-ai/client-react";
import VoiceControls from "../voiceControls/VoiceControls";
import ShoppingList from "../shoppingLists/ShoppingList";
import ShoppingListsOverview from "../shoppingLists/ShoppingListsOverview";
import { useFunctionCallHandler } from "./useFunctionCallHandler";
import { useCreateAndInitVoiceClient } from "./useCreateAndInitVoiceClient";

function App() {
  const route = useRoute();
  const voiceClient = useCreateAndInitVoiceClient();
  useFunctionCallHandler(voiceClient);

  return (

      <RTVIClientProvider client={voiceClient!}>
        <div className="h-screen bg-amber-50">
          <div className="w-64 fixed top-0 left-0 h-full border-r border-amber-200 bg-white">
            <VoiceControls />
          </div>
          <div className="ml-64">
            {route.name === "home" && <ShoppingListsOverview />}
            {route.name === "list" && <ShoppingList id={route.params.id} />}
          </div>
        </div>
        <RTVIClientAudio />
      </RTVIClientProvider>

  );
}

export default App;
