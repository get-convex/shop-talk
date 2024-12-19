import * as React from "react";
import { FunctionCallHandler } from "./FunctionCallHandler";
import { LLMHelperProvider } from "./LLMHelperProvider";
import { AutoConnectVoiceClient } from "@/voiceManagement/AutoConnectVoiceClient";
import { RTVIClientAudio } from "@pipecat-ai/client-react";

export const VoiceClientManagement: React.FC = () => {
  return (
    <>
      <RTVIClientAudio />
      <AutoConnectVoiceClient />
      <LLMHelperProvider>
        <FunctionCallHandler />
      </LLMHelperProvider>
    </>
  );
};
