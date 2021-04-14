
// const { sequelize, DataTypes } = require('../db/connection');
// const personal_expenditure_get = sequelize.define('personal_expenditure_get', {
//     // Model attributes are defined here
//     UID: {
//         type: DataTypes.INTEGER,
//         allowNull: false,
       
//     },
//     GroupID: {
//         type: DataTypes.INTEGER
       
//     },
//     amount_gets: {
//         type: DataTypes.INTEGER
//         // allowNull defaults to true
//     },
//     amount_gets_from_UID: {
//         type: DataTypes.INTEGER
//         // allowNull defaults to true
//     },
//     expen_ID: {
//         type: DataTypes.INTEGER
//         // allowNull defaults to true
//     },
//     id: {
//         type: DataTypes.INTEGER,
//         primaryKey: true
//         // allowNull defaults to true
//     }
   
   
// },

//     {
//         tableName : 'personal_expenditure_get',
//         timestamps : false
//     }


// );

// module.exports = personal_expenditure_get;

const mongoose = require('mongoose')

const personal_expenditure_getSchema = new mongoose.Schema({
    UID: {
        type: Number
    },
    GroupID: {
        type: Number
    },
    amount_gets: {
        type: Number
        
    },
    amount_gets_from_UID: {
        type: Number
    },
    expen_ID: {
        type: Number
    }

}, {
    timestamps: true
})
const personal_expenditure_get = mongoose.model('personal_expenditure_get', personal_expenditure_getSchema)
module.exports = personal_expenditure_get