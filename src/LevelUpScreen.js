LevelUpScreen = function(){
	//do this in HTML because lazy
	$('body').append(
		"<div id='level-up' style='display: none; position: absolute; left: 0; right:0; width: "+WIDTH/2+"px; height: "+HEIGHT/2+"px; margin: 0 auto; background: url(res/img/char/levelup.png); top: "+HEIGHT/4+"px;'>" +
			"<div style='font-family: arial; font-size: 24px; color: white; position: absolute; left: 25px; top: 10px;'>Troop Armory</div>"+
			"<div onclick='levelUpScreen.hide()' style='position: absolute; right: 5px; top: 5px; width: 32px; height: 32px; background: url(res/img/char/x.png)'></div>" +

			"<table style='font-family: arial; color: white; margin-top: 50px; margin-left: 10px; width: 460px; text-align: center; height: 260px;'>"+
				"<tr><td colspan='6'> Skillpoints Remaining </td></tr>"+
				"<tr style='height: 15px;'>"+
					"<td style='background-color: rgb(110, 110, 110); border-bottom: 2px solid #302c24;'>Attribute </td>" +
					"<td style='background-color: rgb(0, 0, 110); border-bottom: 2px solid #302c24; ' id='skillpoints-label-blue'>5</td>"+
					"<td style='background-color: rgb(110, 0, 0); border-bottom: 2px solid #302c24; ' id='skillpoints-label-red'>5</td>"+
					"<td style='background-color: rgb(0, 110, 0); border-bottom: 2px solid #302c24; ' id='skillpoints-label-green'>5</td>"+
					"<td style='background-color: rgb(161, 161, 0); border-bottom: 2px solid #302c24; ' id='skillpoints-label-yellow'>5</td>"+
				"</tr>" +
				"<tr>"+
					"<td style='width: 25px; padding: 0 10px 0 0;'>Damage</td>"+
					"<td><span id='attack-label-blue' style='padding: 0 5px;'>1</span><button id='blue-attack-button' onclick='levelUpScreen.onClickPlus(\"blue\", \"attack\")'>+</button></td>" +
					"<td><span id='attack-label-red' style='padding: 0 5px;'>1</span><button id='red-attack-button' onclick='levelUpScreen.onClickPlus(\"red\", \"attack\")'>+</button></td>" +
					"<td><span id='attack-label-green' style='padding: 0 5px;'>1</span><button id='green-attack-button' onclick='levelUpScreen.onClickPlus(\"green\", \"attack\")'>+</button></td>" +
					"<td><span id='attack-label-yellow' style='padding: 0 5px;'>1</span><button id='yellow-attack-button' onclick='levelUpScreen.onClickPlus(\"yellow\", \"attack\")'>+</button></td>" +
				"</tr>"+
				"<tr>" +
					"<td style='width: 25px; padding: 0 10px 0 0;'>Defence</td>"+
					"<td><span id='defence-label-blue' style='padding: 0 5px;'>1</span><button id='blue-defence-button' onclick='levelUpScreen.onClickPlus(\"blue\", \"defence\")'>+</button></td>" +
					"<td><span id='defence-label-red' style='padding: 0 5px;'>1</span><button id='red-defence-button' onclick='levelUpScreen.onClickPlus(\"red\", \"defence\")'>+</button></td>" +
					"<td><span id='defence-label-green' style='padding: 0 5px;'>1</span><button id='green-defence-button' onclick='levelUpScreen.onClickPlus(\"green\", \"defence\")'>+</button></td>" +
					"<td><span id='defence-label-yellow' style='padding: 0 5px;'>1</span><button id='yellow-defence-button' onclick='levelUpScreen.onClickPlus(\"yellow\", \"defence\")'>+</button></td>" +
				"</tr>" +
				"<tr>" +
					"<td style='width: 25px; padding: 0 10px 0 0;'>Range</td>"+
					"<td><span id='range-label-blue' style='padding: 0 5px;'>1</span><button id='blue-range-button' onclick='levelUpScreen.onClickPlus(\"blue\", \"range\")'>+</button></td>" +
					"<td><span id='range-label-red' style='padding: 0 5px;'>1</span><button id='red-range-button' onclick='levelUpScreen.onClickPlus(\"red\", \"range\")'>+</button></td>" +
					"<td><span id='range-label-green' style='padding: 0 5px;'>1</span><button id='green-range-button' onclick='levelUpScreen.onClickPlus(\"green\", \"range\")'>+</button></td>" +
					"<td><span id='range-label-yellow' style='padding: 0 5px;'>1</span><button id='yellow-range-button' onclick='levelUpScreen.onClickPlus(\"yellow\", \"range\")'>+</button></td>" +
				"</tr>" +

			"</table>"+
		"</div>"
	);

	this.onClickPlus = function(char, stat){
		switch(char){
			case "blue":
				blue.vitals.avalibleSkillPoints--;

				switch(stat){
					case "attack":
						blue.vitals.attack++;
					break;
					case "defence":
						blue.vitals.defence++;
					break;

					case "range":
						blue.vitals.range += 30;
					break;
				}
			break;
			case "red":
				red.vitals.avalibleSkillPoints--;

				switch(stat){
					case "attack":
						red.vitals.attack++;
					break;
					case "defence":
						red.vitals.defence++;
					break;

					case "range":
						red.vitals.range += 30;
					break;
				}

			break;
			case "yellow":
				yellow.vitals.avalibleSkillPoints--;

				switch(stat){
					case "attack":
						yellow.vitals.attack++;
					break;
					case "defence":
						yellow.vitals.defence++;
					break;

					case "range":
						yellow.vitals.range += 30;
					break;
				}
			break;
			case "green":
				green.vitals.avalibleSkillPoints--;

				switch(stat){
					case "attack":
						green.vitals.attack++;
					break;
					case "defence":
						green.vitals.defence++;
					break;

					case "range":
						green.vitals.range += 30;
					break;
				}
			break;
		}
	}

	this.update = function(){
		$('#attack-label-blue').html(blue.vitals.attack);
		$('#defence-label-blue').html(blue.vitals.defence);
		$('#range-label-blue').html(blue.vitals.range);
		$('#skillpoints-label-blue').html(blue.vitals.avalibleSkillPoints);

		if(blue.vitals.avalibleSkillPoints < 1){
			$('#blue-attack-button').attr('disabled', true);
			$('#blue-defence-button').attr('disabled', true);
			$('#blue-range-button').attr('disabled', true);
		}else{
			$('#blue-attack-button').attr('disabled', false);
			$('#blue-defence-button').attr('disabled', false);
			$('#blue-range-button').attr('disabled', false);
		}

		$('#attack-label-red').html(red.vitals.attack);
		$('#defence-label-red').html(red.vitals.defence);
		$('#range-label-red').html(red.vitals.range);
		$('#skillpoints-label-red').html(red.vitals.avalibleSkillPoints);

		if(red.vitals.avalibleSkillPoints < 1){
			$('#red-attack-button').attr('disabled', true);
			$('#red-defence-button').attr('disabled', true);
			$('#red-range-button').attr('disabled', true);
		}else{
			$('#red-attack-button').attr('disabled', false);
			$('#red-defence-button').attr('disabled', false);
			$('#red-range-button').attr('disabled', false);
		}

		$('#attack-label-green').html(green.vitals.attack);
		$('#defence-label-green').html(green.vitals.defence);
		$('#range-label-green').html(green.vitals.range);
		$('#skillpoints-label-green').html(green.vitals.avalibleSkillPoints);

		if(green.vitals.avalibleSkillPoints < 1){
			$('#green-attack-button').attr('disabled', true);
			$('#green-defence-button').attr('disabled', true);
			$('#green-range-button').attr('disabled', true);
		}else{
			$('#green-attack-button').attr('disabled', false);
			$('#green-defence-button').attr('disabled', false);
			$('#green-range-button').attr('disabled', false);
		}

		$('#attack-label-yellow').html(yellow.vitals.attack);
		$('#defence-label-yellow').html(yellow.vitals.defence);
		$('#range-label-yellow').html(yellow.vitals.range);
		$('#skillpoints-label-yellow').html(yellow.vitals.avalibleSkillPoints);

		if(yellow.vitals.avalibleSkillPoints < 1){
			$('#yellow-attack-button').attr('disabled', true);
			$('#yellow-defence-button').attr('disabled', true);
			$('#yellow-range-button').attr('disabled', true);
		}else{
			$('#yellow-attack-button').attr('disabled', false);
			$('#yellow-defence-button').attr('disabled', false);
			$('#yellow-range-button').attr('disabled', false);
		}
	}

	this.hide = function(){
		$('#level-up').fadeOut(250);
		levelUpScreenOpen = false;
	}
	
	this.show = function(){
		$('#level-up').fadeIn(250);
		levelUpScreenOpen = true;
	}
}