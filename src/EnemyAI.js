EnemyAI = {
	neighborRadius: 100,
	separationWeight: 1,
	alignmentWeight: 1,
	cohesionWeight: 2,
	desiredSeparation: 64,
	

	//call every frame to determine new velocity
	boid: function(me, enemies){
		var accelerationVec = this.boidFlock(me, enemies);

		me.sprite.body.velocity.x += accelerationVec.x;
		me.sprite.body.velocity.y += accelerationVec.y;

		var dx = 0;
		var dy = 0;
		if(me.logic.idealPath.length > 0){
			var whereToGo = me.logic.idealPath[me.logic.idealPathIndex];
			var dx = whereToGo.x*64+32 - me.sprite.x;
			var dy = whereToGo.y*64+32 - me.sprite.y;
			var d = Math.sqrt(dx*dx + dy*dy);
	
			//if we get within 32px, increment and go to the next one!
			if(d <= 48){
				if(me.logic.idealPathIndex + 1 < me.logic.idealPath.length){
					me.logic.idealPathIndex++;
				}
			}
		}


		if(me.sprite.body.velocity.x > me.vitals.speed){
			me.sprite.body.velocity.x = me.vitals.speed;
		}else if(me.sprite.body.velocity.x < -me.vitals.speed){
			me.sprite.body.velocity.x = -me.vitals.speed;
		}

		if(dx < 0 && me.sprite.body.velocity.x > 0 || dx > 0 && me.sprite.body.velocity.x < 0){
			me.sprite.body.velocity.x *= -1;
		}

		if(me.sprite.body.velocity.y > me.vitals.speed){
			me.sprite.body.velocity.y = me.vitals.speed;
		}else if(me.sprite.body.velocity.y < -me.vitals.speed){
			me.sprite.body.velocity.y = -me.vitals.speed;
		}

		if(dy < 0 && me.sprite.body.velocity.y > 0 || dy > 0 && me.sprite.body.velocity.y < 0){
			me.sprite.body.velocity.y *= -1;
		}
	},

	boidFlock: function(me, enemies){
		var separationVec = this.separate(me, enemies);
		separationVec.x *= this.separationWeight;
		separationVec.y *= this.separationWeight;

		var alignmentVec = this.align(me, enemies);
		alignmentVec.x *= this.alignmentWeight;
		alignmentVec.y *= this.alignmentWeight;

		var cohesionVec = this.cohere(me, enemies);
		cohesionVec.x *= this.cohesionWeight;
		cohesionVec.y *= this.cohesionWeight;

		var accelerationVec = {x: 0, y: 0};
		accelerationVec.x = separationVec.x + alignmentVec.x + cohesionVec.x;
		accelerationVec.y = separationVec.y + alignmentVec.y + cohesionVec.y;

		return accelerationVec;
	},

	cohere: function(me, enemies){
		var sum = {x: 0, y: 0};
		var count = 0;

		enemies.forEach(function(e){
			var d = this.getDistance(me, e);

			if(d > 0 && d < this.neighborRadius){
				sum.x += e.sprite.x;
				sum.y += e.sprite.y;

				count++;
			}
		},this);

		//enemies want to kill penguins!
		friends.forEach(function(e){
			var d = this.getDistance(me, e);

			if(d > 0 && d < me.vitals.seekRadius){
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

			//if(d < 100){
				//var accFactor = me.vitals.speed*(d/100);
				//desired.x *= accFactor;
				//desired.y *= accFactor;
			//}else{
				desired.x *= me.vitals.speed;
				desired.y *= me.vitals.speed;
			//}

			steer = {x: 0, y: 0};
			steer.x = desired.x - me.sprite.body.velocity.x;
			steer.y = desired.y - me.sprite.body.velocity.y;

			//limit steering here?
		}else{
			steer = {x: 0, y: 0};
		}

		return steer;
	},

	align: function(me, enemies){
		var mean = {x: 0, y: 0};
		var count = 0;

		enemies.forEach(function(e){
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

	separate: function(me, enemies){
		var mean = {x: 0, y: 0};
		var count = 0; 

		enemies.forEach(function(e){
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
	},

	//A*
	map: null,
	beginTile: null,
	destinationTile: null,
	_open: [],
	_closed: [],

	getShortestPath: function(map, beginTile, destinationTile){
		this.map = map;
		this.beginTile = beginTile;
		this.destinationTile = destinationTile;
		this._open = [];
		this._closed = [];
		var shortestPath = [];

		this._iterativeSearch(this.beginTile, 0, shortestPath);

		return shortestPath;
	},

	_iterativeSearch: function(current, d, shortestPath){
		if(current === this.destinationTile){
			this._backtrack(shortestPath);
			return;
		}

		this._closed.push(current);

		var i = this._open.indexOf(current);
		if(i != -1){
			this._open.splice(i, 1);
		}

		var currentCol = Math.floor(current.x);
        var currentRow = Math.floor(current.y);

        var north = this.map.getTileAbove(0, currentCol, currentRow);
        var south = this.map.getTileBelow(0, currentCol, currentRow);
        var east = this.map.getTileRight(0, currentCol, currentRow);
        var west = this.map.getTileLeft(0, currentCol, currentRow);

        if(north){
            this._pushToOpen(north, current, this.destinationTile, d);
        }

        if(south){
            this._pushToOpen(south, current, this.destinationTile, d);
        }

        if(east){
            this._pushToOpen(east, current, this.destinationTile, d);
        }

        if(west){
            this._pushToOpen(west, current, this.destinationTile, d);
        }

        if(this._open.length > 0){
            var lowestF = this._open[0];

            this._open.forEach(function(tile){
                if((tile.hCost + tile.dCost) <= (lowestF.hCost + lowestF.dCost)){
                    lowestF = tile;
                }
            }, this);

            //keep searching for the end
            this._iterativeSearch(lowestF, d + 1, shortestPath);
        }else{
            return [];
        }
	},

	_pushToOpen: function(tile, current, dest, d){
        if(tile.properties.solid !== "true" && $.inArray(tile, this._closed) === -1 && $.inArray(tile, this._open) === -1){
            this._open.push(tile);
            tile.parentTile = current;
            tile.hCost = this._calcHCost(tile, current, dest);
            tile.dCost = d;
        }
    },

    _backtrack: function(shortestPath){
        var currentTile = this.destinationTile;

        while(!(currentTile === this.beginTile)){
            shortestPath.unshift(currentTile);
            var temp = currentTile;
            currentTile = currentTile.parentTile;
            delete temp.parentTile;
            delete temp.hCost;
            delete temp.dCost;
        }

        return shortestPath;
    },

    _calcHCost: function(tile, current, dest){
        return Math.abs(current.x - dest.x) + 
        Math.abs(current.y - dest.y);
    },
}