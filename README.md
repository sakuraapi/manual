# Introduction

This is the "official" manual for SakuraAPI and it's ecosystem of utilities and plugins.

## Goals

SakuraAPI was started in late 2016 by J.P. Poveda, who desired to create a new framework that natively took advantage of many of the emerging standards surrounding JavaScript.

Some of the features of SakuraAPI include:

|||
|----|----|
|Good DX (developer experience)|Or so we'd like to think...|
|Native Dependency Injection|We believe a dependency injection system is important to building testable large scale applications.|
|Cascading Configuration System|SakuraApi should allow easy configuration for multiple target environments such that a portion of the configuration can be shared by all environments and specific settings can be overriden for a particular environment. We believe this is essential for supporting a robust CI/CD system|
|Plugin System|It should be easy to add plugins that enhance SakuraAPI, like support for oAuth or email authentication.|
|Decorators based API|Because we think this makes for a better DX|

Some fluffier objectives include:

|||
|----|----|
|Light Express Wrapper|SakuraApi should be as helpful as it can be, but it should quickly get out of the way when you need to do something it can't. If you know Express, SakuraApi will not interfere if you want to implement something outside of SakuraApi or if you want to utilize existing middleware.|
|Familiarity for Angular Developers|We use silmilar concepts like decorators and providers and constructor based dependency injection.|
|No legacy|We are committed to exploiting the potential of the rapidly evolving standards of the JavaScript / TypeScript community.|
|Commitment to MongoDB|Database Abstraction technologies are useful in most trivial cases but often become a burden to non-trivial implementations. We are primarily focused on supporting MongoDB at the moment. We believe that your deep knowledge of MongoDB should be directly exploitable when using SakuraApi. If SakuraApi doesn't allow for some MongoDB feature natively, it allows you to work directly with MongoDB without penalty.|
|Micro-services Oriented|SakuraApi's eco-system leans towards supporting micro-services architectures|


## Contributing
[![CLA assistant](https://cla-assistant.io/readme/badge/sakuraapi/manual)](https://cla-assistant.io/sakuraapi/manual)

* Sign the CLA
* Fork the repo, make your changes, then open a Pull Request
* Ideally, you should open an issue first (https://github.com/sakuraapi/manual/issues) and commit against that issue

## Content
* Tutorial 1: [My First API](tutorials/Tutorial-001.md)
* Tutorial 2: [Adding a Service](tutorials/Tutorial-002.md)
* Tutorial 3: [Adding a model](tutorials/Tutorial-003.md)
* [Getting Started](Getting%20Started.md)
* [Walk throguh the output of the CLI](Directory%20Structure.md)


 