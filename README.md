PKStart API
===========

Running the Database
--------------------

MongoDB for development is configured to run in Docker.

The `docker/dev-db/` folder holds the `docker-compose.yml` file with the required configuration and the initializer scripts.

To start the dev database run `npm run start:db` from the root, or `docker-compose up` from the `dev-db/` directory. The data is kept using a docker volume, so as long as you don't delete the volume, it will persist.

Once the docker containers are running, Mongo-express UI can then be accessed at [http://localhost:8888](http://localhost:8888)

To remove the volume and clear the DB data, the best way is to run `npm run clear:db` from the root, `docker-compose down -v` from the `dev-db/` directory.

### Seeding
Seed data can be added to the DB by the `npm run db:seed` command. For this you need to have a `.seed-data.json` file in the repository root folder. This file is ignored from git.

Seed data can be cleaned using the `npm run db:clean` command. (Each new seed run will also clean the previous data, so no need to run the clean command separately.)

Running the Backend API
-----------------------

### Common code in the `pks-common` repository
Types, interfaces and utils common to all PKStart applications are stored in the `pks-common` [repository](https://github.com/PKStart/pks-common). The code is added to each app's repo as an NPM package directly from Github by the following command:
```shell
npm install git+https://github.com/PKStart/pks-common.git
```
Make sure to reinstall and update this package whenever the common code changes. Use the `npm run update:common` command for this.

### Environment variables
Before starting the backend, make sure there is `.env` file in the root directory with all the environment variables listed in the `.env.example` file.

### DEV Server
To start the API in development mode simply run the `npm run start:dev` script, and it will be served at [http://localhost:8100](http://localhost:8100).

### API documentation
* Swagger UI documentation is available at [http://localhost:8100/api](http://localhost:8100/api)
* OpenAPI JSON can be downloaded from the [http://localhost:8100/api-json](http://localhost:8100/api-json) URL, which can be imported to Insomnia or Postman for testing.


CI pipelines and testing
------------------------

### Github actions
Github action workflows are set up for code quality checks, build and testing. These pipelines are triggered on each push and pull request for the `develop` and `master` branches, and also can be started manually on Github on any branch.

* `code-check-build.yml`: This workflow is responsible for linting, format check and to make sure that builds are passing for each component.
* `api-e2e.yml`: Runs the backend API e2e and integration tests in a fully dockerized environment.

Testing locally
---------------

### Code quality checks
Husky is set up to run the linter and check code formatting before each commit.
These checks however can also be run using the `npm run lint` and `npm run format:check` commands for the entire repository.

### API e2e / integration tests
API tests can run in two ways:
* Against the actual dev environment using the `npm run test:e2e` command, in this case make sure a database is also running
* In a dockerized environment using the `npm run test:docker` command


Deploying for production
========================

Database
--------

For production environment the database is provided by [MongoDB Atlas](https://cloud.mongodb.com/v2/60cf8035289f4f0c103690d0#clusters) under the `Start3` project. The free plan should be more than enough for this application. The connection string must be added in the `.env.prod` file for the `PK_DB_CONNECTION_STRING` key.

Backend API
-----------

### Docker, Fly.io
Production backend is hosted on [Fly.io](https://fly.io/apps/pk-start) as a Docker based application named `pk-start`, and currently using a free plan.

The backend project is configured to run as a Docker container. Its configuration is in the root `Dockerfile.prod-local`.

Building the Docker image needs the production environment variables which should be in the `.env.prod` file in the root directory.

Before deploy, it's possible to build and run it locally, but actually not necessary.
To build and run the backend in Docker locally use the `npm run docker:build` and `npm run docker:run` scripts.

### Fly.io Automatic deployment
Automatic deployment is set up using Github Actions in the `api-deploy.yml` file under the workflows folder. For simplicity this action uses the root `Dockerfile` to build the API image. 

The process will automatically run by pushing to the `master` branch or can be started manually on Github with the dispatch action. 

Non-sensitive environment variables are stored in the `fly.toml` config file, others are on Fly.io under the app's secrets. For more info about setting up secrets see the [Fly.io docs](https://fly.io/docs/reference/secrets/).

### Fly.io Manual deployment
To make a deployment, use the Fly.io `flyctl` CLI, which can be downloaded from [here](https://fly.io/docs/getting-started/installing-flyctl/). 
Don't forget to log in to Fly.io (using Github OAuth): 
```
flyctl auth login
```
More info [here](https://fly.io/docs/flyctl/). 

Make sure the backend Docker image is working by running it locally as described above. Also make sure the production environment variables are all there in the `.env.prod` file.

To process the deployment, use the `npm run fly:deploy` command. This will use the `fly.local.toml` configuration file which is a bit different from the one used by Github actions.


