UI = function(){
	this.update = function(){
		this.barricadesText.setText(equipment.barricades);
		this.healthKitsText.setText(equipment.healthPacks);
		this.ammoKitsText.setText(equipment.ammoPacks);

		if(equipment.barricades === 0){
			this.barricadesText.setStyle(this.emptyTextStyle);
		}

		if(equipment.healthPacks === 0){
			this.healthKitsText.setStyle(this.emptyTextStyle);
		}

		if(equipment.ammoPacks === 0){
			this.ammoKitsText.setStyle(this.emptyTextStyle);
		}

		this.currentWaveText.setText('Current Wave: ' + currentWave);
		this.remainingEnemiesText.setText('Remaining Enemies: ' + remainingEnemies);
	}

	this.render = function(){

	}

	this.onOver = function(element){
		element.alpha = 1;
	}

	this.onOut = function(element){
		element.alpha = 0.8;
	}

	this.onDown = function(element){
		if(element === this.barricadesIcon && equipment.barricades > 0){
			itemToPlace = "barricade";
			isPlacing = true;
		}else if(element === this.healthKitsIcon && equipment.healthPacks > 0){
			itemToPlace = "healthpack";
			isPlacing = true;
		}else if(element === this.ammoKitsIcon && equipment.ammoPacks > 0){
			itemToPlace = "ammopack";
			isPlacing = true;
		}
	}

	this.textStyle = {fill: "#FFFFFF", font: "30pt arial"};
	this.emptyTextStyle = {fill: "#FF0000 ", font: "30pt arial"};

	this.barricadesIcon = game.add.image(20, HEIGHT*2 - 160, 'barricade');
	this.barricadesIcon.scale.setTo(2);
	this.barricadesIcon.alpha = 0.8;
	this.barricadesIcon.inputEnabled = true;
	this.barricadesIcon.events.onInputOver.add(this.onOver, this);
	this.barricadesIcon.events.onInputOut.add(this.onOut, this);
	this.barricadesIcon.events.onInputDown.add(this.onDown, this);
	this.barricadesText = game.add.text(35, HEIGHT*2 - 140, equipment.barricades, this.textStyle);
	this.barricadesKeyText = game.add.text(35, HEIGHT*2 - 60, "A", this.textStyle);

	this.healthKitsIcon = game.add.image(160, HEIGHT*2 - 160, 'health');
	this.healthKitsIcon.scale.setTo(2);
	this.healthKitsIcon.alpha = 0.8;
	this.healthKitsIcon.inputEnabled = true;
	this.healthKitsIcon.events.onInputOver.add(this.onOver, this);
	this.healthKitsIcon.events.onInputOut.add(this.onOut, this);
	this.healthKitsIcon.events.onInputDown.add(this.onDown, this);
	this.healthKitsText = game.add.text(175, HEIGHT*2 - 140, equipment.healthPacks, this.textStyle);
	this.healthKitsKeyText = game.add.text(175, HEIGHT*2 - 60, "S", this.textStyle);

	this.ammoKitsIcon = game.add.image(300, HEIGHT*2- 160, 'ammo');
	this.ammoKitsIcon.scale.setTo(2);
	this.ammoKitsIcon.alpha = 0.8;
	this.ammoKitsIcon.inputEnabled = true;
	this.ammoKitsIcon.events.onInputOver.add(this.onOver, this);
	this.ammoKitsIcon.events.onInputOut.add(this.onOut, this);
	this.ammoKitsIcon.events.onInputDown.add(this.onDown, this);
	this.ammoKitsText = game.add.text(325, HEIGHT*2 - 140, equipment.healthPacks, this.textStyle);
	this.ammoKitsKeyText = game.add.text(325, HEIGHT*2 - 60, "D", this.textStyle);

	this.currentWaveText = game.add.text(435, HEIGHT*2 - 120, 'Current Wave: ' + currentWave, this.textStyle);
	this.remainingEnemiesText = game.add.text(435, HEIGHT*2 - 80, 'Remaining Enemies: ' + remainingEnemies, this.textStyle);
}