const jsonfile = require('jsonfile');

module.exports = function(app, io) {

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

        jsonfile.readFile('next_races.json', (error, object) => {
            if(error)
            {
                console.log(error.message);
            }
            else {

                object.data.races.push({
                    "id_race": 99999,
                    "event": {
                      "title": "Silverstone",
                      "country": "GB"
                    },
                    "race_type": "D",
                    "post_time": 1439970900,
                    "num_runners": 7,
                    "distance": 3580,
                    "purse": {
                      "amount": 302500,
                      "currency": "GBP"
                    },
                    "runners": [
                      {
                        "id_runner": 20200,
                        "name": "Sierra Foxtrot",
                        "odds": 3.5,
                        "silk": "3.png"
                      },
                      {
                        "id_runner": 55452,
                        "name": "Roger",
                        "odds": 3.8,
                        "silk": "1.png"
                      },
                      {
                        "id_runner": 9969685,
                        "name": "Belly Button",
                        "odds": 4.8,
                        "silk": "6.png"
                      }
                    ]
                  });

                  jsonfile.writeFile('next_races.json', object, (error) => {
                    console.log(error);
                  })
            }
            
        });    
        
        

        io.emit('race added', "true");
        response.send('Ok');
    });
};


