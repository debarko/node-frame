/** Strider.js
    @def: 
    @TODO: 
        [ ] auto import all controller
*/
"use strict";
global.Controller = require('./controllers/Controller.js');
// controller imports

const UserController = require('./controllers/UserController.js'),
      ArticalController  = require('./controllers/ArticalController.js');

const models = require('./dbModelLoader.js');
// 
module.exports = class Strider {
    // constructor()
    constructor(req, res, next) {
        // TODO: write validation for each parameter's value i.e. req, res...
        this.configs = {};
        this.data = {};
        this.error = {};
        this.model = {};
        this.user = {};
        this.promise = Q.defer();
        this.sessionToken = null;
        // set http request handlers
        this.configs.HTTPRequest = {
            request: req,
            response: res,
            next: next,
        };
        // db
        this.configs.models = models;
        // 
        this.steps = [];
        this.timepoint;
    }
    setUser(userData) {
        this.user = userData;
        return this;
    }
    setSessionToken(sessionToken) {
        this.sessionToken =sessionToken;
        return this;
    }
    /** Initial run method to start execution of the flow */
    setup(steps, onErrorShouldBreak) {
        Logger.dev.debug('Strider.setup()...');
        Logger.dev.debug('Get param', this.configs.HTTPRequest.request.query);
        // Copy steps object into local object
        this.steps = [];
        for (let s in steps)
            this.steps.push(steps[s]);
        this.onErrorShouldBreak = onErrorShouldBreak || false;
        return this;
    }

    // start step execution
    run() {
        Logger.dev.debug('Strider.run()...').br();
        // create timepoint
        this.timepoint = new Date();
        this.next();
        return this.promise;
    }

    /** next()
        @def: loops through each steps, one at a time in sequence, 
            and executes related controller
        @param: [void]
        @return: [Boolean] resolves promise
    */
    next() {
        Logger.dev.debug('Strider.next()')
            .debug('Time taken:', (new Date() - this.timepoint), 'ms')
            .line(30);
        // reset timepoint
        this.timepoint = new Date();
        const currentStep = this.steps.shift();
        // TODO: hack, remove this
        if (!currentStep) {
            this.configs.HTTPRequest
                .response.status(200)
                .json({
                    data: this.data,
                    error: this.error,
                    model: this.model,
                });
            // 
            this.promise.resolve(true);
            return false; // exit function from here
        }
        // 
        let steps = currentStep.name.split('.'),
            stepName = steps.shift();
        Logger.dev.debug("Found Step ", stepName);
        Logger.dev.debug("Found Step method/s: ", steps);

        // create controller instance for current step
        let controllerObj = this.findController(stepName);
        // prepare controller instance
        controllerObj
            .map(currentStep.mappedFields)
            .setSelf(currentStep.dataAccessPath);
        Logger.dev.debug("Mapped fields are: ", controllerObj.argv).br();

        /** A step can have chain of methods, add each to a queue */
        let executionQueue = Q.resolve(true);
        for (let s in steps) {
            if (steps[s] == 'GET')
                executionQueue = executionQueue.then(() => {
                    return controllerObj.GET();
                });
            else if (steps[s] == 'POST')
                executionQueue = executionQueue.then(() => {
                    return controllerObj.POST();
                });
            else if (steps[s] == 'PATCH')
                executionQueue = executionQueue.then(() => {
                    return controllerObj.PATCH();
                });
            else if (steps[s] == 'PUT')
                executionQueue = executionQueue.then(() => {
                    return controllerObj.PUT();
                });
            else if (steps[s] == 'DELETE')
                executionQueue = executionQueue.then(() => {
                    return controllerObj.DELETE();
                });
            else
                continue;
            // 
            executionQueue = executionQueue.fail((err) => {
                Logger.error("Error in executionQueue: ", err.stack || err).br();
                // stop as soon as error occurs 
                if (this.onErrorShouldBreak) {
                    this.stop();
                    return true;
                }
            });
        }
        // end of execution chain
        executionQueue.then((shouldStop) => {
            Logger.dev.debug(stepName, 'executed, Jumping to next.').br();
            if (!shouldStop)
                this.next();
        });
    }

    // stop the execution for current endpoint
    stop() {
        // TODO: set error code based on error type
        this.configs.HTTPRequest
            .response.status(501)
            .json({
                data: this.data,
                error: this.error,
                model: this.model,
            });
    }

    /** findController()
        @def: finds related controller from name,
            creates and returns controller instance
        @param: [String] name of controller
        @return: [Object] Controller
    */
    findController(controller) {
        let controllerInstance;
        switch (controller) {
            case "User":
                controllerInstance = new UserController();
                break;
            case "Artical" :
                controllerInstance = new ArticalController();
                break;

        }
        // feed data and return instance
        controllerInstance.configs = this.configs;
        controllerInstance.data = this.data;
        controllerInstance.error = this.error;
        controllerInstance.model = this.model;
        controllerInstance.user = this.user;
        controllerInstance.sessionToken = this.sessionToken;
        return controllerInstance;
    }
}





//