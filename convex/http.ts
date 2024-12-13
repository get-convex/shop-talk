import { httpRouter } from "convex/server";
import { httpAction } from "./_generated/server";

const http = httpRouter();

http.route({
  path: "/connect",
  method: "POST",
  handler: httpAction(async (ctx, request) => {
    return new Response(JSON.stringify({ message: "Hello from Convex!" }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        Vary: "origin",
      },
    });
  }),
});

export default http;
