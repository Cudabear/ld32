//Used for the 4 main characters: red, blue, green, yellow
Character = function(x, y, spriteName){
	this.sprite = game.add.sprite(x, y, spriteName);

	//animations
	this.sprite.animations.add('stand', [0, 1]);
	this.sprite.animations.add('walk', [2, 3]);
	this.sprite.animations.add('shoot', [4, 5]);

	this.sprite.anchor.setTo(0.5, 0.5);

	//physics
	game.physics.enable(this.sprite, Phaser.Physics.ARCADE);
	this.sprite.body.collideWorldBounds = true;
	//this.sprite.body.velocity.x = (Math.random()-2)*2;
	//this.sprite.body.velocity.y = (Math.random()-2)*2;

	this.vitals = {
		speed: 100,
		health: 10,
		shotCooldown: 0,
		maxShotCooldown: 25
	}

	this.logic = {
		isMoving: false,
		target: null,
		chosenDestination: {
			x: 0,
			y: 0
		}
	}




	this.doStand = function(){
		this.sprite.animations.play('stand', 4, false);
	}

	this.doWalk = function(){
		this.sprite.animations.play('walk', 4, false);
	}

	this.doShoot = function(){
		this.sprite.animations.play('shoot', 8, false);
	}

	this.getHit = function(damage){
		this.vitals.health -= damage;
	}

	this.render = function(){
		game.debug.body(this.sprite);
	}

	this.getHit = function(damage){
		this.vitals.health -= damage;
	}

	this.isDead = function(){
		return this.vitals.health <= 0;
	}

	this.update = function(){
		game.physics.arcade.collide(this.sprite, layer);

		friends.forEach(function(e){
			game.physics.arcade.collide(this.sprite, e.sprite);
		}, this);

		enemies.forEach(function(e){
			game.physics.arcade.collide(this.sprite, e.sprite);
		}, this);

		if(!this.logic.target){
			
			FriendAI.boid(this, friends);

			this.doWalk();

			enemies.forEach(function(e){
				var dx = this.sprite.x - e.sprite.x;
				var dy = this.sprite.y - e.sprite.y;
				var d = Math.sqrt(dx*dx + dy*dy);

				if(d < 300){
					this.logic.target = e;
				}
			}, this);
		}else if(!this.logic.target.isDead()){
			if(this.vitals.shotCooldown === 0){
				this.doShoot();
				this.sprite.body.velocity.setTo(0);
				this.logic.target.getHit(1);
				this.vitals.shotCooldown = this.vitals.maxShotCooldown;
			}
		}else{
			this.logic.target = null;
		}

		if(this.vitals.shotCooldown > 0){
			this.vitals.shotCooldown--;
		}
	}
}