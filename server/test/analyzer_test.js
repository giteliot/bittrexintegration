const expect = require("chai").expect;
const analyzer = require("../analyzer.js");

const test = [ 
	{ "date" : new Date("2018-02-12T11:54:44.502Z"), "perc" : -3, "value" : 0.0000556 },
	{ "date" : new Date("2018-02-12T12:54:44.502Z"), "perc" : 3, "value" : 0.0000556 },
	{ "date" : new Date("2018-02-12T19:54:44.502Z"), "perc" : -3, "value" : 0.0000556 },
	{ "date" : new Date("2018-02-12T20:54:44.502Z"), "perc" : 3, "value" : 0.0000556 }
	];


let agg;

describe("Analyzer", function() {
	it("aggregate spikes", function() {

		agg = analyzer.aggregateSpikes(test);
		//console.log(agg);
		expect(agg.length).to.equal(4);

	});

	it("clean isolated spikes", function() {

		agg = analyzer.deleteIsolatedSpikes(test);
		console.log(agg);
		expect(agg.length).to.equal(2);

	});

	it("clean them out too!", function() {

		let clean = analyzer.cleanCurve(agg);
		//console.log(clean);
		expect(clean.length).to.equal(2);

	});
});