# Description

This package serves the purpose of providing the backend for the BulkyPoe app. It is to be deployed on AWS and runs as serverless lambda functions behind API Gateway.

## Disclaimer

This documentation is mostly for myself. I work on this project on and off and at least currently don't use AWS outside of this, so I tend to forget how the whole build and deployment process goes. This is not gonna be a complete guide on how to do this, but bullet points for myself.

## Usage

If you are on vscode, install the AWS Toolkit extension. You'll need to create an IAM user that is responsible for deploying your code. I called mine BulkyPoe. If you choose a different name, you will have to substitute it in the package.json scripts.

Install the dependencies. I'm using the pnpm package manager. Afterwards, make your changes as usual in the src directory. You should use typescript here.
On running the pnpm build command, tsup is being used to typecheck, minify and convert your endpoint functions into .mjs files that can be deployed on AWS.

To check code locally, run pnpm deploy:local. This will redirect live aws events to your local code. This means you can point it at the source folder and run ts code without the build step. Might require ts-node to be installed on your system, I have not checked.

## Adding new endpoints

Add your new function as a .ts file in the src directory. As this should probably not be inlined into another script, you have to specify this new file as an entry point in the tsup config file. Add the function to the serverless.yaml file. Use other functions there as reference on how to do that.

_Note_: In current form, after deployment, your API is public and can be invoked by anyone. For production deployments, you might want to configure an authorizer. For details on how to do that, refer to [`httpApi` event docs](https://www.serverless.com/framework/docs/providers/aws/events/http-api/). Additionally, in current configuration, the DynamoDB table will be removed when running `serverless remove`. To retain the DynamoDB table even after removal of the stack, add `DeletionPolicy: Retain` to its resource definition.
