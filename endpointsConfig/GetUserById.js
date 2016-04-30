/** GetUsersById.js
    @def: Get user details and update user detail to redis server 
    @TODO: 
*/

module.exports = {
    path: "/user/:id",
    method: 'GET',
    steps: [{
        name: "User.GET",
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