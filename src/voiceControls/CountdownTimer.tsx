import { useRTVIClient } from "@pipecat-ai/client-react";
import * as React from "react";
import { useState, useEffect } from "react";
import { Timer, Info } from "lucide-react";
import { maxSessionDurationSeconds } from "../../convex/rtviConfig";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export const CountdownTimer: React.FC = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [timeLeft, setTimeLeft] = useState(maxSessionDurationSeconds);
  const voiceClient = useRTVIClient();

  useEffect(() => {
    if (!voiceClient) return;

    const handleConnect = () => {
      setIsConnected(true);
      setTimeLeft(maxSessionDurationSeconds);
    };
    const handleDisconnect = () => setIsConnected(false);

    voiceClient.addListener("botConnected", handleConnect);
    voiceClient.addListener("botDisconnected", handleDisconnect);

    return () => {
      voiceClient.removeListener("botConnected", handleConnect);
      voiceClient.removeListener("botDisconnected", handleDisconnect);
    };
  }, [voiceClient]);

  useEffect(() => {
    if (!isConnected) return;

    const interval = setInterval(() => {
      setTimeLeft((prev) => Math.max(0, prev - 1));
    }, 1000);

    return () => clearInterval(interval);
  }, [isConnected]);

  if (!isConnected) return null;

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  return (
    <TooltipProvider delayDuration={50}>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="text-amber-600 text-sm opacity-35 flex items-center justify-center gap-1 cursor-help">
            <Timer size={14} />
            {minutes}:{seconds.toString().padStart(2, "0")}
          </div>
        </TooltipTrigger>
        <TooltipContent className="max-w-40 bg-amber-50 border-amber-200">
          <div className="flex gap-2 items-start text-amber-800">
            <Info size={14} className="flex-shrink-0 mt-0.5" />
            <span>
              For demo purposes, the assistant automatically disconnects after a
              period of time
            </span>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};
