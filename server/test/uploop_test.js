const expect = require("chai").expect;
const uploop = require("../uploop.js");

const market = "BTC-1ST";
const spikes = [ { "date" : new Date("2018-02-12T15:54:44.502Z"), "perc" : 3, "value" : 0.0000556 } ];
const price = 0.0000666;

describe("Uploop", function() {

	it("clean spikes", function() {
		let newSpikes = uploop.updateSpikes(spikes,price, market);
		console.log(newSpikes);
		expect(spikes.length).to.equal(1);

	});

});