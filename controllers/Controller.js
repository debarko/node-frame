/** Controller.js
    @def: Parent controller, all other controller extends this
    @TODO: 
        - 
*/
"use strict";

const Utill = require('../lib/utill.js');

module.exports = class Controller {
    constructor() {
        Logger.dev.debug('Controller.constructor()....');
        this.configs = {};
        this.data = {};
        this.error = {};
        this.model = {};
        this.user = {};
        this.profileToken = null;
    }

    /** Identify and Set self block for child controller */
    setSelf(dataAccessPath) {
        this.dataAccessPath = dataAccessPath;
        Utill.ArrayLib.createPath(this.data, dataAccessPath);
        Utill.ArrayLib.createPath(this.configs, dataAccessPath);
        Utill.ArrayLib.createPath(this.error, dataAccessPath);
        Utill.ArrayLib.createPath(this.model, dataAccessPath);
        return this;
    }

    // Setters: key is optional. key can be name.name.name...
    // ----------
    setData(key, data) {
        // key is an optional argument
        if (arguments.length == 1) {
            data = key;
            key = '';
        }
        var path = this.dataAccessPath;
        if (!!key)
            path += '.' + key;
        Utill.ArrayLib.resolvePathThenSet(this.data, path, data);
        return this;
    }

    setError(key, error) {
        // key is an optional argument
        if (arguments.length == 1) {
            error = key;
            key = '';
        }
        var path = this.dataAccessPath;
        if (!!key)
            path += '.' + key;
        Utill.ArrayLib.resolvePathThenSet(this.error, path, error);
        return this;
    }

    setModel(key, model) {
        // key is an optional argument
        if (arguments.length == 1) {
            model = key;
            key = '';
        }
        var path = this.dataAccessPath;
        if (!!key)
            path += '.' + key;
        Utill.ArrayLib.resolvePathThenSet(this.model, path, model);
        return this;
    }

    setDataArgv(key, value) {
        this.argv[key] = value;
        return this;
    }


    /** Mapping request fields list from request to this object
        for easy access via child controller */
    map(mappedFields) {
        this.argv = {};
        for (let i in mappedFields) {
            let path = mappedFields[i].split('.');
            let p1 = path.shift(),
                targetObj;
            if (p1 == "POST")
                targetObj = this.configs.HTTPRequest.request.body;
            else if (p1 == "PATCH")
                targetObj = this.configs.HTTPRequest.request.body;
            else if (p1 == "GET")
                targetObj = this.configs.HTTPRequest.request.query;
            else if (p1 == "PATH")
                targetObj = this.configs.HTTPRequest.request.params;
            else if (p1 == "DELETE")
                targetObj = this.configs.HTTPRequest.request.body;
            else if (p1 == "DATA")
                targetObj = this.data;
            else if (p1 == "ERROR")
                targetObj = this.error;
            else if (p1 == "MODEL")
                targetObj = this.model;
            else if (p1 == "USER")
                targetObj = this.user;
            else
                continue;
            this.argv[i] = Utill.ArrayLib.resolvePath(targetObj, path);
        }
        return this;
    }
}
















// end
