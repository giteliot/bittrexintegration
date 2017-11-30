const express = require('express');
const morgan = require('morgan');
const path = require('path');
const UpLoop = require('./uploop');
const config = require('./config');


const app = express();

// Setup logger
app.use(morgan(':remote-addr - :remote-user [:date[clf]] ":method :url HTTP/:http-version" :status :res[content-length] :response-time ms'));

// Serve static assets
app.use(express.static(path.resolve(__dirname, '..', 'build')));

// Always return the main index.html, so react-router render the route in the client
app.get('/', (req, res) => {
  res.sendFile(path.resolve(__dirname, '..', 'build', 'index.html'));
});

//starting the update loop with SPIKE% spike size and LOOP_INTERVAL seconds interval time
//UpLoop.update(config.SPIKE);
UpLoop.start();

module.exports = app;