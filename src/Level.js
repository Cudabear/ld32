Level = function(tilemap, config){

	this.tilemap = tilemap ? tilemap : 'test';
	this.config = config ? config : {
		startHealthKits: 1,
		perWaveHealthKits: 1,
		startAmmoKits: 1, 
		perWaveAmmoKits: 1, 
		startBarricades: 5, 
		perWaveBarricades: 5, 
		waves: [
			{enemies: 10,
			 cooldown: 160
			},
			{enemies: 50,
			 cooldown: 140
			},
			{enemies: 100,
		     cooldown: 120
			}
		]
	}

	this.createLevel = function(){
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
		//layer.debug = true;

		currentWave = 1;
		remainingEnemies = this.config.waves[currentWave - 1].enemies;
		maxEnemySpawnCooldown = this.config.waves[currentWave -1 ].cooldown;


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
	}

	this.completeWave = function(){
		currentWave++;

		if(currentWave <= this.config.waves.length){
			remainingEnemies = this.config.waves[currentWave -1].enemies;
			maxEnemySpawnCooldown = this.config.waves[currentWave -1 ].cooldown;
		}else{
			this.completeLevel();
		}
	}

	this.completeLevel = function(){
		console.log("Hurrah, you beat the game!");
	}

	this.createLevel();
}