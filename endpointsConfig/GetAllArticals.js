/** GetAllArticals.js
    @def: Get user details and update user detail to redis server 
    @TODO: 
*/

module.exports = {
    path: "/articals",
    method: 'GET',
    steps: [{
        name: "Artical.GET",
        dataAccessPath: "articals",
        mappedFields: {}
    }],
    onErrorShouldBreak: true,
    oath: {
        allow: ["admin"]
    },
    fn: null,
};