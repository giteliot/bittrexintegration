const config = {};

//db
config.db = {};
config.db.url = 'mongodb://localhost:27017/brexdb';

//parameters

//Loop Settings
config.LOOP_INTERVAL = 30; //interval in seconds
config.MEMORY = 24; //hours of history

//Spikes Settings
config.MAX_SPIKE = 10; //max spike size recordable; lower sizes are considered not valid
config.MIN_CHANGE = 5; //mimum value of a spike to be considered a switch

//Analysis Settings
config.MIN_SPIKETRADE = 1; //rebound size to consider a trade
config.ALERTRANK = 4; //minimum switches for a market to be tradable

//Buy Amount
config.BUY_AM_BTC = 0.01;
config.BUY_AM_ETH = 0.1; 

config.FEES = 0.0025; //simulation only

//Obsolete
config.SPIKE = 5; //percentage of a valid spike (obsolete)

module.exports = config;
