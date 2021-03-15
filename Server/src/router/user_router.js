const express = require("express");
const sequelize = require('../db/connection.js');
const users = require('../db_models/users');
const groups = require('../db_models/groups');
const invitations = require('../db_models/invitations');
const router = new express.Router();
const { QueryTypes, where } = require('sequelize');
const { Sequelize } = require('sequelize');

router.post('/signup', async (req, res) => {


  if (req.body.emailid === "" || req.body.password === "" || req.body.name === "") {
    result = {
      auth_flag_email: "F"
    }

    res.status(200).send(result);
  }

  else {
    const found_data = await users.findOne({ where: { emailid: req.body.emailid } });
    if (found_data === null) {
      console.log('Not found!');
      //inserting data
      await users.create(req.body, { fields: ["name", "emailid", "password"] });

      const data_after_insert = await users.findOne({ where: { emailid: req.body.emailid } });

      console.log("data after insert", data_after_insert)

      result = {
        auth_flag_email: "S",
        name: req.body.name,
        emailid: req.body.emailid,
        UID: data_after_insert.UID,
        phone_number: req.body.phone_number
      }

      res.status(200).send(result);

    }

    else {


      result = {
        auth_flag_email: "Femail_already",
        error_message: "Email id is already present"
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
    updated_state: updated_state

  }

  res.status(200).send(result_edit);




});



//Api-----Create_group
router.post('/Create_group', async (req, res) => {

  const found_group_name = await groups.findOne({ where: { group_name: req.body.group_name } });
  if (found_group_name !== null) {
    result_group_name = {
      group_name_already_p_f: "F",
      error_messgae: "Group name is already present"
    }

    res.status(200).send(result_group_name);

  }
  else {
    //inserting data in database
    await groups.create({ group_name: req.body.group_name })
    //get the group_id from the inserted value
    const created_group_id = await groups.findOne({ where: { group_name: req.body.group_name } });
    for (var i = 0; i < req.body.length; i++) {
      //get the UID
      var UID_for_group_member = await users.findOne({ where: { emailid: req.body.emailid_of_members[i] } })
      // console.log("UID is ------",UID_for_group_member.UID)
      // console.log("invite_from_group_id is ------",created_group_id.groupID)
      invitations.create({ UID: UID_for_group_member.UID, invite_from_group_id: created_group_id.groupID })
    }

    //sending response to frontend
    result_group_name = {
      group_name_already_p_f: "S"
     
    }

    res.status(200).send(result_group_name);

  
  }


});


router.post('/dashboard_req', async (req, res) => {

  const count_invitations= await invitations.count(
    {where:{
      UID:req.body.UID,
      accept:"NA"
    }}
    )

  const invitations_array=await invitations.findAll({attributes:['invite_from_group_id'],where:{UID:req.body.UID,accept:"NA"} } )
  
  var group_names =[]
  var group_ids=[]

for(var i=0;i<count_invitations;i++)
{
 
   group_names.push(await groups.findOne({attributes:['group_name'],where:{groupID:invitations_array[i].dataValues.invite_from_group_id} }))
   group_ids.push(invitations_array[i])
}

//count already accepted 
const count_invitations_accepted= await invitations.count(
  {where:{
    UID:req.body.UID,
    accept:"ACCEPT"
  }}
  )
//get invitation id for accpted 
const invitations_array_accepted=await invitations.findAll({attributes:['invite_from_group_id'],where:{UID:req.body.UID,accept:"ACCEPT"} } )

//temp array
var group_names_accpeted =[]
var group_ids_accepted=[]

//pushing values in them
for(var i=0;i<count_invitations_accepted;i++)
{
 
  group_names_accpeted.push(await groups.findOne({attributes:['group_name'],where:{groupID:invitations_array_accepted[i].dataValues.invite_from_group_id} }))
  group_ids_accepted.push(invitations_array_accepted[i])
}

result_data ={
  group_ids:group_ids,
  group_ids_accepted:group_ids_accepted,
  group_names:group_names,
  group_names_accpeted:group_names_accpeted,
  count_invitations:count_invitations,
  count_invitations_accepted:count_invitations_accepted
}

res.status(200).send(result_data);
});

//dashboard_reject_req

router.post('/dashboard_reject_req', async (req, res) => {

 console.log("data is ",req.body)

  //update in table 

  console.log("req.body.current_UID is ",req.body.current_UID)
  console.log("req.body.group_ids_to_be_rejected is ",req.body.group_ids_to_be_rejected)

 await  invitations.update({
    accept: "REJECT"
   }, {
    where: { UID:req.body.current_UID  ,
       invite_from_group_id:req.body.group_ids_to_be_rejected}
   })
   res.status(200)
 
});


router.post('/dashboard_accept_req', async (req, res) => {

  await  invitations.update({
    accept: "ACCEPT"
   }, {
    where: { UID:req.body.current_UID  ,
       invite_from_group_id:req.body.accepted_group_id}
   })

   res.status(200)
 });

module.exports = router