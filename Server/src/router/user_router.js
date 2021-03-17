const express = require("express");
const sequelize = require('../db/connection.js');
const users = require('../db_models/users');
const groups = require('../db_models/groups');
const expensenses = require('../db_models/expensenses');
const invitations = require('../db_models/invitations');
const router = new express.Router();
const { QueryTypes, where } = require('sequelize');
const { Sequelize } = require('sequelize');
const personal_expenditure_get = require('../db_models/personal_expenditure_get');
const personal_expenditure_ows = require('../db_models/personal_expenditure_ows');

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


  if (found_data_login === null) {


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

    //put the owner in the group
    invitations.create({ UID: req.body.owner_id, invite_from_group_id: created_group_id.groupID,accept:"ACCEPT" })

    //sending response to frontend
    result_group_name = {
      group_name_already_p_f: "S"

    }

    res.status(200).send(result_group_name);


  }


});


router.post('/dashboard_req', async (req, res) => {

  const count_invitations = await invitations.count(
    {
      where: {
        UID: req.body.UID,
        accept: "NA"
      }
    }
  )

  const invitations_array = await invitations.findAll({ attributes: ['invite_from_group_id'], where: { UID: req.body.UID, accept: "NA" } })

  var group_names = []
  var group_ids = []

  for (var i = 0; i < count_invitations; i++) {

    group_names.push(await groups.findOne({ attributes: ['group_name'], where: { groupID: invitations_array[i].dataValues.invite_from_group_id } }))
    group_ids.push(invitations_array[i])
  }

  //count already accepted 
  const count_invitations_accepted = await invitations.count(
    {
      where: {
        UID: req.body.UID,
        accept: "ACCEPT"
      }
    }
  )
  //get invitation id for accpted 
  const invitations_array_accepted = await invitations.findAll({ attributes: ['invite_from_group_id'], where: { UID: req.body.UID, accept: "ACCEPT" } })

  //temp array
  var group_names_accpeted = []
  var group_ids_accepted = []

  //pushing values in them
  for (var i = 0; i < count_invitations_accepted; i++) {

    group_names_accpeted.push(await groups.findOne({ attributes: ['group_name'], where: { groupID: invitations_array_accepted[i].dataValues.invite_from_group_id } }))
    group_ids_accepted.push(invitations_array_accepted[i])
  }

  result_data = {
    group_ids: group_ids,
    group_ids_accepted: group_ids_accepted,
    group_names: group_names,
    group_names_accpeted: group_names_accpeted,
    count_invitations: count_invitations,
    count_invitations_accepted: count_invitations_accepted
  }

  res.status(200).send(result_data);
});

//dashboard_reject_req

router.post('/dashboard_reject_req', async (req, res) => {

  console.log("data is ", req.body)

  //update in table 



  await invitations.update({
    accept: "REJECT"
  }, {
    where: {
      UID: req.body.current_UID,
      invite_from_group_id: req.body.group_ids_to_be_rejected
    }
  })
  res.status(200)

});


router.post('/dashboard_accept_req', async (req, res) => {

  await invitations.update({
    accept: "ACCEPT"
  }, {
    where: {
      UID: req.body.current_UID,
      invite_from_group_id: req.body.accepted_group_id
    }
  })

  res.status(200)
});

//get_users_in_group

