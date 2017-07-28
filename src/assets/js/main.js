var Main = function(game){

};

var playerColor;

Main.prototype = {

	init: function(playersColor) {
		if (playersColor !=0 && typeof playersColor != 'undefined') {
			playerColor = playersColor;
		}
	},

	preload: function() {
		this.game.load.audio('clearside', ['assets/sound/music/Clearside-SisteViator.ogg', 'assets/sound/music/Clearside-SisteViator.wav']);
		this.game.load.audio('pass', 'assets/sound/effects/SoundPack01/Rise04.mp3');
		this.game.load.audio('explosion', 'assets/sound/effects/explosion.mp3');
	},

	create: function() {
		var me = this;

		me.musicToggle = window.musicToggle;
		me.sfxToggle = window.sfxToggle;

		// Set the speed for the platforms
		me.tileSpeed = -780//-300;

		// Set the background color to blue
		// me.game.stage.backgroundColor = '479CDE'; //sky blue
		me.game.stage.backgroundColor = '002b36'; //navy blue

		// Enable the arcade physics system
		me.game.physics.startSystem(Phaser.Physics.ARCADE);

		// Add the player to the screen
		me.createPlayer();

		// SOUNDS
		if (me.musicToggle === 'on') {
			me.clearsideMusic = me.game.add.audio('clearside');
			me.clearsideMusic.loopFull(1); // param is volume
		}
		if (me.sfxToggle === 'on') {
			me.explosionSfx = me.game.add.audio('explosion');
			me.explosionSfx.volume = 0.2;
			me.passSfx = me.game.add.audio('pass');
			me.passSfx.volume = 0.3;
		}

		// Enable cursor keys so we can create some controls
		me.cursors = me.game.input.keyboard.createCursorKeys();
		me.game.input.onDown.add(me.onTap, me);

		//Init the walls
		me.random = new Phaser.RandomDataGenerator([Date.now()]); //Date.now() is the seed
		me.wallHeight = 100;//70;
        me.wallWidth = 100;//70;
		me.holeSize = 6;
 
        let wallSprite = new Phaser.Graphics(me.game)
            .beginFill(Phaser.Color.hexToRGB('#ffffff'), 1)
            .drawRect(0, 0, me.wallWidth, me.wallHeight);
        let wallSpriteTexture = wallSprite.generateTexture();
        
        me.walls = me.game.add.group();
        me.walls.enableBody = true;
        me.walls.createMultiple(250, wallSpriteTexture);
        
		me.targets = me.game.add.group();
		me.targets.enableBody = true;
		
		// Add a platform every 3 seconds
		me.timer = game.time.events.loop(1500, me.addWall, me);

		// Add particle emitter for death animation
		let playerPiece = new Phaser.Graphics(me.game)
            .beginFill(Phaser.Color.hexToRGB('#'+me.player.tint.toString(16), 1))
            .drawRect(0, 0, 15, 15 );
        let playerPieceTexture = playerPiece.generateTexture();
		me.emitter = game.add.emitter(0, 0, 20);
		me.emitter.makeParticles(playerPieceTexture);
		me.emitter.gravity = 200;

		// Set the initial score
		me.score = 0;
		me.createScore();
	},

	update: function() {
		var me = this;

		me.player.angle +=5;
 
		// Make the sprite jump when the up key is pushed
		if(me.cursors.up.isDown) {
			me.player.body.velocity.y -= 120;//80;
		}
		if (me.game.input.pointer1.isDown) {
			me.player.body.velocity.y -= 120;//80;
		}

		// Make the sprite collide with the ground layer
		me.game.physics.arcade.overlap(me.player, me.walls, me.gameOver, null, me); //unbreakable tiles
		me.game.physics.arcade.overlap(me.player, me.targets, me.collideTarget, null, me); //unbreakable tiles
	},
	change: function(){},

	addWall: function() {
	
		var me = this;
	
		// Speed up the game to make it harder
		// me.tileSpeed -= 40;
	
		// Work out how many tiles we need to fit across the whole screen
		let tilesNeeded = Math.ceil(me.game.world.height / me.wallHeight);
	
		// Add a hole randomly somewhere
		let hole = Math.floor(Math.random() * (tilesNeeded - me.holeSize)) + 1;
	
		// Keep creating tiles next to each other until we have an entire row
		// Don't add tiles where the random hole is
		for (let i = 0; i < tilesNeeded; i++) {

			// if (i != hole && i != hole + 1 && i != hole + 2 && i != hole + 3 && i != hole + 4 && i != hole + 5) {
			if (i < hole || i > hole + (me.holeSize-1)) {
				me.addTile(me.game.world.width - me.wallWidth, i * me.wallHeight, true); 
			} else if(i === hole) {
				me.addTile(me.game.world.width - me.wallWidth, i * me.wallHeight, false);
			} else {
				//Still inside the hole area, do nothing but continue on
			}   

		}
	
	},

	addTile: function(x, y, immovable) {
 
		var me = this;
	
		// Get a tile that is not currently on screen
		if(immovable){
			var tile = me.walls.getFirstDead();
		} else {
			// var tile = me.targets.getFirstDead();
			var tile = me.getTarget();
			me.targets.add(tile);
		}
	
		// Reset it to the specified coordinates
		tile.body.gravity.y = 0;
		tile.reset(x, y);
		tile.body.velocity.x = me.tileSpeed; 
		tile.body.immovable = immovable;
	
		// When the tile leaves the screen, kill it
		tile.checkWorldBounds = true;
		tile.outOfBoundsKill = true;    
	},

	collideTarget: function(player, target) {
		let me = this;
		me.incrementScore();
		if (me.sfxToggle === 'on') {
			me.passSfx.play();
		}

		let targetPieceSprite = new Phaser.Graphics(me.game)
            .beginFill(Phaser.Color.hexToRGB('#'+target.tint.toString(16), 1))
            .drawRect(0, 0, 15, 15 );
        let targetPieceSpriteTexture = targetPieceSprite.generateTexture();

		targetPieceEmitter = game.add.emitter(0, 0, 20);
		targetPieceEmitter.x = player.body.position.x + (player.body.width/2);
		targetPieceEmitter.setXSpeed(me.tileSpeed);
		targetPieceEmitter.setYSpeed(me.tileSpeed/2);
		targetPieceEmitter.y = player.body.position.y + (player.body.height/2);
		targetPieceEmitter.makeParticles(targetPieceSpriteTexture);
		targetPieceEmitter.gravity = 1000;

		// me.game.add.tween(targetPieceEmitter).to( { emitX: 0 }, 1000, Phaser.Easing.Sinusoidal.InOut, true, 0, Number.MAX_VALUE, true);

		// target.addChild(targetPieceEmitter);

		targetPieceEmitter.start(true, 4000, null, 40);
		target.kill();
	},

	collideTile: function(player, tile) {
		// var me = this;
		// tile.body.gravity.y = 2000;
	},

	createPlayer: function() {
		var me = this;
		
		let color = playerColor;

		var playerRect = new Phaser.Graphics(me.game)
			.beginFill(Phaser.Color.hexToRGB( color ), 1)
			.drawRect(0, 0, 100, 100 );
		var playerRectTexture = playerRect.generateTexture();
		me.player = me.game.add.sprite(me.game.world.centerX / 2, me.game.world.centerY, playerRectTexture);
		me.player.tint = parseInt(color.slice(1), 16);

		// tsprite.tint = parseInt(color.slice(1), 16);

		// Set the players anchor point to be in the middle horizontally
		me.player.anchor.setTo(0.5, 0.5);

		// Enable physics on the player
		me.game.physics.arcade.enable(me.player);

		// Make the player fall by applying gravity
		// Wait a little bit before restarting game
		me.game.time.events.add(1000, function(){
			me.player.body.gravity.y = 3000;
		}, me);

		// Make the player collide with the game boundaries
		me.player.body.collideWorldBounds = true;

		// This means the players velocity will be unaffected by collisions
		me.player.body.immovable = true;
	},

	createScore: function(){
 
		var me = this;
	
		var scoreFont = "100px Arial";
	
		me.scoreLabel = me.game.add.text((me.game.world.centerX), 100, "0", {font: scoreFont, fill: "#fff", stroke: "#000", strokeThickness: 8}); 
		me.scoreLabel.anchor.setTo(0.5, 0.5);
		me.scoreLabel.align = 'center';
	
	},

	gameOver: function() {
		var me = this;
 
		me.particleBurst(me.player.body.position.x + (me.player.body.width / 2), me.player.body.position.y + (me.player.body.height / 2));
		me.player.kill();
		if (me.musicToggle === 'on') {
			me.clearsideMusic.stop();
		}
		if (me.sfxToggle === 'on') {
			me.explosionSfx.play();
		}
	
		//Wait a little bit before restarting game
		me.game.time.events.add(1000, function(){
			me.game.state.start('GameTitle', true, false, me.scoreLabel.text);
		}, me);
	},

	incrementScore: function(){
 
		var me = this;
	
		me.score += 1;   
		me.scoreLabel.text = me.score;      
	
	},

	getTarget: function() {
		let me = this;
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

			var targetSprite = new Phaser.Graphics(me.game)
				.beginFill(Phaser.Color.hexToRGB( color ), 1)
				.drawRect(0, 0, me.wallWidth, me.wallHeight * me.holeSize );
			var targetSpriteTexture = targetSprite.generateTexture();
			var tsprite = me.game.add.sprite(0,0, targetSpriteTexture);

			tsprite.tint = parseInt(color.slice(1), 16);
			tsprite.exists = false;
			tsprite.visable = false;
			tsprite.alive = false;
			me.game.physics.arcade.enable(tsprite);

		return tsprite;
	},

	onTap: function(){
		var me = this;
		me.player.body.velocity.y -= 120;//80;
	},

	particleBurst: function(x, y) {
		var me = this;

		me.emitter.x = x;
		me.emitter.y = y;

		me.emitter.start(true, 2000, null, 20);
	},

	randomInt: function(min,max) {
		return Math.floor(Math.random()*(max-min+1)+min);
	},

};