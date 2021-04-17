const express = require("express");
//const sequelize = require('../db/connection.js');
const users = require('../db_models/users');
const groups = require('../db_models/groups');
const comments = require('../db_models/comments')
const expenses = require('../db_models/expenses');
const invitations = require('../db_models/invitations');
const recentactivities = require('../db_models/recentactivities')
const router = new express.Router();
const { QueryTypes, where } = require('sequelize');
const { Sequelize } = require('sequelize');
const personal_expenditure_get = require('../db_models/personal_expenditure_get');
const personal_expenditure_ows = require('../db_models/personal_expenditure_ows');
const { findAll, find, findOne } = require("../db_models/users");
const { Json } = require("sequelize");
const sharp = require('sharp');
const multer = require('multer');
require('../db/mongo')

router.post('/signup', async (req, res) => {
  const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  var auth_flag = "S"
  var message = []
  if (req.body.emailid === "" || re.test(String(req.body.emailid).toLowerCase()) === false) {
    auth_flag = "F"
    message.push("Emailid field is empty or invalid")
  }
  if (req.body.name === "") {
    auth_flag = "F"
    message.unshift("name is blank")
  }
  if (req.body.password === "") {
    auth_flag = "F"
    message.unshift("password is blank")
  }

  if (auth_flag !== "F") {
    //data can be inserted
    //check if emailid is already present
    //const found_data = await users.findOne({ where: { emailid: req.body.emailid } });
    const found_data = await users.findOne({ emailid: req.body.emailid })
    if (found_data === null) {
      //emailid is not present and can be inserted
      // await users.create(req.body, { fields: ["name", "emailid", "password"] });
      //get max UID
      const Max_UID = await users.aggregate([{ $group: { _id: null, maxId: { $max: '$UID' } } }])
      var UID_to_be_inserted

      if (Max_UID.length === 0) {
        UID_to_be_inserted = 0
      }
      else {
        UID_to_be_inserted = Max_UID[0].maxId + 1

      }

      let users1 = await new users({ name: req.body.name, emailid: req.body.emailid, password: req.body.password, UID: UID_to_be_inserted, u_tokens: [] })
      let returneduser = await users1.save()
      await returneduser.generateAuthToken()
      // const data_after_insert = await users.findOne({ where: { emailid: req.body.emailid } });
      const data_after_insert = await users.findOne({ emailid: req.body.emailid })
      message.push("data inserted")
      result = {
        auth_flag: "S",
        message: message,
        message_length: message.length,
        UID: data_after_insert.UID,
        name: data_after_insert.name,
        emailid: data_after_insert.emailid

      }
      res.status(200).send(result);

    }
    else {
      message.push("Emailid is already present")
      result = {
        auth_flag: "F",
        message: message,
        message_length: message.length
      }
      res.status(200).send(result);
    }

  }
  else {

    result = {
      auth_flag: auth_flag,
      message: message,
      message_length: message.length
    }
    res.status(200).send(result);


  }

});

//login Api

router.post('/login', async (req, res) => {
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
      res.status(200).send(result);
    }
    else {

      //now emailid is present check for password

      if (req.body.password === found_data_login.password) {
        message.push("Password is matching and login is successful")
        result = {
          auth_flag: auth_flag,
          name: found_data_login.name,
          emailid: found_data_login.emailid,
          UID: found_data_login.UID,
          phone_number: found_data_login.phone_number,
          message: message,
          profile_photo: found_data_login.profile_photo

        }
        res.status(200).send(result);

      }
      else {
        //invalid password
        message.push("Invalid Password")
        result = {
          auth_flag: "F",
          message: message,
          message_length: message.length
        }
        res.status(200).send(result);
      }
    }

  }
  else {
    result = {
      auth_flag: auth_flag,
      message: message,
      message_length: message.length
    }
    res.status(200).send(result);
  }

});


