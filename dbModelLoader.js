/** dbModelLoader.js
    @def: Creates db connection, and loads all sequilize models in memory
    @TODO: 
        - 
*/
"use strict";

var fs = require("fs");
var path = require("path");
// NOTE: it's global
var Sequelize = require("sequelize");
var sequelize = new Sequelize(
    CONFIG.Mysql.database,
    CONFIG.Mysql.username,
    CONFIG.Mysql.password, {
        host: CONFIG.Mysql.host,
        dialect: 'mysql',
        pool: {
            max: (CONFIG.Mysql.pool || {}).max || 5,
            min: (CONFIG.Mysql.pool || {}).min || 0,
            idle: (CONFIG.Mysql.pool || {}).idle || 10000
        },

        logging: (str) => {
            console.log('SEQUALIZE: ', str, '\n\n');
        }
    }
);

var db = {};

fs
    .readdirSync(ARGV.DIR.HOME + "/db_models")
    .filter((file) => {
        return (file.indexOf(".") !== 0) && (file !== "dbModelLoader.js");
    })
    .forEach((file) => {
        let model = sequelize.import(path.join(ARGV.DIR.HOME + "/db_models", file));
        let name = model.name;
        name = String.fromCharCode((name.charCodeAt(0) - 32)) + name.substr(1);
        db[name] = model;
    });

Object.keys(db).forEach((modelName) => {
    if ("associate" in db[modelName]) {
        db[modelName].associate(db);
    }
});

db.sequelize = sequelize;
db.DataTypes = Sequelize;

module.exports = db;