router.post('/get_users_in_group', async (req, res) => {

  const UID = req.body.current_UID
  const Group_ID = req.body.group_id
  const group_name = req.body.group_name

  //get all the UID who have accepted the invitation of this group

const UID_accepeted_invitation = await invitations.findAll({ attributes: ['UID'], where: { invite_from_group_id: Group_ID, accept: "ACCEPT" } })

 
  //get the count 

  const count_no_of_members = await invitations.count(
    {
      where: {
        invite_from_group_id: Group_ID,
        accept: "ACCEPT"
      }
    }
  )

  //temp array
  var UID_of_members = []
  var Name_of_members = []
  //pushing values in them
  for (var i = 0; i < count_no_of_members; i++) {
    UID_of_members.push(UID_accepeted_invitation[i])
    Name_of_members.push(await users.findOne({ attributes: ['name'], where: { UID: UID_accepeted_invitation[i].dataValues.UID } }) )
  }

//also display the expenses of the group on page

const expense_ids_for_this_group = await expensenses.findAll({ attributes: ['expen_ID'], where: { expense_of_Group_ID: Group_ID} })
const expense_amount_for_this_group=await expensenses.findAll({ attributes: ['amount'], where: { expense_of_Group_ID: Group_ID} })
const expense_description=await expensenses.findAll({ attributes: ['description'], where: { expense_of_Group_ID: Group_ID} })
const expense_paid_by_UID=await expensenses.findAll({ attributes: ['paid_by_UID'], where: { expense_of_Group_ID: Group_ID} })

//get the name of user who paid

let user_name_who_paid=[]

for(var i=0;i<expense_paid_by_UID.length;i++)
{
  
  user_name_who_paid.push(await users.findOne({ attributes: ['name'], where: { UID:expense_paid_by_UID[i].dataValues.paid_by_UID} }))
}

const arr_expense_gets=[]
const arr_expenses_ows=[]

    for(var i=0;i<count_no_of_members;i++)
    {
      //console.log("UID_of_members [] ",UID_of_members[i].dataValues.UID)
      let amount_this_UID_ows=await personal_expenditure_ows.sum('amount_ows',{where:{UID:UID_of_members[i].dataValues.UID}} )
      let amount_this_UID_gets=await personal_expenditure_get.sum('amount_gets',{where:{UID:UID_of_members[i].dataValues.UID}} )
      let name_of_UID=await users.findOne({ attributes: ['name'], where: { UID: UID_of_members[i].dataValues.UID} })
      arr_expense_gets.push({name :name_of_UID.dataValues ,UID:UID_of_members[i].dataValues.UID ,amount_gets:amount_this_UID_gets})
      arr_expenses_ows.push({name :name_of_UID.dataValues,UID:UID_of_members[i].dataValues.UID ,amount_ows:amount_this_UID_ows})


    }

    console.log("arr_expense is ",arr_expense_gets)
    console.log("arr_expense_ows is ",arr_expenses_ows)

//assign and sent
result_data={
  UID_of_members:UID_of_members,
  Name_of_members:Name_of_members,
  count_no_of_members:count_no_of_members,
  expense_ids_for_this_group:expense_ids_for_this_group,
  expense_amount_for_this_group:expense_amount_for_this_group,
  expense_description:expense_description,
  expense_paid_by_UID:expense_paid_by_UID,
  user_name_who_paid:user_name_who_paid,
  arr_expense_gets:arr_expense_gets,
  arr_expenses_ows:arr_expenses_ows


}


  res.status(200).send(result_data);


});

//get_all_email
router.post('/get_all_email', async (req, res) => {

  const all_emails = await users.findAll({ attributes: ['emailid']})
  res.status(200).send(all_emails);
});


router.post('/Expense_add', async (req, res) => {

console.log("data we are getting ",req.body)
await expensenses.create(req.body, { fields: ["paid_by_UID", "expense_of_Group_ID", "amount","currency","description"] });
//get the expense id of latest inserted transction 
const expense_id_of_inserted_transcation=await expensenses.max('expen_ID')
//get the number of members in the group

const no_of_members=await invitations.count(
  {
    where: {
      invite_from_group_id: req.body.expense_of_Group_ID,
      accept: "ACCEPT"
    }
  }
)//get the UID_in_group
const UID_in_group=await invitations.findAll({ attributes: ['UID'], where: { invite_from_group_id: req.body.expense_of_Group_ID ,  accept: "ACCEPT"} })
const each_split=req.body.amount/no_of_members
const amount_owner_gets=each_split*(no_of_members-1)
console.log("each_split is ",each_split)
console.log("no_of_members is ",no_of_members)

for(var i=0;i<no_of_members;i++)
{

  console.log("UID_in_group are ",UID_in_group[i].dataValues.UID)
  
  if(UID_in_group[i].dataValues.UID!==req.body.paid_by_UID)
  {
    await personal_expenditure_get.create({UID:req.body.paid_by_UID,GroupID:req.body.expense_of_Group_ID,amount_gets:each_split,amount_gets_from_UID:UID_in_group[i].dataValues.UID,expen_ID:expense_id_of_inserted_transcation})
    await personal_expenditure_ows.create({UID:UID_in_group[i].dataValues.UID,GroupID:req.body.expense_of_Group_ID,amount_ows:each_split,amount_ows_to_UID:req.body.paid_by_UID,expen_ID:expense_id_of_inserted_transcation})
  }
}
//

//adding in personal expenditure gets column



//personal expenditure ows



  res.status(200);
});



module.exports = router