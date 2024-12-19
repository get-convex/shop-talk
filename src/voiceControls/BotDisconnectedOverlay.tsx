import { useRTVIClient } from "@pipecat-ai/client-react";
import * as React from "react";
import { useState, useEffect } from "react";
import { RefreshCw } from "lucide-react";

export const BotDisconnectedOverlay: React.FC = () => {
  const [isDisconnected, setIsDisconnected] = useState(false);
  const voiceClient = useRTVIClient();

  useEffect(() => {
    if (!voiceClient) return;

    const handleDisconnect = () => setIsDisconnected(true);
    voiceClient.addListener("botDisconnected", handleDisconnect);

    return () => {
      voiceClient.removeListener("botDisconnected", handleDisconnect);
    };
  }, [voiceClient]);

  if (!isDisconnected) return null;

  const handleReconnect = async () => {
    if (!voiceClient) return;

    try {
      await voiceClient.connect();
      setIsDisconnected(false);
    } catch (error) {
      console.error("Failed to reconnect:", error);
    }
  };

  return (
    <div className="absolute inset-0 bg-amber-50/30 backdrop-blur-sm flex flex-col items-center justify-center p-6 z-10">
      <div className="text-amber-800 text-lg font-semibold mb-4">
        Bot Disconnected
      </div>
      <p className="text-amber-600 text-sm text-center mb-6">
        The voice assistant has disconnected. Please try reconnecting.
      </p>
      <button
        onClick={handleReconnect}
        className="px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors flex items-center gap-2"
      >
        <RefreshCw className="w-4 h-4" />
        Reconnect
      </button>
    </div>
  );
};
