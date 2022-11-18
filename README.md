# aws-cli-util-logger

[![npm package][npm-img]][npm-url]
[![Build Status][build-img]][build-url]
[![Downloads][downloads-img]][downloads-url]
[![Issues][issues-img]][issues-url]
[![Code Coverage][codecov-img]][codecov-url]
[![Commitizen Friendly][commitizen-img]][commitizen-url]
[![Semantic Release][semantic-release-img]][semantic-release-url]

> Lightweight logger for use in CLI utilities for AWS

This is the logger I use in my AWS related command line utils (i.e.
[aws-sso-creds-helper][sso-creds-helper-url]).

## Install

```bash
npm install aws-cli-util-logger
```

## Usage

```ts
import { AwsCliUtilLogger } from 'aws-cli-util-logger';

const logger = new AwsCliUtilLogger({
  packageName: 'aws-sso-creds-helper',
});

logger.logSystemInfo('sso');
/*
[aws-sso-creds-helper]: ===========
[aws-sso-creds-helper]: SYSTEM INFO
[aws-sso-creds-helper]: ===========
[aws-sso-creds-helper]: AWS CLI Version aws-cli/2.7.20 Python/3.9.11 Linux/5.15.0-52-generic exe/x86_64.ubuntu.20 prompt/off
[aws-sso-creds-helper]: OS linux 5.15.0-52-generic
[aws-sso-creds-helper]: Node v18.12.1
[aws-sso-creds-helper]: ==============
[aws-sso-creds-helper]: PROFILE CONFIG
[aws-sso-creds-helper]: ==============
[aws-sso-creds-helper]:
      Name                    Value             Type    Location
      ----                    -----             ----    --------
   profile                      sso           manual    --profile
access_key     ****************ZABC              sso
secret_key     ****************5ABC              sso
    region                us-east-1      config-file    ~/.aws/config
*/
```

## API

### AwsCliUtilLogger(options)

#### options

Type: `object`

##### packageName

Type: `string`

Name of the npm package.

##### binCommand

Type: `string`

Name of the bin command.

##### verbose

Type: `boolean`

Enables verbose logging.

##### disabled

Type: `boolean`

When true, disables **ALL** logging output

##### debugFlag

Type: `string`

Default: `'--debug'`

Debug flag for your CLI.

### instanceof AwsCliUtilLogger

#### handleError(error, debug?)

##### error

Type: `Error`

Error to log and generate a stack trace for.

##### debug

Type: `boolean`

When false, a log message instructing the user to run the `binCommand` with
your `debugFlag` set for additional info.

#### logSystemInfo(profile)

Logs various system information including the AWS CLI version and the AWS CLI
profile configuration.

##### profile

Type: `string`

Default: `'default'`

The name of the AWS profile to get system info for.

#### success(...messages)

#### info(...messages)

#### warn(...messages)

#### error(...messages)

#### debug(...messages)

#### log(...messages)

##### messages

Type: `string`

Log messages passed to console log methods.

[build-img]:https://github.com/ryansonshine/aws-cli-util-logger/actions/workflows/release.yml/badge.svg
[build-url]:https://github.com/ryansonshine/aws-cli-util-logger/actions/workflows/release.yml
[downloads-img]:https://img.shields.io/npm/dt/aws-cli-util-logger
[downloads-url]:https://www.npmtrends.com/aws-cli-util-logger
[npm-img]:https://img.shields.io/npm/v/aws-cli-util-logger
[npm-url]:https://www.npmjs.com/package/aws-cli-util-logger
[issues-img]:https://img.shields.io/github/issues/ryansonshine/aws-cli-util-logger
[issues-url]:https://github.com/ryansonshine/aws-cli-util-logger/issues
[codecov-img]:https://codecov.io/gh/ryansonshine/aws-cli-util-logger/branch/main/graph/badge.svg
[codecov-url]:https://codecov.io/gh/ryansonshine/aws-cli-util-logger
[semantic-release-img]:https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg
[semantic-release-url]:https://github.com/semantic-release/semantic-release
[commitizen-img]:https://img.shields.io/badge/commitizen-friendly-brightgreen.svg
[commitizen-url]:http://commitizen.github.io/cz-cli/
[sso-creds-helper-url]:https://github.com/ryansonshine/aws-sso-creds-helper
