import {
  BotLLMTextData,
  RTVIError,
  RTVIEvent,
  TransportState,
  TranscriptData,
} from "@pipecat-ai/client-js";
import {
  useRTVIClient,
  useRTVIClientEvent,
  VoiceVisualizer,
} from "@pipecat-ai/client-react";
import * as React from "react";
import { useCallback, useState, useRef, useEffect } from "react";
import { Loader2, Mic, MicOff, Pause } from "lucide-react";
import { cn } from "./lib/utils";

interface TranscriptItem {
  id: string;
  text: string;
  isUser: boolean;
  fadeOut?: boolean;
  isFinal?: boolean;
}

const AudioIndicatorBubble: React.FC = () => {
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

interface Props {}

export const MyAudio: React.FC<Props> = () => {
  const voiceClient = useRTVIClient();
  const [state, setState] = useState<TransportState>("disconnected");
  const [isMuted, setIsMuted] = useState(false);
  const [transcripts, setTranscripts] = useState<TranscriptItem[]>([]);
  const timeoutRefs = useRef<Map<string, NodeJS.Timeout>>(new Map());
  const transcriptContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (transcriptContainerRef.current) {
      transcriptContainerRef.current.scrollTop = transcriptContainerRef.current.scrollHeight;
    }
  }, [transcripts]);

  useRTVIClientEvent(
    RTVIEvent.BotTranscript,
    useCallback(
      (transcriptData: BotLLMTextData) => {
        if (!transcriptData.text) return;

        const id = Math.random().toString(36).substring(7);
        setTranscripts(prev => [...prev, { 
          id, 
          text: transcriptData.text, 
          isUser: false 
        }]);

        // Set timeout to start fade out after 30 seconds
        const fadeTimeout = setTimeout(() => {
          setTranscripts(prev =>
            prev.map(t => t.id === id ? { ...t, fadeOut: true } : t)
          );

          // Remove after fade animation (2 seconds)
          setTimeout(() => {
            setTranscripts(prev => prev.filter(t => t.id !== id));
            timeoutRefs.current.delete(id);
          }, 2000);
        }, 30000);

        timeoutRefs.current.set(id, fadeTimeout);
      },
      [setTranscripts]
    )
  );

  useRTVIClientEvent(
    RTVIEvent.UserTranscript,
    useCallback(
      (transcriptData: TranscriptData) => {
        if (!transcriptData.text) return

        if (!transcriptData.final) {
          // For non-final transcripts, update existing non-final or add new one
          setTranscripts(prev => {
            const existingNonFinalIndex = prev.findIndex(t => t.isUser && !t.isFinal)
            if (existingNonFinalIndex >= 0) {
              const newTranscripts = [...prev]
              newTranscripts[existingNonFinalIndex] = {
                id: prev[existingNonFinalIndex].id,
                text: transcriptData.text,
                isUser: true,
                isFinal: false
              }
              return newTranscripts
            }
            return [...prev, {
              id: Math.random().toString(36).substring(7),
              text: transcriptData.text,
              isUser: true,
              isFinal: false
            }]
          })
          return
        }

        // For final transcripts, replace any non-final and add the final version
        setTranscripts(prev => {
          const withoutNonFinal = prev.filter(t => t.isFinal !== false)
          const id = Math.random().toString(36).substring(7)
          
          // Set timeout to start fade out after 30 seconds
          const fadeTimeout = setTimeout(() => {
            setTranscripts(prev =>
              prev.map(t => t.id === id ? { ...t, fadeOut: true } : t)
            )

            // Remove after fade animation (2 seconds)
            setTimeout(() => {
              setTranscripts(prev => prev.filter(t => t.id !== id))
              timeoutRefs.current.delete(id)
            }, 2000)
          }, 30000)

          timeoutRefs.current.set(id, fadeTimeout)
          
          return [...withoutNonFinal, {
            id,
            text: transcriptData.text,
            isUser: true,
            isFinal: true
          }]
        })
      },
      [setTranscripts]
    )
  )

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
      // Don't update mute state if the operation failed
    }
  };

  const isReadyToTalk = state == "ready" || state == "connected";

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
          <div className="text-xs font-medium text-amber-600 uppercase tracking-wider mb-1 flex-none">
            Transcript
          </div>
          <div ref={transcriptContainerRef} className="flex-1 bg-white/50 backdrop-blur-sm rounded-lg p-4 shadow-inner overflow-y-auto 
            [&::-webkit-scrollbar]:w-2
            [&::-webkit-scrollbar-track]:bg-amber-50
            [&::-webkit-scrollbar-thumb]:bg-amber-300
            [&::-webkit-scrollbar-thumb]:rounded-full
            [&::-webkit-scrollbar-thumb]:hover:bg-amber-400
            scrollbar-thin scrollbar-thumb-amber-300 scrollbar-track-amber-50">
            <div className="flex flex-col h-full">
              {transcripts.length === 0 ? (
                <div className="text-amber-400 text-sm italic">
                  No transcript yet...
                </div>
              ) : (
                transcripts.map(transcript => (
                  <div
                    key={transcript.id}
                    className={cn(
                      "text-sm mb-2 last:mb-0 transition-all duration-2000",
                      "animate-in fade-in slide-in-from-bottom-2",
                      transcript.isUser ? "text-blue-700" : "text-amber-900",
                      transcript.fadeOut && "opacity-0 translate-y-1"
                    )}
                  >
                    {transcript.text}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        <div className="flex-none px-6 pb-12">
          <div className="relative flex justify-center">
            <button
              onClick={toggleMute}
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
        </div>
      </div>
    </div>
  );
};
