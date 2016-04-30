/** authenticationUtils.js
    @def: Checks for profileToken existance in redis and validates user role
    @TODO: 
*/
"use strict"
//var Q = require("kew");
const models = require('../dbModelLoader.js');

function checkAuthorization(profileToken, roles) {
    return verifyUserRoleFromRedis(profileToken, roles);
}
var verifyUserRoleFromRedis = function(key, values) {
    let promise = Q.defer();
    if (!(values instanceof Array)) {
        values = [values];
    }

    if (values.indexOf("all") >= 0) {
        promise.resolve({authenticated:true,user:null});
        return promise;
    }

    let UserModel = models.User;
    
    UserModel.findOne({
        where : {
            sessionToken : key
        }
    }).then((user)=>{
        if (user) {
            let plainData = user.get({plain:true});
            let role = user.role;
            if (values.indexOf(role)>=0) {
                promise.resolve({authenticated:true,user:plainData});
            } else {
                promise.resolve({authenticated:false,user:null});
            }
        } else {
            promise.resolve({authenticated:false,user:null});
        }
    }).catch((err)=>{
            promise.resolve({authenticated:false,user:null});
    });

    return promise;
}

module.exports.checkAuthorization = checkAuthorization;