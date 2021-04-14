const { Sequelize ,DataTypes} = require('sequelize');




const sequelize = new Sequelize('splitwise', 'root', '12345678', {
  host:'localhost',
  dialect: 'mysql'
});


try {
  sequelize.authenticate();
 console.log('Connection has been established successfully.');
} catch (error) {
 console.error('Unable to connect to the database:', error);
}

module.exports={
  Sequelize,sequelize,DataTypes
}