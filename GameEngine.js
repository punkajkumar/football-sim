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

	Play: function Play(t, y, d, tm) {
		//this.type = function() { return _type; }
		this.type = t;
		this.yards = y;
		this.down = d;
		this.team = tm;
	},

	Engine: function AmericanFootballGameEngine() {
	
		// Public Members
		this.Game = new Football.Game();
		this.playCallback = null;
		this.scoreChangedCallback = null;
	
		this.startNewGame = function(team1, team2) {
			this.Game._gameState = GameState.ON;
			this.Game._team1 = team1;
			this.Game._team2 = team2;
			this.setPossessionWithCoinFlip();
		}
		
		this.doPlay = function(useYards) {			
			var p = new Football.Play(
				_randomHelper.randomTwo(PlayType.PASS, PlayType.RUN),
				useYards || _randomHelper.randomYards(),
				this.Game._down++,
				this.Game._possession);
			this.Game._plays.push(p);
			
			this.moveBallForCurrentTeam(p.yards);
			var itd = this.isTouchDown();
			if (itd == this.Game._team1) {
				this.Game.team1Score += 6;
				this.switchPossession(50);
				if (this.scoreChangedCallback !== null) 
					this.scoreChangedCallback(this.Game, "1")
				return;
			} else if (itd) {
				this.Game.team2Score += 6;
				this.switchPossession(50);
				if (this.scoreChangedCallback !== null)
					this.scoreChangedCallback(this.Game, "2")
				return;
			}
			this.Game._ytd -= p.yards;
			
			if (this.Game._ytd <= 0) {
				this.resetDown();
			}
			if (this.Game._down > 4) { 
				this.switchPossession();
			}
			
			if (this.playCallback !== null) { this.playCallback(p) }
			
			return p;
		}
		
		this.isTouchDown = function() {
			if (this.Game._ballAtYard > 100) return this.Game._team1;
			if (this.Game._ballAtYard < 0) return this.Game._team2;
			return null;
		}
		this.setPossessionWithCoinFlip = function() {
			this.Game._possession = _randomHelper.randomTwo(this.Game._team1, this.Game._team2);
		}
		this.moveBallForCurrentTeam = function(yards) {
			this.moveBallForTeam(this.Game._possession, yards);
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
		var _randomHelper = new Football.EventGenerator(this.Game._fairness)
	},
	
	EventGenerator: function RandomHelper(f) {
		this.randomTwo = function(one, two) {
			return Math.random() <= _fairness ? one : two;
		}
		this.randomYards = function() {
			return Math.round(
				(Math.random() * 25) * 
				(Math.random() <= _negativeYardsChance ? -1 : 1));
		}
		var _fairness = f;
		var _negativeYardsChance = .25;
	}
};