import {
  TransportState,
  RTVIEvent,
} from "@pipecat-ai/client-js";
import { useRTVIClient, useRTVIClientEvent, VoiceVisualizer } from "@pipecat-ai/client-react";
import * as React from "react";
import { useState } from "react";
import { Loader2 } from "lucide-react";
import { TranscriptView } from "./components/TranscriptView";
import { MicButton } from "./components/MicButton";
import { useTranscriptHandling } from "./hooks/useTranscriptHandling";

export const MyAudio: React.FC = () => {
  const voiceClient = useRTVIClient();
  const [state, setState] = useState<TransportState>("disconnected");
  const [isMuted, setIsMuted] = useState(false);
  const { transcripts } = useTranscriptHandling();

  useRTVIClientEvent(
    RTVIEvent.TransportStateChanged,
    (state: TransportState) => {
      setState(state);
    }
  );

  const toggleMute = async () => {
    if (!voiceClient) return;
    if (state === "disconnected") return;

    try {
      const newMutedState = !isMuted;
      await voiceClient.enableMic(!newMutedState);
      setIsMuted(newMutedState);
    } catch (error) {
      console.error("Failed to toggle mute:", error);
    }
  };

  const isReadyToTalk = state === "ready" || state === "connected";

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 flex flex-col min-h-0">
        <div className="flex-none px-6 pt-6">
          <div className="h-fit bg-white/80 rounded-xl p-4 shadow-sm">
            <div className="text-xs font-medium text-amber-600 mb-2 text-center">
              4o-mini
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
                <Loader2 size={32} className="animate-spin text-[#F59E0B]" />
              )}
            </div>
          </div>
        </div>

        <div className="flex-1 flex flex-col min-h-0 px-6 py-6">
          <TranscriptView transcripts={transcripts} />
        </div>

        <div className="flex-none px-6 pb-12">
          <MicButton
            isMuted={isMuted}
            state={state}
            isReadyToTalk={isReadyToTalk}
            onToggleMute={toggleMute}
          />
        </div>
      </div>
    </div>
  );
};
