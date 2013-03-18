var footballModule = (function($) {
	var my = {},
		ctx = null,
		game = null,
		ball = new Image(),
		t1, t2;
	
	var ball_src = 'data:image/png;base64,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';
	ball.src = ball_src;
	var team1Color = "#ffb433";
	var team2Color = "#6097db";
	
	function drawHeaderForTeam(ctx, teamName, i) {
		ctx.beginPath();
		ctx.moveTo( 200, 10);
		ctx.lineTo( 400 * (i-1), 10);
		ctx.strokeStyle = i==1 ? team1Color : team2Color;
		ctx.lineWidth = 20;
		ctx.stroke();
		ctx.font = "bold 12px sans-serif";
		ctx.fillText(teamName, i==1 ? 0 : 200, 10);
	}
	
	function drawPlay(e,i) {
		ctx.beginPath();
		//var y = 20 + 30 * i;
		var y = 20;
		ctx.moveTo( 200, y);
		ctx.lineTo( 200 + e.yards * 2 * (team2HasBall() ? -1 : 1), y);
		ctx.strokeStyle = getColorForTeamWithBall();
		ctx.lineWidth = 20;
		ctx.stroke();
		
		console.debug(game.Game._ballAtYard);
		ctx.drawImage(ball, 
			100 + game.Game._ballAtYard * 2, y - 5,
			20, 12);
		
		ctx.font = "bold 12px sans-serif";
		ctx.fillText(e.type + " for " + e.yards, 330, y + 7);
	}
	function drawNewPlay(p) {
		shiftContext(ctx, 400, 800, 0, 40);   
		drawPlay(p, game.Game._plays.length - 1);
	}
	function setControlColorForTeam() {
		$('.inControl').css(
			'background-color', 
			getColorForTeamWithBall());
	}
	
	function drawHeader() {
		var ctxHead = document.getElementById('canvasHeader').getContext('2d');
		drawHeaderForTeam(ctxHead, game.Game._team1.name, 1);
		drawHeaderForTeam(ctxHead, game.Game._team2.name, 2);
	}
	
	// Helper Functions
	var shiftContext = function(ctx, w, h, dx, dy) {
		var clamp = function(high, value) { return Math.max(0, Math.min(high, value)); };
		var imageData = ctx.getImageData(clamp(w, -dx), clamp(h, -dy), clamp(w, w-dx), clamp(h, h-dy));
		ctx.clearRect(0, 0, w, h);
		ctx.putImageData(imageData, 0, 30);
	}
	var getColorForTeamWithBall = function() {
		return game.Game._possession == t1 ? team1Color : team2Color;
	}
	var team2HasBall = function() {
		return game.Game._possession == t2;
	}
	
	my.initialize = function() {
		ctx = document.getElementById('canvas').getContext('2d');
		game = new Football.Engine();
		
		// Setup callbacks and initialize UI
		game.playCallback = function(p) {
			$('#ballAt').html(game.Game._ballAtYard);
			$('#ytd').html(game.Game._ytd);
			$('#currDown').html(game.Game._down);
			drawNewPlay(p);
			setControlColorForTeam();
			if (p.isInterception) alert('Intercepted!!!');
		};
		game.scoreChangedCallback = function(g, t) {
			$('#team1score').html(g.team1Score);
			$('#team2score').html(g.team2Score);
			var color = (t=="1" ? team1Color : team2Color);
			$('#scoreContainer').pulse(
				{backgroundColor : color}, 
				{duration : 400, pulses : 1});
		}
		$('#passButton').click(function() { game.doPass(); });
		$('#runButton').click(function() { game.doRun(); });
		$('#puntButton').click(function() { alert('not supported yet'); });
		
		// Start the Game
		t1 = new Football.Team("Redskins");
		t2 = new Football.Team("Cowboys");
		game.startNewGame(t1, t2);
		
		setControlColorForTeam();
		drawHeader();
	}
	return my;
}(jQuery));