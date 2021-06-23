const { writeFile } = require("fs");
const { argv } = require("yargs");

// read environment variables from .env file
require("dotenv").config({ path: ".env" });

// read the command line arguments passed with yargs
const env = argv.env;
const isProduction = env === "prod";
const targetPath = isProduction
  ? `./apps/main/src/environments/environment.prod.ts`
  : `./apps/main/src/environments/environment.ts`;

const testVar = isProduction
  ? process.env.PK_TEST_PROD
  : process.env.PK_TEST_DEV;

const apiUrl = isProduction
  ? process.env.PK_API_URL_PROD
  : process.env.PK_API_URL_DEV;

// we have access to our environment variables
// in the process.env object thanks to dotenv
const environmentFileContent = `
export const environment = {
   production: ${isProduction},
   PK_TEST: '${testVar}',
   PK_API_URL: '${apiUrl}'
}
`;

// write the content to the respective file
writeFile(targetPath, environmentFileContent, (err) => {
  if (err) {
    console.log("Error while setting frontend environment variables:", err);
  }
  console.log(`Wrote environment variables to ${targetPath}`);
});
