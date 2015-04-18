FriendAI = {
	neighborRadius: 2000,
	separationWeight: 2,
	alignmentWeight: 1,
	cohesionWeight: 1,
	desiredSeparation: 80,

	//call every frame to determine new velocity
	boid: function(me, friends){
		var accelerationVec = this.boidFlock(me, friends);

		me.sprite.body.velocity.x += accelerationVec.x;
		me.sprite.body.velocity.y += accelerationVec.y;

		if(me.sprite.body.velocity.x > me.vitals.speed){
			me.sprite.body.velocity.x = me.vitals.speed;
		}else if(me.sprite.body.velocity.x < -me.vitals.speed){
			me.sprite.body.velocity.x = -me.vitals.speed;
		}

		if(me.sprite.body.velocity.y > me.vitals.speed){
			me.sprite.body.velocity.y = me.vitals.speed;
		}else if(me.sprite.body.velocity.y < -me.vitals.speed){
			me.sprite.body.velocity.y = -me.vitals.speed;
		}
	},

	boidFlock: function(me, friends){
		var separationVec = this.separate(me, friends);
		separationVec.x *= this.separationWeight;
		separationVec.y *= this.separationWeight;

		var alignmentVec = this.align(me, friends);
		alignmentVec.x *= this.alignmentWeight;
		alignmentVec.y *= this.alignmentWeight;

		var cohesionVec = this.cohere(me, friends);
		cohesionVec.x *= this.cohesionWeight;
		cohesionVec.y *= this.cohesionWeight;

		var accelerationVec = {x: 0, y: 0};
		accelerationVec.x = separationVec.x + alignmentVec.x + cohesionVec.x;
		accelerationVec.y = separationVec.y + alignmentVec.y + cohesionVec.y;

		return accelerationVec;
	},

	cohere: function(me, friends){
		var sum = {x: 0, y: 0};
		var count = 0;

		friends.forEach(function(e){
			var d = this.getDistance(me, e);

			if(d > 0 && d < this.neighborRadius){
				sum.x += e.sprite.x;
				sum.y += e.sprite.y;

				count++;
			}
		},this);

		if(count > 0){
			sum.x /= count;
			sum.y /= count;
			return this.steerTo(me, sum);
		}else{
			return sum;
		}
	},

	steerTo: function(me, targetPos){
		var desired = {x: 0, y: 0};
		desired.x = targetPos.x - me.sprite.x;
		desired.y = targetPos.y - me.sprite.y;

		var d = Math.sqrt(desired.x*desired.x + desired.y*desired.y);

		var steer;
		if(d > 0){
			desired.x /= d;
			desired.y /= d;

			if(d < 100){
				var accFactor = me.vitals.speed*(d/100);
				desired.x *= accFactor;
				desired.y *= accFactor;
			}else{
				desired.x *= me.vitals.speed;
				desired.y *= me.vitals.speed;
			}

			steer = {x: 0, y: 0};
			steer.x = desired.x - me.sprite.body.velocity.x;
			steer.y = desired.y - me.sprite.body.velocity.y;

			//limit steering here?
		}else{
			steer = {x: 0, y: 0};
		}

		return steer;
	},

	align: function(me, friends){
		var mean = {x: 0, y: 0};
		var count = 0;

		friends.forEach(function(e){
			d = this.getDistance(me, e);

			if(d > 0 && d < this.neighborRadius){
				mean.x += e.sprite.body.velocity.x;
				mean.y += e.sprite.body.velocity.y;
				count++; 
			}
		}, this);

		if(count > 0){
			mean.x /= count;
			mean.y /= count;
		}

		//limit mean here?
		return mean;
	},

	separate: function(me, friends){
		var mean = {x: 0, y: 0};
		var count = 0; 

		friends.forEach(function(e){
			var d = this.getDistance(me, e);

			if(d > 0 && d < this.desiredSeparation){
				var vecSub = {x: 0, y: 0};
				vecSub.x = me.sprite.x - e.sprite.x;
				vecSub.y = me.sprite.y - e.sprite.y;
				var vecSubD = Math.sqrt(vecSub.x*vecSub.x + vecSub.y*vecSub.y);
				vecSub.x /= vecSubD;
				vecSub.y /= vecSubD;
				vecSub.x *= d;
				vecSub.y *= d;

				mean.x += vecSub.x;
				mean.y += vecSub.y;


				count++; 
			}
		}, this);

		//let's also check enemies here!

		enemies.forEach(function(e){
			var d = this.getDistance(me, e);

			if(d > 0 && d < this.desiredSeparation*2){
				var vecSub = {x: 0, y: 0};
				vecSub.x = me.sprite.x - e.sprite.x;
				vecSub.y = me.sprite.y - e.sprite.y;
				var vecSubD = Math.sqrt(vecSub.x*vecSub.x + vecSub.y*vecSub.y);
				vecSub.x /= vecSubD;
				vecSub.y /= vecSubD;
				//*2 because we really hate the enemies
				vecSub.x *= d*2;
				vecSub.y *= d*2;

				mean.x += vecSub.x;
				mean.y += vecSub.y;


				count++; 
			}
		}, this);

		if(count > 0){
			mean.x /= count;
			mean.y /= count;
		}

		return mean;
	},

	getDistance: function(me, them){
		var dx = me.sprite.x - them.sprite.x;
		var dy = me.sprite.y - them.sprite.y;
		return Math.sqrt(dx*dx + dy*dy);
	}
}