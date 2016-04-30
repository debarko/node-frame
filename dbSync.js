/** dbSync.js
    @def: 
    @TODO: 
        - 
*/
"use strict";

global.ARGV = new(require('./lib/argv.js'))(__dirname);
global.CONFIG = require('./lib/configLoader.js');
var models = require("./dbModelLoader");

models.sequelize.sync();
