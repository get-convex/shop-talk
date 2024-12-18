import * as React from "react";
import { useFunctionCallHandler } from "@/app/useFunctionCallHandler";
import { useUpdateVoiceClientContext } from "@/app/useUpdateVoiceClientContext";
import { useEffect } from "react";
import { useRTVIClient } from "realtime-ai-react";
import { useCreateLlmHelper } from "@/app/useCreateLlmHelper";

interface Props {}

export const VoiceClientManagement: React.FC<Props> = ({}) => {
  const voiceClient = useRTVIClient();

  useEffect(() => {
    if (!voiceClient) return;

    voiceClient.connect().catch(console.error);

    return () => {
      voiceClient.disconnect().catch(console.error);
    };
  }, [voiceClient]);

  const llmHelper = useCreateLlmHelper();

  useUpdateVoiceClientContext(llmHelper);
  useFunctionCallHandler(llmHelper);

  return null;
};
