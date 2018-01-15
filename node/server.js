const express        = require('express');
const bodyParser     = require('body-parser');
const app            = express();

const port = 8000;

app.use(express.static('static'));


app.use(bodyParser.urlencoded({ extended: true }));
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});
require('./app/routes')(app);

app.listen(port, () => {
  console.log('works!');
});