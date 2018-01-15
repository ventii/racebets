const jsonfile = require('jsonfile');

module.exports = function(app) {

    app.get('/races', (request, response) => {
        
        jsonfile.readFile('next_races.json', (error, object) => {
            if(error)
            {
                console.log(error.message);
            }
            response.send(object);
        });        
    });

    app.post('/race', (request, response) => {

        console.log(request.body);
        response.send('Ok');
    });
};