import { TransportState, RTVIEvent } from "@pipecat-ai/client-js";
import { useRTVIClientEvent, VoiceVisualizer } from "@pipecat-ai/client-react";
import { TranscriptView } from "./TranscriptView";
import { useState } from "react";
import { Loader2 } from "lucide-react";
import { MicButton } from "./MicButton";
import { useTranscriptHandling } from "./useTranscriptHandling";

export default function VoiceControls() {
  const { transcripts } = useTranscriptHandling();
  const [state, setState] = useState<TransportState>("disconnected");
  useRTVIClientEvent(RTVIEvent.TransportStateChanged, setState);

  const isReadyToTalk = state === "ready" || state === "connected";

  return (
    <div className="flex flex-col h-full bg-gradient-to-b from-amber-50 to-white">
      <div className="p-6 border-b border-amber-200">
        <h2 className="text-xl font-semibold text-amber-800">Voice Controls</h2>
        <p className="text-sm text-amber-600 mt-1">
          Use your voice to manage your shopping lists
        </p>
      </div>
      <div className="flex-1 overflow-y-auto">
        <div className="flex flex-col h-full">
          <div className="flex-1 flex flex-col min-h-0">
            <div className="flex-none px-6 pt-6">
              <div className="h-fit bg-white/80 rounded-xl p-4 shadow-sm">
                <div className="text-xs font-medium text-amber-600 mb-2 text-center">
                  gpt-4o-mini
                </div>
                <div className="h-24 flex items-center justify-center">
                  {isReadyToTalk ? (
                    <VoiceVisualizer
                      participantType="bot"
                      barColor="#F59E0B"
                      barWidth={8}
                      barMaxHeight={60}
                    />
                  ) : (
                    <Loader2
                      size={32}
                      className="animate-spin text-[#F59E0B]"
                    />
                  )}
                </div>
              </div>
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