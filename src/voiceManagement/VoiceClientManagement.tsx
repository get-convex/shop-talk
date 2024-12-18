import * as React from "react";
import { VoiceContextUpdater } from "./VoiceContextUpdater";
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
        <VoiceContextUpdater />
        <FunctionCallHandler />
      </LLMHelperProvider>
    </>
  );
};
