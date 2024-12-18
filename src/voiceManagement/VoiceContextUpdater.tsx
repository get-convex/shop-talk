import * as React from "react";
import { useState } from "react";
import { useRTVIClientEvent } from "realtime-ai-react";
import { RTVIEvent, TransportState } from "@pipecat-ai/client-js";
import { useRoute } from "@/app/routes";
import { useLLMHelper } from "./LLMHelperProvider";

export const VoiceContextUpdater: React.FC = () => {
  const route = useRoute();
  const [state, setState] = useState<TransportState>("disconnected");
  useRTVIClientEvent(RTVIEvent.TransportStateChanged, setState);

  const llmHelper = useLLMHelper();

  React.useEffect(() => {
    if (!llmHelper) return;
    if (state !== "ready") return;

    llmHelper.setContext(
      {
        messages: [
          {
            role: "system",
            content: `You are a helpful shopping list assistant called Jane.

The current route the user is looking at is:
${JSON.stringify(route, null, 2)}
`,
          },
        ],
      },
      true
    );
  }, [llmHelper, state, route]);

  return null;
};
