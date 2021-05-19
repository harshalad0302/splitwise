const express = require("express");
const kafka = require('../kafka/client');
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
const passport = require('passport')
require('../db/mongo')
const bcrypt = require("bcrypt");


router.post('/signup', async (req, res) => {
  //kafka
  kafka.make_request("user_topic", { "path": "signup", body: req.body }, function (err, results) {
    if (err) {
      res.status(400).send(results);
    } else {
      res.status(200).send(results);
    }
  })

});

//login Api
router.post('/login', async (req, res) => {
  //kafka
  kafka.make_request("user_topic", { "path": "login", body: req.body }, function (err, results) {

    if (err) {
      res.status(400).send(results);
    } else {
      res.status(200).send(results);
    }
  })


});
//Api-----Create_group
router.post('/create_group', async (req, res) => {
  //kafka
  kafka.make_request("user_topic", { "path": "create_group", body: req.body }, function (err, results) {

    if (err) {
      res.status(400).send(results);
    } else {
      res.status(200).send(results);
    }
  })

});

//Api-----get_group_names
router.post('/get_group_names', async (req, res) => {
  //kafka
  kafka.make_request("user_topic", { "path": "get_group_names", body: req.body }, function (err, results) {

    if (err) {
      res.status(400).send(results);
    } else {
      res.status(200).send(results);
    }
  })
});

//get_users_in_group
router.post('/get_users_in_group', async (req, res) => {
  kafka.make_request("user_topic", { "path": "get_users_in_group", body: req.body }, function (err, results) {

    if (err) {
      res.status(400).send(results);
    } else {
      res.status(200).send(results);
    }
  })
});


//Expense_add
router.post('/Expense_add', passport.authenticate('jwt', { session: false }), async (req, res) => {

  kafka.make_request("user_topic", { "path": "Expense_add", body: req.body }, function (err, results) {

    if (err) {
      res.status(400).send(results);
    } else {
      res.status(200).send(results);
    }
  })

});

//group_page_invite
router.post('/group_page_invite', async (req, res) => {
  
  kafka.make_request("user_topic", { "path": "group_page_invite", body: req.body }, function (err, results) {

    if (err) {
      res.status(400).send(results);
    } else {
      res.status(200).send(results);
    }
  })
});


//group_invite_reject_req
router.post('/group_invite_reject_req', passport.authenticate('jwt', { session: false }), async (req, res) => {
  kafka.make_request("user_topic", { "path": "group_invite_reject_req", body: req.body }, function (err, results) {

    if (err) {
      res.status(400).send(results);
    } else {
      res.status(200).send(results);
    }
  })
});



router.post('/group_invite_accept_req',  async (req, res) => {
  kafka.make_request("user_topic", { "path": "group_invite_accept_req", body: req.body }, function (err, results) {
    if (err) {
      res.status(400).send(results);
    } else {
      res.status(200).send(results);
    }
  })
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
  }

  if (req.body.emailid !== "") {

    //check if email id is already present or not
    const found_data = await users.findOne({ emailid: req.body.emailid })
    if (found_data === null) {
      //emailid is not present and can be updated
      await users.updateOne(
        { UID: req.body.UID },
        { emailid: req.body.emailid })
    }
    else {

      message.push("Email id is already present ")
      result = {
        auth_flag: "F",
        message: message,
        token: req.body.token,
        message_length: message.length

      }
      res.status(200).send(result);

    }


  }

  if (req.body.phone_number !== "") {
    //validate the phone number
    let length_of_phone_number=req.body.phone_number.toString().length

    await users.updateOne(
      { UID: req.body.UID },
      { phone_number: req.body.phone_number })

  }

  if (req.body.name !== "") {
    await users.updateOne({ UID: req.body.UID },
      { name: req.body.name })

  }

  if (req.body.password !== "") {
    //password is not empty
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(req.body.password, salt);

    await users.updateOne({ UID: req.body.UID },
      { password: hashPassword })

  }

  let updated_state = await users.findOne({ UID: req.body.UID });

  message.push("Update is successful")
  result = {
    auth_flag: "S",
    message: message,
    updated_state: updated_state,
    token: req.body.token,
    message_length: message.length

  }
  res.status(200).send(result);


}

);





//add  comment

router.post('/add_comment', passport.authenticate('jwt', { session: false }), async (req, res) => {

  kafka.make_request("user_topic", { "path": "add_comment", body: req.body }, function (err, results) {

    if (err) {
      res.status(400).send(results);
    } else {
      res.status(200).send(results);
    }
  })
});

//get_all_comments
router.post('/get_all_comments', passport.authenticate('jwt', { session: false }), async (req, res) => {
  kafka.make_request("user_topic", { "path": "get_all_comments", body: req.body }, function (err, results) {

    if (err) {
      res.status(400).send(results);
    } else {
      res.status(200).send(results);
    }
  })
});

//leave_group
router.post('/leave_group', async (req, res) => {
  kafka.make_request("user_topic", { "path": "leave_group", body: req.body }, function (err, results) {

    if (err) {
      res.status(400).send(results);
    } else {
      res.status(200).send(results);
    }
  })

});


//settle_up

router.post('/settle_up', passport.authenticate('jwt', { session: false }), async (req, res) => {
  kafka.make_request("user_topic", { "path": "settle_up", body: req.body }, function (err, results) {

    if (err) {
      res.status(400).send(results);
    } else {
      res.status(200).send(results);
    }
  })

});

//setle_up_amount_gets

router.post('/setle_up_amount_gets', passport.authenticate('jwt', { session: false }), async (req, res) => {

  kafka.make_request("user_topic", { "path": "setle_up_amount_gets", body: req.body }, function (err, results) {

    if (err) {
      res.status(400).send(results);
    } else {
      res.status(200).send(results);
    }
  })

});

router.post('/setle_up_amount_owes', passport.authenticate('jwt', { session: false }), async (req, res) => {

  kafka.make_request("user_topic", { "path": "setle_up_amount_owes", body: req.body }, function (err, results) {

    if (err) {
      res.status(400).send(results);
    } else {
      res.status(200).send(results);
    }
  })


});

//recent_activities

router.post('/recent_activities', passport.authenticate('jwt', { session: false }), async (req, res) => {
  kafka.make_request("user_topic", { "path": "recent_activities", body: req.body }, function (err, results) {

    if (err) {
      res.status(400).send(results);
    } else {
      res.status(200).send(results);
    }
  })
});

//delete_comment

router.post('/delete_comment', passport.authenticate('jwt', { session: false }), async (req, res) => {
  kafka.make_request("user_topic", { "path": "delete_comment", body: req.body }, function (err, results) {

    if (err) {
      res.status(400).send(results);
    } else {
      res.status(200).send(results);
    }
  })
});

//get_all_emails

router.post('/get_all_emails',  async (req, res) => {
  kafka.make_request("user_topic", { "path": "get_all_emails", body: req.body }, function (err, results) {

    if (err) {
      res.status(400).send(results);
    } else {
      res.status(200).send(results);
    }
  })
});

module.exports = router