import { checkRatelimit } from "./rateLimiter.util";

const testEvent = {
  requestContext: {
    http: {
      sourceIp: "test",
    },
  },
};

const main = async () => {
  const data = await checkRatelimit(testEvent as any);
  console.log(data);
};

main();
