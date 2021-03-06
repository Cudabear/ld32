var WIDTH = 960;
var HEIGHT = 640;
var game;

var currentCameraPositionX;
var currentCameraPositionY;

var blue;
var green;
var red;
var yellow;
var ui;
var friends = [];
var enemies = [];
var enemySpawns = [];
var powerups = [];

var level;
var powerupGraphics;

var enemySpawnCooldown = 0;
var maxEnemySpawnCooldown = 120;
var currentWave = 0;
var remainingEnemies = 0;

var messageIndex;
var messages = [];

var speechBox = null;
var speechBoxText = null;
var speechBoxTitleText = null;

var equipment = {
	healthPacks: 1,
	ammoPacks: 1,
	barricades: 200,
}

var isPlacing = false;
var itemToPlace = null;

var levelUpScreen;
var levelUpScreenOpen;

var map;
var layer;

var isLoading = false;

var aKey;
var sKey;
var dKey;
var spacebar;
var spacebarSpamProtection = 0;
var rKey;

var hasAnyoneDiedYet = false;

var levelIndex = 1;

var sound = {
	bgMusic: null,
	shoot: null,
	hurt: null
}

window.onload = function(){
	game = new Phaser.Game(WIDTH*2, HEIGHT*2, Phaser.OPENGL, 'game', {preload: preload, create: create, update: update, render: render});

	$(window).trigger('resize');
}

function preload(){
	game.scale.maxHeight = HEIGHT;
	game.scale.maxWidth = WIDTH;
    game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
    game.scale.setScreenSize();

	//tilemaps
	game.load.tilemap('level1', 'res/levels/level1.json', null, Phaser.Tilemap.TILED_JSON);
	game.load.tilemap('level2', 'res/levels/level2.json', null, Phaser.Tilemap.TILED_JSON);
	//I broke level 3 and didn't have time ot fix it :D
	game.load.tilemap('level4', 'res/levels/level4.json', null, Phaser.Tilemap.TILED_JSON);
	game.load.tilemap('level5', 'res/levels/level5.json', null, Phaser.Tilemap.TILED_JSON);

	//tilesets
	game.load.image('base', 'res/img/tileset/tileset.png');

	//sprites
	game.load.atlasJSONHash('blue', 'res/img/char/blue.png', 'res/img/char/penguinanim.json');
	game.load.atlasJSONHash('red', 'res/img/char/red.png', 'res/img/char/penguinanim.json');
	game.load.atlasJSONHash('green', 'res/img/char/green.png', 'res/img/char/penguinanim.json');
	game.load.atlasJSONHash('yellow', 'res/img/char/yellow.png', 'res/img/char/penguinanim.json');
	game.load.atlasJSONHash('gremlin', 'res/img/char/enemy.png', 'res/img/char/enemyanim.json');
	game.load.image('barricade', 'res/img/pickups/barricade.png');
	game.load.image('health', 'res/img/pickups/health.png');
	game.load.image('ammo', 'res/img/pickups/ammo.png');
	game.load.image('chatbubble', 'res/img/char/chatbubble.png');
	game.load.image('chatbox', 'res/img/char/chatbox.png');

	//music
	game.load.audio('bgMusic', 'res/sfx/ld32theme.ogg');
	game.load.audio('hit', 'res/sfx/shoot.wav');
	game.load.audio('hurt', 'res/sfx/hurt.wav');

	doPreloadStuff();
}

function create(){
	game.physics.startSystem(Phaser.Physics.ARCADE);

	level = new Level();
	
	sound.bgMusic = game.add.audio('bgMusic');
	sound.bgMusic.loop = true;
	sound.bgMusic.play();

	sound.hurt = game.add.audio('hurt');
	sound.shoot = game.add.audio('hit');

	LevelFactory.createLevel(levelIndex);

	powerupGraphics = game.add.graphics(0, 0);

	speechBox = game.add.image(30, HEIGHT, 'chatbox');
	speechBox.scale.setTo(2);
	speechBox.alpha = 0;
	speechBoxText = game.add.text(50, HEIGHT + 110, "", {fill: "#FFFFFF", font: "26pt arial", wordWrap: true, wordWrapWidth: speechBox.width - 30});
	speechBoxText.alpha = 0;
	speechBoxTitleText = game.add.text(60, HEIGHT + 30, "Communicator", {fill: "#FFFFFF", font: "32pt arial"});
	speechBoxTitleText.alpha = 0;

	ui = new UI();

	aKey = game.input.keyboard.addKey(Phaser.Keyboard.A);
	sKey = game.input.keyboard.addKey(Phaser.Keyboard.S);
	dKey = game.input.keyboard.addKey(Phaser.Keyboard.D);
	spacebar = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
	rKey = game.input.keyboard.addKey(Phaser.Keyboard.R);

	levelUpScreen = new LevelUpScreen();
}

