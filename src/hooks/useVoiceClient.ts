import { useState, useEffect, useMemo } from "react";
import { RTVIClient } from "@pipecat-ai/client-js";
import { DailyTransport } from "@pipecat-ai/daily-transport";

export const useVoiceClient = () => {
  return useMemo(
    () =>
      new RTVIClient({
        transport: new DailyTransport(),
        params: {
          baseUrl: import.meta.env.VITE_CONVEX_SITE_URL,
          endpoints: {
            connect: "/connect",
            action: "/actions",
          },
        },
      }),
    []
  );
};
