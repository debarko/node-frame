/** curatorAPI.js
    @def: 
    @TODO: 
        [ ] add user Oath
        [ ] 
*/
"use strict"
// imports
const router = express.Router(),
    Strider = require('./Strider.js'),
    GetAllUsersApi = require('./endpointsConfig/GetAllUsers.js'),
    GetUserByIdApi = require('./endpointsConfig/GetUserById.js'),
    GetAllArticalsApi = require('./endpointsConfig/GetAllArticals.js'),
    GetArticalByIdApi = require('./endpointsConfig/GetArticalById.js'),
    PostArticalApi = require('./endpointsConfig/PostArtical.js'),
    PatchArticalByIdApi = require('./endpointsConfig/PatchArticalById.js');

/** API end-point list and config */
const EndPoints = [
    GetAllUsersApi,
    GetUserByIdApi,
    GetAllArticalsApi,
    GetArticalByIdApi,
    PostArticalApi,
    PatchArticalByIdApi
];

/** A factory method which creates a function from given configs
    to handle an API endpoint and returns the same. */
const getAPIHandler = (endpointConfig) => {
    if (endpointConfig.fn && typeof endpointConfig.fn == 'function')
        return endpointConfig.fn(endpointConfig);
    // else
    return function(...requestParam) {
        Logger.log(requestParam[0]);
        // TODO: check for oath permissions over here
        let allowdRoles = endpointConfig.oath.allow;
        
        let sessionToken = requestParam[0].headers['session-token'];

        authenticationUtils
            .checkAuthorization(sessionToken, allowdRoles)
            .then((authorized) => {
                if (authorized.authenticated) {
                    new Strider(...requestParam)
                        .setUser(authorized.user)
                        .setSessionToken(sessionToken)
                        .setup(this.steps, this.onErrorShouldBreak)
                        .run()
                        .then(() => {
                            Logger.dev.debug('promise resolved by Strider...');
                        });
                } else {
                    requestParam[1].status(401)
                        .send({
                            "status": "401",
                            "error": {
                                "message": "UnAuthorized"
                            }
                        });
                }
            }).fail((err) => {
                Logger.error("-->", err);
            });
    }.bind(endpointConfig);
};


/** Middle-ware for curatorAPI router
    @def: add all common checks over here,
        it gets call before assigned endpoint function
*/
router.use((req, res, next) => {
    Logger.dev.debug('Router Middleware, Time: ', Date.now());
    next();
});

/** Attach API handler function to each API end-point from the list */
for (let i in EndPoints) {
    let endPoint = EndPoints[i];
    Logger.dev.debug('registering end point: ', endPoint.method, endPoint.path);
    // Convert path into an array of path, if provided a string
    if (typeof endPoint.path == 'string') {
        endPoint.path = [endPoint.path];
    }
    // 
    for (let i in endPoint.path) {
        let path = endPoint.path[i];
        if (endPoint.method == 'GET')
            router.get(path, getAPIHandler(endPoint));
        else if (endPoint.method == 'POST')
            router.post(path, getAPIHandler(endPoint));
        else if (endPoint.method == 'PATCH')
            router.patch(path, getAPIHandler(endPoint));
        else if (endPoint.method == 'DELETE')
            router.delete(path, getAPIHandler(endPoint));
    }

}

// Exports
module.exports = router;




//