
// const { sequelize, DataTypes } = require('../db/connection');
// const expensenses = sequelize.define('expensenses', {
//     // Model attributes are defined here
//     expen_ID: {
//         type: DataTypes.INTEGER,
//         allowNull: false,
//         primaryKey: true,
//         autoIncrement: true
//     },
//     paid_by_UID: {
//         type: DataTypes.INTEGER
//         // allowNull defaults to true
//     },
   
//     expense_of_Group_ID: {
//         type: DataTypes.INTEGER
//         // allowNull defaults to true
//     },
//     amount: {
//         type: DataTypes.INTEGER
//         // allowNull defaults to true
//     },
//     currency: {
//         type: DataTypes.STRING,
//         defaultValue:"USD"
//         // allowNull defaults to true
//     },
//     description: {
//         type: DataTypes.STRING
      
//         // allowNull defaults to true
//     },
//     date: {
//         type: DataTypes.DATE
      
//         // allowNull defaults to true
//     }
// },

//     {
//         tableName : 'expensenses',
//         timestamps : false
//     }


// );

// module.exports = expensenses;

const mongoose = require('mongoose')
const expensesSchema = new mongoose.Schema({
    expen_ID: {
        type: Number
    },
    paid_by_UID: {
        type: Number
    },
    name_of_UID_who_paid: {
        type: String
    },
    expense_of_Group_ID:{
        type:Number
    },
    amount:{
        type:Number
    },
    description:{
        type:String
    },
    date_time:{
        type:Date
    }
    
}, {
    timestamps: true
})

const expenses = mongoose.model('expenses', expensesSchema)
module.exports = expenses
