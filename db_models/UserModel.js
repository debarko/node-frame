/** UserModel.js
    @def: 
    @TODO: 
        - 
*/
"use strict";
module.exports = (sequelize, DataTypes) => {
    var User = sequelize.define('user', {

        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            comment: `Unique id for each User`
        },
        username: {
            type: DataTypes.STRING,
            allowNull: false,
            unique:true,
            comment: "user's name"
        },
        role: {
            type: DataTypes.STRING,
            allowNull: false,
            comment: "user's role"
        },
        sessionToken : {
            type: DataTypes.STRING,
            allowNull:false,
            comment: "user's auth token"
        }
    }, {
        timestamps: true,
        paranoid: true,
        createdAt: 'createdAt',
        updatedAt: 'updatedAt',
        deletedAt: 'deletedAt',
        freezeTableName: true,
        classMethods: {
            associate: (models) => {
                User.hasMany(models.Artical, {
                    as: "articals",
                    foreignKey: 'userId'
                });
            }
        }
    });
    return User;
}