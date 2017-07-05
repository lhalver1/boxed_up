var GameTitle = function(game){};

var player;
var dir;
var thisScore;

GameTitle.prototype = {

	preload: function() {
        this.game.load.image('play', 'assets/img/play-text.png');
		this.game.load.image('player', 'assets/img/player.png');
	},

	init: function(score) {
		if (score !=0 && typeof score != 'undefined') {
			console.log("You scored: " + score);
			window.gameScore = score;
			thisScore = score;
			var scoreFont = "80px Arial";
	
			this.scoreLabel = this.game.add.text((this.game.world.centerX), this.game.world.height - 100, "You Scored: " + thisScore, {font: scoreFont, fill: "#fff"}); 
			this.scoreLabel.anchor.setTo(0.5, 0.5);
			this.scoreLabel.align = 'center';
		}
	},

	create: function(){
		var me = this;
		dir = "down";

		// Add the player to the game in the center of the screen
		player = me.game.add.sprite(me.game.world.centerX / 2, me.game.world.centerY, 'player');
		player.anchor.setTo(0.5, 0.5);

		// Set the background color to blue
		me.game.stage.backgroundColor = '479CDE';

		var playButton = me.game.add.button(me.game.width/2, me.game.height/2, 'play', this.startGame, this);
        playButton.anchor.setTo(0.5, 0.5);
	},

	update: function() {
		var me = this;

        if (player.y < me.game.world.centerY+50 && dir === "down") {
            player.y += 2;
            if (player.y >= me.game.world.centerY+50) {
                dir = "up";
            }
        } else if(player.y >= me.game.world.centerY-50 && dir === "up") {
            player.y -= 2;
            if (player.y < me.game.world.centerY-50) {
                dir = "down";
            }
        }
		player.angle += 5;
    },

	startGame: function(){
		var me = this;

		me.game.state.start("Main");
	}

}