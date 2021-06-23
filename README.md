Startpage v3
============

Development
============

NPM Workspaces
--------------

The project uses NPM workspaces, so some stuff can be shared easily between the different applications. Thus the project requires to have `npm` version 7 or higher installed.

Steps to add a new package to a workspace:

- Create its folder under `libs/` - or in case it's created to a different folder, add its path to the `workspaces` array in the root `package.json` file.
- Make sure the new package folder has its own `package.json` and `tsconfig.json` files.
- Add a reference to the new folder in the `references` array of the root `tsconfig.json` file.
- The 'child' `tsconfig.json` should have the `composite: true` compiler option property if the compiler complaining about it.
- Make sure the name in the 'child' `package.json` file corresponds to the other packages, eg. in this case something like `@pk-start/new-package`.
- Don't forget to run `npm install` in the root project folder to create the symlink to the newly added package.

Common stuff in the `@pk-start/common` package
----------------------------------------------

The typescript code must be built before the other apps can use it. Initially the build should run together with the first `npm install` as a `postinstall` script.

Later whenever new code is added to the package, run `npm run build:common` to perform a new build.

Running the Database
--------------------

MongoDB for development is configured to run in Docker.

The `dev-db/` folder holds the `docker-compose.yml` file with the required configuration and the initializer scripts.

To start the dev database run `npm run start:db` from the root, or `docker-compose up` from the `dev-db/` directory. The data is kept using a docker volume, so as long as you don't delete the volume, it will persist.

Once the docker containers are running, Mongo-express UI can then be accessed at [http://localhost:8888](http://localhost:8888)

To remove the volume and clear the DB data, the best way is to run `npm run clear:db` from the root, `docker-compose down -v` from the `dev-db/` directory.

Running the Backend API
-----------------------
Before starting the backend, make sure there is a fresh build of the `@pk-start/common` package and that there is a `.env` file in the root directory with all the environment variables listed in the `.env.example` file.

To start the API in development mode simply run the `npm run dev:api` script, and it will be served at [http://localhost:8100](http://localhost:8100).

### API documentation
* Swagger UI documentation is available at [http://localhost:8100/api](http://localhost:8100/api)
* OpenAPI JSON can be downloaded from the [http://localhost:8100/api-json](http://localhost:8100/api-json) URL, which can be imported to Insomnia or Postman for testing.


Running the Frontend - Main
---------------------------

### Environment variables
The aim was to handle all environment variables required by all components from one central `.env` file in the root directory. However, since Angular uses its own logic of handling the environments, a little 'hack' was needed to achieve this.

Basically we need to add both `DEV` and `PROD` variables of the frontend to the same `.env` file, differentiating them with a `_DEV` and `_PROD` suffix on their names (see as in the `.env.example` file). Then the `scripts/setenv.js` script will take care of creating the proper Angular environment files according to which mode we are just running or building. This also means we must not edit manually or commit the content of the `apps/main/src/environments/` folder, as they are always automatically generated 'on the fly'.

To make use of this trick it is essential to only run or build the main frontend app as described below.

### DEV Server
To run the development server for the frontend, simply use the `npm run dev:main` script and open your browser at [http://localhost:8200](http://localhost:8200).


Deploying for production
========================

Database
--------

For production environment the database is provided by [MongoDB Atlas](https://cloud.mongodb.com/v2/60cf8035289f4f0c103690d0#clusters) under the `Start3` project. The free plan should be more than enough for this application. The connection string must be added in the `.env.prod` file for the `PK_DB_CONNECTION_STRING` key.

Backend API
-----------

### Docker
The backend project is configured to run as a Docker container. Its configuration is in the root `Dockerfile`.

Building the Docker image needs the production environment variables which should be in the `.env.prod` file in the root directory.

Before deploy, it's possible to build and run it locally, but actually not necessary.
To build and run the backend in Docker locally use the `npm run docker:build` and `npm run docker:run` scripts.

### Heroku - manual deployment
Production backend is hosted on [Heroku](https://dashboard.heroku.com/apps/pk-start/) as a Docker based application named `pk-start`, and currently using a free dyno.

To make a deploy, use the Heroku CLI. First, log in to both Heroku and the Heroku Container Registry as described [here](https://devcenter.heroku.com/articles/container-registry-and-runtime). 

Make sure the backend Docker image is working by running it locally as described above. Also make sure the production environment variables are all there in the `.env.prod` file.

To process the deployment, use the `npm run heroku:build` command to build and push the image to the container registry, and then the `npm run heroku:deploy` command to finish the deployment.

