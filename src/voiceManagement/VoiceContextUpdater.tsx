import * as React from "react";
import { useState } from "react";
import { RTVIEvent, TransportState } from "@pipecat-ai/client-js";
import { useRoute } from "@/app/routes";
import { useLLMHelper } from "./LLMHelperProvider";
import { useRTVIClientEvent } from "@pipecat-ai/client-react";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Id } from "convex/_generated/dataModel";

export const VoiceContextUpdater: React.FC = () => {
  const route = useRoute();
  const [state, setState] = useState<TransportState>("disconnected");
  useRTVIClientEvent(RTVIEvent.TransportStateChanged, setState);

  const llmHelper = useLLMHelper();
  const list = useQuery(
    api.shoppingLists.queries.findByIdAndAllItems,
    route.name == "list"
      ? {
          id: route.params.id as Id<"shoppingLists">,
        }
      : "skip"
  );

  React.useEffect(() => {
    if (!llmHelper) return;
    if (state !== "ready") return;

    let systemMessage = `The route the user is currently looking at is:\n${JSON.stringify(route, null, 2)}`;

    if (list)
      systemMessage += `\n\nThe shopping list the user is currently looking at is:\n${JSON.stringify(list, null, 2)}.`;

    systemMessage += `\n\nYou dont need to read out the above context unless asked for it.`;

    llmHelper.appendToMessages({
      role: "system",
      content: systemMessage,
    });
  }, [llmHelper, state, route, list]);

  return null;
};
