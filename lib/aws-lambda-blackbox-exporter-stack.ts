import * as cdk from 'aws-cdk-lib';
import { CfnOutput } from 'aws-cdk-lib';
import * as aws_lambda from 'aws-cdk-lib/aws-lambda';

import { Construct } from 'constructs';

export class AwsLambdaBlackboxExporterStack extends cdk.Stack {
    constructor(scope: Construct, id: string, props?: cdk.StackProps) {
        super(scope, id, props);

        // We need to ensure that the binary is compatible with x86_64 architectures, as the lambda is provisioned for
        // x86_64
        const blackboxDownloadURL = 'https://github.com/prometheus/blackbox_exporter/releases/download/v0.25.0/blackbox_exporter-0.25.0.linux-amd64.tar.gz';

        // These are the commands that will be used to create the bundle, they will be executed at synth time
        const code = aws_lambda.Code.fromCustomCommand('bundle/', ['./bundle.sh'], {
            commandOptions: {
                'env': {
                    'BLACKBOX_DOWNLOAD_URL': blackboxDownloadURL
                }
            }
        });

        // This is the lambda where the blackbox exporter will be running on
        const lambdaFunction = new aws_lambda.Function(this, 'BlackboxExporterLambda', {
            code: code,
            runtime: aws_lambda.Runtime.PROVIDED_AL2,
            architecture: aws_lambda.Architecture.X86_64,
            handler: 'doesnt-really-matter',
            timeout: cdk.Duration.seconds(10)
        });

        // Create the function URL, so it can be invoked using an HTTP request
        const functionURL = lambdaFunction.addFunctionUrl({
            authType: aws_lambda.FunctionUrlAuthType.NONE
        });

        new CfnOutput(this, 'LambdaEndpoint', {
            value: functionURL.url,
            description: 'Endpoint to invoke the lambda from'
        });
    }
}
