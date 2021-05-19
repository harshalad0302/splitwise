
const express = require('express');
const app = express();
const cors = require('cors');
const mysql = require('mysql');
const user_router = require('./src/router/user_router');
const passport = require('passport')
const { ApolloServer } = require('apollo-server-express');
const typeDefs = require('./src/typeDefs');
const resolvers = require('./src/resolvers');


// Passport Config
require('./src/passport')(passport)

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());


app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Headers', '*')
  if (req.method === 'OPTIONS') {
    res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET')
    return res.status(200).send()
  }
  next()
})




//graph QL

async function startServer() {
  const app = express();
  const apolloServer = new ApolloServer({
    typeDefs: typeDefs,
    resolvers: resolvers,
  })
  app.use(cors({
    origin: ["http://localhost:3000"],
    methods: ['GET', "POST"],
    credentials: true
  }));
  app.use(express.json());

  
  app.use(user_router);

  await apolloServer.start();

  apolloServer.applyMiddleware({ app: app })

  app.use((req, res) => {
    res.status(200).send("Hello from express apollo server");
  });

  app.listen(3002, () => {
    console.log("Connection established in 3002 port.");
  });

  console.log('Server is started')
}

startServer();





module.exports = app;



