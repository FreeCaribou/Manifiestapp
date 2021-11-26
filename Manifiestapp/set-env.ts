const fs = require('fs');// Configure Angular `environment.ts` file path
const targetPath = './src/environments/environment.ts';// Load node modules
require('dotenv').config();// `environment.ts` file structure
const envConfigFile = `export const environment = {
   apiBaseUrl: '${process.env.API_BASE_URL || ''}',
   apiUrl: '${process.env.API_URL || ''}',
   nodeEnv: '${process.env.NODE_ENV || 'dev'}',
   production: '${process.env.PRODUCTION || false}',
   dataMock: '${process.env.DATA_MOCK || true}'
};
`;
console.log('The file `environment.ts` will be written with the following content: \n');
console.log(envConfigFile); fs.writeFile(targetPath, envConfigFile, function (err) {
  if (err) {
    throw console.error(err);
  } else {
    console.log(`Angular environment.ts file generated correctly at ${targetPath} \n`);
  }
});