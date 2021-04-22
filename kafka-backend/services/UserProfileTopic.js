
const users = require('../db_models/users');
const groups = require('../db_models/groups');
const comments = require('../db_models/comments')
const expenses = require('../db_models/expenses');
const invitations = require('../db_models/invitations');
const recentactivities = require('../db_models/recentactivities')

exports.userService = function (msg, callback) {
  console.log("In companyProfileService - path:", msg.path);
  switch (msg.path) {
    case "login":
      login(msg, callback);
      break;
  }
};

async function login(msg, callback) {
 
  let req = {}
  req.body = msg.body

 let result = {}
  var auth_flag = "S"
  var message = []
  if (req.body.emailid === "") {
    auth_flag = "F"
    message.push("Emailid field is empty")
  }
  if (req.body.password === "") {
    auth_flag = "F"
    message.push("Password field is empty")
  }

  if (req.body.emailid !== "" && req.body.password !== "") {
    //check if emailid is present or not
    //  const found_data_login = await users.findOne({ where: { emailid: req.body.emailid } });
    const found_data_login = await users.findOne({ emailid: req.body.emailid });

    if (found_data_login === null) {
      auth_flag = "F"
      message.push("Emailid is not present ! please login")
      result = {
        auth_flag: auth_flag,
        message: message,
        message_length: message.length
      }
     // res.status(200).send(result);
     return callback(null,result)
    }
    else {

      //now emailid is present check for password
     

      if (req.body.password === found_data_login.password) {
        
        result = {
          auth_flag: auth_flag,
          name: found_data_login.name,
          emailid: found_data_login.emailid,
          UID: found_data_login.UID,
          phone_number: found_data_login.phone_number,
          message: message,
          profile_photo: found_data_login.profile_photo

        }
       
        //res.status(200).send(result);
        return callback(null,result)
      }
      else {
        //invalid password
        message.push("Invalid Password")
        result = {
          auth_flag: "F",
          message: message,
          message_length: message.length
        }
        //res.status(200).send(result);
        return callback(null,result)
      }
    }

  }
  else {
    result = {
      auth_flag: auth_flag,
      message: message,
      message_length: message.length
    }
  //  res.status(200).send(result);
    return callback(null,result)
  }

}
