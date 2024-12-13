import { BrowserRouter, Routes, Route } from "react-router-dom";
import { RTVIClientProvider, RTVIClientAudio } from "@pipecat-ai/client-react";
import VoiceControls from "./components/VoiceControls";
import ShoppingList from "./components/ShoppingList";
import ShoppingListsOverview from "./components/ShoppingListsOverview";
import { useVoiceClient } from "./hooks/useVoiceClient";
import { useFunctionCallHandler } from "./hooks/useFunctionCallHandler";

function App() {
  const voiceClient = useVoiceClient();
  useFunctionCallHandler(voiceClient);

  return (
    <RTVIClientProvider client={voiceClient!}>
      <div className="h-screen bg-amber-50">
        <div className="w-64 fixed top-0 left-0 h-full border-r border-amber-200 bg-white">
          <VoiceControls />
        </div>
        <div className="ml-64">
          <Routes>
            <Route path="/" element={<ShoppingListsOverview />} />
            <Route path="/list/:id" element={<ShoppingList />} />
          </Routes>
        </div>
      </div>
      <RTVIClientAudio />
    </RTVIClientProvider>
  );
}

export default App;
