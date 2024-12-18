import * as React from "react";
import { useEffect } from "react";
import { useRTVIClient } from "realtime-ai-react";
import { useCreateLlmHelper } from "@/app/useCreateLlmHelper";
import { VoiceContextUpdater } from "./VoiceContextUpdater";
import { FunctionCallHandler } from "./FunctionCallHandler";

export const VoiceClientManagement: React.FC = () => {
  const voiceClient = useRTVIClient();

  useEffect(() => {
    if (!voiceClient) return;

    voiceClient.connect().catch(console.error);

    return () => {
      voiceClient.disconnect().catch(console.error);
    };
  }, [voiceClient]);

  const llmHelper = useCreateLlmHelper();

  if (!llmHelper) return null;

  return (
    <>
      <VoiceContextUpdater llmHelper={llmHelper} />
      <FunctionCallHandler llmHelper={llmHelper} />
    </>
  );
};
