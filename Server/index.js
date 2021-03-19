
const express = require('express');
const app = express();
const cors = require('cors');
const mysql = require('mysql');
var Sequelize = require('sequelize');
const user_router=require('./src/router/user_router');

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Headers', '*')
  if (req.method === 'OPTIONS') {
    res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET')
    return res.status(200).send()
  }
  next()
})



app.use(express.json());


app.use(user_router);


app.listen(3002, (req, res) => {
  console.log('running on port 3000');
});

module.exports =app;



