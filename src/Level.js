Level = function(){

	this.init = function(){
		blue = new Character(0, 0, 'blue');
		blue.vitals.attack = 6;
		blue.vitals.defence = 3;
		blue.vitals.range = 240;

		green = new Character(0, 0, 'green');
		green.vitals.attack = 7;
		green.vitals.defence = 2;
		green.vitals.range = 300;

		red = new Character(0, 0, 'red');
		red.vitals.attack = 2;
		red.vitals.defence = 7;
		red.vitals.range = 150;

		yellow = new Character(0,0, 'yellow');
		yellow.vitals.attack = 3;
		yellow.vitals.defence = 6;
		yellow.vitals.range = 240;

		friends = [blue, green, red, yellow];	}

	this.createLevel = function(tilemap, config){

		if(map){
			map.destroy();
		}

		if(layer){
			layer.destroy();
		}

		for(var i = enemies.length - 1; i >= 0; i--){
			var e = enemies[i];

			e.sprite.destroy();
			enemies.splice(i, 1);
		}

		for(var i = friends.length - 1; i >= 0; i--){
			var friend = friends[i];
			friend.logic.movementGoal = null;
			friend.logic.idealPath = [];
			friend.logic.idealPathIndex = 0;
		}

		for(var i = powerups.length - 1; i >= 0; i--){
			var p = powerups[i];
			p.destroy();
		}

		powerups = [];


		enemySpawns = [];

		this.config = config;
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
		game.world.sendToBack(layer);

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
			}
		}, this);

		if(penguinSpawnSpaces.length != 4){
			throw 'Dufus, we need exactly 4 penguin spawns!';
		}

		blue.sprite.x = penguinSpawnSpaces[0].x*64-32;
		blue.sprite.y = penguinSpawnSpaces[0].y*64-32;
		blue.vitals.health = blue.vitals.maxHealth;
		blue.vitals.ammo = blue.vitals.maxAmmo;
		

		green.sprite.x = penguinSpawnSpaces[1].x*64-32;
		green.sprite.y = penguinSpawnSpaces[1].y*64-32;
		green.vitals.health = green.vitals.maxHealth;
		green.vitals.ammo = green.vitals.maxAmmo;
		

		red.sprite.x = penguinSpawnSpaces[2].x*64-32;
		red.sprite.y = penguinSpawnSpaces[2].y*64-32;
		red.vitals.health = red.vitals.maxHealth;
		red.vitals.ammo = red.vitals.maxAmmo;
		

		yellow.sprite.x = penguinSpawnSpaces[3].x*64-32;
		yellow.sprite.y = penguinSpawnSpaces[3].y*64-32;
		yellow.vitals.health = yellow.vitals.maxHealth;
		yellow.vitals.ammo = yellow.vitals.maxAmmo;

		if(levelIndex > 1){
			levelUpScreen.show();
		}
		
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

			friends.forEach(function(f){
				if(f.isDead()){
					f.vitals.health = 30;
				}
			}, this);
		}else{
			this.completeLevel();
		}
	}

	this.completeLevel = function(){
		red.vitals.avalibleSkillPoints += this.config.skillPointsForBeating;
		blue.vitals.avalibleSkillPoints += this.config.skillPointsForBeating;
		green.vitals.avalibleSkillPoints += this.config.skillPointsForBeating;
		yellow.vitals.avalibleSkillPoints += this.config.skillPointsForBeating;


		levelIndex++;
		
		if(levelIndex > 4){
			messages.push("Looks like this is where we depart.  Thanks for all the help, commander.  You really helped us to push through this cave.");
			messages.push("And of course, thanks for playing the game.  This game was created in 48 hours by Cudabear for Ludum Dare 32: An Unconventional Weapon.");
			messages.push("You can press space to restart from level 1.  You will keep your stats.");
			levelIndex = 1;
		}else{
			LevelFactory.createLevel(levelIndex)
		}
	}

	this.init();
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
					skillPointsForBeating: 1,
					waves: [
						{enemies: 10,
						 cooldown: 160,
						 newBarricades: 0,
						 newHealthKits: 0,
						 newAmmoKits: 0,
						 messages: [],
						 messages: ["Finally!  You must be the new commander.  We've been stuck down in these caves for weeks and news has been scarce. (press space to continue)",
						  "We were afraid for a little while that HQ might have fogotten about us... heh.  As though they would ever do that.",
						  "Anyway, nice to meet you.  My codename is Blue.  These are my teammates, Red, Yellow, and Green.  You can reccognize us by our headbands.",
						  "Unfortunately, there's not much to do around here right now.  Even so, it's good to see you.  We could use your help cleaning up some of the trash around here.",
						  "Speaking of which, here comes some now.  Commander, when you're ready, deploy us some crates in this chokepoint so the rodents can't get to us.",
						  "(Click on the crate icon in the lower left, or press A key.  Then select the ground where you'd like to deploy the crate.)"]
						},
						{enemies: 20,
						 cooldown: 140,
						 newBarricades: 3,
						 newHealthKits: 0,
						 newAmmoKits: 1,
						 messages: ["Thanks for the assist, commander.  It's good to see that HQ hasn't forgone us the privledge of such a skilled crate deployer",
						 "It looks like we're not quite done yet.  You'll be able to deploy more crates every wave of enemies that come, so I suggest you plop some down now",
						 "And while you're at it, we're getting a bit low on ammunition.  It would be mighty appreciated if you could deploy some fresh cartridges for our guns",
						 "(Click on the ammunition crate in the lower left, or press D.  Then, click the ground where you would like to deploy the ammo pack.  Your troops will use it automatically.)"]
						},
						{enemies: 40,
					     cooldown: 120,
					     newBarricades: 3,
						 newHealthKits: 1,
						 newAmmoKits: 0,
					     messages: ["I've never seen these little buggers out so fierce!  I wonder what's got them all riled up?",
					     "Whatever it is, looks like they're mounting the biggest attack yet.  If we can keep them from breaking through the choke, we should be fine.",
					     "However, while you're at it, commander, could you deploy a medkit?  It would be nice to patch up any scratches we might get on the way.",
					     "(Click the medkit in the lower left or press S, then click the ground.  Your troops will retreat to wherever you put the medkit when they are injured, so place it carefully!)"],
						}
					]}

				return level.createLevel('level1', config);
			break;
			case 2:
				var config = {
					startHealthKits: 0,
					startAmmoKits: 0, 
					startBarricades: 5, 
					skillPointsForBeating: 2,
					waves: [
						{enemies: 20,
						 cooldown: 140,
						 newBarricades: 0,
						 newHealthKits: 0,
						 newAmmoKits: 0,
						 messages: ["We gain experience\n from each successful\n battle. Here you can\n choose what we specialize\n in.\n (Press the red X to close)",
						 "We were waiting for the order to push through this cave for a while now, it seems that order has finally come.",
						 "Pushing out these locals shouldn't be too hard, they mostly just like to claw your eyes out.  It's only bad when they get you at night.",
						 "Red over here a nasty wake up call just the other night when he forgot to establish a parameter for camp!"]
						},
						{enemies: 40,
						 cooldown: 100,
						 newBarricades: 3,
						 newHealthKits: 1,
						 newAmmoKits: 1,
						 messages: ["So what's at the other end of this cave, anyway?  We were never told, just that we need to clear it out."]
						},
						{enemies: 50,
					     cooldown: 80,
					     newBarricades: 3,
						 newHealthKits: 1,
						 newAmmoKits: 1,
					     messages: ["Easy peasy.  One more wave ought to get rid of the critters in this area."],
						}
					]}

					return level.createLevel('level2', config);
			break;
			case 3:
				var config = {
					startHealthKits: 1,
					startAmmoKits: 1, 
					startBarricades: 10, 
					skillPointsForBeating: 2,
					waves: [
						{enemies: 20,
						 cooldown: 100,
						 newBarricades: 0,
						 newHealthKits: 0,
						 newAmmoKits: 0,
						 messages: ["Things are getting pretty intense, now."]
						},
						{enemies: 40,
						 cooldown: 80,
						 newBarricades: 3,
						 newHealthKits: 1,
						 newAmmoKits: 1,
						 messages: []
						},
						{enemies: 60,
					     cooldown: 50,
					     newBarricades: 3,
						 newHealthKits: 1,
						 newAmmoKits: 1,
					     messages: ["It seems this area is almost cleared out.  We should have one more area to go."],
						}
					]}

					return level.createLevel('level4', config);
			case 4:
				var config = {
					startHealthKits: 2,
					startAmmoKits: 2, 
					startBarricades: 15, 
					skillPointsForBeating: 3,
					waves: [
						{enemies: 40,
						 cooldown: 60,
						 newBarricades: 10,
						 newHealthKits: 2,
						 newAmmoKits: 2,
						 messages: ["This is a huge area!  We tend to be pretty agressive.  You can control our actions as well as the enemy's with crates."]
						},
						{enemies: 60,
						 cooldown: 50,
						 newBarricades: 15,
						 newHealthKits: 2,
						 newAmmoKits: 2,
						 messages: ["It's almost like this swarm of the same enemy we've been fighting this whole time is supposed to take the place of something else..."]
						},
						{enemies: 80,
					     cooldown: 40,
					     newBarricades: 15,
						 newHealthKits: 2,
						 newAmmoKits: 2,
					     messages: ["I'd expect an epic final battle, or something.  Oh well!  I suppose one more wave ought to do it.  Let's finally finish this job!"],
						}
					]}

					return level.createLevel('level5', config);
			break;
		}
	}
}