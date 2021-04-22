
// const { sequelize, DataTypes } = require('../db/connection');
// const groups = sequelize.define('groups', {
//     // Model attributes are defined here
//     groupID: {
//         type: DataTypes.INTEGER,
//         allowNull: false,
//         primaryKey: true,
//         autoIncrement: true
//     },
//     group_name: {
//         type: DataTypes.STRING
//         // allowNull defaults to true
//     }
   
   
// },

//     {
//         tableName : 'groups',
//         timestamps : false
//     }
// );

// module.exports = groups;

const mongoose = require('mongoose')
const GroupSchema = new mongoose.Schema({
    groupID: {
        type: Number
    },
    group_name: {
        type: String
    }
}, {
    timestamps: true
})

const groups = mongoose.model('groups', GroupSchema)
module.exports = groups