import * as React from "react";
import { useEffect } from "react";
import { useRTVIClient } from "realtime-ai-react";

interface Props {}

export const AutoConnectVoiceClient: React.FC<Props> = ({}) => {
  const voiceClient = useRTVIClient();

  useEffect(() => {
    if (!voiceClient) return;

    voiceClient.connect().catch(console.error);

    return () => {
      voiceClient.disconnect().catch(console.error);
    };
  }, [voiceClient]);

  return null;
};
