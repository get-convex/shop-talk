import { useState, useEffect } from "react";
import { RTVIClient } from "@pipecat-ai/client-js";
import { DailyTransport } from "@pipecat-ai/daily-transport";

export const useVoiceClient = () => {
  const [voiceClient, setVoiceClient] = useState<RTVIClient | null>(null);

  useEffect(() => {
    if (voiceClient) return;

    const newVoiceClient = new RTVIClient({
      transport: new DailyTransport(),
      params: {
        baseUrl: import.meta.env.VITE_CONVEX_SITE_URL,
        endpoints: {
          connect: "/connect",
          action: "/actions",
        },
      },
    });

    setVoiceClient(newVoiceClient);
  }, [voiceClient]);

  return voiceClient;
};
