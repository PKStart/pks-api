const { writeFile } = require("fs");

require("dotenv").config({ path: ".env" });

const environments = ["DEV", "PROD"];

const variables = ["PK_TEST", "PK_API_URL"];

const paths = {
  DEV: "./apps/main/src/environments/environment.ts",
  PROD: "./apps/main/src/environments/environment.prod.ts",
};

// PK_TEST: '${process.env[isProd ? "PK_TEST_PROD" : "PK_TEST_DEV"]}',
//   PK_API_URL: '${process.env[isProd ? "PK_API_URL_PROD" : "PK_API_URL_DEV"]}'

environments.forEach((env) => {
  const isProd = env === "PROD";
  let variableList = "";
  variables.forEach((key) => {
    variableList += `  ${key}: '${process.env[key + "_" + env]}',\n`;
  });
  const content = `
export const environment = {
  production: ${isProd},
${variableList}
}
  `;
  writeFile(paths[env], content, (err) => {
    if (err) {
      console.log(
        `[setenv] Error while setting frontend ${env} environment variables:`,
        err
      );
    }
    console.log(`[setenv] Wrote ${env} environment variables to ${paths[env]}`);
  });
});