//Api-----Create_group
router.post('/create_group', async (req, res) => {
  //validations
  var auth_flag = "S"
  var message = []
  if (req.body.group_name === "") {
    auth_flag = "F"
    message.push("Group Name is empty")
  }
  if (req.body.length === 0) {
    auth_flag = "F"
    message.push("Cant create group with only 1 member! add members ")
  }
  if (req.body.emailid_of_members.filter(emailid_of_members => emailid_of_members === "").length !== 0) {
    auth_flag = "F"
    message.push("One of group member has empty value! either remove or fill the emailid")
  }
  if (req.body.group_name !== "" && req.body.length !== 0 && req.body.emailid_of_members.filter(emailid_of_members => emailid_of_members === "").length === 0) {
    //now values are valid
    //check if group name is unique is not
    const found_group_name = await groups.findOne({ group_name: req.body.group_name });
    if (found_group_name) {
      message.push("Group name is already present")
      result = {
        auth_flag: "F",
        message: message,
        message_length: message.length
      }
      res.status(200).send(result);
    }
    else {

      //group name is not present can be created
      // await groups.create({ group_name: req.body.group_name })
      //get auto increment UID
      const Max_Group_ID = await groups.aggregate([{ $group: { _id: null, maxId: { $max: '$groupID' } } }])
      var Group_ID_to_be_inserted
      if (Max_Group_ID.length === 0) {
        Group_ID_to_be_inserted = 0
      }
      else {
        Group_ID_to_be_inserted = Max_Group_ID[0].maxId + 1

      }
      let groups_create = await new groups({ group_name: req.body.group_name, groupID: Group_ID_to_be_inserted })
      groups_created = await groups_create.save()
      //get the group_id from the inserted value
      const created_group_id = groups_created.groupID

      let owner = req.body.owner
      let group_name_this = req.body.group_name
      let activity = "user " + owner + " created a group " + group_name_this

      //adding in recent activity 
      create_recent_activity = await new recentactivities({ GroupID: created_group_id, groupname: req.body.group_name, activity: activity, UID: req.body.owner_UID, date_time: new Date() })
      await create_recent_activity.save()
      for (var i = 0; i < req.body.length; i++) {
        //get the UID
        var UID_for_group_member = await users.findOne({ emailid: req.body.emailid_of_members[i] })
        create_invitations = await new invitations({ UID: UID_for_group_member.UID, invite_from_group_id: created_group_id, accept: "NA" })
        await create_invitations.save()

        let name_of_user_invited = await users.findOne({ UID: UID_for_group_member.UID }, 'name')
        //recent activity sent invitation to 
        let invite_activity = "user " + req.body.owner + " sent group invite of " + req.body.group_name + " to " + name_of_user_invited.name
        create_recent_activity_invitation = await recentactivities({
          GroupID: created_group_id,
          groupname: req.body.group_name,
          activity: invite_activity,
          UID: req.body.owner_UID,
          date_time: new Date()
        })
        await create_recent_activity_invitation.save()

      }

      //put the owner in the group
      put_owner_in_invitation = await new invitations({ UID: req.body.owner_UID, invite_from_group_id: created_group_id, accept: "ACCEPT" })
      await put_owner_in_invitation.save()

      result = {
        auth_flag: auth_flag,
        message: message,
        message_length: message.length
      }
      res.status(200).send(result);

    }


  }
  else {
    result = {
      auth_flag: auth_flag,
      message: message,
      message_length: message.length
    }
    res.status(200).send(result);
  }


});

//Api-----Create_group
router.post('/get_group_names', async (req, res) => {
  //validations
  var auth_flag = "S"
  var message = []
  let group_names = []
  if (req.body.UID === "" || req.body.name === "") {
    auth_flag = "F"
    message.push("UID and name fields are empty")
    result = {
      auth_flag: auth_flag,
      message: message,
      message_length: message.length,
      group_names: group_names
    }
    res.status(200).send(result);
  }
  else {

    const group_id_user_part_of = await invitations.find({ UID: req.body.UID, accept: "ACCEPT" }, 'invite_from_group_id')
    for (var i = 0; i < group_id_user_part_of.length; i++) {
      group_names.push(await groups.findOne({ groupID: group_id_user_part_of[i].invite_from_group_id }, 'group_name groupID'))
    }
    result = {
      auth_flag: auth_flag,
      message: message,
      message_length: message.length,
      group_names_and_id_array: group_names
    }
    res.status(200).send(result);

  }

});

