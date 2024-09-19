# AWS Lambda Blackbox Exporter

Hey there! I created this repository to test the functionality of custom AWS Lambda Runtime environments. As an excercise, this
repository is used to run [blackbox exporter](https://github.com/prometheus/blackbox_exporter) from Graphana on an AWS lambda. No modification to the source code was made (yet).

This repo was created as part of my blog post [Serverless Prometheus Blackbox Exporter pt 1](#TBD), feel free to read it and if you have any question or general feedback, feel free to provide it [on the discussions section](https://github.com/electrototo/aws-lambda-blackbox-exporter/discussions/1)

## High level overview

In order to achieve this, a lambda was created with a custom runtime environment, running on Amazon Linux 2, and a custom bootstrap file was created.

At synth time, the binary of `blackbox exporter` is downloaded from the releases of GitHub to the machine running the cdk synth, and it is bundled together with the custom
bootstrap file under the `lambda/` directory. This is achieved by running the `bundle.sh` file through CDK's `Code.fromCustomCommand()` method.

Finally, the assets are deployed to the provisioned lambda after running `cdk deploy`. The invocation endpoint of the lambda is included in the stack's outputs.

## Deployment
_Build the code_
```
npm run build
```

_Synthesize the stacks_
```
cdk synth
```

_Deploy the stacks_
```
cdk deploy
```

## Invocation
The lambda expects to be invoked through the function URL, with a `POST` http method containing as body the URL that should be probed.

Example
```
curl -X POST -d 'google.com' https://1234567890abcdefg.lambda-url.us-west-2.on.aws/
```

The previous command will probe `google.com`.

### Expected output
If everything goes as expected, you should expect to see an output like the following one:
```
# HELP probe_dns_lookup_time_seconds Returns the time taken for probe dns lookup in seconds
# TYPE probe_dns_lookup_time_seconds gauge
probe_dns_lookup_time_seconds 0.038067114
# HELP probe_duration_seconds Returns how long the probe took to complete in seconds
# TYPE probe_duration_seconds gauge
probe_duration_seconds 0.15292232
# HELP probe_failed_due_to_regex Indicates if probe failed due to regex
# TYPE probe_failed_due_to_regex gauge
probe_failed_due_to_regex 0
# HELP probe_http_content_length Length of http content response
# TYPE probe_http_content_length gauge
probe_http_content_length -1
# HELP probe_http_duration_seconds Duration of http request by phase, summed over all redirects
# TYPE probe_http_duration_seconds gauge
probe_http_duration_seconds{phase="connect"} 0.029623154999999998
probe_http_duration_seconds{phase="processing"} 0.07030286799999999
probe_http_duration_seconds{phase="resolve"} 0.041279342999999996
probe_http_duration_seconds{phase="tls"} 0
probe_http_duration_seconds{phase="transfer"} 0.011155951
# HELP probe_http_redirects The number of redirects
# TYPE probe_http_redirects gauge
probe_http_redirects 1
# HELP probe_http_ssl Indicates if SSL was used for the final redirect
# TYPE probe_http_ssl gauge
probe_http_ssl 0
# HELP probe_http_status_code Response HTTP status code
# TYPE probe_http_status_code gauge
probe_http_status_code 200
# HELP probe_http_uncompressed_body_length Length of uncompressed response body
# TYPE probe_http_uncompressed_body_length gauge
probe_http_uncompressed_body_length 22320
# HELP probe_http_version Returns the version of HTTP of the probe response
# TYPE probe_http_version gauge
probe_http_version 1.1
# HELP probe_ip_addr_hash Specifies the hash of IP address. It's useful to detect if the IP address changes.
# TYPE probe_ip_addr_hash gauge
probe_ip_addr_hash 3.831431737e+09
# HELP probe_ip_protocol Specifies whether probe ip protocol is IP4 or IP6
# TYPE probe_ip_protocol gauge
probe_ip_protocol 4
# HELP probe_success Displays whether or not the probe was a success
# TYPE probe_success gauge
probe_success 1
```

Which includes perceived latecencies metrics from the lambda to the endpoint that is being probed.

## Relevant resources
For more information refer to:
* https://prometheus.io/docs/guides/multi-target-exporter/
* https://github.com/prometheus/blackbox_exporter