# Startpage v3

## Development

### NPM Workspaces

The project uses NPM workspaces, so some stuff can be shared easily between the different applications. Thus the project requires to have `npm` version 7 or higher installed.

Steps to add a new package to a workspace:
- Create its folder under `libs/` - or in case it's created to a different folder, add its path to the `workspaces` array in the root `package.json` file.
- Make sure the new package folder has its own `package.json` and `tsconfig.json` files.
- Add a reference to the new folder in the `references` array of the root `tsconfig.json` file.
- The 'child' `tsconfig.json` must have the `composite: true` compiler option property.
- Make sure the name in the 'child' `package.json` file corresponds to the other packages, eg. in this case something like `@pk-start/new-package`.
- Don't forget to run `npm install` in the root project folder to create the symlink to the newly added package.

### Common stuff in the `@pk-start/common` package

The typescript code must be built before the other apps can use it. Initially the build should run together with the first `npm install` as a `postinstall` script.

Later whenever new code is added to the package, run `npm run build:common` to perform a new build.

### Running the Database

MongoDB for development is configured to run in Docker.

The root `docker-compose.yml` file holds the required configuration and in the `dev-db/` folder there are the initializer scripts.

To start the dev database either run `npm run start:db` or `docker-compose up`. The data is kept using a docker volume, so as long as you don't delete the volume, it will persist. 

Once the docker containers are running, Mongo-express UI can then be accessed at [http://localhost:8888](http://localhost:8888)

To remove the volume and clear the DB data, the best way is to run `npm run clear:db` or `docker-compose down -v`. 
