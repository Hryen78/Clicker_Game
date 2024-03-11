var game = {
    point: 0,
    totalPoint: 0,
    totalClicks: 0,
    clickValues: 1,
    version: 0.000, 

    addPoint: function(amount){
        this.point += amount;
        this.totalPoint += amount;
        display.updatePoint();
    },
    pointPerSec: function(){
        var pps = 0;
        for(i=0; i< building.name.length; i++){
            pps += building.generate[i] * building.level[i]
        }
        return pps;
    }
};

var building = {
    name: ["Upgrade 1", "Upgrade 2", "Upgrade 3", "Upgrade 4", "Upgrade 5"],
    image: ["hdicon.png", "hdicon.png", "hdicon.png", "hdicon.png", "hdicon.png"],
    level: [0, 0, 0, 0, 0],
    generate: [1, 15, 155, 255, 355],
    cost: [10, 100, 200, 300, 400],
    
    purchase: function(index) {
        if(game.point >= this.cost[index]){
            game.point -= this.cost[index];
            this.level[index]++;
            this.cost[index] = Math.ceil(this.cost[index] * 1.10);
            display.updatePoint();
            display.updateShop();
            display.updateFeatures();
        }
    }
};

var feature = {
    name: ["Commercial", "Industrial"],
    image: ["hdicon.png", "hdicon.png"],
    description: ["Your income are now twice as efficient", "The mouse is twice as efficient"],
    type: ["building", "click"],
    cost: [50, 20],
    buildingIndex: [0, -1],
    requirement: [2,1],
    bonus: [2,2],
    purchased: [false, false],

    purchase: function(index){
        if(!this.purchased[index] && game.point >= this.cost[index]){
            if(this.type[index] == "building" && building.level[this.buildingIndex[index]] >= this.requirement[index]){
                game.point -= this.cost[index];
                building.generate[this.buildingIndex[index]] *= this.bonus[index];
                this.purchased[index] = true;
                display.updateFeatures();
                display.updatePoint();
            } else if(this.type[index] == "click" && game.totalClicks >= this.requirement[index]){
                game.point -= this.cost[index];
                game.clickValues *= this.bonus[index];
                this.purchased[index] = true;
                display.updateFeatures();
                display.updatePoint();
            }
        }
    }   
};

var achievement = {
    name: [
        "Fingers",
        "Start",
        "Fantastic"
    ],
    description: [
        "Own 1 factory",
        "Gather money",
        "First click"
    ],
    image: [
        "hdicon.png",
        "hdicon.png",
        "hdicon.png"
    ],
    type: [
        "building",
        "score",
        "click"
    ],
    requirement: [
        1,
        1,
        1
    ],
    objectIndex: [
        0,
        -1,
        -1
    ],
    awarded: [false, false, false],

    earn: function(index){
        this.awarded[index] = true;
    }
}

var display = {
    updatePoint: function(){
        document.getElementById("point").innerHTML = game.point;
        document.getElementById("pps").innerHTML = game.pointPerSec();
        document.title = game.point + "$ - Incognito Hot-Dog Clicker"
    },

    updateShop: function(){
        document.getElementById("shopContainer").innerHTML = "";
        for (i=0; i<building.name.length; i++){
            document.getElementById("shopContainer").innerHTML += '<table class="container_Upgrade unselectable" onclick="building.purchase('+i+')"><tr><td id="image"><img src="img/'+building.image[i]+'"></td><td id="nameAndCost"><p>'+building.name[i]+'</p><p><span>'+building.cost[i]+'</span>$</p></td><td id="amount"><span>'+building.level[i]+'</span></td></tr></table>'
        }
    },

    updateFeatures: function(){
        document.getElementById("container_Feature").innerHTML = "";
        for(i=0; i< feature.name.length; i++) {
            if (!feature.purchased[i]) {
                if(feature.type[i] == "building" && building.level[feature.buildingIndex[i]] >= feature.requirement[i]){
                    document.getElementById("container_Feature").innerHTML += '<img src="img/'+feature.image[i]+'" title="'+feature.name[i]+' &#10; '+feature.description[i]+' &#10; ('+feature.cost[i]+'$) " onclick="feature.purchase('+i+')">';
                } else if(feature.type[i] == "click" && game.totalClicks >= feature.requirement[i]){
                    document.getElementById("container_Feature").innerHTML += '<img src="img/'+feature.image[i]+'" title="'+feature.name[i]+' &#10; '+feature.description[i]+' &#10; ('+feature.cost[i]+'$) " onclick="feature.purchase('+i+')">';
                }
            }
        }
    },

    updateAchievements: function(){
        document.getElementById("container_Achievement").innerHTML = "";
        for(i=0; i< achievement.name.length; i++) {
            if(achievement.awarded[i]){
                document.getElementById("container_Achievement").innerHTML += '<img src="img/'+achievement.image[i]+'" title="'+achievement.name[i]+' &#10; '+achievement.description[i]+'">';
            }
        }
    }
};