//get_users_in_group
router.post('/get_users_in_group', async (req, res) => {
  var auth_flag = "S"
  message = []
  //get the UID of members who are in group
  const UID_of_members = await invitations.find({ invite_from_group_id: req.body.groupID, accept: "ACCEPT" }, 'UID')
  details_of_group_members = []
  group_expenses_details = []
  details_of_each_individual_owes_gets = []
  for (var i = 0; i < UID_of_members.length; i++) {
    var name_of_UID = await users.findOne({ UID: UID_of_members[i].UID }, 'name')
    //  details_of_group_members.push({ name_of_group_members: name_of_UID.name })
    var amount_this_UID_ows = await personal_expenditure_ows.aggregate([
      { $match: { UID: UID_of_members[i].UID, GroupID: req.body.groupID } },

      { $group: { _id: null, amount_ows: { $sum: '$amount_ows' } } }

    ])
    var amount_this_UID_gets = await personal_expenditure_get.aggregate([
      { $match: { UID: UID_of_members[i].UID, GroupID: req.body.groupID } },

      { $group: { _id: null, amount_gets: { $sum: '$amount_gets' } } }

    ])

    details_of_each_individual_owes_gets.push({
      UID: UID_of_members[i].UID,
      name: name_of_UID,
      amount_gets: amount_this_UID_gets,
      amount_ows: amount_this_UID_ows
    })

  }

  //get the expenses in the group_expenses_details

  const get_expenses = await expenses.find({ expense_of_Group_ID: req.body.groupID })


  result = {
    auth_flag: auth_flag,
    message: message,
    message_length: message.length,
    //  details_of_group_members: details_of_group_members,
    group_expenses_details: get_expenses,
    details_of_each_individual_owes_gets: details_of_each_individual_owes_gets
  }
  res.status(200).send(result);

});


//Expense_add
router.post('/Expense_add', async (req, res) => {
  var auth_flag = "S"
  message = []
  //validation
  if (req.body.amount === "") {
    auth_flag = "F"
    message.push("Amount is empty")
  }
  if (req.body.description === "") {
    auth_flag = "F"
    message.push("Description is empty")
  }


  if (req.body.amount !== "" && req.body.description !== "") {
    //now you can entre the data
    //auto increment expen_ID
    const Max_expen_ID = await expenses.aggregate([{ $group: { _id: null, maxId: { $max: '$expen_ID' } } }])
    var expen_ID_to_be_inserted
    if (Max_expen_ID.length === 0) {
      console.log("Max_expen_ID is here")
      expen_ID_to_be_inserted = 0
    }
    else {
      expen_ID_to_be_inserted = Max_expen_ID[0].maxId + 1
    }
    //expense inserted
    create_expense = await new expenses(
      {
        paid_by_UID: req.body.UID_adding_expense,
        expense_of_Group_ID: req.body.groupID,
        amount: req.body.amount,
        description: req.body.description,
        name_of_UID_who_paid: req.body.name,
        expen_ID: expen_ID_to_be_inserted,
        date_time: new Date()
      }
    )
    let create_expense_insered = await create_expense.save()

    //check if comment is there or not
    if (req.body.comment !== "") {
      //comment is not empty, need to insert
      insert_comment = await new comments({
        groupID: req.body.groupID,
        group_name: req.body.group_name,
        comment: req.body.comment,
        UID_adding_comment: req.body.UID_adding_expense,
        UID_adding_comment_name: req.body.name,
        expen_ID: expen_ID_to_be_inserted,
        expen_description: req.body.description,
        date_time: new Date()
      })

      await insert_comment.save()

    }

    const expense_id_of_inserted_transcation = create_expense_insered.expen_ID_to_be_inserted
    //Recent activity
    let recent_activity_expense_added = "user " + req.body.name + " added the new expense " + req.body.description + " of " + req.body.amount + "USD in the group " + req.body.group_name
    let insert_recent_activity = await new recentactivities({
      GroupID: req.body.groupID,
      groupname: req.body.group_name,
      activity: recent_activity_expense_added,
      UID: req.body.UID_adding_expense,
      date_time: new Date()
    })
    await insert_recent_activity.save()
    //now split
    //get the number of members in the group
    const no_of_members = await invitations.aggregate([
      { $match: { invite_from_group_id: req.body.groupID, accept: "ACCEPT" } },

      {
        $count: "no_of_members"
      }

    ])
    // console.log("no_of_members is ",no_of_members[0].no_of_members)
    const UID_in_group = await invitations.find({ invite_from_group_id: req.body.groupID, accept: "ACCEPT" }, 'UID')


    const each_split = req.body.amount / no_of_members[0].no_of_members

    const amount_owner_gets = each_split * (no_of_members[0].no_of_members - 1)

    for (var i = 0; i < UID_in_group.length; i++) {

      if (UID_in_group[i].UID !== req.body.UID_adding_expense) {

        let personal_expenditure_getinsert = await new personal_expenditure_get({ UID: req.body.UID_adding_expense, GroupID: req.body.groupID, amount_gets: each_split, amount_gets_from_UID: UID_in_group[i].UID, expen_ID: expense_id_of_inserted_transcation })
        await personal_expenditure_getinsert.save()
        let personal_expenditure_ows_inserted = await new personal_expenditure_ows({ UID: UID_in_group[i].UID, GroupID: req.body.groupID, amount_ows: each_split, amount_ows_to_UID: req.body.UID_adding_expense, expen_ID: expense_id_of_inserted_transcation })
        await personal_expenditure_ows_inserted.save()
      }
    }

    message.push("Expenses sucessfully added")
    result = {
      auth_flag: "S",
      message: message,
      message_length: message.length
    }
    res.status(200).send(result);

  }
  else {
    result = {
      auth_flag: auth_flag,
      message: message,
      message_length: message.length
    }
    res.status(200).send(result);
  }


});

