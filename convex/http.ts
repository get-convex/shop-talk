import { httpRouter } from "convex/server";
import { httpAction } from "./_generated/server";
import { defaultRtviConfig, maxSessionDurationSeconds } from "./rtviConfig";

const http = httpRouter();

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "Content-Type",
  Vary: "origin",
};

http.route({
  path: "/hello",
  method: "GET",
  handler: httpAction(async (ctx, request) => {
    return new Response(JSON.stringify({ message: "Hello from Convex!" }), {
      status: 200,
      headers: {
        ...corsHeaders,
        "Content-Type": "application/json",
      },
    });
  }),
});

http.route({
  path: "/connect",
  method: "OPTIONS",
  handler: httpAction(async () => {
    return new Response(null, {
      status: 204,
      headers: corsHeaders,
    });
  }),
});

http.route({
  path: "/connect",
  method: "POST",
  handler: httpAction(async (ctx, request) => {
    if (!process.env.DAILY_BOTS_KEY)
      throw new Error("Daily bots key not found");

    if (!process.env.OPENAI_API_KEY)
      throw new Error("OpenAI API key not found");

    const payload = {
      bot_profile: "voice_2024_10",
      max_duration: maxSessionDurationSeconds,
      services: {
        stt: "deepgram",
        tts: "cartesia",
        llm: "openai",
      },
      api_keys: {
        openai: process.env.OPENAI_API_KEY,
      },
      config: defaultRtviConfig,
    };

    console.log(`Requesting connection to Daily Bots..`);

    const req = await fetch("https://api.daily.co/v1/bots/start", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.DAILY_BOTS_KEY}`,
      },
      body: JSON.stringify(payload),
    });

    const res = await req.json();

    console.log(`Daily Bots response: ${JSON.stringify(res)}`);

    if (req.status !== 200)
      return Response.json(res, { ...corsHeaders, status: req.status });

    return Response.json(res, {
      status: 200,
      headers: {
        ...corsHeaders,
        "Content-Type": "application/json",
      },
    });
  }),
});

export default http;
