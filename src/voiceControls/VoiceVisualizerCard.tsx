import { VoiceVisualizer } from "@pipecat-ai/client-react";
import { Loader2 } from "lucide-react";
import { CountdownTimer } from "./CountdownTimer";

type VoiceVisualizerCardProps = {
  isReadyToTalk: boolean;
};

export function VoiceVisualizerCard({
  isReadyToTalk,
}: VoiceVisualizerCardProps) {
  return (
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
          <Loader2 size={32} className="animate-spin text-[#F59E0B]" />
        )}
      </div>
      <div className="text-center mt-2">
        <CountdownTimer />
      </div>
    </div>
  );
}
