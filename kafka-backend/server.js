var connection = new require('./kafka/connection');

// topic files
var UserProfileTopic = require("./services/UserProfileTopic");

const mongoose = require('mongoose');




mongoose.connect("mongodb+srv://root:root@splitwise-cluster.1ghfx.mongodb.net/Splitwise?retryWrites=true&w=majority", {
  useUnifiedTopology: true,
  useCreateIndex: true,
  useNewUrlParser: true,
  useFindAndModify: false
}, (err, res) => {
  if (err) {
    console.log(err);
    console.log(`MongoDB Connection Failed`);
  } else {
    console.log(`MongoDB Connected`);
  }
})

function handleTopicRequest(topic_name, fname) {
  var consumer = connection.getConsumer(topic_name);
  var producer = connection.getProducer();
  console.log('server is running');
  consumer.on('message', function (message) {
   
    var data = JSON.parse(message.value);
    switch (topic_name) {
      case 'user_topic':
        fname.userService(data.data, function (err, res) {
          response(data, res, producer);
          return;
        });
        break;
     
    }
  });
}

function response(data, res, producer) {
  //console.log('after handle', res);
  var payloads = [
    {
      topic: data.replyTo,
      messages: JSON.stringify({
        correlationId: data.correlationId,
        data: res,
      }),
      partition: 0,
    },
  ];
  producer.send(payloads, function (err, data) {
   
  });
  return;
}

// Add your TOPICS here
// first argument is topic name
// second argument is a function that will handle this topic request

handleTopicRequest("user_topic", UserProfileTopic);

