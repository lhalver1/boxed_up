var GameOver = function(game){};

GameOver.prototype = {

  	create: function(){

		titleText = this.game.add.text(16, 16, 'You Scored:', { fontSize: '32px' });
        titleText.fixedToCamera = true;
        titleText.stroke = '#000000';
        titleText.strokeThickness = 8;
        titleText.fill = '#43d637';

	},

	restartGame: function(){
		this.game.state.start("GameTitle");
	}
	
}