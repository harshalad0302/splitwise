
const { sequelize, DataTypes } = require('../db/connection');


const users = sequelize.define('users', {
    // Model attributes are defined here
    UID: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: DataTypes.STRING
        // allowNull defaults to true
    },
    password: {
        type: DataTypes.STRING
        // allowNull defaults to true
    },
    emailid: {
        type: DataTypes.STRING
        // allowNull defaults to true
    },
    phone_number: {
        type: DataTypes.STRING
        // allowNull defaults to true
    }
   
},

    {
        tableName : 'users',
        timestamps : false
    }


);

module.exports = users;
