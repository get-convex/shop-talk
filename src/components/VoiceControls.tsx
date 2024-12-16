import { MyAudio } from "@/MyAudio";
import { RTVIError } from "@pipecat-ai/client-js";
import * as React from "react";
import { useRTVIClient } from "@pipecat-ai/client-react";

export default function VoiceControls() {
  const voiceClient = useRTVIClient();

  React.useEffect(() => {
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

  return (
    <div className="flex flex-col h-full bg-gradient-to-b from-amber-50 to-white">
      <div className="p-6 border-b border-amber-200">
        <h2 className="text-xl font-semibold text-amber-800">Voice Controls</h2>
        <p className="text-sm text-amber-600 mt-1">
          Use your voice to manage your shopping lists
        </p>
      </div>
      <div className="flex-1 overflow-y-auto">
        <MyAudio />
      </div>
    </div>
  );
}
