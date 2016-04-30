/** ArticalModel.js
    @def: 
    @TODO: 
        - 
*/
"use strict";
module.exports = (sequelize, DataTypes) => {
    var Artical = sequelize.define('artical', {

        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            comment: `Unique id for each Artical`
        },
        userId : {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        data: {
            type: DataTypes.TEXT('long'),
            allowNull: false,
            comment: "Artical's name"
        }
    }, {
        timestamps: true,
        paranoid: true,
        createdAt: 'createdAt',
        updatedAt: 'updatedAt',
        deletedAt: 'deletedAt',
        freezeTableName: true,
    });
    return Artical;
}