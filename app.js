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

var enemySpawnCooldown = 0;
var maxEnemySpawnCooldown = 120;

var equipment = {
	healthPacks: 1,
	ammoPacks: 1,
	barricades: 2,
}

var isPlacing = false;
var itemToPlace = null;

var config = {

}

window.onload = function(){
	game = new Phaser.Game(WIDTH*2, HEIGHT*2, Phaser.OPENGL, 'game', {preload: preload, create: create, update: update, render: render});

	$('#game')[0].addEventListener('mousewheel', function(e){
		var ds = e.deltaY;
		var dx = e.offsetX;
		var dy = e.offsetY;
		var p = ds/-1000;


		if(game.camera.scale.x + p > 0.5 && game.camera.scale.x + p <= 3){
			//game.camera.scale.x += p;
		}

		if(game.camera.scale.y + p > 0.5 && game.camera.scale.y + p <= 3){	
			//game.camera.scale.y += p;	
		}
	});
}

function preload(){
	game.scale.maxHeight = HEIGHT;
	game.scale.maxWidth = WIDTH;
    game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
    game.scale.setScreenSize();

	//tilemaps
	game.load.tilemap('test', 'res/levels/test.json', null, Phaser.Tilemap.TILED_JSON);

	//tilesets
	game.load.image('base', 'res/img/tileset/tileset.png');

	//sprites
	game.load.atlasJSONHash('blue', 'res/img/char/blue.png', 'res/img/char/penguinanim.json');
	game.load.image('gremlin', 'res/img/char/gremlin.png');
	game.load.image('barricade', 'res/img/pickups/barricade.png');
	game.load.image('health', 'res/img/pickups/health.png');
	game.load.image('ammo', 'res/img/pickups/ammo.png');
}

function create(){
	game.physics.startSystem(Phaser.Physics.ARCADE);

	map = game.add.tilemap('test');
	map.addTilesetImage('base', 'base');
	map.setCollisionBetween(2, 10);
	map.setCollisionBetween(18, 20);
	map.setCollisionBetween(28, 29);
	layer = map.createLayer('layer1', WIDTH*2, HEIGHT*2);
	game.input.onDown.add(onLayerClick, this);
	spawns = map.createLayer('penguinspawns', WIDTH*2, HEIGHT*2);
	spawns.alpha = 0;
	layer.resizeWorld();
	//slayer.debug = true;

	var tiles = layer.getTiles(0, 0, layer.width, layer.height);
	tiles.forEach(function(tile){
		//enemy spawn tiles
		if(tile.index >= 24 && tile.index <= 27){
			enemySpawns.push({x: tile.x, y: tile.y});
		}
	}, this);

	var penguinSpawnSpaces = [];
	var spawnTiles = spawns.getTiles(0, 0, spawns.width, spawns.height);
	spawnTiles.forEach(function(tile){
		if(tile.index===30){
			penguinSpawnSpaces.push(tile);
			tile.destroy();
		}
	}, this);

	if(penguinSpawnSpaces.length != 4){
		throw 'Dufus, we need exactly 4 penguin spawns!';
	}

	blue = new Character(penguinSpawnSpaces[0].x*64-32, penguinSpawnSpaces[0].y*64-32, 'blue');

	green = new Character(penguinSpawnSpaces[1].x*64-32, penguinSpawnSpaces[1].y*64-32, 'blue');

	red = new Character(penguinSpawnSpaces[2].x*64-32, penguinSpawnSpaces[2].y*64-32, 'blue');

	yellow = new Character(penguinSpawnSpaces[3].x*64-32, penguinSpawnSpaces[3].y*64-32, 'blue');

	friends = [blue, green, red, yellow];

	ui = new UI();
}

function update(){
	if(enemySpawnCooldown >= maxEnemySpawnCooldown){
		enemySpawnCooldown = 0;

		var spawn = enemySpawns[Math.round(Math.random()*(enemySpawns.length-1))];

		enemies.push(new Enemy(spawn.x*64+32, spawn.y*64+32, 'gremlin'));
	}else{
		enemySpawnCooldown++;
	}


	for(var i = enemies.length - 1; i >= 0; i--){
		var e = enemies[i];
		e.update();

		if(e.isDead()){
			e.sprite.destroy();
			enemies.splice(i, 1);
		}
	}

	for(var i = friends.length - 1; i >= 0; i--){
		var e = friends[i];
		e.update();

		if(e.isDead()){
			e.sprite.destroy();
			friends.splice(i, 1);
		}
	}

	if(isPlacing){

	}

	ui.update();
}

function render(){
	 // blue.render();
	 // red.render();
	 // yellow.render();
	 // green.render();
}

function onLayerClick(event){
	if(isPlacing){
		var tile = map.getTile(Math.floor(event.worldX/64), Math.floor(event.worldY/64), 0);

		if(tile.properties.solid !== "true"){
			switch(itemToPlace){
				case "healthpack":
					equipment.healthPacks--;
					var newPowerup = game.add.sprite(tile.x*64, tile.y*64, 'health');
					newPowerup.uses = 3;
					newPowerup.name = 'healthpack';
					powerups.push(newPowerup);
				break;
				case "ammopack":
					equipment.ammoPacks--;
					var newPowerup = game.add.sprite(tile.x*64, tile.y*64, 'ammo');
					newPowerup.uses = 3;
					newPowerup.name = 'ammopack';
					powerups.push(newPowerup);
				break;
				case "barricade":
					equipment.barricades--;
					var newPowerup = game.add.sprite(tile.x*64, tile.y*64, 'barricade');
					game.physics.enable(newPowerup, Phaser.Physics.ARCADE);
					newPowerup.body.immovable = true;
					newPowerup.uses = 500;
					newPowerup.name = 'barricade';
					powerups.push(newPowerup);
				break;
				default:
				console.log("I guess I don't know what item: " + itemToPlace + " is...");
				break;
			}

			isPlacing = false;
			itemToPlace = null;
		}
	}	
}


