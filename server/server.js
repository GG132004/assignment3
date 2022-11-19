const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const config = require('config');
const path = require('path');
const app = express();
const { getFileStream } = require("./middleWare/s3")

app.use(express.json());
app.use(cors());
app.disable('etag');

mongoose.connect( config.get('MONGO_URI'), { useNewUrlParser: true, useUnifiedTopology: true })
const db = mongoose.connection

db.on("error", (err) => { console.error(err) })
db.once("open", () => { console.log("Mongodb connection success!") })

app.use('/api', require('./route/api/userController'));
app.get('/images/:key', (req, res) => {
  console.log(req.params)
  const key = req.params.key
  const readStream = getFileStream(key)
  readStream.pipe(res)
})

//Serve static assets in production
if (config.get('NODEENV') === 'PRODUCTION') {
    //Set static folder
    app.use(express.static('client/build'));
  
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
    });
  }


app.listen(3000, () => { console.log("Server running at port: 3000") })