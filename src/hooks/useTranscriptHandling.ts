import { BotLLMTextData, TranscriptData, RTVIEvent } from "@pipecat-ai/client-js";
import { useRTVIClientEvent } from "@pipecat-ai/client-react";
import { useCallback, useRef, useState } from "react";
import { TranscriptItem } from "../types";

export function useTranscriptHandling() {
  const [transcripts, setTranscripts] = useState<TranscriptItem[]>([]);
  const timeoutRefs = useRef<Map<string, NodeJS.Timeout>>(new Map());

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

        const fadeTimeout = setTimeout(() => {
          setTranscripts(prev =>
            prev.map(t => t.id === id ? { ...t, fadeOut: true } : t)
          );

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

        setTranscripts(prev => {
          const withoutNonFinal = prev.filter(t => t.isFinal !== false)
          const id = Math.random().toString(36).substring(7)
          
          const fadeTimeout = setTimeout(() => {
            setTranscripts(prev =>
              prev.map(t => t.id === id ? { ...t, fadeOut: true } : t)
            )

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
  );

  return { transcripts };
} 