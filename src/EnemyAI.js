EnemyAI = {
	neighborRadius: 100,
	separationWeight: 1,
	alignmentWeight: 1,
	cohesionWeight: 2,
	desiredSeparation: 64,
	

	//call every frame to determine new velocity
	boid: function(me, enemies){
				if(me.logic.idealPathIndex < me.logic.idealPath.length){
            var destTile = me.logic.idealPath[me.logic.idealPathIndex ];

            var tileIsOpen = true;
            enemies.forEach(function(e){
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

		            if(destTile.x*64+32 < me.sprite.x){
		                me.sprite.x -= me.vitals.speed;

		                if(destTile.x*64+32 > me.sprite.x){
		                    me.sprite.x = destTile.x*64+32;
		                }
		            }else if(destTile.x*64+32 > me.sprite.x){
		                me.sprite.x += me.vitals.speed;

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
		                    me.logic.target = null;
		                }
		            }
		        }
		    }else{
		    	me.attack(boxExistsHere);
		    }
        }
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
	boxInWay: null,
	_open: [],
	_closed: [],

	getShortestPath: function(map, beginTile, destinationTile, me){
		this.map = map;
		this.beginTile = beginTile;
		this.destinationTile = destinationTile;
		this.boxInWay = null;
		this._open = [];
		this._closed = [];
		var shortestPath = [];

		this._iterativeSearch(this.beginTile, 0, shortestPath, me);

		return shortestPath;
	},

	_iterativeSearch: function(current, d, shortestPath, me){
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
            this._pushToOpen(north, current, this.destinationTile, d, me);
        }

        if(south){
            this._pushToOpen(south, current, this.destinationTile, d, me);
        }

        if(east){
            this._pushToOpen(east, current, this.destinationTile, d, me);
        }

        if(west){
            this._pushToOpen(west, current, this.destinationTile, d, me);
        }

        if(this._open.length > 0){
            var lowestF = this._open[0];

            this._open.forEach(function(tile){
                if((tile.hCost + tile.dCost) <= (lowestF.hCost + lowestF.dCost)){
                    lowestF = tile;
                }
            }, this);

            //keep searching for the end
            this._iterativeSearch(lowestF, d + 1, shortestPath, me);
        }else{
            return [];
        }
	},

	_pushToOpen: function(tile, current, dest, d, me){
        if( tile.properties.solid !== "true" && $.inArray(tile, this._closed) === -1 && $.inArray(tile, this._open) === -1){
            this._open.push(tile);
            tile.parentTile = current;
            tile.hCost = this._calcHCost(tile, current, dest);
            tile.dCost = d;
        }
    },

    _backtrack: function(shortestPath, cutShort){
        var currentTile = cutShort ? cutShort : this.destinationTile;

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