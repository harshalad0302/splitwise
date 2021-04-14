
// const { sequelize, DataTypes } = require('../db/connection');
// var Sequelize = require('sequelize');

// const recentactivities = sequelize.define('recentactivities', {
//     // Model attributes are defined here
//     id: {
//         type: DataTypes.INTEGER,
//         allowNull: false,
//         primaryKey: true,
//         autoIncrement: true
//     },
//     GroupID: {
//         type: DataTypes.INTEGER
//         // allowNull defaults to true
//     },
   
//     groupname: {
//         type: DataTypes.STRING
//         // allowNull defaults to true
//     },
//     activity: {
//         type: DataTypes.STRING
//         // allowNull defaults to true
//     },
//     //UID
//     UID: {
//         type: DataTypes.INTEGER
        
//     },

//     date_time:{
//         type:Sequelize.DATE
//     }
    
  
// },

//     {
//         tableName : 'recentactivities',
//        timestamps : false
//     }


// );

// module.exports = recentactivities  ;


const mongoose = require('mongoose')
const RecentActivitiesSchema = new mongoose.Schema({
    GroupID: {
        type: Number
    },
    groupname: {
        type: String
    },
    activity: {
        type: String
        
    },
    UID: {
        type: Number
    },
    date_time: {
        type: Date
    }

}, {
    timestamps: true
})


const recentactivities = mongoose.model('recentactivities', RecentActivitiesSchema)
module.exports = recentactivities