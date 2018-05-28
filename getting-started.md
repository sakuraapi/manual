# Starting a new project

## Install Sakura CLI globally

`npm install --global @sakuraapi/cli`

Test to see if you have successfully installed the sakur API CLI by running

`sapi help`

## Create a working directory

Start by creating a working directory for your project.

`mkdir example-api`

## run sapi init

`cd example init`

`sapi init`

You will go through a series of prompts to configure the project.

1. package.json preferences:
   1. Author: 

      _Your name, handle, alias, pseudonym, etc._

   2. Description: _Project description_
   3. License: _Pick a license.  If you need help visit_ [https://choosealicense.com/](https://choosealicense.com/)
   4. Project Name \(npm name\): _Project name_
   5. Version: _If you need help visit_ [http://semver.org](http://semver.org)
2. src/config/environment.ts preferences: 1. What JWT role does this server fulfill?:

   This has to do with the authentication needs of your project. Your choices are

   * **a** for audience
   * **i** for issuer
   * **n** for none
   * **H** for Help

