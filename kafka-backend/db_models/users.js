
// const { sequelize, DataTypes } = require('../db/connection');


// const users = sequelize.define('users', {
//     // Model attributes are defined here
//     UID: {
//         type: DataTypes.INTEGER,
//         allowNull: false,
//         primaryKey: true,
//         autoIncrement: true
//     },
//     name: {
//         type: DataTypes.STRING
//         // allowNull defaults to true
//     },
//     password: {
//         type: DataTypes.STRING
//         // allowNull defaults to true
//     },
//     emailid: {
//         type: DataTypes.STRING
//         // allowNull defaults to true
//     },
//     phone_number: {
//         type: DataTypes.STRING
//         // allowNull defaults to true
//     },
    
//     profile_photo:{
//         type:DataTypes.BLOB
//     }
   
// },

//     {
//         tableName : 'users',
//         timestamps : false
//     }


// );

// module.exports = users;

const mongoose = require('mongoose')
const SecretKey = "mysecretissplitwise"
var jwt = require('jsonwebtoken');
const userSchema = new mongoose.Schema({
    UID: {
        type: Number
    },
    name: {
        type: String
    },
    emailid: {
        type: String,
        unique: true
    },
    password: {
        type: String
    },
    profile_photo: {
        type: Buffer
    },
    phone_number: {
        type: Number
    },
    u_tokens:[{
        token:{
            type:String
        }
    }]

}, {
    timestamps: true
})


//generate jwt token
//generate jwt token
userSchema.methods.generateAuthToken = async function () {
    const users = this
    const token = jwt.sign(users.emailid,SecretKey)
    users.u_tokens = users.u_tokens.concat({token:token})
    await users.save()
    return token

}


const users = mongoose.model('users', userSchema)
module.exports = users