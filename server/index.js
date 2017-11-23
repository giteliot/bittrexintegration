'use strict';

const app = require('./app');
const mongoapi = require('./mongoapi');
const request = require('request');
const PORT = process.env.PORT || 9000;


app.get('/api/v1/update', function(req, res){

  request.get('https://bittrex.com/api/v1.1/public/getmarkets', function (error, response, body) {
  //	  request.get('/api/v1/currencies', function (error, response, body) {
			if (error) {
				res.send("Error");
			} else {
				res.send(body);
			}
	});

});

app.get('/api/v1/currencies' , function(req, res){
	 
	  mongoapi.findPairs(function(docs) {
	  	  console.log(docs);
	  	  res.send(docs);
          
      });

});

app.post('/api/v1/insert/:pair', function(req,res) {

	mongoapi.insertPair(req.params.pair, function(resp) {
	  	  res.status(resp.code);
	  	  res.send(resp.message);
    });

});


app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}!`);
});