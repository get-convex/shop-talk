import { useRoute } from "./routes";
import { RTVIClientAudio } from "@pipecat-ai/client-react";
import VoiceControls from "../voiceControls/VoiceControls";
import ShoppingListRoute from "../shoppingLists/ShoppingList";
import ShoppingListsOverviewRoute from "../shoppingLists/ShoppingListsOverview";
import { VoiceClientManagement } from "@/voiceManagement/VoiceClientManagement";

function App() {
  const route = useRoute();

  return (
    <>
      <VoiceClientManagement />
      <div className="h-screen bg-amber-50">
        <div className="w-64 fixed top-0 left-0 h-full border-r border-amber-200 bg-white">
          <VoiceControls />
        </div>
        <div className="ml-64">
          {route.name === "home" && <ShoppingListsOverviewRoute />}
          {route.name === "list" && <ShoppingListRoute id={route.params.id} />}
        </div>
      </div>
    </>
  );
}

export default App;
