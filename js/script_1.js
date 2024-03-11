var point=0;
var clickingPower=2;

var upgradeCost_1=10;
var upgradeCost_2=10;
var upgrade=0;
var upgrade_1=0;
var effi_2=0

function buyUpgrade1(){
    if(point >= upgradeCost_1){
        point-=upgradeCost_1;
        upgrade+=1
        upgradeCost_1=Math.round(upgradeCost_1 *1.10)
        document.getElementById("point").innerHTML = point;
        document.getElementById("upgradeCost_1").innerHTML = upgradeCost_1;
        document.getElementById("upgrade").innerHTML = upgrade;
        setMoneyPerSec();
    }
}

function buyUpgrade2(){
    if(point >= upgradeCost_2){
        point-=upgradeCost_2;
        upgrade_1+=1
        upgradeCost_2=Math.round(upgradeCost_2 *1.10)
        effi_2 = upgrade_1 / upgradeCost_2 
        document.getElementById("point").innerHTML = point;
        document.getElementById("upgradeCost_2").innerHTML = upgradeCost_2;
        document.getElementById("upgrade_1").innerHTML = upgrade_1;
        document.getElementById("effi_2").innerHTML = effi_2;
        setMoneyPerSec();
    }
}

function addPoint(amount){
    point+=amount;
    document.getElementById("point").innerHTML = point;

}

function setMoneyPerSec(){
    pointPerSec = upgrade + upgrade_1;
    document.getElementById("scorepersecond").innerHTML = pointPerSec;
}

function saveGame(){
    var gameSave = {
        point: point,
        clickingPower: clickingPower,
        upgradeCost_1: upgradeCost_1,
        upgrade: upgrade,
        upgradeCost_2: upgradeCost_2,
        upgrade_1: upgrade_1
    };
    localStorage.setItem("gameSave", JSON.stringify(gameSave));
}

function loadGame(){
    var savedGame = JSON.parse(localStorage.getItem("gameSave"));
    if(typeof savedGame.point !== "undefined") point = savedGame.point;
    if(typeof savedGame.clickingPower !== "undefined") clickingPower = savedGame.clickingPower;
    if(typeof savedGame.upgradeCost_1 !== "undefined") upgradeCost_1 = savedGame.upgradeCost_1;
    if(typeof savedGame.upgrade !== "undefined") upgrade = savedGame.upgrade;
    if(typeof savedGame.upgradeCost_2 !== "undefined") upgradeCost_2 = savedGame.upgradeCost_2;
    if(typeof savedGame.upgrade_1 !== "undefined") upgrade_1 = savedGame.upgrade_1;
}

function resetGame(){
    if(confirm("This will reset your game, are sure you want to do that?")){
        var gameSave = {};
        localStorage.setItem("gameSave", JSON.stringify(gameSave));
        location.reload();
    }
}

window.onload = function(){
    loadGame();
    setMoneyPerSec();
    document.getElementById("point").innerHTML = point;
    document.getElementById("upgradeCost_1").innerHTML = upgradeCost_1;
    document.getElementById("upgrade").innerHTML = upgrade;
    document.getElementById("upgradeCost_2").innerHTML = upgradeCost_2;
    document.getElementById("upgrade_1").innerHTML = upgrade_1;
};

// Point per sec after update
setInterval(function(){
    point+=upgrade;
    point+=upgrade_1;
    document.getElementById("point").innerHTML = point; 

    document.title = "Hot Dog"
}, 1000);

setInterval(function(){
    saveGame();
}, 30000); // 30s

document.addEventListener("keydown", function(event){
    if (event.ctrlKey && event.which == 83){ // ctrl + s
        event.preventDefault();
        saveGame();
    }
}, false)