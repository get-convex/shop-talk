import { useMemo, useEffect } from 'react'
import { RTVIClient } from '@pipecat-ai/client-js'
import { DailyTransport } from '@pipecat-ai/daily-transport'

export function useCreateAndInitVoiceClient() {
  const voiceClient = useMemo(
    () => new RTVIClient({
      transport: new DailyTransport(),
      params: {
        baseUrl: import.meta.env.VITE_CONVEX_SITE_URL,
        endpoints: {
          connect: '/connect',
          action: '/actions',
        },
      },
    }),
    []
  )

  useEffect(() => {
    if (!voiceClient) return

    voiceClient.connect().catch(e => {
      console.error(e)
      voiceClient.disconnect()
    })

    return () => {
      voiceClient.disconnect().catch(e => {
        console.error(e)
      })
    }
  }, [voiceClient])

  return voiceClient
} 