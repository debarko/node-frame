/** configLoader.js
    @def: Loads configs from config.sample.json then
    	overwrites configs from local config.json then
    	overwrites configs from cli argv
    @TODO: 
        [x] overwrite with config.sample.json
        [ ] overwrite with argv config
        [ ] Use deep copy for overwritting config
*/
"use strict"
const HOME_DIR = ARGV.DIR.HOME;
const localConfig = require(HOME_DIR + '/config.json'),
    sampleConfig = require(HOME_DIR + '/config.sample.json');

// ---------------------------------------
// Merge configs
// ---------------------------------------
let config = {};
// Load ideal prod settings
for (let i in sampleConfig['PROD_ENV'])
    config[i] = sampleConfig['PROD_ENV'][i];
// overwrite ideal current ENV settings
for (let i in sampleConfig[ARGV.ENV])
    config[i] = sampleConfig[ARGV.ENV][i];
// 
// overwrite local settings
for (let i in localConfig['PROD_ENV'])
    config[i] = localConfig['PROD_ENV'][i];
// overwrite current ENV settings
for (let i in localConfig[ARGV.ENV])
    config[i] = localConfig[ARGV.ENV][i];


// exports
module.exports = config;
