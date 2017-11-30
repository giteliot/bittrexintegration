const config = {};

//db
config.db = {};
config.db.url = 'mongodb://localhost:27017/brexdb';

//constants
config.LOOP_INTERVAL = 300; //interval in seconds
config.SPIKE = 5; //percentage of a valid spike
config.MEMORY = 24; //hours of history
config.ALERTRANK = 2; //if there is a low for a market with rank >= ALERTRANK, an alert is sent
config.BUY_AM_BTC = 0.1;
config.BUY_AM_ETH = 0.25;
config.FEES = 0.0025;


module.exports = config;