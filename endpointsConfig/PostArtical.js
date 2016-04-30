/** PostArtical.js
    @def: Get user details and update user detail to redis server 
    @TODO: 
*/

module.exports = {
    path: "/artical",
    method: 'POST',
    steps: [{
        name: "Artical.POST",
        dataAccessPath: "artical",
        mappedFields: {
            "data" : "POST.data"
        }
    }],
    onErrorShouldBreak: true,
    oath: {
        allow: ["admin","user"]
    },
    fn: null,
};