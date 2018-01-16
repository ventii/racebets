var express    = require('express');
var bodyParser = require('body-parser');

var app = express();

app.use(express.static("static"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});




const port = 8000;
var server = app.listen(port, () => {
  console.log("works!");
});

var io  = require('socket.io').listen(server);
require("./app/routes")(app, io);

io.on('connection', function(socket){
  console.log('connected');
});

