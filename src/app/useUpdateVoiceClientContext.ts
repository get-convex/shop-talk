import { RTVIEvent } from "@pipecat-ai/client-js";
import { useEffect, useState } from "react";
import { useRoute } from "@/app/routes";
import { useRTVIClientEvent } from "realtime-ai-react";
import { TransportState, LLMHelper } from "realtime-ai";

export const useUpdateVoiceClientContext = (llmHelper: LLMHelper | null) => {
  const route = useRoute();
  const [state, setState] = useState<TransportState>("disconnected");
  useRTVIClientEvent(RTVIEvent.TransportStateChanged, setState);

  useEffect(() => {
    console.log(`state`, { state, llmHelper, route });

    if (!llmHelper) return;
    if (state !== "ready") return;

    console.log(`SETTING CONTEXT.....`);

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
};
