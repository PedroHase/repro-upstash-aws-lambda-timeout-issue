import {
  HttpApi,
  HttpMethod,
} from '@aws-cdk/aws-apigatewayv2-alpha';
import {HttpLambdaIntegration} from '@aws-cdk/aws-apigatewayv2-integrations-alpha';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as cdk from 'aws-cdk-lib';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
import 'dotenv/config'

export class UpstashAwsCdkLambdaStack extends cdk.Stack {
  constructor(scope: cdk.App, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // 👇 create our HTTP Api
    const httpApi = new HttpApi(this, 'http-api-example', {
      description: 'HTTP API example',
    });

    // 👇 create get-todos Lambda
    const getTodosLambda = new NodejsFunction(this, 'ratelimit', {
      // for SAM we need to use Node v14, but the issue also occurs in Node v16
      runtime: lambda.Runtime.NODEJS_14_X,
      bundling: {
        minify: true,
        sourceMap: false,
        target: 'node14.14',
        externalModules: ['aws-sdk'],
        sourcesContent: false,
        mainFields: ['module', 'main'],
      },
      entry: 'src/rateLimiter/index.ts',
      functionName: 'main',
      environment: {
        UPSTASH_REDIS_REST_TOKEN: process.env.UPSTASH_REDIS_REST_TOKEN ?? "",
        UPSTASH_REDIS_REST_URL: process.env.UPSTASH_REDIS_REST_URL ?? "",
      }
    });

    // 👇 add route for GET /todos
    httpApi.addRoutes({
      path: '/ratelimit',
      methods: [HttpMethod.GET],
      integration: new HttpLambdaIntegration(
        'aws-lambda-integration',
        getTodosLambda,
      ),
    });
  }
}
