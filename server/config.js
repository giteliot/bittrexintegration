const config = {};

//constants
config.LOOP_INTERVAL = 30; //interval in seconds
config.SPIKE = 5; //percentage of a valid spike
config.MEMORY = 24; //hours of history

//db
config.db = {};
config.db.url = 'mongodb://localhost:27017/brexdb';

module.exports = config;