## Structure of the CLI output
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

##### /src/api/config.api.ts
This is a default __api__ created to show status.  If you run `npm start`, you can navigate to http://localhost:8001/api and see 
```
{
server: "example-api",
serverUp: true
}
```
where ___example-api___ is the name of the project you are scaffolding.  

A close examination of this file will show that, all request methods, __PUT__, __POST__, __GET__, __DELETE__, etc, are handled with the same handler. 
Different behavior, based on the method, will require their own handlers.  

##### /src/api/
#### /spec