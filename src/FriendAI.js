FriendAI = {
	neighborRadius: 2000,
	separationWeight: 2,
	alignmentWeight: 1,
	cohesionWeight: 1,
	desiredSeparation: 40,

	//call every frame to determine new velocity
	//removed boid AI for friendlies, but keeping for enemies
	boid: function(me, friends){
		if(me.logic.idealPathIndex < me.logic.idealPath.length){
            var destTile = me.logic.idealPath[me.logic.idealPathIndex ];

            var tileIsOpen = true;
            friends.forEach(function(e){
            	if(e.logic.myTile === destTile && destTile !== me.logic.myTile){
            		tileIsOpen = false;
            	}
            }, this);

            var boxExistsHere = false;
			powerups.forEach(function(e){
				if(e.name === "barricade"){
					if(e.x-32 === destTile.x*64 && e.y-32=== destTile.y*64){
						boxExistsHere = e;
					}
				}
			}, this);

			if(!boxExistsHere){
	            if(tileIsOpen){
	            	me.logic.myTile = destTile;
	            	me.doWalk();

		            if(destTile.x*64+32 < me.sprite.x){
		                me.sprite.x -= me.vitals.speed;
		                me.sprite.scale.x = -Math.abs(me.sprite.scale.x);

		                if(destTile.x*64+32 > me.sprite.x){
		                    me.sprite.x = destTile.x*64+32;
		                }
		            }else if(destTile.x*64+32 > me.sprite.x){
		                me.sprite.x += me.vitals.speed;
		                me.sprite.scale.x = Math.abs(me.sprite.scale.x);

		                if(destTile.x*64+32 < me.sprite.x){
		                    me.sprite.x = destTile.x*64+32;
		                }
		            }

		            if(destTile.y*64+32 < me.sprite.y){
		                me.sprite.y -= me.vitals.speed;

		                if(destTile.y*64+32 > me.sprite.y){
		                    me.sprite.y = destTile.y*64+32;
		                }
		            }else if(destTile.y*64+32 > me.sprite.y){
		                me.sprite.y += me.vitals.speed;

		                if(destTile.y*64+32 < me.sprite.y){
		                    me.sprite.y = destTile.y*64+32;
		                }
		            }

		            if(destTile.y*64+32 === me.sprite.y && destTile.x*64+32 === me.sprite.x){
		                me.logic.idealPathIndex++;

		                if(me.logic.idealPathIndex >= me.logic.idealPath.length){
		                    me.logic.idealPathIndex = 0;
		                    me.logic.idealPath = [];
		                    me.logic.movementGoal = null;
		                }
		            }
		        }else{
		        	me.doStand();
		        }
		    }else{
		    	me.logic.idealPath = [];
		    	me.logic.idealPathIndex = 0;
		    	me.logic.movementGoal = null;
		    	me.doStand();
		    }
        }
	}
}