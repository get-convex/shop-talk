import { TransportState, RTVIEvent } from "@pipecat-ai/client-js";
import { useRTVIClientEvent } from "@pipecat-ai/client-react";
import { TranscriptView } from "./TranscriptView.tsx";
import { useState } from "react";
import { MicButton } from "./MicButton.tsx";
import { useTranscriptHandling } from "./useTranscriptHandling.ts";
import { BotDisconnectedOverlay } from "./BotDisconnectedOverlay.tsx";
import { VoiceVisualizerCard } from "./VoiceVisualizerCard.tsx";

export default function VoiceControls() {
  const { transcripts } = useTranscriptHandling();
  const [state, setState] = useState<TransportState>("disconnected");
  useRTVIClientEvent(RTVIEvent.TransportStateChanged, setState);

  const isReadyToTalk = state === "ready" || state === "connected";

  return (
    <div className="flex flex-col h-full bg-gradient-to-b from-amber-50 to-white relative">
      <BotDisconnectedOverlay />
      <div className="p-6 border-b border-amber-200">
        <h2 className="text-xl font-semibold text-amber-800">🛒 Shop Talk</h2>
        <p className="text-sm text-amber-600 mt-1">
          Use your voice to manage your shopping lists
        </p>
      </div>
      <div className="flex-1 overflow-y-auto">
        <div className="flex flex-col h-full">
          <div className="flex-1 flex flex-col min-h-0">
            <div className="flex-none px-6 pt-6">
              <VoiceVisualizerCard isReadyToTalk={isReadyToTalk} />
            </div>

            <div className="flex-1 flex flex-col min-h-0 px-6 py-6">
              <TranscriptView transcripts={transcripts} />
            </div>

            <div className="flex-none px-6 pb-12">
              <MicButton state={state} isReadyToTalk={isReadyToTalk} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
