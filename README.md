# repro-upstash-aws-lambda-timeout-issue

![meme](https://i.imgur.com/PndwbRy.png)

Reproducing a timeout issue with upstash in AWS Lambda.

### What is it all about?

This Repo contains a AWS CDK that defines a HttpGateway and a Lambda `src/rateLimiter/index.ts` using Node v16 (in this repo we use Node v14 as this is the only version running locally). The lambda uses a rate limiter (`utils/rateLimiter.util.ts`) using `@upstash/ratelimit`. When making a request to the Lambda, the rate limiter should decide if the request should go through or not.

### What is the issue?

When calling the Lambda, it will time out when running the Upstash rate limiter fn:

```
START RequestId: fa6547db-4a37-4f25-bac4-5bec8e1ff9cf Version: $LATEST
2022-10-20T11:08:53.732Z        fa6547db-4a37-4f25-bac4-5bec8e1ff9cf    DEBUG   Waiting for upstash
Function 'ratelimit' timed out after 3 seconds
No response from invoke container for ratelimitC4266C65
Invalid lambda response received: Lambda response must be valid json
```

However, this only happens, if called inside the Lambda. If called in Node (see `npm run rateLimiterDirect` / `utils/runRatelimiterDirectly.ts` as example), it works without issues.

### Reproduce locally

1. Have both `docker` and AWS `sam` installed.
1. Rename `.env.example` to `.env` and enter your Upstash credentials
1. Run `cdk synth`
1. Run `npm run runLocal` to start the HttpGateway locally
1. Send a `GET` to `http://localhost:3000/ratelimit`
1. Server answers with `502` due to the Lambda timing out (check console where you started the gateway)
