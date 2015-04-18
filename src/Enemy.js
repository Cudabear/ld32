Enemy = function(x, y, spriteName){
	this.sprite = game.add.sprite(x, y, spriteName);

	this.sprite.anchor.setTo(0.5, 0.5);

	//physics
	game.physics.enable(this.sprite, Phaser.Physics.ARCADE);
	this.sprite.body.collideWorldBounds = true;
	//animations


	this.vitals = {
		speed: 100,
		health: 10,
		seekRadius: 1080
	}

	this.logic = {
		isMoving: false,
		idealPath: [],
		idealPathIndex: 0,
		target: null,
	}

	this.doWalk = function(){}

	this.doStand = function(){}

	this.doShoot = function(){}

	this.getHit = function(damage){
		this.vitals.health -= damage;
	}

	this.isDead = function(){
		return this.vitals.health <= 0;
	}

	this.update = function(){
		EnemyAI.boid(this, enemies);

		//find closest friend (lazily), target them
		if(!this.logic.target){
			var closestFriend = null;
			var closestD = 1000000;
			friends.forEach(function(f){
				var d = EnemyAI.getDistance(this, f);

				if(!closestFriend || d < closestD){
					closestFriend = f;
				}
			}, this);
			this.target = closestFriend;

			var myTile = map.getTile(Math.floor(this.sprite.x/64), Math.floor(this.sprite.y/64), 0);
			var hisTile = map.getTile(Math.floor(closestFriend.sprite.x/64), Math.floor(closestFriend.sprite.y/64), 0);
			this.logic.idealPath = EnemyAI.getShortestPath(map, myTile, hisTile);
			this.logic.idealPathIndex = 0;
		}else{
			if(this.logic.target.isDead()){
				!this.logic.target;
			}
		}


		game.physics.arcade.collide(this.sprite, layer);

		friends.forEach(function(e){
			if(game.physics.arcade.collide(this.sprite, e.sprite)){
				e.getHit(1);
			}
		}, this);

		enemies.forEach(function(e){
			game.physics.arcade.collide(this.sprite, e.sprite);
		}, this);

		for(var i = powerups.length -1; i >= 0; i--){
			var e = powerups[i];
			if(e.name === 'barricade'){
				if(game.physics.arcade.collide(this.sprite, e)){
					e.uses--;
					if(e.uses < 1){
						e.destroy();
						powerups.splice(i, 1);
					}
				}
			}
		}
		
	}
}