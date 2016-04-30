/** server.js
    @def: 
    @TODO: 
        - 
*/
"use strict";

// Globally available Object/Modules
global.ARGV = new(require('./lib/argv.js'))(__dirname);
// 
global.CONFIG = require('./lib/configLoader.js');
global.Logger = new(require('./lib/logger.js'))();
global.authenticationUtils = require('./lib/authenticationUtils.js');
global.express = require('express');
global.Q = require('kew');
global._ = require("underscore");
global.httpRequest = require("request");
global.fs = require('fs');
global.temp = require('temp');
global.Sequelize = require('sequelize');
// 
Logger.msg.initializing();
Logger.dev.info("Configurations loaded: ");
Logger.dev.json(CONFIG);

// Constant Modules
const app = express(),
    http = require('http'),
    // 
    cookieParser = require('cookie-parser'),
    session = require('express-session'),
    MemcachedStore = require('connect-memcached')(session),
    bodyParser = require('body-parser'),
    // for parsing multipart/form-data
    // 
    portScanner = require('./lib/portscanner.js'),
    skipper = require('skipper');
// curatorAPI = require('./curatorAPIRouter.js'),

app.use(skipper());

// Bodyparser for parsing application/json and application/x-www-form-urlencoded
app.use(bodyParser.json());
// for parsing application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({
    extended: true
}));

// Create Session and Cookie
app.use(cookieParser());
app.use(session({
    secret: 'CatOnKeyboard',
    key: 'NodeFrame',
    proxy: false,
    cookie: {
        secure: CONFIG.NodeFrame.Cookie.secure || false,
        maxAge: CONFIG.NodeFrame.Cookie.maxAge || 1000 * 60 * 60 * 24,
    },
    store: new MemcachedStore({
        hosts: [`${CONFIG.Memcached.host}:${CONFIG.Memcached.port}`]
    }),
    resave: true, // auto save of sassion
    // don't save cookies with each request, if not logged in.
    saveUninitialized: true,
    // reset cookie expiry on each request
    rolling: true,
}));

// Find available port and Start server
portScanner.findAPortNotInUse(
    CONFIG.NodeFrame.ports,
    CONFIG.NodeFrame.host, (error, port) => {
        if (error)
            process.exit(1);
        // Start server on available port
        app.listen(port, () => {
            Logger.log('Server started on ', port, '...');
        });
    }
);

// set routes

let curatorAPI = require('./curatorAPIRouter.js');
app.use('/api/v1/', curatorAPI);