function update(){
	if(!isLoading){
		if(messageIndex < messages.length){   
			speechBox.alpha = 1;
			speechBoxText.alpha = 1;
			speechBoxTitleText.alpha = 1;

			speechBoxText.setText(messages[messageIndex]);

			if(spacebar.isDown && spacebarSpamProtection > 30){
				messageIndex++;
				spacebarSpamProtection = 0;
			}else{
				spacebarSpamProtection++;
			}
		}else if(levelUpScreenOpen){
			//handled by HTML
		}else{
			speechBox.alpha = 0;
			speechBoxText.alpha = 0;
			speechBoxTitleText.alpha = 0;


			if(enemySpawnCooldown >= maxEnemySpawnCooldown && remainingEnemies > 0){
				enemySpawnCooldown = 0;

				var spawn = enemySpawns[Math.round(Math.random()*(enemySpawns.length-1))];

				enemies.push(new Enemy(spawn.x*64+32, spawn.y*64+32, 'gremlin'));
				remainingEnemies--;
			}else{
				enemySpawnCooldown++;
			}

			if(remainingEnemies < 1 && enemies.length == 0){
				level.completeWave();
			}


			for(var i = enemies.length - 1; i >= 0; i--){
				var e = enemies[i];
				e.update();

				if(e.isDead()){
					e.sprite.destroy();
					enemies.splice(i, 1);
				}
			}

			var anyoneAlive = false;
			for(var i = friends.length - 1; i >= 0; i--){
				var e = friends[i];
				e.update();

				if(!e.isDead()){
					anyoneAlive = true;
				}else{
					if(!hasAnyoneDiedYet){
						hasAnyoneDiedYet = true;
						messages.push("Looks like one of our troops has fallen in battle.  Don't worry about them, they will revive and look for a helath kit after this wave of enemies.");
					}
				}


			}

			if(!anyoneAlive){
				messages.push("How could you let all of our troops die?  Didn't you protect them?!  (Press R to restart)");
			}

			if(!isPlacing){
				if(aKey.isDown && equipment.barricades > 0){
					itemToPlace = "barricade";
					isPlacing = true;
					changeCursorToImage("res/img/pickups/barricadesmall.png");
				}else if(sKey.isDown && equipment.healthPacks > 0){
					itemToPlace = "healthpack";
					isPlacing = true;
					changeCursorToImage("res/img/pickups/healthsmall.png");
				}else if(dKey.isDown && equipment.ammoPacks > 0){
					itemToPlace = "ammopack";
					isPlacing = true;
					changeCursorToImage("res/img/pickups/ammosmall.png");
				}
			}

			
		}

		ui.update();
		levelUpScreen.update();

		if(rKey.isDown){
			LevelFactory.createLevel(levelIndex);
		}
	}
}

function changeCursorToImage(url){
    var cur = $('#game');
    cur.css("cursor", "url("+url+"), default");
}

function changeCursorToPointer(){
	var cur = $('#game');
    cur.css("cursor", "default");
}

function render(){
	  //blue.render();
	 // red.render();
	 // yellow.render();
	 // green.render();

	 friends.forEach(function(f){
	 	f.render();
	 },this);

	powerupGraphics.clear();
	powerups.forEach(function(powerup){
		powerupGraphics.beginFill(0x009900);
		powerupGraphics.moveTo(powerup.x - powerup.width/2,
		 powerup.y - powerup.height/2 + powerup.height );
		powerupGraphics.lineTo(powerup.x - powerup.width/2 + (powerup.width*(powerup.uses/powerup.maxUses)),
		 powerup.y - powerup.height/2 + powerup.height );
		powerupGraphics.lineTo(powerup.x - powerup.width/2 + (powerup.width*(powerup.uses/powerup.maxUses)),
		 powerup.y - powerup.height/2 + powerup.height + 5);
		powerupGraphics.lineTo(powerup.x - powerup.width/2,
		 powerup.y - powerup.height/2 + powerup.height + 5);
		powerupGraphics.lineTo(powerup.x - powerup.width/2,
		 powerup.y - powerup.height/2 + powerup.height);
		powerupGraphics.endFill();
	});
}

function doPreloadStuff(){

}

function onLayerClick(event){
	if(isPlacing){
		var tile = map.getTile(Math.floor(event.worldX/64), Math.floor(event.worldY/64), 0);

		if(tile.properties.solid !== "true"){
			switch(itemToPlace){
				case "healthpack":
					equipment.healthPacks--;
					var newPowerup = game.add.sprite(tile.x*64 + 32, tile.y*64  +32, 'health');
					newPowerup.anchor.setTo(0.5);
					newPowerup.uses = 500;
					newPowerup.maxUses = 500;
					newPowerup.name = 'healthpack';
					powerups.push(newPowerup);
				break;
				case "ammopack":
					equipment.ammoPacks--;
					var newPowerup = game.add.sprite(tile.x*64+32, tile.y*64+32, 'ammo');
					newPowerup.anchor.setTo(0.5);
					newPowerup.uses = 500;
					newPowerup.maxUses = 500;
					newPowerup.name = 'ammopack';
					powerups.push(newPowerup);
				break;
				case "barricade":
					equipment.barricades--;
					var newPowerup = game.add.sprite(tile.x*64+32, tile.y*64+32, 'barricade');
					newPowerup.anchor.setTo(0.5);
					game.physics.enable(newPowerup, Phaser.Physics.ARCADE);
					newPowerup.body.immovable = true;
					newPowerup.uses = 500;
					newPowerup.sprite = newPowerup;
					newPowerup.maxUses =500;
					newPowerup.name = 'barricade';
					newPowerup.getHit = function(damage){
						this.uses -= damage;
						sound.hurt.play();

						if(this.uses < 1){
							this.destroy();
							
							var i = powerups.indexOf(this);
							powerups.splice(i, 1);
						}
					};
					newPowerup.isDead = function(){
						return this.uses < 1;
					}
					powerups.push(newPowerup);
				break;
				default:
				console.log("I guess I don't know what item: " + itemToPlace + " is...");
				break;
			}

			isPlacing = false;
			changeCursorToPointer();
			itemToPlace = null;
		}
	}	
}


