
const { sequelize, DataTypes } = require('../db/connection');


const personal_expenditure_ows = sequelize.define('personal_expenditure_ows', {
    // Model attributes are defined here
    UID: {
        type: DataTypes.INTEGER,
        allowNull: false,
       
    },
    GroupID: {
        type: DataTypes.INTEGER
       
    },
    amount_ows: {
        type: DataTypes.INTEGER
        // allowNull defaults to true
    },
    amount_ows_to_UID: {
        type: DataTypes.INTEGER
        // allowNull defaults to true
    },
    expen_ID: {
        type: DataTypes.INTEGER
        // allowNull defaults to true
    },
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true
        // allowNull defaults to true
    }
   
   
},

    {
        tableName : 'personal_expenditure_ows',
        timestamps : false
    }


);

module.exports = personal_expenditure_ows;
