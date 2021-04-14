
// const { sequelize, DataTypes } = require('../db/connection');


// const personal_expenditure_ows = sequelize.define('personal_expenditure_ows', {
//     // Model attributes are defined here
//     UID: {
//         type: DataTypes.INTEGER,
//         allowNull: false,
       
//     },
//     GroupID: {
//         type: DataTypes.INTEGER
       
//     },
//     amount_ows: {
//         type: DataTypes.INTEGER
//         // allowNull defaults to true
//     },
//     amount_ows_to_UID: {
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
//         tableName : 'personal_expenditure_ows',
//         timestamps : false
//     }


// );

// module.exports = personal_expenditure_ows;

const mongoose = require('mongoose')

const personal_expenditure_owsSchema = new mongoose.Schema({
    UID: {
        type: Number
    },
    GroupID: {
        type: Number
    },
    amount_ows: {
        type: Number
        
    },
    amount_ows_to_UID: {
        type: Number
    },
    expen_ID: {
        type: Number
    }

}, {
    timestamps: true
})


const personal_expenditure_ows = mongoose.model('personal_expenditure_ows', personal_expenditure_owsSchema)
module.exports = personal_expenditure_ows