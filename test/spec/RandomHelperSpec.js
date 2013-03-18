describe("The EventGenerator ", function() {
	var engine;

	beforeEach(function() {
		eventGen = new Football.EventGenerator(.5);
	});

	it("randomYards return valid number", function() {
		var y = eventGen.randomYards(20);
		expect(y >= 0 && y <= 20).toBeTruthy();
	});
	//it("can generate a Pass", function() {
	//	eventGen.randomYards = function(m) { return 12; }
	//	var pass = eventGen.generatePass();
    //
	//	expect(pass.type).toEqual(PlayType.PASS);
	//	expect(pass.yards).toEqual(12);
	//});
	//
	//it("can generate a Run", function() {
	//	eventGen.randomYards = function(m) { return 12; }
	//	var pass = eventGen.generateRun();
    //
	//	expect(pass.type).toEqual(PlayType.RUN);
	//	expect(pass.yards).toEqual(12);
	//});
});