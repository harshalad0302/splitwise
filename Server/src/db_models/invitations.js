
const { sequelize, DataTypes } = require('../db/connection');


const invitations = sequelize.define('invitations', {
    // Model attributes are defined here
    UID: {
        type: DataTypes.INTEGER

    },
    invite_from_group_id: {
        type: DataTypes.INTEGER
        // allowNull defaults to true
    },
    accept: {
        type: DataTypes.STRING,
       defaultValue:"NA"
      
    },
    id:{
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    }
   
   
},

    {
        tableName : 'invitations',
        timestamps : false
    }


);

module.exports = invitations;
