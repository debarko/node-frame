/** GetAllUsers.js
    @def: Get user details and update user detail to redis server 
    @TODO: 
*/

module.exports = {
    path: "/users",
    method: 'GET',
    steps: [{
        name: "User.GET",
        dataAccessPath: "user",
        mappedFields: {}
    }],
    onErrorShouldBreak: true,
    oath: {
        allow: ["admin"]
    },
    fn: null,
};