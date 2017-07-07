var Preload = function(game){};

Preload.prototype = {

	preload: function(){ 
		this.game.load.image('tile', 'assets/img/tile1.png');
		this.game.load.image('tile2', 'assets/img/tile2.png');
		this.game.load.image('explode', 'assets/img/explode.png');
		this.game.load.image('player', 'assets/img/player.png');
	},

	create: function(){
		this.game.state.start("GameTitle");
	}
}