function saveGame(){
    var gameSave = {
        point: game.point,
        totalPoint: game.totalPoint,
        totalClicks: game.totalClicks,
        clickValues: game.clickValues,
        version: game.version,
        buildingLevel: building.level,
        buildingGenerate: building.generate,
        buildingCost: building.cost,
        featurePurchased: feature.purchased,
        achievementAwarded: achievement.awarded
    };
    localStorage.setItem("gameSave", JSON.stringify(gameSave))
}

function loadGame(){
    var savedGame = JSON.parse(localStorage.getItem('gameSave'));
    if(localStorage.getItem("gameSave") !== null){
        if(typeof savedGame.point !== "undefined") game.point = savedGame.point;
        if(typeof savedGame.totalPoint !== "undefined") game.totalPoint = savedGame.totalPoint;
        if(typeof savedGame.totalClicks !== "undefined") game.totalClicks = savedGame.totalClicks;
        if(typeof savedGame.clickValues !== "undefined") game.clickValues = savedGame.clickValues;
        if(typeof savedGame.buildingLevel !== "undefined"){
            for (i=0; i<savedGame.buildingLevel.length; i++){
                building.level[i] = savedGame.buildingLevel[i]
            }
        }
        if(typeof savedGame.buildingGenerate !== "undefined"){
            for (i=0; i<savedGame.buildingGenerate.length; i++){
                building.generate[i] = savedGame.buildingGenerate[i];
            }
        }
        if(typeof savedGame.buildingCost !== "undefined"){
            for (i=0; i<savedGame.buildingCost.length; i++){
                building.cost[i] = savedGame.buildingCost[i];
            }
        }
        if(typeof savedGame.featurePurchased !== "undefined"){
            for(i=0; i<savedGame.featurePurchased[i]; i++){
                feature.purchased[i] = savedGame.featurePurchased[i];
            }
        }
        if(typeof savedGame.achievementAwarded !== "undefined"){
            for(i=0; i<savedGame.achievementAwarded[i]; i++){
                achievement.awarded[i] = savedGame.achievementAwarded[i];
            }
        }
    }
}

function resetGame(){
    if(confirm("This will reset your game, are sure you want to do that?")){
        var gameSave = {};
        localStorage.setItem("gameSave", JSON.stringify(gameSave));
        location.reload();
    }
}

function randomNumber(min, max){
    return Math.round(Math.random() * (max - min) + min);
}

function fadeOut(element, duration, finalOpacity, callback){
    let opacity = 1;
    let elementFadingInterval = window.setInterval(function(){
        opacity -= 50 / duration;

        if (opacity <= finalOpacity){
            clearInterval(elementFadingInterval);
            callback();
        }

        element.style.opacity = opacity;
    }, 50);
}

function createNumberOnClicker(event){
    let clicker = document.getElementById("clicker");

    let clickerOffset = clicker.getBoundingClientRect();
    let position = {
        x: event.pageX - clickerOffset.left + randomNumber(-5, 5),
        y: event.pageY - clickerOffset.top
    };

    let element = document.createElement("div");
    element.textContent= "+" + game.clickValues;
    element.classList.add("number", "unselectable");
    element.style.left = position.x + "px";
    element.style.top = position.y + "px";
    
    clicker.appendChild(element);

    let movementInterval = window.setInterval(function(){
        if(typeof element == "undefined" && element == null) clearInterval(movementInterval);
        position.y--;
        element.style.top = position.y + "px";
    }, 10);

    fadeOut(element, 3000, 0.5, function(){
        element.remove();
    });
}

document.getElementById("clicker").addEventListener("click", function(event){
    game.totalClicks++;
    game.addPoint(game.clickValues);

    createNumberOnClicker(event);
}, false);

setInterval(function(){
    for(i=0; i<achievement.name.length; i++){
        if(achievement.type[i] == "score" && game.totalPoint >= achievement.requirement[i]) achievement.earn(i);
        else if (achievement.type[i] == "click" && game.totalClicks >= achievement.requirement[i]) achievement.earn(i);
        else if (achievement.type[i] == "building" && building.level[achievement.objectIndex[i]] >= achievement.requirement[i]) achievement.earn(i);
    }
    game.point += game.pointPerSec()
    game.totalPoint += game.pointPerSec();
    display.updatePoint();
    display.updateAchievements();
}, 1000);

setInterval(function(){
    display.updatePoint();
    display.updateFeatures();
}, 10000)

setInterval(function(){
    saveGame();
}, 30000); // 30s

document.addEventListener("keydown", function(event){
    if (event.ctrlKey && event.which == 83){ // ctrl + s
        event.preventDefault();
        saveGame();
    }
}, false)

window.onload = function(){
    loadGame();
    display.updatePoint();
    display.updateFeatures();
    display.updateShop();
    display.updateAchievements();
}
