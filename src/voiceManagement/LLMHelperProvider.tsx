import { LLMHelper } from "@pipecat-ai/client-js";
import { useRTVIClient } from "@pipecat-ai/client-react";
import * as React from "react";

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

  const value = React.useMemo(() => ({ llmHelper }), [llmHelper]);

  return (
    <LLMHelperContext.Provider value={value}>
      {children}
    </LLMHelperContext.Provider>
  );
};

interface LLMHelperContextValue {
  llmHelper: LLMHelper | null;
}

export const LLMHelperContext = React.createContext<LLMHelperContextValue>({
  llmHelper: null,
});

export const useLLMHelper = (): LLMHelper | null => {
  const context = React.useContext(LLMHelperContext);
  if (!context)
    throw new Error("useLlmHelper must be used within a LlmHelperProvider");

  return context.llmHelper;
};
