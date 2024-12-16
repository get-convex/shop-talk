import * as React from "react";
import { useCallback, useRef } from "react";
import { useRTVIClientEvent } from "@pipecat-ai/client-react";
import { RTVIEvent } from "@pipecat-ai/client-js";

export const AudioIndicatorBubble: React.FC = () => {
  const volRef = useRef<HTMLDivElement>(null);

  useRTVIClientEvent(
    RTVIEvent.LocalAudioLevel,
    useCallback((volume: number) => {
      if (volRef.current) {
        const v = Number(volume) * 1.75;
        volRef.current.style.transform = `scale(${Math.max(0.1, v)})`;
      }
    }, [])
  );

  return (
    <div
      ref={volRef}
      className="absolute inset-0 rounded-full bg-amber-200/50 transition-transform duration-100"
    />
  );
};