//group_page_invite
router.post('/group_page_invite', async (req, res) => {
  var auth_flag = "S"
  message = []

  const invitations_array = await invitations.find({ UID: req.body.UID, accept: "NA" }, 'invite_from_group_id')
  var invite_from_groups = []
  for (var i = 0; i < invitations_array.length; i++) {
    invite_from_groups.push({ group_name: await groups.findOne({ groupID: invitations_array[i].invite_from_group_id }, 'group_name'), groupID: invitations_array[i].invite_from_group_id })
  }

  //display total amount on dashboard

  const amount_this_UID_gets = await personal_expenditure_get.aggregate([
    { $match: { UID: req.body.UID } },

    { $group: { _id: null, amount_gets: { $sum: '$amount_gets' } } }

  ])

  const amount_this_UID_ows = await personal_expenditure_ows.aggregate([
    { $match: { UID: req.body.UID } },

    { $group: { _id: null, amount_owes: { $sum: '$amount_ows' } } }

  ])


  result = {
    auth_flag: auth_flag,
    message: message,
    message_length: message.length,
    invite_from_groups: invite_from_groups,
    amount_gets: amount_this_UID_gets,
    amount_gets_length: amount_this_UID_gets.length,
    amount_owes_length: amount_this_UID_ows.length,
    amount_owes: amount_this_UID_ows

  }
  res.status(200).send(result);
});


//group_invite_reject_req
router.post('/group_invite_reject_req', async (req, res) => {
  var auth_flag = "S"
  message = []

  const update_output = await invitations.updateOne({ UID: req.body.current_UID, invite_from_group_id: req.body.group_ids_to_be_rejected }, { accept: 'REJECT' });
  console.log("update_output.nModified is ", update_output.nModified)
  if (update_output.nModified === 1) {
    message.push("Reject is successful")
    result = {
      auth_flag: auth_flag,
      message: message,
      message_length: message.length,

    }
    res.status(200).send(result);
  }
  else {

    message.push("Reject is not successful")
    result = {
      auth_flag: "F",
      message: message,
      message_length: message.length,

    }
    res.status(200).send(result);
  }

});



