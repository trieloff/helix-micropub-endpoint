# Helix MicroPub Endpoint

> A micropub publishing endpoint for Project Helix

## Status
[![codecov](https://img.shields.io/codecov/c/github/trieloff/helix-micropub-endpoint.svg)](https://codecov.io/gh/trieloff/helix-micropub-endpoint)
[![CircleCI](https://img.shields.io/circleci/project/github/trieloff/helix-micropub-endpoint.svg)](https://circleci.com/gh/trieloff/helix-micropub-endpoint)
[![GitHub license](https://img.shields.io/github/license/trieloff/helix-micropub-endpoint.svg)](https://github.com/trieloff/helix-micropub-endpoint/blob/master/LICENSE.txt)
[![GitHub issues](https://img.shields.io/github/issues/trieloff/helix-micropub-endpoint.svg)](https://github.com/trieloff/helix-micropub-endpoint/issues)
[![LGTM Code Quality Grade: JavaScript](https://img.shields.io/lgtm/grade/javascript/g/trieloff/helix-micropub-endpoint.svg?logo=lgtm&logoWidth=18)](https://lgtm.com/projects/g/trieloff/helix-micropub-endpoint)
[![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg)](https://github.com/semantic-release/semantic-release) [![Greenkeeper badge](https://badges.greenkeeper.io/trieloff/helix-micropub-endpoint.svg)](https://greenkeeper.io/)

## Installation

## Usage

```bash
curl https://adobeioruntime.net/api/v1/web/helix/helix-services/micropub-endpoint@v1
```

For more, see the [API documentation](docs/API.md).

## Development

### Deploying Helix MicroPub Endpoint

Deploying Helix MicroPub Endpoint requires the `wsk` command line client, authenticated to a namespace of your choice. For Project Helix, we use the `helix` namespace.

All commits to master that pass the testing will be deployed automatically. All commits to branches that will pass the testing will get commited as `/helix-services/micropub-endpoint@ci<num>` and tagged with the CI build number.
