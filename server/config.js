const config = {};

//db
config.db = {};
config.db.url = 'mongodb://localhost:27017/brexdb';

//constants
config.LOOP_INTERVAL = 60; //interval in seconds
config.SPIKE = 10; //percentage of a valid spike
config.MEMORY = 24; //hours of history
config.ALERTRANK = 1; //if there is a low for a market with rank >= ALERTRANK, an alert is sent
config.BUY_AM_BTC = 0.01; //amount of BTC worth of Currency bought in each transaction
config.BUY_AM_ETH = 0.2; //amount of ETH worth of Currency bought in each transaction
config.FEES = 0.0025; //fees % (simulation only)

module.exports = config;