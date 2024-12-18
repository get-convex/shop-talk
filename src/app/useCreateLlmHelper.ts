import { useRTVIClient } from "realtime-ai-react";
import { useEffect } from "react";
import { useState } from "react";
import { LLMHelper } from "realtime-ai";

export const useCreateLlmHelper = () => {
  const voiceClient = useRTVIClient();
  const [llmHelper, setLlmHelper] = useState<LLMHelper | null>(null);

  useEffect(() => {
    if (!voiceClient) return;

    setLlmHelper(
      voiceClient.registerHelper(
        "llm",
        new LLMHelper({
          callbacks: {},
        })
      ) as LLMHelper
    );
  }, [voiceClient]);

  return llmHelper;
};