router.post('/group_invite_accept_req', async (req, res) => {
  var auth_flag = "S"
  message = []
  const update_output = await invitations.updateOne({ UID: req.body.UID, invite_from_group_id: req.body.groupID }, { accept: 'ACCEPT' });
  if (update_output.nModified === 1) {
    //adding to recent activity
    let activity_insert = "user " + req.body.name + " joined the group " + req.body.group_name
    create_recent_activity_group_accept = await recentactivities({
      GroupID: req.body.create_expensegroupID,
      groupname: req.body.group_name,
      activity: activity_insert,
      UID: req.body.UID,
      date_time: new Date()
    })
    await create_recent_activity_group_accept.save()
    message.push("User is added to a group")
    result = {
      auth_flag: auth_flag,
      message: message,
      message_length: message.length,

    }
    res.status(200).send(result);
  }
  else {

    message.push("adding user is not successful")
    result = {
      auth_flag: "F",
      message: message,
      message_length: message.length,

    }
    res.status(200).send(result);
  }



});

const upload = multer({

})


//update profile

router.post('/profile', upload.single('u_avatar'), async (req, res) => {

  var auth_flag = "S"
  message = []
  if (req.file) {
    await users.updateOne(
      { UID: req.body.UID },
      { profile_photo: await (await sharp(req.file.buffer).resize(420, 240).toBuffer()).toString('base64') }
    )
    if (req.body.emailid !== "") {
      await users.updateOne(
        { UID: req.body.UID },
        { emailid: req.body.emailid })

    }

    if (req.body.phone_number !== "") {
      await users.updateOne(
        { UID: req.body.UID },
        { phone_number: req.body.phone_number })

    }

    if (req.body.name !== "") {
      await users.updateOne({ UID: req.body.UID },
        { name: req.body.name })

    }

    const updated_state = await users.findOne({ UID: req.body.UID });

    message.push("Update is successful")
    result = {
      auth_flag: "S",
      message: message,
      message_length: message.length,

    }
    res.status(200).send(result);


  }

});





//add  comment

router.post('/add_comment', async (req, res) => {
  var auth_flag = "S"
  message = []

  if (req.body.comment === "") {
    message.push("adding comment is not successful because comment is empty")
    result = {
      auth_flag: "S",
      message: message,
      message_length: message.length,

    }
    res.status(200).send(result);

  }
  else {
    adding_comment = await comments({
      groupID: req.body.groupID,
      group_name: req.body.group_name,
      comment: req.body.comment,
      UID_adding_comment: req.body.UID,
      UID_adding_comment_name: req.body.name,
      expen_ID: req.body.expen_ID,
      expen_description: req.body.description,
      date_time: new Date()
    })
    await adding_comment.save()

    message.push("adding comment is successful")
    result = {
      auth_flag: "S",
      message: message,
      message_length: message.length,

    }
    res.status(200).send(result);
  }



});

//get_all_comments
router.post('/get_all_comments', async (req, res) => {
  var auth_flag = "S"
  message = []
  //get all the comments 

  const all_comments_on_this_expense = await comments.find({ expen_ID: req.body.expen_ID })

  message.push("got all comments is successful")
  result = {
    auth_flag: "S",
    message: message,
    message_length: message.length,
    all_comments_on_this_expense: all_comments_on_this_expense,
    comments_length: all_comments_on_this_expense.length
  }
  res.status(200).send(result);

});

//leave_group
router.post('/leave_group', async (req, res) => {
  var auth_flag = "S"
  message = []

  //check if user has cleared all the expenses
  const amount_user_gets = await personal_expenditure_get.aggregate([
    { $match: { UID: req.body.UID, GroupID: req.body.groupID } },

    {
      $count: "amount_user_gets"
    }

  ])

  const amount_user_owes = await personal_expenditure_ows.aggregate([
    { $match: { UID: req.body.UID, GroupID: req.body.groupID } },

    {
      $count: "amount_user_owes"
    }

  ])

  if (amount_user_gets === 0 && amount_user_owes === 0) {
    message.push("user can leave the group")
    result = {
      auth_flag: "S",
      message: message,
      message_length: message.length
    }
    res.status(200).send(result);
  }
  else {
    message.push("user can't leave the group as some expenses are yet to setteled")
    result = {
      auth_flag: "F",
      message: message,
      message_length: message.length
    }
    res.status(200).send(result);
  }


});


//settle_up

