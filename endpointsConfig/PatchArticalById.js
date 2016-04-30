/** PatchArtical.js
    @def: Get user details and update user detail to redis server 
    @TODO: 
*/

module.exports = {
    path: "/artical/:id",
    method: 'PATCH',
    steps: [{
        name: "Artical.PATCH",
        dataAccessPath: "artical",
        mappedFields: {
            "id"   : "PATH.id",
            "data" : "PATCH.data"
        }
    }],
    onErrorShouldBreak: true,
    oath: {
        allow: ["admin","user"]
    },
    fn: null,
};