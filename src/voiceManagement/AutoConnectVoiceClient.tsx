import { useRTVIClient } from "@pipecat-ai/client-react";
import * as React from "react";
import { useEffect } from "react";

interface Props {}

export const AutoConnectVoiceClient: React.FC<Props> = ({}) => {
  const voiceClient = useRTVIClient();

  console.log("AutoConnectVoiceClient", { voiceClient });

  useEffect(() => {
    if (!voiceClient) return;

    console.log("Connecting to voice client");
    voiceClient.connect().catch(console.error);

    return () => {
      console.log("Disconnecting from voice client");
      voiceClient.disconnect().catch(console.error);
    };
  }, [voiceClient]);

  return null;
};
