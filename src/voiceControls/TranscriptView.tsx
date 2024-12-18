import * as React from "react";
import { useRef, useEffect } from "react";
import { User, Bot } from "lucide-react";
import { cn } from "../lib/utils";
import { TranscriptItem } from "../types";

interface TranscriptViewProps {
  transcripts: TranscriptItem[];
}

export const TranscriptView: React.FC<TranscriptViewProps> = ({
  transcripts,
}) => {
  const transcriptContainerRef = useRef<HTMLDivElement>(null);

  // Lets auto scroll the transcript to the bottom when the transcripts change
  useEffect(() => {
    if (transcriptContainerRef.current)
      transcriptContainerRef.current.scrollTop =
        transcriptContainerRef.current.scrollHeight;
  }, [transcripts]);

  return (
    <div className="flex-1 flex flex-col min-h-0">
      <div className="text-xs font-medium text-amber-600 uppercase tracking-wider mb-1 flex-none">
        Transcript
      </div>
      <div
        ref={transcriptContainerRef}
        className="flex-1 bg-white/50 backdrop-blur-sm rounded-lg p-4 shadow-inner overflow-y-auto 
          [&::-webkit-scrollbar]:w-2
          [&::-webkit-scrollbar-track]:bg-amber-50
          [&::-webkit-scrollbar-thumb]:bg-amber-300
          [&::-webkit-scrollbar-thumb]:rounded-full
          [&::-webkit-scrollbar-thumb]:hover:bg-amber-400
          scrollbar-thin scrollbar-thumb-amber-300 scrollbar-track-amber-50"
      >
        <div className="flex flex-col h-full">
          {transcripts.length === 0 ? (
            <div className="text-amber-400 text-sm italic">
              No transcript yet...
            </div>
          ) : (
            transcripts.map((transcript) => (
              <div
                key={transcript.id}
                className={cn(
                  "text-sm mb-2 last:mb-0 transition-all duration-2000 flex items-start gap-2",
                  "animate-in fade-in slide-in-from-bottom-2",
                  transcript.isUser ? "text-blue-700" : "text-amber-900",
                  transcript.fadeOut && "opacity-0 translate-y-1"
                )}
              >
                {transcript.isUser ? (
                  <User className="w-4 h-4 mt-1 flex-shrink-0" />
                ) : (
                  <Bot className="w-4 h-4 mt-1 flex-shrink-0" />
                )}
                <span>{transcript.text}</span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
