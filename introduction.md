# Introduction

This serves as the owner's manual to the SakuraApi ecosystem.

If you're reading this on [https://github.com/sakuraapi/manual](https://github.com/sakuraapi/manual), you can find a more reader friendly version at [https://sakuraapi.gitbook.io/sakuraapi/](https://sakuraapi.gitbook.io/sakuraapi/).

## Finding Things

* Github repos: [https://github.com/sakuraapi](https://github.com/sakuraapi)
* @sakuraapi/core Api documentation: [https://sakuraapi.github.io/docs-core/](https://sakuraapi.github.io/docs-core/)
*  Blog: [https://blog.sakuraapi.com/](https://blog.sakuraapi.com/)
* Github repo for this manual: [https://github.com/sakuraapi/manual](https://github.com/sakuraapi/manual)

## Goals

SakuraAPI was started in late 2016 by J.P. Poveda, who desired to create a new framework that natively took advantage of many of the emerging standards surrounding JavaScript.

Some of the features of SakuraApi include:

| Good DX \(developer experience\) | At least we'd like to think so. :\) |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Native Dependency Injection | We believe a dependency injection system is important to build testable large scale applications. |
| Cascading Configuration System | SakuraApi allows a hierarchy of configuration files written in both TypeScript and JSON to allow for easy CI/CD \(continuous integration and continuous deployment\) into multiple environments. |
| Plugin System | SakuraApi is extensible. Plugins allow you to add support for things like email/password based authentication and oAuth authentication. |
| Decorator Based DSL | SakuraApi provides a decorator based DSL \(domain specific language\) utilizing TypeScript decorators. For example, to declare a class is a model, you decorate that class with `@Model.` |
| No Legacy | SakuraApi is committed to exploiting JavaScript to its fullest as it rapidly evolves. |
| MongoDB | SakuraApi is not all things to all databases. It currently only supports MongoDB. Database Abstraction technologies are useful in trivial cases, but they can become a burden to work with in more complex scenarios because no matter how elegantly a library tries to hide the details of the underlying database, at the end of the day, MongoDB is not MySQL is not PostgreSQL. SakuraApi is currently focused on  MongoDB integration. Future versions may support a growing number of databases. |
| Micro-services Oriented | SakuraApi's ecosystem leans towards support a micro-services based philosophy. |

## Contributing

If you'd like to help improve this documentation or any part of the SakuraApi ecosystem, please sign our CLA and then open a Pull Request with your proposed changes. Ideally, you'd open an issue in the appropriate [SakuraApi Github](https://github.com/sakuraapi) project first to make sure you efforts are being coordinated with other efforts taking place: 

[![CLA assistant](https://cla-assistant.io/readme/badge/sakuraapi/manual)](https://cla-assistant.io/sakuraapi/manual)

* Sign the CLA
* Fork the repo, make your changes, then open a Pull Request
* Ideally, you should open an issue first \([https://github.com/sakuraapi/manual/issues](https://github.com/sakuraapi/manual/issues)\) and commit against that issue

