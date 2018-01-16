
const routes = require('./routes');

module.exports = function(app, io) {
    routes(app, io);    
    
  };