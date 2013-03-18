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
		engine.doPlay();
		
		expect(engine.getNumberOfPlays()).toEqual(1);
	  });
	  
	  it("doPlay moves the ball", function() {
		var t1 = new Football.Team("Redskins");
		engine.startNewGame(t1, new Football.Team("Cowboys"));
		engine.Game._possession = t1;
		engine.doPlay(10);
		
		expect(engine.Game._ballAtYard).toEqual(60);
	  });
	  
	  it("with a random # of yards", function() {
		engine.startNewGame(new Football.Team("Redskins"), new Football.Team("Cowboys"));
		var p = engine.doPlay();
		
		expect(p.yards % 1 === 0).toBeTruthy();
	  });
	  
	  it("and a random type", function() {
		engine.startNewGame(new Football.Team("Redskins"), new Football.Team("Cowboys"));
		var p = engine.doPlay();
		
		expect(p.type !== null).toBeTruthy();
	  });
	  
	  it("making >10 yards in 2 plays gets you a First Down", function() {
		engine.startNewGame(new Football.Team("Redskins"), new Football.Team("Cowboys"));
		engine.doPlay(1);
		expect(engine.Game._down).toEqual(2);
		engine.doPlay(10);
		expect(engine.Game._down).toEqual(1);
	  });
	  
	  it("making 10 yards in 1 play gets you a First Down", function() {
		engine.startNewGame(new Football.Team("Redskins"), new Football.Team("Cowboys"));
		engine.doPlay(10);
		expect(engine.Game._down).toEqual(1);
	  });

	  it("after 3 downs without making 10+ yards, possession the same", function() {
		engine.startNewGame(new Football.Team("Redskins"), new Football.Team("Cowboys"));
		var t1 = engine.Game._possession;
		
		engine.doPlay(1);
		engine.doPlay(1);
		engine.doPlay(1);

		expect(engine.Game._possession).toEqual(t1);
	  });
	  
	  it("after 4th down without making 10+ yards, possession switches", function() {
		engine.startNewGame(new Football.Team("Redskins"), new Football.Team("Cowboys"));
		var t1 = engine.Game._possession;
		
		engine.doPlay(1);
		engine.doPlay(1);
		engine.doPlay(1);
		engine.doPlay(1);

		expect(engine.Game._possession).toNotEqual(t1);
	  });
	  
	  describe("Touchdowns are made when", function() {
		  it("team1 is in their endzone", function() {
			var t1 = new Football.Team("Redskins");
			engine.startNewGame(t1, new Football.Team("Cowboys"));
			engine.Game._ballAtYard = 101;
			expect(engine.isTouchDown()).toEqual(t1);
		  });
		  
		  it("team2 is in their endzone", function() {
			var t2 = new Football.Team("Cowboys");
			engine.startNewGame(new Football.Team("Redskins"), t2);
			engine.Game._ballAtYard = -1;
			expect(engine.isTouchDown()).toEqual(t2);
		  });
	  });

	  describe("Touchdowns cause", function() {
		  it("possession to switch", function() {
			var t1 = new Football.Team("Redskins");
			var t2 = new Football.Team("Cowboys");
			engine.startNewGame(t1, t2);
			engine.Game._possession = t1;
			engine.doPlay(11);
			engine.doPlay(90);
			expect(engine.Game._possession).toEqual(t2);
		  });
		  
		  it("ball moved to 50 yard line", function() {
			var t1 = new Football.Team("Redskins");
			var t2 = new Football.Team("Cowboys");
			engine.startNewGame(t1, t2);
			engine.Game._possession = t1;
			engine.doPlay(11);
			engine.doPlay(90);
			expect(engine.Game._ballAtYard).toEqual(50);
		  });
	  });
	  
	  describe("6 points are scored when", function() {
		  it("team1 gets a touchdown", function() {
			var t1 = new Football.Team("Redskins");
			var t2 = new Football.Team("Cowboys");
			engine.startNewGame(t1, t2);
			engine.Game._possession = t1;
			engine.doPlay(11);
			engine.doPlay(90);
			expect(engine.Game.team1Score).toEqual(6);
		  });
		  
		  it("team2 gets a touchdown", function() {
			var t1 = new Football.Team("Redskins");
			var t2 = new Football.Team("Cowboys");
			engine.startNewGame(t1, t2);
			engine.Game._possession = t2;
			engine.doPlay(11);
			engine.doPlay(90);
			expect(engine.Game.team2Score).toEqual(6);
			expect(engine.Game._possession).toEqual(t1);
		  });
	  });
	});
});