import * as React from "react";
import { VoiceContextUpdater } from "./VoiceContextUpdater";
import { FunctionCallHandler } from "./FunctionCallHandler";
import { LLMHelperProvider } from "./LLMHelperProvider";
import { AutoConnectVoiceClient } from "@/voiceManagement/AutoConnectVoiceClient";

export const VoiceClientManagement: React.FC = () => {
  return (
    <>
      <AutoConnectVoiceClient />
      <LLMHelperProvider>
        <VoiceContextUpdater />
        <FunctionCallHandler />
      </LLMHelperProvider>
    </>
  );
};
