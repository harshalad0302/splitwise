
const { sequelize, DataTypes } = require('../db/connection');


const expensenses = sequelize.define('expensenses', {
    // Model attributes are defined here
    expen_ID: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    paid_by_UID: {
        type: DataTypes.INTEGER
        // allowNull defaults to true
    },
   
    expense_of_Group_ID: {
        type: DataTypes.INTEGER
        // allowNull defaults to true
    },
    amount: {
        type: DataTypes.INTEGER
        // allowNull defaults to true
    },
    currency: {
        type: DataTypes.STRING,
        defaultValue:"USD"
        // allowNull defaults to true
    },
    description: {
        type: DataTypes.STRING
      
        // allowNull defaults to true
    },
    date: {
        type: DataTypes.DATE
      
        // allowNull defaults to true
    }
},

    {
        tableName : 'expensenses',
        timestamps : false
    }


);

module.exports = expensenses;
