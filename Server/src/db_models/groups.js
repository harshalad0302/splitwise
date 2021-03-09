
const { sequelize, DataTypes } = require('../db/connection');


const groups = sequelize.define('groups', {
    // Model attributes are defined here
    groupID: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    group_name: {
        type: DataTypes.STRING
        // allowNull defaults to true
    },
    group_creater_UID: {
        type: DataTypes.INTEGER
        // allowNull defaults to true
    }
   
},

    {
        tableName : 'groups',
        timestamps : false
    }


);

module.exports = groups;
