var GameTitle = function(game){};

var player;
var playerColor;
var dir;
var thisScore;

GameTitle.prototype = {

	preload: function() {
		// this.game.load.image('play', 'assets/img/play-text.png');
		this.game.load.spritesheet('play-btn', 'assets/img/play-btn-sprite-sheet.png', 190, 49);
		this.game.load.spritesheet('music-btn', 'assets/img/music-button.png', 190, 49);
		this.game.load.spritesheet('sfx-btn', 'assets/img/sfx-button.png', 190, 49);
		this.game.load.image('player', 'assets/img/player.png');

		this.game.load.audio('tremLoading', 'assets/sound/music/TremLoadingloop.wav');
		this.game.load.image('title', 'assets/img/title.png');
	},

	init: function(score) {
		if (score !=0 && typeof score != 'undefined') {
			// console.log("You scored: " + score);
			window.gameScore = score;
			window.dispatchEvent(new CustomEvent('gameScore', {detail: score})); //invoke angular 2 change detection

			thisScore = score;
			var scoreFont = "80px Arial";
	
			this.scoreLabel = this.game.add.text((this.game.world.centerX), this.game.world.height - 410, "You Scored: " + thisScore, {font: scoreFont, fill: "#fff", stroke: "#000", strokeThickness: 8}); 
			this.scoreLabel.anchor.setTo(0.5, 0.5);
			this.scoreLabel.align = 'center';
		}
	},

	create: function(){
		var me = this;
		dir = "down";

		me.createPlayer();

		// Set the background color to blue
		me.game.stage.backgroundColor = '002b36'; //navy blue

		// Title Image
		me.titleImg = me.game.add.sprite(me.game.width/2, me.game.world.centerY/4, 'title');
		me.titleImg.scale.setTo(4,4);
        me.titleImg.anchor.setTo(0.5, 0.5);

		// The numbers given in parameters are the indexes of the frames, in this order: over, out, down
		var playButton = me.game.add.button(me.game.width/2+10, me.game.height-300, 'play-btn', this.startGame, this, 0, 0, 1);
		playButton.scale.setTo(2,2);
        playButton.anchor.setTo(0.5, 0.5);
		
		if (typeof window.musicToggle === 'undefined' || window.musicToggle === null || window.musicToggle === 'on') {
			window.musicToggle = 'on';
			// The numbers given in parameters are the indexes of the frames, in this order: over, out, down
			me.musicButton = me.game.add.button(me.game.width/2+10, (me.game.height)-188, 'music-btn', this.toggleMusic, this, 0, 0, 1);
			me.musicButton.scale.setTo(2,2);
			me.musicButton.anchor.setTo(0.5, 0.5);
			// Music
			me.tremLoadingMusic = me.game.add.audio('tremLoading');
			me.tremLoadingMusic.loopFull(0.5); //param is volume
		} else {
			me.musicButton = me.game.add.button(me.game.width/2+10, (me.game.height)-188, 'music-btn', this.toggleMusic, this, 1, 1, 0);
			me.musicButton.scale.setTo(2,2);
			me.musicButton.anchor.setTo(0.5, 0.5);
		}
		
		if (typeof window.sfxToggle === 'undefined' || window.sfxToggle === null || window.sfxToggle === 'on') {
			window.sfxToggle = 'on';
			// The numbers given in parameters are the indexes of the frames, in this order: over, out, down
			me.sfxButton = me.game.add.button(me.game.width/2+10, (me.game.height)-66, 'sfx-btn', this.toggleSfx, this, 0, 0, 1);
			me.sfxButton.scale.setTo(2,2);
			me.sfxButton.anchor.setTo(0.5, 0.5);
		} else {
			me.sfxButton = me.game.add.button(me.game.width/2+10, (me.game.height)-66, 'sfx-btn', this.toggleSfx, this, 1, 1, 0);
			me.sfxButton.scale.setTo(2,2);
			me.sfxButton.anchor.setTo(0.5, 0.5);
		}
	},

	update: function() {
		var me = this;
        if (player.y < me.game.world.centerY+50 && dir === "down") {
            player.y += 2;
            if (player.y >= me.game.world.centerY+50) {
                dir = "up";
            }
        } else if(player.y >= me.game.world.centerY-60 && dir === "up") {
            player.y -= 2;
            if (player.y < me.game.world.centerY-60) {
                dir = "down";
            }
        }
		player.angle += 5;
	},
	
	createPlayer: function() {
		var me = this;
		me.colors = [
			'#FFFF6D', //yellow
			'#FF5E5E', //red
			'#54f759', //green
			'#6078ff', //blue
			'#c272ff', //purple
			'#ff56e0', //pink
			'#56fffc', //cyan
			'#56ffc1', //teal
			'#ffa456', //orange
			'#d7ff56', //neon yellow
		];

		let index = me.randomInt(0, me.colors.length-1);
		let color = me.colors[index];
		playerColor = color;

		var playerRect = new Phaser.Graphics(me.game)
			.beginFill(Phaser.Color.hexToRGB( color ), 1)
			.drawRect(100, 100, 100, 100 );
		var playerRectTexture = playerRect.generateTexture();
		player = me.game.add.sprite(me.game.world.centerX / 2, me.game.world.centerY, playerRectTexture);

		player.exists = true;
		player.visable = true;
		player.alive = true;
		me.game.physics.arcade.enable(player);

		// Set the players anchor point to be in the middle horizontally
		player.anchor.setTo(0.5, 0.5);
	},

	randomInt: function(min,max) {
		return Math.floor(Math.random()*(max-min+1)+min);
	},

	startGame: function(){
		var me = this;

		me.tremLoadingMusic.stop();
		// me.game.state.start("Main");
		me.game.state.start('Main', true, false, playerColor);
	},

	toggleMusic: function() {
		let me = this;
		if (window.musicToggle === 'on') {
			window.musicToggle = 'off';
			me.tremLoadingMusic.stop();
			me.musicButton.setFrames(1,1,0);
		} else {
			// then window.musicToggle = 'off'
			window.musicToggle = 'on';
			me.tremLoadingMusic.play();
			me.musicButton.setFrames(0, 0, 1);
		}
	},

	toggleSfx: function() {
		let me = this;
		if (window.sfxToggle === 'on') {
			window.sfxToggle = 'off';
			me.sfxButton.setFrames(1,1,0);
		} else {
			// then window.sfxToggle = 'off'
			window.sfxToggle = 'on';
			me.sfxButton.setFrames(0,0,1);
		}
	}

}