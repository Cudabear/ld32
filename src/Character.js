//Used for the 4 main characters: red, blue, green, yellow
Character = function(x, y, spriteName){
	this.sprite = game.add.sprite(x, y, spriteName);

	//animations
	this.sprite.animations.add('stand', [0, 1]);
	this.sprite.animations.add('walk', [2, 3]);
	this.sprite.animations.add('shoot', [4, 5]);
	this.sprite.animations.add('dead', [6]);

	this.chatBubble =  game.add.image(x, y, 'chatbubble');
	this.chatBubble.scale.setTo(2);
	this.chatBubble.alpha = 0;
	this.chatText = game.add.text(x, y, '', {fill: "#000000", font: "16pt arial", wordWrap: true, wordWrapWidth: this.chatBubble.width - 10});
	this.chatText.alpha = 0;

	this.sprite.anchor.setTo(0.5, 0.5);

	this.graphics = game.add.graphics(0, 0);

	//physics
	//game.physics.enable(this.sprite, Phaser.Physics.ARCADE);
	//this.sprite.body.collideWorldBounds = true;
	//this.sprite.body.setSize(50, 60, 5, 20)
	//this.sprite.body.immovable = true;
	//this.sprite.body.velocity.x = (Math.random()-2)*2;
	//this.sprite.body.velocity.y = (Math.random()-2)*2;

	this.vitals = {
		//this gets a much lower speed than enemies because we aren't using velocity to move the sprites
		speed: 3,
		health: 100,
		maxHealth: 100,
		ammo: 100,
		maxAmmo: 100,
		shotCooldown: 0,
		maxShotCooldown: 25,
		attack: 1,
		defence: 1,
		range: 300,
		avalibleSkillPoints: 0,
	}

	this.logic = {
		isSpeaking: false,
		speakCooldown: 0,
		maxSpeakCooldown: 1200,
		timeSpoke: 0,
		maxTimeSpoke: 240,
		message: "",

		target: null,
		movementGoal: null,
		idealPath: [],
		idealPathIndex: 0,
		myTile: null,
		movementCooldown: 0,
		maxMovementCooldown: 360
	}




	this.doStand = function(){
		this.sprite.animations.play('stand', 4, false);
	}

	this.doWalk = function(){
		this.sprite.animations.play('walk', 4, false);
	}

	this.doDie = function(){
		this.sprite.animations.play('dead', 50, true);
	}

	this.doShoot = function(){
		this.sprite.animations.play('shoot', 8, false);
	}

	this.getHit = function(damage){
		this.vitals.health -= Math.max(0, damage - this.vitals.defence);
	}

	this.render = function(){
		game.debug.body(this.sprite);
	}

	this.getHit = function(damage){
		this.vitals.health -= damage;
		sound.hurt.play();
	}

	this.isDead = function(){
		return this.vitals.health <= 0;
	}

	this.speak = function(){

	}

	this.update = function(){
		if(!this.isDead()){
			game.physics.arcade.collide(this.sprite, layer);

			friends.forEach(function(e){
				game.physics.arcade.collide(this.sprite, e.sprite);
			}, this);

			if(!this.logic.myTile){
				this.logic.myTile = map.getTile(Math.floor(this.sprite.x/64), Math.floor(this.sprite.y/64), 0);
			}

			enemies.forEach(function(e){
				game.physics.arcade.collide(this.sprite, e.sprite);
			}, this);

			if(!this.logic.target){
				
				

				

				enemies.forEach(function(e){
					var dx = this.sprite.x - e.sprite.x;
					var dy = this.sprite.y - e.sprite.y;
					var d = Math.sqrt(dx*dx + dy*dy);

					if(d < this.vitals.range){
						this.logic.target = e;
					}
				}, this);

				FriendAI.boid(this, friends);
			}else if(!this.logic.target.isDead()){
				if(this.vitals.shotCooldown === 0 && this.vitals.ammo > 0){
					this.doShoot();
					sound.shoot.play();
					//this.sprite.body.velocity.setTo(0);
					this.logic.target.getHit(this.vitals.attack);
					this.vitals.ammo--;
					this.vitals.shotCooldown = this.vitals.maxShotCooldown;
				}else if(this.vitals.ammo <= 0){
					this.logic.isSpeaking = true;
					this.logic.speakCooldown = this.logic.maxSpeakCooldown;
					this.logic.timeSpoke = this.logic.maxTimeSpoke;
					this.chatText.setText("I'm out of ammo!");
					this.chatText.alpha = 1;
					this.chatBubble.alpha = 1;
				}
			}else{
				this.logic.target = null;
			}
			//let's always search for these if we need them.
			if(this.logic.idealPath.length === 0){
				if(this.vitals.health < this.vitals.maxHealth*0.33){
					powerups.forEach(function(e){
						if(e.name == "healthpack"){
							this.logic.movementGoal = e;

							var hisTile = map.getTile(Math.floor(e.x/64), Math.floor(e.y/64), 0);
							this.logic.idealPath = EnemyAI.getShortestPath(map, this.logic.myTile, hisTile, this);
							this.logic.idealPathIndex = 0;
							this.logic.movementCooldown = this.logic.maxMovementCooldown;
						}
					}, this);
				} else if(this.vitals.ammo < this.vitals.maxAmmo*0.33){
					powerups.forEach(function(e){
						if(e.name == "ammopack"){
							this.logic.movementGoal = e;

							var hisTile = map.getTile(Math.floor(e.x/64), Math.floor(e.y/64), 0);
							this.logic.idealPath = EnemyAI.getShortestPath(map, this.logic.myTile, hisTile, this);
							this.logic.idealPathIndex = 0;
							this.logic.movementCooldown = this.logic.maxMovementCooldown;
						}
					}, this);
				}

				if(this.logic.idealPath.length === 0){
					var myFriend = null;

					friends.forEach(function(friend){
						//the friend is fighting something, let's go help
						if(friend.logic.target){
							myFriend = friend;
						}
					}, this);

					if(myFriend){
						var destTile;

						while(!destTile || destTile.properties.solid !== "false"){
							var destX = myFriend.logic.myTile.x + Math.round(Math.random()*4 - 2);
							var destY = myFriend.logic.myTile.y + Math.round(Math.random()*4 - 2);

							destTile = map.getTile(destX, destY, 0);
						}

						this.logic.idealPath = EnemyAI.getShortestPath(map, this.logic.myTile, destTile, this);
						this.logic.idealPathIndex = 0;
						this.logic.movementCooldown = this.logic.maxMovementCooldown;
					}
				}

				if(this.logic.idealPath.length === 0){
					//if we still haven't found anything, just move randomly
					if(this.logic.idealPath.length === 0 && this.logic.movementCooldown === 0){
						this.logic.movementCooldown = this.logic.maxMovementCooldown;

						var destTile;

						while(!destTile || destTile.properties.solid !== "false"){
							var destX = this.logic.myTile.x + Math.round(Math.random()*8 - 4);
							var destY = this.logic.myTile.y + Math.round(Math.random()*8 - 4);

							destTile = map.getTile(destX, destY, 0);
						}

						this.logic.idealPath = EnemyAI.getShortestPath(map, this.logic.myTile, destTile, this);
						this.logic.idealPathIndex = 0;
					}else{
						this.doStand();
					}
				}
			}

			if(this.logic.movementGoal){
				var dx = this.logic.movementGoal.x - this.sprite.x;
				var dy = this.logic.movementGoal.y - this.sprite.y;
				var d = Math.sqrt(dx*dx + dy*dy);
				if(d <= 32){
					

					if(this.logic.movementGoal.name == "healthpack"){
						var healthRequried = (this.vitals.maxHealth - this.vitals.health)
						if(this.logic.movementGoal.uses > healthRequried){
							this.vitals.health = this.vitals.maxHealth;
						}else{
							this.vitals.health += this.logic.movementGoal.uses;
						}

						this.logic.movementGoal.uses -= healthRequried;
					}else{
						var ammoRequried = (this.vitals.maxAmmo - this.vitals.ammo)
						if(this.logic.movementGoal.uses > ammoRequried){
							this.vitals.ammo = this.vitals.maxAmmo;
						}else{
							this.vitals.ammo += this.logic.movementGoal.uses;
						}

						this.logic.movementGoal.uses -= ammoRequried;
					}

					

					if(this.logic.movementGoal.uses < 1){
						this.logic.movementGoal.destroy();
						var i = powerups.indexOf(this.logic.movementGoal);
						if(i != -1){
							powerups.splice(i, 1);
						}
					}

					this.logic.movementGoal = null;
				}
			}
			
			if(this.logic.movementCooldown > 0){
				this.logic.movementCooldown--;
			}

			if(this.logic.movementCooldown == 0 && (this.sprite.x-32)%64 === 0 && (this.sprite.y-32)%64 ===0){
				this.logic.idealPath = [];
				this.logic.idealPathIndex = 0;
				this.logic.movementGoal = null;
			}


			if(this.vitals.shotCooldown > 0){
				this.vitals.shotCooldown--;
			}

			if(this.logic.speakCooldown > 0){
				this.logic.speakCooldown--;
			}

			if(this.logic.timeSpoke > 0){
				this.logic.timeSpoke--;

				if(this.logic.timeSpoke === 0){
					this.logic.isSpeaking = false;
					this.logic.message = "";
					this.chatText.setText("");
					this.chatText.alpha = 0;
					this.chatBubble.alpha = 0;
				}
			}

			if(!this.logic.isSpeaking && this.logic.speakCooldown === 0){
				if(Math.random()*100 >= 99.95){
					this.logic.isSpeaking = true;
					this.logic.speakCooldown = this.logic.maxSpeakCooldown;
					this.logic.timeSpoke = this.logic.maxTimeSpoke;
					this.pickMessage();
					this.chatText.setText(this.logic.message);
					this.chatText.alpha = 1;
					this.chatBubble.alpha = 1;
				}
			}

			this.chatBubble.x = this.sprite.x + 10;
			this.chatBubble.y = this.sprite.y - this.chatBubble.height - 30;
			this.chatText.x = this.chatBubble.x + 5;
			this.chatText.y = this.chatBubble.y + 3;

		}else{
			this.doDie();
		}
	}

	this.pickMessage = function(){
		if(this.vitals.health < this.vitals.maxHealth*0.33){
			this.logic.message = "I could use a health pickup!";
		}

		if(this.vitals.ammo < this.vitals.maxAmmo*0.33){
			this.logic.message = "Running out of ammo here!";
		}

		var possibleMessages = [
			"Just like shooting swamprats back home!",
			"Man, these things are coming out of the walls!",
			"Born just in time to brouse dank memes.",
			"Man, I wish I had a stronger weapon.",
			"Why are we stuck in this horrible place?",
			"What are we even doing here, fighting these things?",
			"It's a good thing we've got plenty of barricades",
			"I suppose the commander won't be coming down here himself.",
			"There's not many unconventional weapons in here..."
		];

		if(this.logic.message === ""){
			var r = Math.round(Math.random()*(possibleMessages.length - 1));
			this.logic.message = possibleMessages[r];
		}
	}

	this.render = function(){
		if(!this.isDead()){
			this.graphics.clear();
			this.graphics.beginFill(0x009900);
			this.graphics.moveTo(this.sprite.x - this.sprite.width/2,
			 this.sprite.y - this.sprite.height/2 + this.sprite.height );
			this.graphics.lineTo(this.sprite.x - this.sprite.width/2 + (this.sprite.width*(this.vitals.health/this.vitals.maxHealth)),
			 this.sprite.y - this.sprite.height/2 + this.sprite.height );
			this.graphics.lineTo(this.sprite.x - this.sprite.width/2 + (this.sprite.width*(this.vitals.health/this.vitals.maxHealth)),
			 this.sprite.y - this.sprite.height/2 + this.sprite.height + 5);
			this.graphics.lineTo(this.sprite.x - this.sprite.width/2,
			 this.sprite.y - this.sprite.height/2 + this.sprite.height + 5);
			this.graphics.lineTo(this.sprite.x - this.sprite.width/2,
			 this.sprite.y - this.sprite.height/2 + this.sprite.height);
			this.graphics.endFill();

			this.graphics.beginFill(0x000099);
			this.graphics.moveTo(this.sprite.x - this.sprite.width/2,
			 this.sprite.y - this.sprite.height/2 + this.sprite.height + 5);
			this.graphics.lineTo(this.sprite.x - this.sprite.width/2 + (this.sprite.width*(this.vitals.ammo/this.vitals.maxAmmo)),
			 this.sprite.y - this.sprite.height/2 + this.sprite.height + 5);
			this.graphics.lineTo(this.sprite.x - this.sprite.width/2 + (this.sprite.width*(this.vitals.ammo/this.vitals.maxAmmo)),
			 this.sprite.y - this.sprite.height/2 + this.sprite.height + 10);
			this.graphics.lineTo(this.sprite.x - this.sprite.width/2,
			 this.sprite.y - this.sprite.height/2 + this.sprite.height + 10);
			this.graphics.lineTo(this.sprite.x - this.sprite.width/2,
			 this.sprite.y - this.sprite.height/2 + this.sprite.height + 5);
			this.graphics.endFill();
		}else{
			this.graphics.clear();
		}

		//game.debug.body(this.sprite);
	}
}