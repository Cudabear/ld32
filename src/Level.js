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
			 cooldown: 160,
			 messages: []
			},
			{enemies: 50,
			 cooldown: 140,
			 message: []
			},
			{enemies: 100,
		     cooldown: 120,
		     message: [],
			}
		]
	}

	this.createLevel = function(){
		map = game.add.tilemap(tilemap);
		map.addTilesetImage('base', 'base');
		map.setCollisionBetween(2, 10);
		map.setCollisionBetween(18, 20);
		map.setCollisionBetween(28, 29);
		map.setCollisionBetween(37, 38);
		layer = map.createLayer('layer1', WIDTH*2, HEIGHT*2);
		game.input.onDown.add(onLayerClick, this);
		spawns = map.createLayer('penguinspawns', WIDTH*2, HEIGHT*2);
		spawns.alpha = 0;
		layer.resizeWorld();
		//layer.debug = true;

		currentWave = 1;
		remainingEnemies = this.config.waves[currentWave - 1].enemies;
		maxEnemySpawnCooldown = this.config.waves[currentWave -1 ].cooldown;
		messageIndex = 0;
		messages = this.config.waves[currentWave -1 ].messages;

		equipment.healthPacks = this.config.startHealthKits;
		equipment.ammoPacks = this.config.startAmmoKits;
		equipment.barricades = this.config.startBarricades;


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
			messageIndex = 0;
			messages = this.config.waves[currentWave -1 ].messages;

			equipment.ammoPacks += this.config.waves[currentWave -1].newAmmoKits;
			equipment.healthPacks += this.config.waves[currentWave -1].newHealthKits;
			equipment.barricades += this.config.waves[currentWave -1].newBarricades;
		}else{
			this.completeLevel();
		}
	}

	this.completeLevel = function(){
		console.log("Hurrah, you beat the game!");
	}

	this.createLevel();
}

LevelFactory = {
	createLevel(levelIndex){
		switch(levelIndex){
			case 1:
				var config = {
					startHealthKits: 0,
					perWaveHealthKits: 0,
					startAmmoKits: 0, 
					perWaveAmmoKits: 1, 
					startBarricades: 5, 
					perWaveBarricades: 3, 
					waves: [
						{enemies: 10,
						 cooldown: 200,
						 newBarricades: 0,
						 newHealthKits: 0,
						 newAmmoKits: 0,
						 messages: ["Finally!  You must be the new commander.  We've been stuck down in these caves for weeks and news has been scarce. (press space to continue)",
						  "We were afraid for a little while that HQ might have fogotten about us... heh.  As though they would ever do that.",
						  "Anyway, nice to meet you.  My codename is Blue.  These are my teammates, Red, Yellow, and Green.  You can reccognize us by our headbands.",
						  "Unfortunately, there's not much to do around here right now.  Even so, it's good to see you.  We could use your help cleaning up some of the trash around here.",
						  "Speaking of which, here comes some now.  Commander, when you're ready, deploy us some crates in this chokepoint so the rodents can't get to us.",
						  "(Click on the crate icon in the lower left, or press A key.  Then select the ground where you'd like to deploy the crate.)"]
						},
						{enemies: 20,
						 cooldown: 160,
						 newBarricades: 3,
						 newHealthKits: 0,
						 newAmmoKits: 1,
						 messages: ["Thanks for the assist, commander.  It's good to see that HQ hasn't forgone us the privledge of such a skilled crate deployer",
						 "It looks like we're not quite done yet.  You'll be able to deploy more crates every wave of enemies that come, so I suggest you plop some down now",
						 "And while you're at it, we're getting a bit low on ammunition.  It would be mighty appreciated if you could deploy some fresh cartridges for our guns",
						 "(Click on the ammunition crate in the lower left, or press D.  Then, click the ground where you would like to deploy the ammo pack.  Your troops will use it automatically.)"]
						},
						{enemies: 40,
					     cooldown: 140,
					     newBarricades: 3,
						 newHealthKits: 1,
						 newAmmoKits: 0,
					     messages: ["I've never seen these little buggers out so fierce!  I wonder what's got them all riled up?",
					     "Whatever it is, looks like they're mounting the biggest attack yet.  If we can keep them from breaking through the choke, we should be fine.",
					     "However, while you're at it, commander, could you deploy a medkit?  It would be nice to patch up any scratches we might get on the way.",
					     "(Click the medkit in the lower left or press S, then click the ground.  Your troops will retreat to wherever you put the medkit when they are injured, so place it carefully!)"],
						}
					]}

				return new Level('level1', config);
			break;
			case 2:
				var config = {}
			break;
			case 3:
				var config = {}
			break;
			case 4:
				var config = {}
			break;
			case 5:
				var config = {}
			break;
		}
	}
}