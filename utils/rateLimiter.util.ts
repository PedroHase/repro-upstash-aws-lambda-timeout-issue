import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis/with-fetch";
import { APIGatewayProxyEventV2 } from "aws-lambda";
import "dotenv/config";

const rateLimitCache = new Map();

// Upstash rate limiter, allow 4 requests every 10s
const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  ephemeralCache: rateLimitCache,
  limiter: Ratelimit.slidingWindow(4, "10 s"),
});

export const checkRatelimit = async (event: APIGatewayProxyEventV2) => {
  const { sourceIp } = event.requestContext.http;
  // we identify & limit clients based on their ip
  console.debug("Waiting for upstash");
  const { success, reset } = await ratelimit.limit(sourceIp);

  // we hit the rate limit!
  if (!success) {
    return { error: "Too many requests", reset, reachedLimit: true };
  }
  return { reachedLimit: false };
};
