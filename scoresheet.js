// Scoring holders
let numberOfYahtzees = 0;
let yahtzeeScore = 0;
let upperBonus = 0;
let upperSectionsFilled = 0;
let bonusActive = false;
let finalScore = 0;

// Selected duplicate dice information holder
let duplicates = {};

// DOM elements
const upperBonusScoreField = document.getElementById('upper-bonus-score');
const scoreMessage = document.getElementById('scoreMessage');
const finalScoreElement = document.getElementById('finalScore');
const yahtzeeLogo = document.getElementById('logo');

// Make an array with the score box elements
let scoreBoxes = [];

scoreBoxes[1] = document.getElementById('one-score');
scoreBoxes[2] = document.getElementById('two-score');
scoreBoxes[3] = document.getElementById('three-score');
scoreBoxes[4] = document.getElementById('four-score');
scoreBoxes[5] = document.getElementById('five-score');
scoreBoxes[6] = document.getElementById('six-score');
scoreBoxes[7] = document.getElementById('3kind-score');
scoreBoxes[8] = document.getElementById('4kind-score');
scoreBoxes[9] = document.getElementById('fullHouse-score');
scoreBoxes[10] = document.getElementById('smallStrt-score');
scoreBoxes[11] = document.getElementById('largeStrt-score');
scoreBoxes[12] = document.getElementById('chance-score');
scoreBoxes[13] = document.getElementById('yahtzee-score');

// Make an array with the speculative score box elements
let calculatedScoreBoxes = [];
for (let i = 1; i < 14; i++) {
	calculatedScoreBoxes[i] = scoreBoxes[i].nextSibling.nextSibling;
    console.log(scoreBoxes[i])
    console.log(calculatedScoreBoxes[i]);
}

// Check if value can be found in given array
function isInArray(value, array) {
	return array.indexOf(value) > -1;
}

// Return the sum of an array
function arraySum (array) {
	let summedArray = array.reduce(function(previousValue, currentValue) {
		return previousValue + currentValue;
	});

	return summedArray;
}

// Return the sum of specified duplicate values in an array
function sumDuplicates(value, array) {
	let count = 0;
	for (let i = 0; i < array.length; i++) {
		if (array[i] == value) {
			count++;
		}
	}
	return count * value;
}

// Update the duplicates object with the value & number of duplicates in an array
function countDuplicates(array) {
	duplicates = {};
	array.forEach (function(i) {
		duplicates[i] = (duplicates[i] || 0) + 1;
	});
}

// Check the status of upper section bonus
function updateUpperBonus () {
	if (upperSectionsFilled === 6 && upperBonus < 63) { // Upper section is full and bonus is not reached
		upperBonusScoreField.innerHTML = '&mdash;';
	} else if ( upperBonus < 63 ) { // Bonus not yet reached
		upperBonusScoreField.innerHTML = -63 + parseInt(upperBonus);
	} else { // Bonus reached
		upperBonusScoreField.innerHTML = 35;
		upperBonusScoreField.previousSibling.previousSibling.innerHTML = 'Bonus &#10003;';
		bonusActive = true;
	}
}

// Locking in score on upper section
function acceptScoreUpper() {
	let score = this.innerHTML;
	let scoreBox = this.previousSibling.previousSibling;
	scoreBox.innerHTML = score;
	upperBonus += parseInt(score);
	upperSectionsFilled += 1;
	roundNum += 1;
	if (!bonusActive) {
		updateUpperBonus();
	}
	resetTable();
	closeRules();
	if (roundNum === 14) {
		rollDieBtn.className = 'roll-3 disabled';
		rollDieBtn.removeEventListener('click', rollDie, false);
		countFinalScore();
	}
}

// Locking in score on lower section
function acceptScoreLower() {
	let score = this.innerHTML;
	let scoreBox = this.previousSibling.previousSibling;
	scoreBox.innerHTML = score;
	roundNum += 1;
	resetTable();
	closeRules();
	if (roundNum === 14) {
		rollDieBtn.className = 'roll-3 disabled';
		rollDieBtn.removeEventListener('click', rollDie, false);
		countFinalScore();
	}
}

// Locking in Yahtzee score
function lockYahtzeeScore() {
	let score = this.innerHTML;
	let scoreBox = this.previousSibling.previousSibling;
	scoreBox.innerHTML = score;
	roundNum += 1;
	numberOfYahtzees += 1;
	resetTable();
	closeRules();
	if (roundNum === 14) {
		rollDieBtn.className = 'roll-3 disabled';
		rollDieBtn.removeEventListener('click', rollDie, false);
		countFinalScore();
	}
}

