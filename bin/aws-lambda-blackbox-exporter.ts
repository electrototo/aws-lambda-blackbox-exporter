#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { AwsLambdaBlackboxExporterStack } from '../lib/aws-lambda-blackbox-exporter-stack';

const app = new cdk.App();

// Create the blackbox lambda in us-west-2
new AwsLambdaBlackboxExporterStack(app, 'AwsLambdaBlackboxExporterStack', {
    env: {
        region: 'us-west-2'
    }
});