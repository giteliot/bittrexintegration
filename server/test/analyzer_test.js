const expect = require("chai").expect;
const analyzer = require("../analyzer.js");

const test = [
			  {perc:-6},
			  {perc:6},
			  {perc:5},
			  {perc:8},
			  {perc:-5},
			  {perc:7},
			  {perc:8}
			 ];

let agg;

describe("Analyzer", function() {
	it("aggregate spikes", function() {

		agg = analyzer.aggregateSpikes(test);
		console.log(agg);
		expect(agg.length).to.equal(4);

	});

	it("clean them out too!", function() {

		let clean = analyzer.cleanCurve(agg);
		console.log(clean);
		expect(clean.length).to.equal(3);

	});
});