router.post('/settle_up', async (req, res) => {

  var auth_flag = "S"
  message = []

  const UID_from_which_amount_gets = await personal_expenditure_get.distinct("amount_gets_from_UID", { UID: req.body.UID })
  const UID_to_which_amount_owes = await personal_expenditure_ows.distinct("amount_ows_to_UID", { UID: req.body.UID })
  let amount_gets_array = []
  let amount_owes_array = []

  if (UID_from_which_amount_gets.length !== 0) {

    for (var i = 0; i < UID_from_which_amount_gets.length; i++) {

      let UID_from_which_amount_gets_all_UID = UID_from_which_amount_gets[i]
      let UID_from_which_amount_gets_all_UID_name = await users.findOne({ UID: UID_from_which_amount_gets_all_UID }, 'name')



      let final_amount_gets = await personal_expenditure_get.aggregate(
        [
          {
            $match: {
              UID: req.body.UID,
              amount_gets_from_UID: UID_from_which_amount_gets_all_UID
            }
          },
          {
            $group: {
              _id: {
                amount_gets_from_UID: '$UID_from_which_amount_gets_all_UID'

              }, final_amount_gets_total: { $sum: '$amount_gets' }
            }
          }
        ])



      amount_gets_array.push({
        UID: req.body.UID,
        name: req.body.name,
        amount_gets: final_amount_gets[0].final_amount_gets_total,
        amount_gets_from: UID_from_which_amount_gets_all_UID_name.name,
        amount_gets_from_UID: UID_from_which_amount_gets_all_UID
      })

    }


  }

  if (UID_to_which_amount_owes.length !== 0) {

    for (var i = 0; i < UID_to_which_amount_owes.length; i++) {

      let UID_to_which_amount_owes_all_UID = UID_to_which_amount_owes[i]
      let UID_to_which_amount_owes_all_UID_name = await users.findOne({ UID: UID_to_which_amount_owes_all_UID }, 'name')


      let final_amount_owes = await personal_expenditure_ows.aggregate(
        [
          {
            $match: {
              UID: req.body.UID,
              amount_ows_to_UID: UID_to_which_amount_owes_all_UID
            }
          },
          {
            $group: {
              _id: {
                amount_ows_to_UID: '$UID_to_which_amount_owes_all_UID'

              }, final_amount_owes_total: { $sum: '$amount_ows' }
            }
          }
        ])

      console.log("final_amount_owes is ", final_amount_owes[0].final_amount_owes_total)

      amount_owes_array.push({
        UID: req.body.UID,
        name: req.body.name,
        amount_owes: final_amount_owes[0].final_amount_owes_total,
        amount_owes_to: UID_to_which_amount_owes_all_UID,
        amount_owes_to_name: UID_to_which_amount_owes_all_UID_name.name
      })

    }


  }

  message.push("balance is as bellow")
  result = {
    auth_flag: "S",
    message: message,
    message_length: message.length,
    amount_gets_array: amount_gets_array,
    amount_gets_array_length: amount_gets_array.length,
    amount_owes_array: amount_owes_array,
    amount_owes_array_length: amount_owes_array.length
  }
  res.status(200).send(result);


});

//setle_up_amount_gets

router.post('/setle_up_amount_gets', async (req, res) => {
  //delete the amount_gets
  var auth_flag = "S"
  message = []
  await personal_expenditure_get.deleteMany({
    UID: req.body.UID,
    amount_gets_from_UID: req.body.settle_up_with_UID
  })

  await personal_expenditure_ows.deleteMany({
    amount_ows_to_UID: req.body.UID,
    UID: req.body.settle_up_with_UID
  })

  message.push("settled up ")
  result = {
    auth_flag: "S",
    message: message,
    message_length: message.length
    
  }
  res.status(200).send(result);


});

router.post('/setle_up_amount_owes', async (req, res) => {
  //delete the amount_gets
  var auth_flag = "S"
  message = []
  await personal_expenditure_ows.deleteMany({
    UID: req.body.UID,
    amount_ows_to_UID: req.body.settle_up_with_UID
  })

  await personal_expenditure_get.deleteMany({
    amount_gets_from_UID: req.body.UID,
    UID: req.body.settle_up_with_UID
  })

  message.push("settled up ")
  result = {
    auth_flag: "S",
    message: message,
    message_length: message.length
    
  }
  res.status(200).send(result);


});


module.exports = router