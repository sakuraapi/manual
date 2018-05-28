# Introduction

This serves as the owners manual to the SakuraApi ecosystem.

If you're reading this on [https://github.com/sakuraapi/manual](https://github.com/sakuraapi/manual), you can find a more reader friendly version at [https://sakuraapi.gitbook.io/sakuraapi/](https://sakuraapi.gitbook.io/sakuraapi/).

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

