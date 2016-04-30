/** GetArticalById.js
    @def: Get user details and update user detail to redis server 
    @TODO: 
*/

module.exports = {
    path: "/artical/:id",
    method: 'GET',
    steps: [{
        name: "Artical.GET",
        dataAccessPath: "user",
        mappedFields: {
            "ids" :"PATH.id"
        }
    }],
    onErrorShouldBreak: true,
    oath: {
        allow: ["admin","user"]
    },
    fn: null,
};