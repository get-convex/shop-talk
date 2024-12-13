import {
  BotLLMTextData,
  RTVIError,
  RTVIEvent,
  TranscriptData,
  TransportState,
} from "@pipecat-ai/client-js";
import { useRTVIClient, useRTVIClientEvent } from "@pipecat-ai/client-react";
import * as React from "react";
import { useCallback, useState } from "react";
import { Button } from "./components/ui/button";

interface Props {}

export const MyAudio: React.FC<Props> = ({}) => {
  const voiceClient = useRTVIClient();
  const [error, setError] = useState<string | null>(null);
  const [state, setState] = useState<TransportState>("disconnected");
  const [botTranscript, setBotTranscript] = useState<BotLLMTextData[]>([]);
  
  useRTVIClientEvent(
    RTVIEvent.BotTranscript,
    useCallback(
      (transcriptData: BotLLMTextData) => {
        if (transcriptData.final) {
          setBotTranscript((prev) => [...prev, transcriptData]);
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

    setBotTranscript([]);
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="text-red-500 text-bold">{error}</div>

      <Button
        onClick={() => (state === "disconnected" ? connect() : disconnect())}
        className="mx-auto bg-slate-300 px-5 py-2 rounded-full self-center"
      >
        {state === "disconnected" ? "Start" : "Disconnect"}
      </Button>

      <div className="text-center">
        Transport state: <strong>{state}</strong>
      </div>

      <div className="mt-10">
        {botTranscript.map((transcript, index) => (
          <div key={index}>{transcript.text}</div>
        ))}
      </div>
    </div>
  );
};
