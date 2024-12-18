import * as React from "react";
import { LLMHelper } from "realtime-ai";
import { useRTVIClient } from "realtime-ai-react";

interface Props {
  children?: React.ReactNode;
}

export const LLMHelperProvider: React.FC<Props> = ({ children }) => {
  const voiceClient = useRTVIClient();
  const [llmHelper, setLlmHelper] = React.useState<LLMHelper | null>(null);

  React.useEffect(() => {
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

  return (
    <LLMHelperContext.Provider value={llmHelper}>
      {children}
    </LLMHelperContext.Provider>
  );
};

export const LLMHelperContext = React.createContext<LLMHelper | null>(null);

export const useLLMHelper = (): LLMHelper => {
  const context = React.useContext(LLMHelperContext);
  if (!context)
    throw new Error("useLlmHelper must be used within a LlmHelperProvider");
  return context;
};
