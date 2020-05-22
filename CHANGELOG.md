# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [1.0.0] - 2020-05-22

### Added

-   CounterConfig element
-   CSV variable support in HeaderManager
-   RandomVariableConfig element
-   ThroughputController element supporting both percentage and amount based throughput control.
-   UniformRandomTimer support

### Fixed

-   CacheManager won't crash the converter, but instead skip it with a comment in the output.
-   Pass iterations to context from threadgroups
-   Consolidated some common functionailty for Elements into a baseclass
-   Change Load Impact to k6 in comments
-   Moved CI workflow from CircleCI to GitHub Actions and automated release and publish.

## [0.1.19] - 2020-04-24

-   Switch from standardjs to prettier and eslint + airbnb
-   Add husky git hooks to enforce test and lint on commit and push.
-   Add Noop element for elements that make no sense outside of JMeter (currently ResultCollector) to avoid unnecessary crashes.

## [0.1.18] - 2019-07-05

### Added

-   Dockerfile and installation instructions on how to use Docker image from DockerHub.

### Fixed

-   Prefer evaluation of variables at runtime to work correctly with dynamic variables, sourced from CSV or response data.
-   Pinned jsonpath dependency version to fix problem introduced in newest version.

## [0.1.17] - 2019-03-01

### Updated

-   Installation and usage instructions to recommend [nvm](https://github.com/creationix/nvm) to avoid filesystem permission issues when installing the tool globally with `npm install -g ...`

### Fixed

-   Installtion issues on Linux and Windows caused by postinstall process not being executed correctly

## [0.1.16] - 2019-02-27

### Added

-   This CHANGELOG file

### Updated

-   New install and usage instructions in README based on NPM publishing and refactoring of JS output

### Fixed

-   ResponseAssertion: status code equality check is now number based ([#6](https://github.com/loadimpact/jmeter-to-k6/issues/6))
-   HTMLExtractor: can't use array indexing on [Selection](https://docs.k6.io/docs/selection-k6html) object ([#8](https://github.com/loadimpact/jmeter-to-k6/issues/8))
-   RandomController: conversion generating out-of-bounds indexes for `switch` statement ([#9](https://github.com/loadimpact/jmeter-to-k6/issues/9))

## 0.1.1 to 0.1.15 - 2019-02-26

### Fixed

-   Problems with NPM publishing process

## [0.1.0] - 2019-02-26

### Added

-   All the initial code

[unreleased]: https://github.com/loadimpact/jmeter-to-k6/compare/v1.0.0...HEAD
[1.0.0]: https://github.com/loadimpact/jmeter-to-k6/compare/v0.1.18...v0.1.19
[0.1.19]: https://github.com/loadimpact/jmeter-to-k6/compare/v0.1.18...v0.1.19
[0.1.18]: https://github.com/loadimpact/jmeter-to-k6/compare/v0.1.17...v0.1.18
[0.1.17]: https://github.com/loadimpact/jmeter-to-k6/compare/v0.1.16...v0.1.17
[0.1.16]: https://github.com/loadimpact/jmeter-to-k6/compare/v0.1.0...v0.1.16
[0.1.0]: https://github.com/olivierlacan/keep-a-changelog/releases/tag/v0.1.0
