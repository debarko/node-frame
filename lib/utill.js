/** Controller.js
    @def: Parent controller, all other controller extends this
    @TODO: 
        - 
*/
"use strict";
let ArrayLib = {};

// 
ArrayLib.resolvePath = function(array, path) {
    if (!array)
        return null;
    path = path || '';
    if (typeof path != 'object')
        path = path.split('.');
    // 
    let pointer = array;
    for (let i in path) {
        let p = path[i];
        if (!!pointer.hasOwnProperty(p))
            pointer = pointer[p];
        else
            return undefined;
    }
    return pointer;
}

// 
ArrayLib.resolvePathThenSet = function(array, path, data) {
    if (!array || !data)
        return null;
    path = path || '';
    if (typeof path != 'object')
        path = path.split('.');
    // path - 1
    let toPath = path.pop();
    // 
    let pointer = array;
    for (let i in path) {
        let p = path[i];
        if (!!pointer.hasOwnProperty(p))
            pointer = pointer[p];
        else
            return undefined;
    }
    // set value to deepest level
    pointer[toPath] = data;
    return array;
}

// 
ArrayLib.createPath = function(array, path) {
    path = path || '';
    if (typeof path != 'object')
        path = path.split('.');
    // 
    let pointer = array || {};
    for (let i in path) {
        let p = path[i];
        if (!pointer.hasOwnProperty(p))
            pointer[p] = {};
        pointer = pointer[p];
    }
    return array;
}

module.exports.ArrayLib = ArrayLib;
