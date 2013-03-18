describe("The Football GameEngine", function() {
	var engine;

	beforeEach(function() {
		engine = new Football.Engine();
	});

	describe("When the GameEngine is first created", function() {
	  it("the state should be Not Started", function() {
		expect(engine.Game._gameState).toEqual(GameState.NOT_STARTED);
	  });
	});
	describe("When a game is started", function() {
	  it("the state should be ON", function() {
		engine.startNewGame();
		expect(engine.Game._gameState).toEqual(GameState.ON);
	  });
	  
	  it("and the possession should be set", function() {
		engine.startNewGame();
		expect(engine.Game._possession !== null).toBeTruthy();
	  });
	});
	describe("When in play", function() {
	  it("doPlay creates and records a play", function() {
		engine.startNewGame(new Football.Team("Redskins"), new Football.Team("Cowboys"));
		engine.doPlay(new Football.Play(PlayType.PASS, 10));
		
		expect(engine.getNumberOfPlays()).toEqual(1);
	  });
	  
	  describe("doPlay ", function() {
		  it("moves the ball", function() {
			var t1 = new Football.Team("Redskins");
			engine.startNewGame(t1, new Football.Team("Cowboys"));
			engine.Game._possession = t1;
			engine.doPlay(new Football.Play(PlayType.PASS, 10));
			
			expect(engine.Game._ballAtYard).toEqual(60);
		  });
		  
		  it("and returns a valid play object", function() {
			engine.startNewGame(new Football.Team("Redskins"), new Football.Team("Cowboys"));
			var p = engine.doPlay(new Football.Play(PlayType.PASS, 10));
			
			expect(p.type).toEqual(PlayType.PASS);
			expect(p.yards).toEqual(10);
		  });
		  
		  it("making >10 yards in 2 plays gets you a First Down", function() {
			engine.startNewGame(new Football.Team("Redskins"), new Football.Team("Cowboys"));
			engine.doPlay(new Football.Play(PlayType.PASS, 1));
			
			expect(engine.Game._down).toEqual(2);
			engine.doPlay(new Football.Play(PlayType.PASS, 10));
			expect(engine.Game._down).toEqual(1);
		  });
		  
		  it("making 10 yards in 1 play gets you a First Down", function() {
			engine.startNewGame(new Football.Team("Redskins"), new Football.Team("Cowboys"));
			engine.doPlay(new Football.Play(PlayType.PASS, 10));
			expect(engine.Game._down).toEqual(1);
		  });

		  it("after 3 downs without making 10+ yards, possession the same", function() {
			engine.startNewGame(new Football.Team("Redskins"), new Football.Team("Cowboys"));
			var t1 = engine.Game._possession;
			
			[1,1,1].forEach(doTestPass);

			expect(engine.Game._possession).toEqual(t1);
		  });
		  
		  it("after 4th down without making 10+ yards, possession switches", function() {
			engine.startNewGame(new Football.Team("Redskins"), new Football.Team("Cowboys"));
			var t1 = engine.Game._possession;
			
			[1,1,1,1].forEach(doTestPass);

			expect(engine.Game._possession).toNotEqual(t1);
		  });
	  });
	  
	  describe("doPass ", function() {
		  it("returns a valid Pass-type Play object", function() {
			engine.startNewGame(new Football.Team("Redskins"), new Football.Team("Cowboys"));		
			engine.eventGen.randomYards = function(m) { return 12; }
			var p = engine.doPass();

			expect(p.type).toEqual(PlayType.PASS);
			expect(p.yards).toEqual(12);
		  });

		  it("can return an interception", function() {
			engine.startNewGame(new Football.Team("Redskins"), new Football.Team("Cowboys"));		
			engine.eventGen._passInterceptionChance = 1;
			var p = engine.doPass();

			expect(p.type).toEqual(PlayType.PASS);
			expect(p.isInterception).toBeTruthy();
		  });
	  });
	  describe("doRuns ", function() {
		  it("returns a valid Runs-type Play object", function() {
			engine.startNewGame(new Football.Team("Redskins"), new Football.Team("Cowboys"));		
			engine.eventGen.randomYards = function(m) { return 12; }
			var p = engine.doRun();

			expect(p.type).toEqual(PlayType.RUN);
			expect(p.yards).toEqual(12);
		  });

		  it("can return a fumble", function() {
			engine.startNewGame(new Football.Team("Redskins"), new Football.Team("Cowboys"));		
			engine.eventGen._fumbleChance = 1;
			var p = engine.doRun();

			expect(p.type).toEqual(PlayType.RUN);
			expect(p.isInterception).toBeTruthy();
		  });
	  });
	  
	  describe("Touchdowns are made when", function() {
		  it("team1 is in their endzone", function() {
			var t1 = new Football.Team("Redskins");
			engine.startNewGame(t1, new Football.Team("Cowboys"));
			engine.Game._ballAtYard = 101;
			expect(engine.isTouchDown()).toEqual("1");
		  });
		  
		  it("team2 is in their endzone", function() {
			var t2 = new Football.Team("Cowboys");
			engine.startNewGame(new Football.Team("Redskins"), t2);
			engine.Game._ballAtYard = -1;
			expect(engine.isTouchDown()).toEqual("2");
		  });
	  });

	  describe("Touchdowns cause", function() {
		  it("possession to switch", function() {
			var t1 = new Football.Team("Redskins");
			var t2 = new Football.Team("Cowboys");
			engine.startNewGame(t1, t2);
			engine.Game._possession = t1;
			[11,90].forEach(doTestPass);
			expect(engine.Game._possession).toEqual(t2);
		  });
		  
		  it("ball moved to 50 yard line", function() {
			var t1 = new Football.Team("Redskins");
			var t2 = new Football.Team("Cowboys");
			engine.startNewGame(t1, t2);
			engine.Game._possession = t1;
			[11,90].forEach(doTestPass);
			expect(engine.Game._ballAtYard).toEqual(50);
		  });
	  });
	  
	  describe("6 points are scored when", function() {
		  it("team1 gets a touchdown", function() {
			var t1 = new Football.Team("Redskins");
			var t2 = new Football.Team("Cowboys");
			engine.startNewGame(t1, t2);
			engine.Game._possession = t1;
			[11,90].forEach(doTestPass);
			expect(engine.Game.team1Score).toEqual(6);
		  });
		  
		  it("team2 gets a touchdown", function() {
			var t1 = new Football.Team("Redskins");
			var t2 = new Football.Team("Cowboys");
			engine.startNewGame(t1, t2);
			engine.Game._possession = t2;
			[11,90].forEach(doTestPass);
			expect(engine.Game.team2Score).toEqual(6);
			expect(engine.Game._possession).toEqual(t1);
		  });
	  });
	  
	  function doTestPass(e,i,a) { 
	  engine.doPlay(new Football.Play(PlayType.PASS, e)) }
	});
});