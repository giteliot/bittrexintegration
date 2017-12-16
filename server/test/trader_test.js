const expect    = require("chai").expect;
const trader = require("../trader.js");

describe("Trader", function() {
	it("gets all the buy orders", function() {
		trader.getSellables(function(buys){
			expect(docs.length>0).to.equal(true);
		});
	});

	/*it("inserts a buy like a good boy", function() {
		trader.placeBuy("ETH-NMR", 0.00123,function(modified){
			expect(modified).to.equal(1);
		});
	});*/

	/*it("sells a market like a good boy", function() {
		trader.placeSell("BTC-LSK", 0.00143,function(modified){
			expect(modified).to.equal(1);
		});
	});*/

	it("gets all good boi sellablez", function() {
		trader.getSellables( function(sellablez){
			expect(sellablez.length).to.equal(1);
		});
	});

	it("tells how much of a good boi bot he is", function(){
		console.log("AM I GOOD BOT?");
		trader.getGains(function(gainz) {
			console.log(gainz);
			expect(gainz.eth).to.equal(0);
		});
	});
});