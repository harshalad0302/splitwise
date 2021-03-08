const express = require("express");
const sequelize = require('../db/connection.js');
const users = require('../db_models/users');
const router = new express.Router();
const { Sequelize } = require('sequelize');

router.post('/signup', async (req, res) => {


  if(req.body.emailid===""||req.body.password===""||req.body.name==="")
{
  result = {
    auth_flag_email: "F"
  }

  res.status(200).send(result);
}

else
{
  const found_data = await users.findOne({ where: { emailid: req.body.emailid } });
  if (found_data === null) {
    console.log('Not found!');
    //inserting data
    await users.create(req.body, { fields: ["name", "emailid", "password"] });

  const data_after_insert = await users.findOne({ where: { emailid: req.body.emailid } });

  console.log("data after insert",data_after_insert)

    result = {
      auth_flag_email: "S",
      name: req.body.name,
      emailid: req.body.emailid,
      UID:data_after_insert.UID,
      phone_number: req.body.phone_number
    }

    res.status(200).send(result);

  }

  else {


    result = {
      auth_flag_email: "Femail_already",
      error_message:"Email id is already present"
    }

    res.status(200).send(result);
  }

}

 

});


router.post('/Login', async (req, res) => {

  const found_data_login = await users.findOne({ where: { emailid: req.body.emailid } });
  // console.log("----------------",req.body);
  // console.log("---------------",found_data_login.emailid);
  // console.log("---------------",found_data_login.password);

  // console.log("---------------",found_data_login.phone_numebr);

  if (found_data_login === null) {
    //console.log('Not found!');

    result_login = {
      auth_flag_email_login: "F",
      error_messgae: "Email id is not present,please sign up"
    }

    res.status(200).send(result_login);

  }
  else {
    //email id is present , need to check the password
    //get password from database

    if (req.body.password === found_data_login.password) {
      result_login = {
        auth_flag_email_login: "S",
        name: found_data_login.name,
        emailid: found_data_login.emailid,
        UID: found_data_login.UID,
        phone_number: found_data_login.phone_number

      }
      res.status(200).send(result_login);
    }
    else {
      result_login = {
        auth_flag_email_login: "F",
        error_messgae: "incorrect password"
      }

      res.status(200).send(result_login);
    }


  }


});





router.post('/profile', async (req, res) => {

  //const found_data1 = await users.findOne({ where: { UID: req.body.UID } });
  // console.log("-----------",req.body.name);
  // console.log("-----------", found_data1.UID);

  console.log("-----------", req.body.emailid);

  if (req.body.emailid !== "") {
    await users.update({ emailid: req.body.emailid },
      { where: { UID: req.body.UID } })

  }

  if (req.body.phone_number !== "") {
    await users.update({ phone_number: req.body.phone_number },
      { where: { UID: req.body.UID } })
  }
  if (req.body.name !== "") {
    await users.update({ name: req.body.name },
      { where: { UID: req.body.UID } })
  }



  const updated_state = await users.findOne({ where: { UID: req.body.UID } });

  result_edit = {
    auth_flag_edit: "S",
    updated_state:updated_state

  }

  res.status(200).send(result_edit);


  

});



module.exports = router