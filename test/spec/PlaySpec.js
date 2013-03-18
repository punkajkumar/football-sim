describe("The Play object", function() {
	var play;

	beforeEach(function() {
		play = new Football.Play(
			PlayType.RUN,
			10);
	});

	describe(" when it is an interception", function() {
	  it("isFumbleOrInterception should be true", function() {
	  	play.isInterception = true;
	  	expect(play.isFumbleOrInterception()).toBeTruthy();
	  });
	});
	describe(" when it is a fumble", function() {
	  it("isFumbleOrInterception should be true", function() {
	  	play.isFumble = true;
	  	expect(play.isFumbleOrInterception()).toBeTruthy();
	  });
	});
	describe(" when it is not a fumble or interception", function() {
	  it("isFumbleOrInterception should be true", function() {
	  	expect(play.isFumbleOrInterception()).toBeFalsy();
	  });
	});
});