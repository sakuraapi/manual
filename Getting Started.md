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
    
  
    
