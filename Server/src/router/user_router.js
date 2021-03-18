const express = require("express");
const sequelize = require('../db/connection.js');
const users = require('../db_models/users');
const groups = require('../db_models/groups');
const expensenses = require('../db_models/expensenses');
const invitations = require('../db_models/invitations');
const recentactivities = require('../db_models/recentactivities')
const router = new express.Router();
const { QueryTypes, where } = require('sequelize');
const { Sequelize } = require('sequelize');
const personal_expenditure_get = require('../db_models/personal_expenditure_get');
const personal_expenditure_ows = require('../db_models/personal_expenditure_ows');
const { findAll } = require("../db_models/users");
const { Json } = require("sequelize");

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

      //inserting data
      await users.create(req.body, { fields: ["name", "emailid", "password"] });

      const data_after_insert = await users.findOne({ where: { emailid: req.body.emailid } });



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
        auth_flag_email: "F",
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

    //--------------------------
    let owner = req.body.owner
    let group_name_this = req.body.group_name
    let activity = "user " + JSON.stringify(owner) + "created a group " + JSON.stringify(group_name_this)
    //adding in recent activity 
    await recentactivities.create({ GroupID: created_group_id.groupID, groupname: req.body.group_name, activity: activity, UID: req.body.owner_id, date_time: Sequelize.fn('NOW') })
    //--------------------------
    for (var i = 0; i < req.body.length; i++) {
      //get the UID
      var UID_for_group_member = await users.findOne({ where: { emailid: req.body.emailid_of_members[i] } })
      invitations.create({ UID: UID_for_group_member.UID, invite_from_group_id: created_group_id.groupID })
      let name_of_user_invited = await users.findOne({ attributes: ['name'], where: { UID: UID_for_group_member.UID } })
      //--------------------------
      //recent activity sent invitation to 
      let invite_activity = "user " + JSON.stringify(req.body.owner) + " sent group invite of " + JSON.stringify(req.body.group_name) + " to " + JSON.stringify(name_of_user_invited.name)


      await recentactivities.create({
        GroupID: created_group_id.groupID,
        groupname: req.body.group_name,
        activity: invite_activity,
        UID: req.body.owner_id,
        date_time: Sequelize.fn('NOW')
      })
      //--------------------------
    }

    //put the owner in the group
    invitations.create({ UID: req.body.owner_id, invite_from_group_id: created_group_id.groupID, accept: "ACCEPT" })

    //sending response to frontend
    result_group_name = {
      group_name_already_p_f: "S"

    }

    res.status(200).send(result_group_name);


  }


});


