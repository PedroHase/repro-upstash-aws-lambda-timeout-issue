import {APIGatewayProxyEventV2} from 'aws-lambda';
import { checkRatelimit } from '../../utils/rateLimiter.util';

const sendResp = (statusCode: number, payload?: Record<string, any>) => ({
  body: JSON.stringify(payload),
  statusCode
});

export const handler = async (event: APIGatewayProxyEventV2) => {
  const {reachedLimit, ...ratelimitResponse} = await checkRatelimit(event);
  if (reachedLimit) {
    return sendResp(429, ratelimitResponse)
  }
  return sendResp(200);
}
