const mongoose = require('mongoose')
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