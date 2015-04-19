Enemy = function(x, y, spriteName){
	this.sprite = game.add.sprite(x, y, spriteName);

	this.sprite.anchor.setTo(0.5, 0.5);

	//physics
	//game.physics.enable(this.sprite, Phaser.Physics.ARCADE);
	//this.sprite.body.collideWorldBounds = true;
	//animations


	this.vitals = {
		speed: 3,
		health: 10,
		seekRadius: 2000,
		attackCooldown: 0,
		maxAttackCooldown: 25
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

	this.attack = function(otherSprite){
		var dx = this.sprite.x - otherSprite.sprite.x;
		var dy = this.sprite.y - otherSprite.sprite.y;
		var d = Math.sqrt(dx*dx + dy*dy);

		if(d <= 92 && this.vitals.attackCooldown === 0){
			otherSprite.getHit(20);
			this.vitals.attackCooldown = this.vitals.maxAttackCooldown;

			if(otherSprite.isDead()){
				this.logic.target = null;

			}
		}
	}

	this.update = function(){
		EnemyAI.boid(this, enemies);

		//find closest friend (lazily), target them
		if(!this.logic.target ){
			var closestFriend = null;
			var closestD = 1000000;
			friends.forEach(function(f){
				var d = EnemyAI.getDistance(this, f);

				if(!closestFriend || d < closestD){
					closestFriend = f;
				}
			}, this);
			this.logic.target = closestFriend;

			var dx = this.sprite.x - this.logic.target.sprite.x; //- to the right, + to the left
			var dy = this.sprite.y - this.logic.target.sprite.y; //- to the down, + to the up
			var tryTileX = dx < 0 ? -1 : 1;
			var tryTileY = dy < 0 ? -1 : 1;

			var myTile = map.getTile(Math.floor(this.sprite.x/64), Math.floor(this.sprite.y/64), 0);
			var hisTile = map.getTile(Math.floor(this.logic.target.sprite.x/64), Math.floor(this.logic.target.sprite.y/64), 0);
			this.logic.idealPath = EnemyAI.getShortestPath(map, myTile, hisTile, this);
			this.logic.idealPathIndex = 0;
		}

		if(this.logic.target){
			this.attack(this.logic.target);
		}

		if(this.vitals.attackCooldown > 0){
			this.vitals.attackCooldown--;
		}
	}
}