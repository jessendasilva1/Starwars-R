// Health is between 100-200
// Attack Power is between 1-15
// Counter Attack Power is between 1-15

var availableCharacters = createCharacters();

var currentPlayer;
var currentDefender;
var enemies = [];
var multiplier = 1;

function createCharacters() {
    console.log("create new characters");
    availableCharacters = [];
    return new Promise(function (resolve, reject) {
        var characters = [{
            name: "Chewbacca",
            picture: "chewbacca.jpg",
            health: getRandomInt(100, 200),
            attackPower: getRandomInt(1, 15),
            counterAttackPower: getRandomInt(1, 15),
        },
        {
            name: "Yoda",
            picture: "yoda.jpg",
            health: getRandomInt(100, 200),
            attackPower: getRandomInt(1, 15),
            counterAttackPower: getRandomInt(1, 15),
        },
        {
            name: "GeneralGrevious",
            picture: "generalGrevious.jpg",
            health: getRandomInt(100, 200),
            attackPower: getRandomInt(1, 15),
            counterAttackPower: getRandomInt(1, 15),
        },
        {
            name: "JabbaTheHut",
            picture: "jabbaTheHut.jpg",
            health: getRandomInt(100, 200),
            attackPower: getRandomInt(1, 15),
            counterAttackPower: getRandomInt(1, 15),
        }]
        resolve(characters);
    });

}

function startGame() {
    var promise = createCharacters();
    promise.then(function (thing) {
        //console.log(JSON.stringify(thing));
        availableCharacters = thing;
        console.log(availableCharacters);
        enemies = [];
        currentDefender = null;
        currentPlayer = null;
        multiplier = 1;
        $("#battleButton").attr("disabled", true);
        $(".newGame").empty();
        for (var i = 0; i < availableCharacters.length; i++) {
            var temp = availableCharacters[i].name;
            $(".characterDiv").append(`
            <div id="" class="characters d-flex flex-column justify-content-center align-items-center " >
                <h4 class="characterNames">${availableCharacters[i].name}</h4>
                <img id="${availableCharacters[i].name}" src="assets/${availableCharacters[i].picture}" height="80px" width="80px" alt="thing" onclick="characterSelect(this)">
                <p>${availableCharacters[i].health}</p>
            </div>
        `);
        }
    })

}

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min; //The maximum is exclusive and the minimum is inclusive
}

function characterSelect(character) {
    for (var i = 0; i < availableCharacters.length; i++) {
        if (character.id === availableCharacters[i].name) {
            currentPlayer = availableCharacters[i];
        }
        else {
            enemies.push(availableCharacters[i]);
        }
    }
    movePlayers();
    console.log(currentPlayer);
    console.log(enemies);
}

function movePlayers() {
    currentHero();
    availableEnemies();
}

function currentHero() {
    $('#currentPlayer').empty();
    $('#currentPlayer').append(`
    <div id="" class="characters d-flex flex-column justify-content-center align-items-center " >
        <h4 class="characterNames">${currentPlayer.name}</h4>
        <img id="${currentPlayer.name}" src="assets/${currentPlayer.picture}" height="80px" width="80px" alt="thing" >
        <p>${currentPlayer.health}</p>
    </div>
    `);
    $(".characterDiv").empty();
    //availableEnemies();
}

function availableEnemies() {
    $("#enemiesDiv").empty();
    for (var i = 0; i < enemies.length; i++) {
        $("#enemiesDiv").append(`
        <div class="enemies d-flex flex-column justify-content-center align-items-center " >
            <h4 class="characterNames">${enemies[i].name}</h4>
            <img id="${enemies[i].name}" src="assets/${enemies[i].picture}" height="80px" width="80px" alt="thing" onclick="enemySelect(this)">
            <p>${enemies[i].health}</p>
        </div>
        `);
    }
}

function currentDefenderHero(enemy) {
    $('#defenderPlayer').empty();
    $("#defenderPlayer").append(`
    <div id="" class="enemies d-flex flex-column justify-content-center align-items-center" >
        <h4 class="characterNames">${enemy.name}</h4>
        <img id="${enemy.name}" src="assets/${enemy.picture}" height="80px" width="80px" alt="thing" >
        <p>${enemy.health}</p>
    </div>
    `);
    currentDefender = enemy;
    $("#battleButton").attr("disabled", false);
}

function enemySelect(element) {
    console.log(currentDefender);
    if (!currentDefender) {
        enemies.forEach(function (enemy, index) {
            if (enemy.name === element.id) {
                currentDefenderHero(enemy);
                enemies.splice(index, 1);
                availableEnemies();

                console.log("currentDefender: " + enemy);
                $(".battleInfo").empty();
                console.log(enemies);
                console.log(enemy.name);
            }
        })
    }

}

function updateHealth() {
    currentDefenderHero(currentDefender);
    currentHero();
}

function checkHealth(defender) {

    if (currentPlayer.health <= 0) {
        $("#battleButton").attr("disabled", true);
        $(".battleInfo").empty();
        $(".battleInfo").append(`
            <div>
            You have been defeated... GAME OVER!!!!
            <button onclick="restartGame()">Restart</button>
            </div>
        `);
    }
    else if (defender.health <= 0) {
        if (enemies.length <= 0) {
            console.log("you win!");
            $("#battleButton").attr("disabled", true);
            $(".battleInfo").empty();
            $(".battleInfo").append(`
                <div>
                You have won the game... GAME OVER!!!!
                <button onclick="restartGame()">Restart</button>
                </div>
            `);
        }
        else {
            $("#battleButton").attr("disabled", true);
            $(".battleInfo").empty();
            $(".battleInfo").append(`<h4>You defeated ${defender.name}. Select your next opponent? </h4>`);
            currentDefender = null;
            console.log(currentDefender);
            $("#defenderPlayer").empty();
        }
    }
}

function battle() {
    var playerAttackPower = currentPlayer.attackPower * multiplier;
    console.log("playerPower: " + playerAttackPower);
    if (currentPlayer && currentDefender) {
        currentDefender.health = currentDefender.health - playerAttackPower;
        currentPlayer.health = currentPlayer.health - currentDefender.counterAttackPower;
        multiplier++;
        $(".battleInfo").empty();
        $(".battleInfo").append(`<h4>You attacked ${currentDefender.name} for ${playerAttackPower} damage.</h4>`);
        $(".battleInfo").append(`<h4>${currentDefender.name} attacked you for ${currentDefender.counterAttackPower} damage.</h4>`);
        updateHealth(currentDefender);
        checkHealth(currentDefender);

    }
}

function restartGame() {
    startGame();
}

$(document).ready(function () {

})