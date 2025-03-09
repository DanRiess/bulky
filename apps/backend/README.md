# REST API

## Description

This package serves the purpose of providing the backend for the BulkyPoe app. It is to be deployed on AWS and runs as serverless lambda functions behind API Gateway.

## Disclaimer

This documentation is mostly for myself. I work on this project on and off and at least currently don't use AWS outside of this, so I tend to forget how the whole build and deployment process goes. This is not gonna be a complete guide on how to do this, but bullet points for myself.

## Usage

If you are on vscode, install the AWS Toolkit extension. You'll need to create an IAM user that is responsible for deploying your code. I called mine BulkyPoe. If you choose a different name, you will have to substitute it in the package.json scripts.

Install the dependencies. I'm using the pnpm package manager. Afterwards, make your changes as usual in the src directory. You should use typescript here.
On running the pnpm build command, tsup is being used to typecheck, minify and convert your endpoint functions into .mjs files that can be deployed on AWS.

To check code locally, run pnpm dev. This will redirect live aws events to your local code. This means you can point it at the source folder and run ts code without the build step. Might require ts-node to be installed on your system, I have not checked. Send requests via postman to your Api Gateway endpoint to test.

## Adding new endpoints

Add your new function as a .ts file in the src directory. As this should probably not be inlined into another script, you have to specify this new file as an entry point in the tsup config file. Add the function to the serverless.yaml file. Use other functions there as reference on how to do that.

_Note_: In current form, after deployment, your API is public and can be invoked by anyone. For production deployments, you might want to configure an authorizer. For details on how to do that, refer to [`httpApi` event docs](https://www.serverless.com/framework/docs/providers/aws/events/http-api/). Additionally, in current configuration, the DynamoDB table will be removed when running `serverless remove`. To retain the DynamoDB table even after removal of the stack, add `DeletionPolicy: Retain` to its resource definition.

## Caveats

There is no build step on the server. The code will be bundled before it gets uploaded. If you want to use or add a package, there is 2 things you will have to make sure of. First, try to use only modules that support tree shaking and import packages like this: import { capitalize } from 'lodash-es'. Second, add your package to the noExternal array in tsup.config.ts.

This will make sure, that only functions you actually use are being imported and inlined. If you would instead import packages like this: import \* as \_ from 'lodash', tsup would inline the entire package.

# PoE Ninja Proxy

## Description

To avoid a gazillion requests raining down on Rasmus' servers, set up a proxy that periodically fetches ninja data and then serves it to clients.

The current implementation uses a lambda function that gets triggered once per hour, fetches ninja data, processes it and saves it to s3. The endpoint is set up with cloudfront and a 60 minute TTL with (important!) stale-while-revalidate set.
