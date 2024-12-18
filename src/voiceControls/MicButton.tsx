import * as React from "react";
import { Mic, MicOff } from "lucide-react";
import { cn } from "../lib/utils";
import { AudioIndicatorBubble } from "./AudioIndicatorBubble";
import { TransportState } from "@pipecat-ai/client-js";
import { useRTVIClient } from "@pipecat-ai/client-react";
import { useState } from "react";

interface MicButtonProps {
  state: TransportState;
  isReadyToTalk: boolean;
}

export const MicButton: React.FC<MicButtonProps> = ({
  state,
  isReadyToTalk,
}) => {
  const voiceClient = useRTVIClient();

  const [isMuted, setIsMuted] = useState(() => {
    const stored = localStorage.getItem("voiceControls.isMuted");
    return stored ? JSON.parse(stored) : false;
  });

  React.useEffect(() => {
    if (!voiceClient) return;
    if (state === "disconnected") return;
    voiceClient.enableMic(!isMuted);
  }, [voiceClient, isMuted, state]);

  return (
    <div className="relative flex justify-center">
      <button
        onClick={() => {
          setIsMuted(!isMuted);
          localStorage.setItem(
            "voiceControls.isMuted",
            JSON.stringify(!isMuted)
          );
        }}
        disabled={!isReadyToTalk}
        className={cn(
          "relative w-20 h-20 rounded-full transition-all duration-300 shadow-lg flex items-center justify-center",
          isReadyToTalk ? "" : "opacity-50 cursor-not-allowed",
          isMuted
            ? "bg-gray-300 hover:bg-gray-400 text-gray-600 opacity-75"
            : "bg-amber-600 hover:bg-amber-700 text-white"
        )}
      >
        <div className="relative z-10">
          {isMuted ? (
            <MicOff className="w-8 h-8" />
          ) : (
            <Mic className="w-8 h-8" />
          )}
        </div>
        {!isMuted && <AudioIndicatorBubble />}
      </button>

      <div
        className={cn(
          "absolute -bottom-6 left-0 right-0 text-center text-xs font-medium transition-all duration-300",
          isMuted ? "text-gray-500" : "text-amber-600"
        )}
      >
        {isMuted ? "muted" : state}
      </div>
    </div>
  );
};
