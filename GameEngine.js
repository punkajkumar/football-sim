var GameState = {
	NOT_STARTED	: "Get Ready",
	ON 			: "In Progress",
	OVER		: "Game Over"
}
var PlayType = {
	PASS		: "Pass",
	RUN			: "Run",
	PUNT		: "Punt",
	FIELD_GOAL	: "Field Goal Kick",
}

var Football = {
	Game: function Game() {
		this._ballAtYard = 50; // simplifying, skipping kickoff
		this._possession = null;
		this.team1Score = 0;
		this.team2Score = 0;
		
		this._team1;
		this._team2;
		this._gameState = GameState.NOT_STARTED;
		this._fairness = .5;
		this._plays = [];
		this._down = 1;
		this._ytd = 10;
	},
	
	Team: function Team(n) {
		this.name = n;
	},

	Play: function Play(t, y) {
		//this.type = function() { return _type; }
		this.type = t;
		this.yards = y;
		this.isInterception = null;
	},

	Engine: function AmericanFootballGameEngine() {
	
		// Public Members
		this.Game = new Football.Game();
		this.playCallback = null;
		this.scoreChangedCallback = null;
		this.eventGen = new Football.EventGenerator(this.Game._fairness)
	
		this.startNewGame = function(team1, team2) {
			this.Game._gameState = GameState.ON;
			this.Game._team1 = team1;
			this.Game._team2 = team2;
			this.setPossessionWithCoinFlip();
		}

		this.doPass = function() {
			return this.doPlay(this.eventGen.generatePass());
		}
		this.doRun = function() {
			return this.doPlay(this.eventGen.generateRun());
		}
		
		this.doPlay = function(p) {
			++this.Game._down;
			this.Game._plays.push(p);
			
			this.moveBallForCurrentTeam(p);
			var tdTeamNum = this.isTouchDown();
			
			this.Game._ytd -= p.yards;
			
			this.handleScore(tdTeamNum, p);
		
			if (this.Game._ytd <= 0) {
				this.resetDown();
			}
			if (this.Game._down > 4 || p.isInterception) { 
				this.switchPossession();
			}
			
			if (tdTeamNum == null && 
				this.playCallback !== null) { this.playCallback(p) }
			
			return p;
		}
		
		this.handleScore = function(teamNum, p) {
			//teamNum is the offensive team when the ball is in that opposing team's endzone
			if (teamNum == null) return;
			// then the ball is in an endzone - so either a safety or TD
			// depending on who has possession
			// (notify observer of new play before changing possession)
			if (this.playCallback !== null) { this.playCallback(p) }
			
			// now score it
			if (this.Game._possession == this.Game['_team'+(teamNum=="1"?"2":"1")]) {
				// safety
				this.Game['team' + teamNum + 'Score'] += 2;
				this.switchPossession(50); // simplifying, no kick
			} else {
				this.Game['team' + teamNum + 'Score'] += 6;
				this.switchPossession(50);
			}
			if (this.scoreChangedCallback !== null) 
				this.scoreChangedCallback(this.Game, teamNum)
		}
		
		this.isTouchDown = function() {
			if (this.Game._ballAtYard >= 100) return "1";
			if (this.Game._ballAtYard <= 0) return "2";
			return null;
		}
		this.setPossessionWithCoinFlip = function() {
			this.Game._possession = this.eventGen.randomTwo(this.Game._team1, this.Game._team2);
		}
		this.moveBallForCurrentTeam = function(p) {
			if (p.isInterception) p.yards = 0;
			this.moveBallForTeam(this.Game._possession, p.yards);
		}
		this.moveBallForTeam = function(team, yards) {
			if 		(team == this.Game._team1) { this.Game._ballAtYard += yards }
			else if (team == this.Game._team2) { this.Game._ballAtYard -= yards }
		}
		this.resetDown = function() {
			this.Game._down = 1;
			this.Game._ytd = 10;
		}
		this.switchPossession = function(moveToYard) {
			this.Game._possession = this.Game._possession === this.Game._team1 ? this.Game._team2 : this.Game._team1;
			this.resetDown();
			if (moveToYard) { this.Game._ballAtYard = moveToYard }
		}
		
		this.getNumberOfPlays = function() { return this.Game._plays.length; }
		
		// Private Members
		
	},
	
	EventGenerator: function RandomHelper(f) {
		//stats
		// have some random multiplier on the maxes, to allow for big ones occasionally
		this._maxPassYards = 30;
		this._passInterceptionChance = .17;
		this._maxRunYards = 10; 
		this._fumbleChance = .04;
		
		this.randomTwo = function(one, two) {
			return Math.random() <= _fairness ? one : two;
		}
		this.generatePass = function() {
			var p = new Football.Play(
				PlayType.PASS,
				this.randomYards(this._maxPassYards));

			if (Math.random() <= this._passInterceptionChance) {
				p.isInterception = true;
			}
			return p;
		}
		this.generateRun = function() {
			var p = new Football.Play(
				PlayType.RUN,
				this.randomYards(this._maxRunYards));

			if (Math.random() <= this._fumbleChance) {
				p.isInterception = true;
			}
			return p;
		}
		this.randomYards = function(max) {
			return Math.round(
				(Math.random() * max) * 
				(Math.random() <= _negativeYardsChance ? -1 : 1));
		}
		var _fairness = f;
		var _negativeYardsChance = .25;
	}
};