router.post('/group_page_invite', async (req, res) => {

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

router.post('/group_invite_reject_req', async (req, res) => {



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


router.post('/group_invite_accept_req', async (req, res) => {

  await invitations.update({
    accept: "ACCEPT"
  }, {
    where: {
      UID: req.body.current_UID,
      invite_from_group_id: req.body.accepted_group_id
    }
  })

  //---------------------
  //add to recent activitiies
  let activity_insert = "user " + JSON.stringify(req.body.current_UID_name) + " joined the group " + JSON.stringify(req.body.accepted_group_name)
  console.log("activity_insert --------", activity_insert)

  await recentactivities.create({
    GroupID: req.body.accepted_group_id,
    groupname: req.body.accepted_group_name,
    activity: activity_insert,
    UID: req.body.current_UID,
    date_time: Sequelize.fn('NOW')
  })


  //---------------------
  result = {
    acceped_for_group: req.body.accepted_group_id
  }
  res.status(200).send(result)
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
    Name_of_members.push(await users.findOne({ attributes: ['name'], where: { UID: UID_accepeted_invitation[i].dataValues.UID } }))
  }

  //also display the expenses of the group on page

  const expense_ids_for_this_group = await expensenses.findAll({ attributes: ['expen_ID'], where: { expense_of_Group_ID: Group_ID } })
  const expense_amount_for_this_group = await expensenses.findAll({ attributes: ['amount'], where: { expense_of_Group_ID: Group_ID } })
  const expense_description = await expensenses.findAll({ attributes: ['description'], where: { expense_of_Group_ID: Group_ID } })
  const expense_paid_by_UID = await expensenses.findAll({ attributes: ['paid_by_UID'], where: { expense_of_Group_ID: Group_ID } })

  //get the name of user who paid

  let user_name_who_paid = []

  for (var i = 0; i < expense_paid_by_UID.length; i++) {

    user_name_who_paid.push(await users.findOne({ attributes: ['name'], where: { UID: expense_paid_by_UID[i].dataValues.paid_by_UID } }))
  }

  const arr_expense_gets = []
  const arr_expenses_ows = []

  for (var i = 0; i < count_no_of_members; i++) {

    let amount_this_UID_ows = await personal_expenditure_ows.sum('amount_ows', { where: { UID: UID_of_members[i].dataValues.UID, GroupID: Group_ID } })
    let amount_this_UID_gets = await personal_expenditure_get.sum('amount_gets', { where: { UID: UID_of_members[i].dataValues.UID, GroupID: Group_ID } })
    let name_of_UID = await users.findOne({ attributes: ['name'], where: { UID: UID_of_members[i].dataValues.UID } })
    arr_expense_gets.push({ name: name_of_UID.dataValues, UID: UID_of_members[i].dataValues.UID, amount_gets: amount_this_UID_gets })
    arr_expenses_ows.push({ name: name_of_UID.dataValues, UID: UID_of_members[i].dataValues.UID, amount_ows: amount_this_UID_ows })


  }



  //assign and sent
  result_data = {
    UID_of_members: UID_of_members,
    Name_of_members: Name_of_members,
    count_no_of_members: count_no_of_members,
    expense_ids_for_this_group: expense_ids_for_this_group,
    expense_amount_for_this_group: expense_amount_for_this_group,
    expense_description: expense_description,
    expense_paid_by_UID: expense_paid_by_UID,
    user_name_who_paid: user_name_who_paid,
    arr_expense_gets: arr_expense_gets,
    arr_expenses_ows: arr_expenses_ows


  }


  res.status(200).send(result_data);


});

//get_all_email
router.post('/get_all_email', async (req, res) => {

  const all_emails = await users.findAll({ attributes: ['emailid'] })
  res.status(200).send(all_emails);
});


router.post('/Expense_add', async (req, res) => {


  await expensenses.create(req.body, { fields: ["paid_by_UID", "expense_of_Group_ID", "amount", "currency", "description"] });
  //get the expense id of latest inserted transction 
  const expense_id_of_inserted_transcation = await expensenses.max('expen_ID')
  //--------------------
  //Recent activity
  let recent_activity_expense_added = "user " + JSON.stringify(req.body.name_of_UID_paid) + " added the new expense " + JSON.stringify(req.body.description) + " of " + JSON.stringify(req.body.amount) + "USD in the group " + JSON.stringify(req.body.name_of_group_ID)
 
  await recentactivities.create({
    GroupID: req.body.expense_of_Group_ID,
    groupname: req.body.name_of_group_ID,
    activity: recent_activity_expense_added,
    UID: req.body.paid_by_UID,
    date_time: Sequelize.fn('NOW')
  })


  //--------------------

  //get the number of members in the group

  const no_of_members = await invitations.count(
    {
      where: {
        invite_from_group_id: req.body.expense_of_Group_ID,
        accept: "ACCEPT"
      }
    }
  )//get the UID_in_group
  const UID_in_group = await invitations.findAll({ attributes: ['UID'], where: { invite_from_group_id: req.body.expense_of_Group_ID, accept: "ACCEPT" } })
  const each_split = req.body.amount / no_of_members
  const amount_owner_gets = each_split * (no_of_members - 1)

  for (var i = 0; i < no_of_members; i++) {

    if (UID_in_group[i].dataValues.UID !== req.body.paid_by_UID) {
      await personal_expenditure_get.create({ UID: req.body.paid_by_UID, GroupID: req.body.expense_of_Group_ID, amount_gets: each_split, amount_gets_from_UID: UID_in_group[i].dataValues.UID, expen_ID: expense_id_of_inserted_transcation })
      await personal_expenditure_ows.create({ UID: UID_in_group[i].dataValues.UID, GroupID: req.body.expense_of_Group_ID, amount_ows: each_split, amount_ows_to_UID: req.body.paid_by_UID, expen_ID: expense_id_of_inserted_transcation })
    }
  }

  res.status(200);
});

//dashboard_display


router.post('/dashboard_display', async (req, res) => {


  //get how much this UID ows

  const amount_this_UID_gets = await personal_expenditure_get.sum('amount_gets', { where: { UID: req.body.UID } })
  const amount_this_UID_ows = await personal_expenditure_ows.sum('amount_ows', { where: { UID: req.body.UID } })

  let group_wise_expenses_ows = []

  //get the no of groups user has --like currently accepted

  const no_of_groups = await invitations.count(
    {
      where: {
        UID: req.body.UID,
        accept: "ACCEPT"
      }
    }
  )

  //get those two groups
  let group_wise_data = []
  const group_id_user_part_of = await invitations.findAll({ attributes: ['invite_from_group_id'], where: { UID: req.body.UID, accept: "ACCEPT" } })

  for (var i = 0; i < group_id_user_part_of.length; i++) {

    let group_name = await groups.findOne({ attributes: ['group_name'], where: { groupID: group_id_user_part_of[i].dataValues.invite_from_group_id } })
    //check if user get anything from this group
    let amount_get_for_this_group = await personal_expenditure_get.sum('amount_gets', { where: { UID: req.body.UID, GroupID: group_id_user_part_of[i].dataValues.invite_from_group_id } })

    //check if user ows to any group
    let amount_ows_to_this_group = await personal_expenditure_ows.sum('amount_ows', { where: { UID: req.body.UID, GroupID: group_id_user_part_of[i].dataValues.invite_from_group_id } })

    let name_of_user = await users.findOne({ attributes: ['name'], where: { UID: req.body.UID } })



    group_wise_data.push({ UID: req.body.UID, name: name_of_user.dataValues.name, Group_ID: group_id_user_part_of[i].dataValues.invite_from_group_id, group_name: group_name.dataValues.group_name, amount_gets_from_this_group: amount_get_for_this_group, amount_ows_to_this_group: amount_ows_to_this_group })


  }



  //send the data to frontend
  result_dashboard = {
    amount_this_UID_gets: amount_this_UID_gets,
    amount_this_UID_ows: amount_this_UID_ows,
    group_wise_data: group_wise_data

  }

  res.status(200).send(result_dashboard);

});



//Show_deatils

router.post('/Show_deatils', async (req, res) => {

  let array_group_specific_tran = []

  //get the data

  const data_of_ows = await personal_expenditure_ows.findAll({ attributes: ['amount_ows', 'amount_ows_to_UID', 'expen_ID'], where: { UID: req.body.UID, GroupID: req.body.Group_ID } })

  for (var i = 0; i < data_of_ows.length; i++) {

    //get the details of expense
    let expense_detail = await expensenses.findOne({ attributes: ['currency', 'description', 'date', 'amount'], where: { expense_of_Group_ID: req.body.Group_ID, expen_ID: data_of_ows[i].dataValues.expen_ID } })
    let name_of_UId_who_gets_amount = await users.findOne({ attributes: ['name'], where: { UID: data_of_ows[i].dataValues.amount_ows_to_UID } })
    array_group_specific_tran.push({
      name: req.body.name,
      UID: req.body.UID,
      amount_ows: data_of_ows[i].dataValues.amount_ows,
      amount_ows_to_UID: data_of_ows[i].dataValues.amount_ows_to_UID,
      amount_ows_to_name: name_of_UId_who_gets_amount.dataValues.name,
      expen_ID: data_of_ows[i].dataValues.expen_ID,
      expense_currency: expense_detail.dataValues.currency,
      expense_description: expense_detail.dataValues.description,
      expense_date: expense_detail.dataValues.date,
      expense_amount: expense_detail.dataValues.amount

    })

  }

  //user specific data ows
  let combined_ows = []
  const amount_ows_combined_with_user = await personal_expenditure_ows.findAll({ attributes: ['UID', 'GroupID', 'amount_ows_to_UID', [Sequelize.fn('sum', Sequelize.col('amount_ows')), 'amount_ows']], group: ['amount_ows_to_UID'], where: { UID: req.body.UID, GroupID: req.body.Group_ID } })


  for (var i = 0; i < amount_ows_combined_with_user.length; i++) {
    //get user name
    let user_name = await users.findOne({ attributes: ['name'], where: { UID: amount_ows_combined_with_user[i].dataValues.amount_ows_to_UID } })
    combined_ows.push({
      UID: amount_ows_combined_with_user[i].dataValues.UID,
      GroupID: amount_ows_combined_with_user[i].dataValues.GroupID,
      amount_ows_to_UID: amount_ows_combined_with_user[i].dataValues.amount_ows_to_UID,
      name_of_amount_ows_to_UID: user_name.dataValues.name,
      amount_ows: amount_ows_combined_with_user[i].dataValues.amount_ows


    })
  }

  //similarly for gets
  let array_group_specific_tran_gets = []
  const data_gets = await personal_expenditure_get.findAll({ attributes: ['amount_gets', 'amount_gets_from_UID', 'expen_ID'], where: { UID: req.body.UID, GroupID: req.body.Group_ID } })

  for (var i = 0; i < data_gets.length; i++) {
    //get the details of expense
    let expense_detail = await expensenses.findOne({ attributes: ['currency', 'description', 'date', 'amount'], where: { expense_of_Group_ID: req.body.Group_ID, expen_ID: data_gets[i].dataValues.expen_ID } })
    let name_of_UId_from_whom_gets_amount = await users.findOne({ attributes: ['name'], where: { UID: data_gets[i].dataValues.amount_gets_from_UID } })
    array_group_specific_tran_gets.push({
      name: req.body.name,
      UID: req.body.UID,
      amount_gets: data_gets[i].dataValues.amount_gets,
      amount_gets_from_UID: data_gets[i].dataValues.amount_gets_from_UID,
      amount_gets_from_name: name_of_UId_from_whom_gets_amount.dataValues.name,
      expen_ID: data_gets[i].dataValues.expen_ID,
      expense_currency: expense_detail.dataValues.currency,
      expense_description: expense_detail.dataValues.description,
      expense_date: expense_detail.dataValues.date,
      expense_amount: expense_detail.dataValues.amount

    })

  }
  let combined_gets = []
  const amount_gets_combined_with_user = await personal_expenditure_get.findAll({ attributes: ['UID', 'GroupID', 'amount_gets_from_UID', [Sequelize.fn('sum', Sequelize.col('amount_gets')), 'amount_gets']], group: ['amount_gets_from_UID'], where: { UID: req.body.UID, GroupID: req.body.Group_ID } })
  for (var i = 0; i < amount_gets_combined_with_user.length; i++) {
    //get user name
    let user_name = await users.findOne({ attributes: ['name'], where: { UID: amount_gets_combined_with_user[i].dataValues.amount_gets_from_UID } })
    combined_gets.push({
      UID: amount_gets_combined_with_user[i].dataValues.UID,
      GroupID: amount_gets_combined_with_user[i].dataValues.GroupID,
      amount_gets_from_UID: amount_gets_combined_with_user[i].dataValues.amount_gets_from_UID,
      name_of_amount_gets_from_UID: user_name.dataValues.name,
      amount_gets: amount_gets_combined_with_user[i].dataValues.amount_gets


    })
  }

  result = {
    array_group_specific_tran: array_group_specific_tran,
    combined_ows: combined_ows,
    array_group_specific_tran_gets: array_group_specific_tran_gets,
    combined_gets: combined_gets


  }

  res.status(200).send(result);
});


//response_users_to_show
router.post('/response_users_to_show', async (req, res) => {

  console.log("length is ", req.body.length)

  let user_names = []

  for (var i = 0; i < req.body.length; i++) {
    user_names.push(await users.findOne({ attributes: ['name', 'UID'], where: { UID: req.body[i] } }))
  }

  result = {

    user_names: user_names
  }

  res.status(200).send(result);

});

//Settle_req

router.post('/Settle_req', async (req, res) => {

  //delete data from gets table

  await personal_expenditure_get.destroy({ where: { UID: req.body.UID_of_login, GroupID: req.body.GroupID, amount_gets_from_UID: req.body.other_UID } })
  await personal_expenditure_ows.destroy({ where: { UID: req.body.UID_of_login, GroupID: req.body.GroupID, amount_ows_to_UID: req.body.other_UID } })

  //-----------------
  //recent activity

  let settle_activity="user "+JSON.stringify(req.body.name_of_UID_login)+"settle up with "+JSON.stringify(req.body.name_of_other_UID)+" for group "+JSON.stringify(req.body.GroupID_name)
  await recentactivities.create({
    GroupID: req.body.GroupID,
    groupname: req.body.GroupID_name,
    activity: settle_activity,
    UID: req.body.UID_of_login,
    date_time: Sequelize.fn('NOW')
  })
 // -----------------

 
  res.status(200);

});

//leave_group
router.post('/leave_group', async (req, res) => {
  //first check if everything is settel 
  const count_gets = await personal_expenditure_get.count({
    where: {
      UID: req.body.UID,
      GroupID: req.body.group_id
    }
  })


  const count_ows = await personal_expenditure_ows.count(
    {
      where: {
        UID: req.body.UID,
        GroupID: req.body.group_id
      }
    }
  )




  if (count_gets === 0 && count_ows === 0) {
    console.log("Inside")
    result = {
      flag_settle: "S"

    }
    //user can leave the group
    invitations.destroy({
      where: {
        invite_from_group_id: req.body.group_id,
        UID: req.body.UID,
        accept: "ACCEPT"
      }
    })

    //-------------recent activity

    let activity_left="user "+JSON.stringify(req.body.UID_name)+" left the group "+JSON.stringify(req.body.group_name)

    await recentactivities.create({
      GroupID: req.body.group_id,
      groupname: req.body.group_name,
      activity: activity_left,
      UID: req.body.UID,
      date_time: Sequelize.fn('NOW')
    })
//----------------------
  }
  else {
    result = {
      flag_settle: "F",
      count_ows: count_ows,
      count_gets: count_gets

    }
  }


  console.log("result is ", result)
  res.status(200).send(result);

});


module.exports = router