import {
  BotLLMTextData,
  RTVIError,
  RTVIEvent,
  TransportState,
} from "@pipecat-ai/client-js";
import { useRTVIClient, useRTVIClientEvent } from "@pipecat-ai/client-react";
import * as React from "react";
import { useCallback, useState, useRef } from "react";
import { Button } from "./components/ui/button";
import { Mic, MicOff } from "lucide-react";
import { cn } from "./lib/utils";

interface TranscriptItem extends BotLLMTextData {
  id: string;
  fadeOut?: boolean;
}

interface Props {}

export const MyAudio: React.FC<Props> = ({}) => {
  const voiceClient = useRTVIClient();
  const [error, setError] = useState<string | null>(null);
  const [state, setState] = useState<TransportState>("disconnected");
  const [botTranscript, setBotTranscript] = useState<TranscriptItem[]>([]);
  const timeoutRefs = useRef<Map<string, NodeJS.Timeout>>(new Map());

  useRTVIClientEvent(
    RTVIEvent.BotTranscript,
    useCallback(
      (transcriptData: BotLLMTextData) => {
        if (transcriptData.text) {
          const id = Math.random().toString(36).substring(7);
          setBotTranscript(prev => [...prev, { ...transcriptData, id }]);
          
          // Set timeout to start fade out after 30 seconds
          const fadeTimeout = setTimeout(() => {
            setBotTranscript(prev => 
              prev.map(t => t.id === id ? { ...t, fadeOut: true } : t)
            );
            
            // Remove after fade animation (2 seconds)
            setTimeout(() => {
              setBotTranscript(prev => prev.filter(t => t.id !== id));
              timeoutRefs.current.delete(id);
            }, 2000);
          }, 30000);
          
          timeoutRefs.current.set(id, fadeTimeout);
        }
      },
      [setBotTranscript]
    )
  );

  useRTVIClientEvent(
    RTVIEvent.TransportStateChanged,
    (state: TransportState) => {
      setState(state);
    }
  );

  async function connect() {
    if (!voiceClient) return;

    try {
      await voiceClient.connect();
    } catch (e) {
      setError((e as RTVIError).message || "Unknown error occurred");
      voiceClient.disconnect();
    }
  }

  async function disconnect() {
    if (!voiceClient) return;
    await voiceClient.disconnect();
    
    // Clear all timeouts
    timeoutRefs.current.forEach(timeout => clearTimeout(timeout));
    timeoutRefs.current.clear();
    setBotTranscript([]);
  }

  const isConnected = state !== "disconnected";

  return (
    <div className="flex flex-col h-full">
      <div className="flex-none p-6 space-y-6">
        {error && (
          <div className="text-red-500 text-sm font-medium bg-red-50 p-3 rounded-md">
            {error}
          </div>
        )}

        <div className="relative">
          <Button
            onClick={() => (isConnected ? disconnect() : connect())}
            className={cn(
              "w-full transition-all duration-300 shadow-lg",
              isConnected 
                ? "bg-amber-600 hover:bg-amber-700 text-white" 
                : "bg-amber-500 hover:bg-amber-600 text-white"
            )}
            size="lg"
          >
            {isConnected ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
            {isConnected ? "Stop Listening" : "Start Listening"}
          </Button>

          <div className={cn(
            "absolute -bottom-6 left-0 right-0 text-center text-xs font-medium transition-all duration-300",
            isConnected ? "text-amber-600" : "text-amber-400"
          )}>
            {state}
          </div>
        </div>
      </div>

      <div className={cn(
        "flex-1 flex flex-col min-h-0 px-6 pb-6",
        botTranscript.length > 0 ? "opacity-100" : "opacity-0"
      )}>
        <div className="text-xs font-medium text-amber-600 uppercase tracking-wider mb-1 flex-none">
          Transcript
        </div>
        <div className="flex-1 bg-white/50 backdrop-blur-sm rounded-lg p-4 shadow-inner overflow-y-auto">
          <div className="flex flex-col-reverse h-full">
            {botTranscript.length === 0 ? (
              <div className="text-amber-400 text-sm italic">
                No transcript yet...
              </div>
            ) : (
              botTranscript.map((transcript) => (
                <div 
                  key={transcript.id}
                  className={cn(
                    "text-sm text-amber-900 mb-2 last:mb-0 transition-all duration-2000",
                    "animate-in fade-in slide-in-from-bottom-2",
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
    </div>
  );
}