// Trigger Yahtzee celebration animation
function celebrateYahtzee() {
	yahtzeeLogo.className = 'animated tada';
	setTimeout(function() {
		yahtzeeLogo.className = '';
	}, 1500);
}

function isAnyDupOver(x){
    console.log("DKUP CLAL");
    for (var i in duplicates){
        if (duplicates[i] > x) return true;
    }
    return false;
}

// Update score table with calculated scores from selected dice on all possible scoring categories
function updateScoreTable() {
	countDuplicates(diceChoosen);

	// Update zero score tabs on upper section
	for (let i = 1; i < 7; i++) {
		if (scoreBoxes[i].innerHTML === '') {
			calculatedScoreBoxes[i].style.display = 'table-cell';
			calculatedScoreBoxes[i].className = 'calculated-score zero-score';
			calculatedScoreBoxes[i].innerHTML = 0;
			calculatedScoreBoxes[i].addEventListener('click', acceptScoreUpper, false);
		}
	}

	// Update zero score tabs on lower section
	for (let j = 7; j < 14; j++) {
        console.log(scoreBoxes[j]);
		if (scoreBoxes[j].innerHTML === '') {
			calculatedScoreBoxes[j].style.display = 'table-cell';
			calculatedScoreBoxes[j].className = 'calculated-score zero-score';
			calculatedScoreBoxes[j].innerHTML = 0;
			calculatedScoreBoxes[j].addEventListener('click', acceptScoreLower, false);
		}
	}

	// Ones, twos, threes, fours, fives, sixes
	for (let k = 1; k < 7; k++) {
		if (isInArray(k, diceChoosen) && scoreBoxes[k].innerHTML === '') {
            console.log("K ARRAY");
			calculatedScoreBoxes[k].style.display = 'table-cell';
			calculatedScoreBoxes[k].className = 'calculated-score';
			calculatedScoreBoxes[k].innerHTML = sumDuplicates(k, diceChoosen)
			calculatedScoreBoxes[k].addEventListener('click', acceptScoreUpper, false);
		}
	}

	// Three-of-a-kind
	if (scoreBoxes[7].innerHTML === '' && isAnyDupOver(2)) {
		calculatedScoreBoxes[7].style.display = 'table-cell';
		calculatedScoreBoxes[7].className = 'calculated-score';
		calculatedScoreBoxes[7].innerHTML = arraySum(diceAnywhere)
		calculatedScoreBoxes[7].addEventListener('click', acceptScoreLower, false);
	}

	// Four-of-a-kind
	if (scoreBoxes[8].innerHTML === '' && isAnyDupOver(3)) {
		calculatedScoreBoxes[8].style.display = 'table-cell';
		calculatedScoreBoxes[8].className = 'calculated-score';
		calculatedScoreBoxes[8].innerHTML = arraySum(diceAnywhere)
		calculatedScoreBoxes[8].addEventListener('click', acceptScoreLower, false);
	}

	// Full House
	if ((duplicates[1] === 2 || duplicates[2] === 2 || duplicates[3] === 2 || duplicates[4] === 2 || duplicates[5] === 2 || duplicates[6] === 2) && (duplicates[1] === 3 || duplicates[2] === 3 || duplicates[3] === 3 || duplicates[4] === 3 || duplicates[5] === 3 || duplicates[6] === 3) && scoreBoxes[9].innerHTML === '') {
		calculatedScoreBoxes[9].style.display = 'table-cell';
		calculatedScoreBoxes[9].className = 'calculated-score';
		calculatedScoreBoxes[9].innerHTML = 25
		calculatedScoreBoxes[9].addEventListener('click', acceptScoreLower, false);
	}

	// Small Straight
    if ((scoreBoxes[10].innerHTML === '') && (isInArray(3,diceChoosen) && isInArray(4,diceChoosen)) && ((isInArray(1,diceChoosen) && isInArray(2,diceChoosen)) || (isInArray(2,diceChoosen) && isInArray(5,diceChoosen)) || (isInArray(5,diceChoosen) && isInArray(6,diceChoosen)))){
        calculatedScoreBoxes[10].style.display = 'table-cell';
		calculatedScoreBoxes[10].className = 'calculated-score';
		calculatedScoreBoxes[10].innerHTML = 30;
		calculatedScoreBoxes[10].addEventListener('click', acceptScoreLower, false);
	}

	// Large Straight
	if (((scoreBoxes[11].innerHTML === '') && isInArray(2, diceChoosen) && isInArray(3, diceChoosen) && isInArray(4, diceChoosen) && isInArray(5, diceChoosen)) && (isInArray(1,diceChoosen) || isInArray(6,diceChoosen))){
        calculatedScoreBoxes[11].style.display = 'table-cell';
		calculatedScoreBoxes[11].className = 'calculated-score';
		calculatedScoreBoxes[11].innerHTML = 40;
		calculatedScoreBoxes[11].addEventListener('click', acceptScoreLower, false);
	}

	// Chance
	if (diceChoosen.length === 5 && scoreBoxes[12].innerHTML === '') {
		calculatedScoreBoxes[12].style.display = 'table-cell';
		calculatedScoreBoxes[12].className = 'calculated-score';
		calculatedScoreBoxes[12].innerHTML = arraySum(diceAnywhere);
		calculatedScoreBoxes[12].addEventListener('click', acceptScoreLower, false);
	}

	// Yahtzee
	if ((duplicates[1] === 5 || duplicates[2] === 5 || duplicates[3] === 5 || duplicates[4] === 5 || duplicates[5] === 5 || duplicates[6] === 5) && (scoreBoxes[12].innerHTML === '' || numberOfYahtzees > 0)) {
        console.log("DUP YAH");
		// Multiple Yahtzees, give the bonus score and check the Joker scoring rule
		if (numberOfYahtzees > 0) {
            console.log("CELE YAH");
			celebrateYahtzee();
			//alert('Yay! You scored a 100 point Yahtzee bonus!');
			yahtzeeScore = 50 + (numberOfYahtzees * 100);
			scoreBoxes[13].innerHTML = yahtzeeScore;
			scoreBoxes[13].previousSibling.previousSibling.innerHTML = 'Yahtzee' + (Array(numberOfYahtzees + 1).join(' &#10003;'));
			numberOfYahtzees += 1;

			// Check if corresponding upper section box has been used, if it is allow Joker placement on lower boxes
			if (scoreBoxes[diceChoosen[1]].innerHTML !== '') {
				//alert('Since the upper section box is filled, the Joker rule allows you some extra scoring choices on the lower section');

				// Joker scoring for Full House
				if (scoreBoxes[9].innerHTML === '') {
					calculatedScoreBoxes[9].style.display = 'table-cell';
					calculatedScoreBoxes[9].className = 'calculated-score';
					calculatedScoreBoxes[9].innerHTML = 25;
					calculatedScoreBoxes[9].addEventListener('click', acceptScoreLower, false);
				}

				// Joker scoring for Small Straight
				if (scoreBoxes[10].innerHTML === '') {
					calculatedScoreBoxes[10].style.display = 'table-cell';
					calculatedScoreBoxes[10].className = 'calculated-score';
					calculatedScoreBoxes[10].innerHTML = 30;
					calculatedScoreBoxes[10].addEventListener('click', acceptScoreLower, false);
				}

				// Joker scoring for Large Straight
				if (scoreBoxes[11].innerHTML === '') {
					calculatedScoreBoxes[11].style.display = 'table-cell';
					calculatedScoreBoxes[11].className = 'calculated-score';
					calculatedScoreBoxes[11].innerHTML = 40;
					calculatedScoreBoxes[11].addEventListener('click', acceptScoreLower, false);
				}

			} else { // Zero out lower section to force placement on the free upper section box
				for (let l = 7; l < 14; l++) {
					if (scoreBoxes[l].innerHTML === '') {
						calculatedScoreBoxes[l].style.display = 'table-cell';
						calculatedScoreBoxes[l].className = 'calculated-score zero-score';
						calculatedScoreBoxes[l].innerHTML = 0;
						calculatedScoreBoxes[l].addEventListener('click', acceptScoreLower, false);
					}
				}
			}


		// First Yahtzee
		} else {
			celebrateYahtzee();
			calculatedScoreBoxes[13].style.display = 'table-cell';
			calculatedScoreBoxes[13].className = 'calculated-score';
			yahtzeeScore = 50;
			calculatedScoreBoxes[13].innerHTML = yahtzeeScore;
			calculatedScoreBoxes[13].removeEventListener('click', acceptScoreLower, false);
			calculatedScoreBoxes[13].addEventListener('click', lockYahtzeeScore, false);
		}
	}
}



function countFinalScore () {
	for (let i = scoreBoxes.length - 1; i >= 1; i--) {

		if (scoreBoxes[i].innerHTML !== '') {
			finalScore += parseInt(scoreBoxes[i].innerHTML);
		}
	}

	if (bonusActive) {
		finalScore += 35;
	}

	finalScoreElement.innerHTML = finalScore;
	scoreMessage.style.visibility = 'visible';
	scoreMessage.lastChild.className = 'score-total bounceIn animated';

	rollDieBtn.className = 'roll-3 playagain';
	rollDieBtn.innerHTML = 'NEW GAME';
	rollDieBtn.addEventListener('click', resetGame, false);
}