import { BrowserRouter, Routes, Route } from "react-router-dom";
import { RTVIClientProvider, RTVIClientAudio } from "@pipecat-ai/client-react";
import VoiceControls from "./components/VoiceControls";
import ShoppingList from "./components/ShoppingList";
import ShoppingListsOverview from "./components/ShoppingListsOverview";
import { useFunctionCallHandler } from "./hooks/useFunctionCallHandler";
import { useEffect, useMemo } from "react";
import { DailyTransport } from "@pipecat-ai/daily-transport";
import { RTVIClient } from "@pipecat-ai/client-js";

function App() {
  const voiceClient = useMemo(
    () =>
      new RTVIClient({
        transport: new DailyTransport(),
        params: {
          baseUrl: import.meta.env.VITE_CONVEX_SITE_URL,
          endpoints: {
            connect: "/connect",
            action: "/actions",
          },
        },
      }),
    []
  );

  useEffect(() => {
    if (!voiceClient) return;

    voiceClient.connect().catch((e) => {
      console.error(e);
      voiceClient.disconnect();
    });

    // Cleanup on unmount
    return () => {
      voiceClient.disconnect().catch((e) => {
        console.error(e);
      });
    };
  }, [voiceClient]);

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
