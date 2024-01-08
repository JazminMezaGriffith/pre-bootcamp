var player = {
    left: 290,
    top: 380
}

var enemies = [
    {left: 80, top: 150},
    {left: 230, top: 50},
    {left: 320, top: 200},
    {left: 400, top: 120}
];

var missiles = [];

function drawPlayer(){
    content = "<div class='player' style='left: " + player.left + "px; top: " + player.top + "px;'></div>";
    document.getElementById("players").innerHTML = content;
}

function drawEnemies(){
    content = "";
    for (var idx = 0; idx < enemies.length; idx++){
        content += "<div class='enemy' style='left: " + enemies[idx].left + "px; top: " + enemies[idx].top + "px;'></div>";
    }
    document.getElementById("enemies").innerHTML = content;
}

function drawMissiles(){
    content = "";
    for (idx = 0; idx < missiles.length; idx++){
        content += "<div class='missile' style='left: " + missiles[idx].left + "px; top: " + missiles[idx].top + "px;'></div>"
    }
    document.getElementById("missiles").innerHTML = content;
}

function moveEnemies(){
    for (var idx = 0; idx < enemies.length; idx++){
        enemies[idx].top += 5;

        if (enemies[idx].top > 370) {
            // Reincia la posición del enemigo en la parte superior
            enemies[idx].top = 0;
        }
    }
}

function moveMissiles(){
    for (var idx = 0; idx < missiles.length; idx++){
        missiles[idx].top -= 10;
    }
}

document.onkeydown = function (e) {
    if (e.keyCode == 37 && player.left > 0) { // LEFT
        player.left -= 10;
    } else if (e.keyCode == 39 && player.left < 570) { // RIGHT
        player.left += 10;
    } else if (e.keyCode == 40 && player.top < 380) { // DOWN
        player.top += 10;
    } else if (e.keyCode == 38 && player.top > 280) { // UP
        player.top -= 10;
    }

    if (e.keyCode == 32) { // SPACE BAR - Fire missile
        missiles.push({left: (player.left + 34), top: (player.top - 8)});
        drawMissiles();
    }
    drawPlayer();
}

function gameLoop(){
    drawPlayer();

    moveEnemies();
    drawEnemies();

    moveMissiles();
    drawMissiles();
    setTimeout(gameLoop, 200);
}
gameLoop();