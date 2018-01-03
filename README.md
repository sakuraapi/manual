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

## Starting a new project
### Install Sakura CLI globally
`npm install --global @sakuraapi/cli`

Test to see if you have successfully installed the sakur API CLI by running 

`sapi help`
### Create a working directory
Start by creating a working directory for your project.

`mkdir example-api`
### run sapi init
`cd example init`

`sapi init`

You will go through a series of prompts to configure the project.  

1. package.json preferences:
    1. Author: 
_Your name, handle, alias, pseudonym, etc._
    1. Description: _Project description_
    1. License: _Pick a license.  If you need help visit <https://choosealicense.com/>_
    1. Project Name (npm name): _Project name_
    1. Version: _If you need help visit <http://semver.org>_
2. src/config/environment.ts preferences:
    1. What JWT role does this server fulfill?: 
    
    This has to do with the authentication needs of your project.  Your choices are 
    * __a__ for audience
    * __i__ for issuer
    * __n__ for none
    * __H__ for Help
    
    For the sake of this example, we will choose _none_.  For a description of what
    the issuer and the audience does, see corresponding projects 
    [auth-native-authority](https://github.com/sakuraapi/auth-native-authority) and   
    [auth-audience](https://github.com/sakuraapi/auth-audience_)
    
## Walk through the output of the CLI
### files created by the CLI
#### package.json
Every app needs a package.json.  The CLI pre-populates this with the dependencies Sakura API is expecting.   
#### tslint.json, tsconfig.json, tsconfig.spec.json
These three files are _typescript_ configuration files.  
They will set the standard lint and compiler configurations for your project.  
The CLI produces a recommended set of settings, but you are welcome to make changes.  
For more about these files, read 
(https://www.typescriptlang.org/docs/handbook/tsconfig-json.html)
(https://palantir.github.io/tslint/usage/tslint-json/)
#### /docker/local-test.yml
This file is the YML configuration file used by docker compose to build a test container for your project.  
As a minimum, this build puts a blank mongoDB instance for your API to use.  We use a blank one in our test environment
 when developing so that old data does not create artifacts that will corrupt the test.  
 
This file is used by the script found in ___scripts/docker:local-compose-up.sh___. 

This file is also used to shut down a container when a `docker-compose down` command is executed.  More commonly this is run from the 
command `npm run docker:local-compose-down`
#### /scripts/build.sh
This file is run when the command `npm run build` is executed.  At its core, it compiles the typescript code into the 
`/dist/` folder ready to be packaged into a docker container.  

#### /scripts/docker:local-compose-up.sh
This file is run when the command `npm run docker:local-compose-up`.  Defunct containers are pruned from the system and
a new container based on the ___local-test.yml___ file is run.  This will be active until `npm run docker:local-compose-down` is run.  

#### /scripts/install.sh
This is a placeholder for later.

#### /scripts/nodemon.sh and /scripts/start.sh
These files are run when the command `npm start` is executed.  A container is created with a new ___/dist/___ directory.  
The node server from the ___/dist/___ directory starts and listens on the specified port (defaults to 8001).  

Additional reading found at (https://nodemon.io/)

#### /scripts/test.sh
This file is run when the command `npm run test` is executed.  A container is created with a test environment running. 
That means the build directory for this environment is based on the ___tsconfig.spec.json___ file instead of the ___tsconfig.json___.  
The Jasmine tests are run.  When the tests are completed, the container is shut down.  

#### /scripts/test:db.sh
This file is run when the command `npm run test:db` is executed.  
This is the same as the ___test.sh___ script except for two notable differences.  First, the container is not closed at the end of the Jasmine run.
Second, the build is based on the ___tsconfig.json___ file instead of the ___tsconfig.spec.json___  
#### /src
This directory will be where the bulk of the source code for your new Sakura API project will live.  A more in depth 
description of where pieces go can be found below.  

A few notes about what the CLI scaffolds for you.  

#### /src/api/config.api.ts
This is a default __api__ created to show status.  If you run `npm start`, you can navigate to http://localhost:8001/api and see 
```
{
server: "example-api",
serverUp: true
}
```
where ___example-api___ is the name of the project you are scaffolding.  


 
#### /spec

 