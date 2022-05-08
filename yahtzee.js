let rollNum = 0;
let roundNum = 1;
let diceAnywhere = [];
let diceChoosen = [];
let diceRolled = [];
let dieOnTable = [];
let curDieIndex;
let diceIndex = [0,1,2,3,4,5];
let dieChoosenArray;

//DOM Elements
const dieArea = document.getElementById('dieArea');
const choosenDieArea = document.getElementById('choosenDieArea');
const openRulesBtn = document.getElementById('openRulesBtn');
const rollDieBtn = document.getElementById('rollDieBtn');
const closeRulesBtn = document.getElementById('close-rules');
const siteWrapper = document.getElementById('site-wrapper');
const canvas = document.getElementById('canvas');
const calculatedScore = document.getElementsByClassName('calculated-score');
const roundNumHTML = document.getElementById('roundNum');

//Listeners
rollDieBtn.addEventListener('click', rollDie,false);
openRulesBtn.addEventListener('click',openRules,false);
closeRulesBtn.addEventListener('click',closeRules,false);

updateRoundNumber();
checkrollNum();

function randomizeDie(){
    return Math.floor(Math.random() * 6) + 1;
}

const windowWidth = document.documentElement.clientWidth;

function updateRoundNumber(){
    roundNumHTML.textContent = Math.min(roundNum,13);
}

function openRules(){
    siteWrapper.className = 'showRules';
    openRulesBtn.style.opacity = 0;
}

function closeRules(){
    siteWrapper.className = '';
    scroll(0,0);
    openRulesBtn.style.opacity = 1;
}

function rollDie(){
        checkrollNum();

        dieArea.innerHTML = ''; //Clear the table
        dieOnTable = [];

        let diceToRollAmt = 5 - diceChoosen.length;
        for (let i = 0;i<diceToRollAmt;i++){
            let roll = randomizeDie();
            dieOnTable.push(roll);
        }

        //Draw the dice we just rolled
        drawDice();
        updateDiceAnywhere();
        updateScoreTable();
}

function drawDice(){
    diceIndex = [0,1,2,3,4];
    for (let i = dieOnTable.length-1;i>=0;i--){
        drawDie(dieOnTable[i],diceIndex[i])
    }

    updateChoosenArr();
    if (dieChoosenArray){
        for (let i = 0;i<dieChoosenArray.length;i++){
            dieChoosenArray[i].setAttribute('dieIndex', dieOnTable.length + i);
        }
    }
}

function drawDie(value,index){
    let dieDivHTML = document.createElement('div');
    dieDivHTML.className += 'die';
    dieArea.appendChild(dieDivHTML);
    let curTransform = getStyle(dieDivHTML, 'transform');
    dieDivHTML.style.transform = curTransform + ' rotate('+randomizeRotation()+'deg)';
    dieDivHTML.setAttribute('dieValue',value);
    dieDivHTML.setAttribute('dieIndex',index);
    dieDivHTML.addEventListener('click',selectDie,false);
}

function selectDie(){
    let val = parseInt(this.getAttribute('dieValue'), 10);
    curDieIndex = parseInt(this.getAttribute('dieIndex'), 10);
    let posOnArr = dieOnTable.indexOf(val);
    dieOnTable.splice(posOnArr,1);
    this.parentNode.removeChild(this);
    diceChoosen.push(val);
    drawSelectedDie(val,curDieIndex);
    updateDiceAnywhere();
    updateScoreTable();
}

function deselectDie(){
    let val = parseInt(this.getAttribute('dieValue'), 10);
    curDieIndex = parseInt(this.getAttribute('dieIndex'), 10);
    let posOnArr = dieOnTable.indexOf(val);
    diceChoosen.splice(posOnArr,1);
    this.parentNode.removeChild(this);
    dieOnTable.push(val);
    drawDie(val,curDieIndex);
    updateDiceAnywhere();
    updateScoreTable();
}

function drawSelectedDie(val, index){
    let dieDivHTML = document.createElement('div');
    dieDivHTML.className += 'dieChoosen';
    choosenDieArea.appendChild(dieDivHTML);
    dieDivHTML.setAttribute('dieValue',val);
    dieDivHTML.setAttribute('dieIndex',index);
    dieDivHTML.addEventListener('click',deselectDie,false);
}

function updateChoosenArr(){
    if (choosenDieArea.innerHTML != ''){
        dieChoosenArray = document.getElementsByClassName('dieChoosen');
    }
}

function randomizeRotation(){
    return Math.floor(Math.random() * (360 - 1) + 1);
}

function updateDiceAnywhere(){
    if (diceChoosen){
        diceAnywhere = dieOnTable.concat(diceChoosen);
    }else{
        diceAnywhere = dieOnTable;
    }
}

function checkrollNum() {
    console.log(rollNum);
	switch (rollNum) {
		case 0:
			rollDieBtn.className = '';
			rollNum += 1;
		break;
		case 1:
			rollDieBtn.className = 'roll-1';
			rollNum += 1;
		break;
		case 2:
			rollDieBtn.className = 'roll-2';
			rollNum += 1;
		break;
		case 3:
			rollDieBtn.className = 'roll-3';
			rollDieBtn.removeEventListener('click', rollDie, false);
			rollNum += 1;
			setTimeout(function() {
				rollDieBtn.className = 'roll-3 disabled';
			}, 500);
		break;
		default:
		console.log("Roll number error");
	}
}

function hideCalculatedScores() {
	for (let i = 0; i < calculatedScore.length; i++) {
		calculatedScore[i].style.display = 'none';
	}
}

function resetTable() {
	diceOnTable = []; // Reset on-table die array
	diceChoosen = []; // Reset selected die array
	diceIndex = [0,1,2,3,4]; // Reset die index holder
	updateDiceAnywhere(); // Reset dice in play array
	rollNum = 0;
	checkrollNum();
	hideCalculatedScores();
	updateRoundNumber();
	rollDieBtn.addEventListener('click', rollDie, false);
	choosenDieArea.innerHTML = '';
	dieArea.innerHTML = '';
}

function resetGame(){
    window.location.reload(false);
}

// Get the rendered style of an element
// http://robertnyman.com/2006/04/24/get-the-rendered-style-of-an-element/
function getStyle(oElm, strCssRule){
	let strValue = "";
	if(document.defaultView && document.defaultView.getComputedStyle){
		strValue = document.defaultView.getComputedStyle(oElm, "").getPropertyValue(strCssRule);
	}
	else if(oElm.currentStyle){
		strCssRule = strCssRule.replace(/\-(\w)/g, function (strMatch, p1){
			return p1.toUpperCase();
		});
		strValue = oElm.currentStyle[strCssRule];
	}
	return strValue;
}
