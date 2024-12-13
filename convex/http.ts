import { httpRouter } from "convex/server";
import { httpAction } from "./_generated/server";

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
    const { services, config } = await request.json();

    if (!services || !config || !process.env.DAILY_BOTS_KEY)
      return Response.json("Services or config not found on request body", {
        status: 400,
      });

    const payload = {
      bot_profile: "voice_2024_10",
      max_duration: 600,
      services,
      api_keys: {
        openai: process.env.OPENAI_API_KEY,
      },
      config,
    };

    const req = await fetch("https://api.daily.co/v1/bots/start", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.DAILY_BOTS_KEY}`,
      },
      body: JSON.stringify(payload),
    });

    const res = await req.json();

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
