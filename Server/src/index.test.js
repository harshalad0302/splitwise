const assert = require("chai").assert;
const index = require("../index");
const chai = require("chai");
chai.use(require("chai-http"));
const expect = require("chai").expect;
const agent = require("chai").request.agent(index);

describe("Splitwise", function () {
  describe("Login Test", function () {
    it("Incorrect Password", () => {
      agent
        .post("/Login")

        .send({ emailid: "***", password: "password" })
        .then(function (res) {
          expect(res.text).to.equal('{"auth_flag_email_login":"F","error_messgae":"Email id is not present,please sign up"}');
        })
        .catch((error) => {
          console.log(error);
        });
    });

  });

  it("Successful Login", () => {
    agent
      .post("/Login")
      .send({ emailid: "h@gmail.com", password: "123" })
      .then(function (res) {
        expect(res.text).to.equal(
          '{"auth_flag_email_login":"S","name":"Harshala","emailid":"h@gmail.com","UID":1,"phone_number":"669-213-9881"}'
        );
      })
      .catch((error) => {
        console.log(error);
      });
  });



  describe("Signup Test", function () {
    it("User Already exists", () => {
      agent
        .post("/signup")
        .send({
          emailid: "**",
          password: "**",
          name: "harshala",
        })
        .then(function (res) {
          expect(res.text).to.equal('{"auth_flag_email":"Femail_already","error_message":"Email id is already present"}');
        })
        .catch((error) => {
          console.log(error);
        });
    });
  });


  it("Successful Signup", () => {
    agent
      .post("/signup")
      .send({
        emailid: "***",
        password: "***",
        name: "new_user",
      })
      .then(function (res) {
        expect(res.text).to.equal(
          '{"auth_flag_email":"Femail_already","error_message":"Email id is already present"}'
        );
      })
      .catch((error) => {
        console.log(error);
      });
  });


});


describe(" Create Groups Test", function () {
  it("Sucessfully created a group", () => {
    agent
      .post("/Create_group")
      .set("Autherization", "Bearer **")
      .send({
        group_name: "homies"
      })
      .then(function (res) {
        expect(res.text).to.equal(
          '{"group_name_already_p_f":"F","error_messgae":"Group name is already present"}'
        );
      })
      .catch((error) => {
        console.log(error);
      });
  });


});

describe("Leave Group", function () {
  it("User can leave a group", () => {
    agent
      .post("/leave_group")
      .set("Autherization", "Bearer *******")
      .send({
        UID: 1,
        GroupID: 1

      })
      .then(function (res) {
        expect(res.text).to.equal(
          '{"group_name_already_p_f":"F","error_messgae":"Group name is already present"}'
        );
      })
      .catch((error) => {
        console.log(error);
      });
  });


});


