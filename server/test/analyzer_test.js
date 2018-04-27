const expect = require("chai").expect;
const analyzer = require("../analyzer.js");

const test = [ 
	
	 { "date" : new Date("2018-04-26T16:11:45.493Z"), "perc" : -33, "value" : 0.0000556 },
	 { "date" : new Date("2018-04-26T15:11:45.493Z"), "perc" : 8, "value" : 0.0000556 },
	 { "date" : new Date("2018-04-26T15:00:15.463Z"), "perc" : -7, "value" : 0.0000556 },
	 { "date" : new Date("2018-04-26T13:44:15.413Z"), "perc" : 44, "value" : 0.0000556 },
	 { "date" : new Date("2018-04-26T04:35:43.798Z"), "perc" : -5, "value" : 0.0000556 },
	 { "date" : new Date("2018-04-26T03:27:13.637Z"), "perc" : 4, "value" : 0.0000556 },
	 { "date" : new Date("2018-04-26T01:02:13.867Z"), "perc" : -3, "value" : 0.0000556 },
	 { "date" : new Date("2018-04-25T19:48:42.425Z"), "perc" : 2, "value" : 0.0000556 },
	 { "date" : new Date("2018-04-25T16:02:41.788Z"), "perc" : -1, "value" : 0.0000556 }

	];


let agg;

describe("Analyzer", function() {
	it("aggregate spikes", function() {
		agg = analyzer.aggregateSpikes(test);
		//console.log(agg);
		expect(agg.length).to.equal(9);

	});

	it("clean isolated spikes", function() {
		agg = analyzer.deleteIsolatedSpikes(test);
		console.log(agg);
		expect(agg.length).to.equal(4);

	});

	it("clean them out too!", function() {

		let clean = analyzer.cleanCurve(agg);
		//console.log(clean);
		expect(clean.length).to.equal(2);

	});

	it ("concatenates like a boss", function() {
		let final = analyzer.cleanCurve(analyzer.deleteIsolatedSpikes(test));
		console.log(final);
		expect(final.length).to.equal(2);
	});
});