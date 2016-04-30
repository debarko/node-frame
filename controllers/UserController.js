/** UserController.js
*/

"use strict";

module.exports = class UserController extends Controller {

    constructor(...args) {
        super(...args);
    }

    // 
    GET() {
        Logger.log("UserController.GET().... called");

        let UserModel = this.configs.models.User;
        let userIds = this.argv.ids;
        let data = [];
        let filter = {};

        if (!_.isUndefined(userIds)) {
            if (!_.isArray(userIds)) {
                userIds = [userIds];
            }
            filter = {
                where: {
                    id: {
                        $in: userIds
                    }
                }
            };
        } else {
            filter = {};
        }
        return UserModel.findAll(filter).then((users) => {
            for (let i = 0; i < users.length; i++) {
                data.push(users[i].get({
                    plain: true
                }));
            }
            this.setData('data', data);
        });
    }

    //
    POST() {
        Logger.log("UserController.POST().... called");

        let UserModel = this.configs.models.User;
        let userFields = Object.keys(UserModel.attributes);
        let userInstance = UserModel.build({});

        //traverse each field of userModel and sets if field exist in argv
        for (let i in userFields) {
            let field = userFields[i];
            let el = this.argv[field];
            if (!_.isUndefined(el)) {
                userInstance[field] = el;
            }
        }
        return userInstance.save()
            .then((user) => {
                Logger.dev.log('User created', user.get());
                this.setData('data', user.get());
                this.setData('userId', user.id);
            }).catch((err) => {
                Logger.error("Error while creating User");
                if (!!err.errors) {
                    this.setError(err);
                } else {
                    this.setError(err.message);
                }
                throw new Error(err);
            });
    }

}

// end