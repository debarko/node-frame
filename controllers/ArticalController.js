/** ArticalController.js
*/

"use strict";

module.exports = class ArticalController extends Controller {

    constructor(...args) {
        super(...args);
    }

    // 
    GET() {
        Logger.log("ArticalController.GET().... called");

        let ArticalModel = this.configs.models.Artical;
        let articalIds = this.argv.ids;
        let data = [];
        let filter = {};

        if (!_.isUndefined(articalIds)) {
            if (!_.isArray(articalIds)) {
                articalIds = [articalIds];
            }
            filter = {
                where: {
                    id: {
                        $in: articalIds
                    }
                }
            };
        } else {
            filter = {};
        }
        return ArticalModel.findAll(filter).then((articals) => {
            for (let i = 0; i < articals.length; i++) {
                data.push(articals[i].get({
                    plain: true
                }));
            }
            this.setData('data', data);
        });
    }

    //
    POST() {
        Logger.log("ArticalController.POST().... called");

        let ArticalModel = this.configs.models.Artical;
        let articalFields = Object.keys(ArticalModel.attributes);
        let articalInstance = ArticalModel.build({});

        //traverse each field of articalModel and sets if field exist in argv
        for (let i in articalFields) {
            let field = articalFields[i];
            let el = this.argv[field];
            if (!_.isUndefined(el)) {
                articalInstance[field] = el;
            }
        }
        articalInstance.userId = this.user.id;
        return articalInstance.save()
            .then((artical) => {
                Logger.dev.log('Artical created', artical.get());
                this.setData('data', artical.get());
                this.setData('articalId', artical.id);
            }).catch((err) => {
                Logger.error("Error while creating Artical");
                if (!!err.errors) {
                    this.setError(err);
                } else {
                    this.setError(err.message);
                }
                throw new Error(err);
            });
    }

    PATCH() {
        Logger.log("ArticalController.POST().... called");

        let ArticalModel = this.configs.models.Artical;
        
        let id = this.argv.id;
        let data = this.argv.data;

        return ArticalModel.findOne({
            where : {
                id : id
            }
        }).then((articalInstance)=>{
            if (articalInstance) {
                articalInstance.data = data;
                articalInstance.save();
                this.setData('data',articalInstance.get());
                this.setData('articalId',id);
            } else {
                this.setError("invalid artical Id");
            }
        }).catch((err)=>{
                Logger.error("Error while Modifying Artical");
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