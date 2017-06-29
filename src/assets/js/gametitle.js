var GameTitle = function(game){};

var player;
var dir;

GameTitle.prototype = {

	preload: function() {
        this.game.load.image('play', '../assets/img/play-text.png');
		this.game.load.image('player', '../assets/img/player.png');
	},

	init: function(score) {
		if (score !=0) {
			console.log("You scored: " + score);
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