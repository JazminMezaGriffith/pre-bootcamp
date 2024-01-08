var direction = 'Right', score = 0, lives = 3, gameOver = false;

function generateRandomWorld(rows, cols) { // Recursive Backtracking
    var world = [];

    // Inicializar el mundo con todos los muros
    for (var row = 0; row < rows; row++) {
        var currentRow = [];
        for (var col = 0; col < cols; col++) {
            currentRow.push(1);
        }
        world.push(currentRow);
    }

    // Puntos iniciales
    var startX = 1;
    var startY = 1;

    // Añadir puntos iniciales al conjunto de puntos activos
    var activeCells = [{ x: startX, y: startY }];

    while (activeCells.length > 0) {
        // Elegir una celda aleatoria del conjunto de puntos activos
        var currentIndex = Math.floor(Math.random() * activeCells.length);
        var currentCell = activeCells[currentIndex];

        // Obtener coordenadas x e y de la celda actual
        var x = currentCell.x;
        var y = currentCell.y;

        // Marcar la celda actual como pasable (2 o 3)
        world[y][x] = Math.random() < 0.5 ? 2 : 3;

        // Obtener vecinos no visitados de la celda actual
        var neighbors = [
            { x: x - 2, y: y },
            { x: x + 2, y: y },
            { x: x, y: y - 2 },
            { x: x, y: y + 2 }
        ];

        neighbors = neighbors.filter(
            neighbor =>
                neighbor.x > 0 &&
                neighbor.y > 0 &&
                neighbor.x < cols - 1 &&
                neighbor.y < rows - 1 &&
                world[neighbor.y][neighbor.x] === 1
        );

        if (neighbors.length > 0) {
            // Elegir un vecino aleatorio y marcar el camino (2 o 3)
            var nextCell = neighbors[Math.floor(Math.random() * neighbors.length)];
            world[nextCell.y][nextCell.x] = Math.random() < 0.5 ? 2 : 3;

            // Añadir el vecino al conjunto de puntos activos
            activeCells.push({ x: nextCell.x, y: nextCell.y });

            // Eliminar la pared entre la celda actual y el vecino
            world[y + (nextCell.y - y) / 2][x + (nextCell.x - x) / 2] = Math.random() < 0.5 ? 2 : 3;

            // Agregar los vecinos al conjunto de puntos activos
            activeCells.push({ x: nextCell.x, y: nextCell.y });
        } else {
            // Si no hay vecinos no visitados, eliminar la celda actual del conjunto activo
            activeCells.splice(currentIndex, 1);
        }
    }
    world[1][1] = 0; // Spawn del ninja
    return world;
}

var world = generateRandomWorld(11, 15); // Solo funciona con numeros impares

var worldDict = {
    0: 'blank',
    1: 'wall',
    2: 'sushi',
    3: 'onigiri'
}

function drawWorld() {
    output = "";

    for (var row = 0; row < world.length; row++) {
        output += "<div class='row'>";
        for (var x = 0; x < world[row].length; x++) {
            output += "<div class='" + worldDict[world[row][x]] + "'></div>";
        }
        output += "</div>";
    }

    document.getElementById('world').innerHTML = output;
}
drawWorld();

var ninjaman = {
    x: 1,
    y: 1
}

var enemy = {
    x: 14,
    y: 9
};

function drawNinjaman() {
    document.getElementById('ninjaman').style.top = ninjaman.y * 40 + 'px';
    document.getElementById('ninjaman').style.left = ninjaman.x * 40 + 'px';
    document.getElementById('ninjaman').style.backgroundImage = "url('img/ninja" + direction + ".gif')";
}
drawNinjaman();

function drawEnemy() {
    document.getElementById('red').style.top = enemy.y * 40 + 'px';
    document.getElementById('red').style.left = enemy.x * 40 + 'px';
}
drawEnemy();

document.onkeydown = function (e) {
    if (!gameOver) {
        if (e.keyCode == 37) { // LEFT
            if (world[ninjaman.y][ninjaman.x - 1] != 1) {
                ninjaman.x--;
                direction = 'Left';
            }
        } else if (e.keyCode == 39) { // RIGHT
            if (world[ninjaman.y][ninjaman.x + 1] != 1) {
                ninjaman.x++;
                direction = 'Right';
            }
        } else if (e.keyCode == 40) { // DOWN
            if (world[ninjaman.y + 1][ninjaman.x] != 1) {
                ninjaman.y++;
                direction = 'Down';
            }
        } else if (e.keyCode == 38) { // UP
            if (world[ninjaman.y - 1][ninjaman.x] != 1) {
                ninjaman.y--;
                direction = 'Up';
            }
        }

        if (ninjaman.x === enemy.x && ninjaman.y === enemy.y) {
            lives--;
            document.getElementById('lives').innerHTML = "Lives: " + lives;
            checkWin();
        }

        updateScore();
        drawWorld();
        drawNinjaman();
    }
}

function moveEnemy() {
    // Direcciones posibles para el enemigo
    const directions = [{ x: 0, y: -1 }, { x: 0, y: 1 }, { x: -1, y: 0 }, { x: 1, y: 0 }];

    // Variables para almacenar la mejor dirección y la menor distancia al ninja
    let bestDirection = null;
    let minDistance = Infinity;

    for (const direction of directions) {
        const newX = enemy.x + direction.x;
        const newY = enemy.y + direction.y;

        // Verifica si la nueva posición está dentro de los límites del mundo y es transitable
        if (newX >= 0 && newX < world[0].length && newY >= 0 && newY < world.length && world[newY][newX] !== 1) {
            // Calcula la distancia al ninja usando la distancia euclidiana
            const distance = Math.sqrt(Math.pow(ninjaman.x - newX, 2) + Math.pow(ninjaman.y - newY, 2));

            // Si la nueva posición está más cerca, actualiza la mejor dirección y la menor distancia
            if (distance < minDistance) {
                minDistance = distance;
                bestDirection = direction;
            }
        }
    }

    if (bestDirection) {
        enemy.x += bestDirection.x;
        enemy.y += bestDirection.y;
    }

    if (ninjaman.x === enemy.x && ninjaman.y === enemy.y) {
        lives--;
        document.getElementById('lives').innerHTML = "Lives: " + lives;
        checkWin();
    }

    drawEnemy();
}

function checkRemainingFood() {
    for (var row = 0; row < world.length; row++) {
        for (var col = 0; col < world[row].length; col++) {
            if (world[row][col] === 2 || world[row][col] === 3) {
                // Todavía hay sushis u onigiris
                return true;
            }
        }
    }
    // No hay sushis ni onigiris restantes
    return false;
}

function checkWin() {
    if (checkRemainingFood() == false) {
        document.getElementById('message').innerHTML = "You won! :D";
        document.getElementById('restartButton').style.display = 'block';
        gameOver = true;
    } else if (lives <= 0) {
        document.getElementById('message').innerHTML = "You lost :(";
        document.getElementById('restartButton').style.display = 'block';
        gameOver = true;
    }
}

function updateScore() {
    if (world[ninjaman.y][ninjaman.x] == 2) {
        score += 10;
    } else if (world[ninjaman.y][ninjaman.x] == 3) {
        score += 5;
    }
    world[ninjaman.y][ninjaman.x] = 0;
    document.getElementById('score').innerHTML = "Score: " + score + "pts";
    checkWin();
}

function restartGame() {
    score = 0;
    lives = 3;
    gameOver = false;

    world = generateRandomWorld(11, 15);
    ninjaman.x = 1;
    ninjaman.y = 1;
    enemy.x = 14;
    enemy.y = 9;

    document.getElementById('score').innerHTML = "Score: 0pts";
    document.getElementById('lives').innerHTML = "Lives: 3";

    document.getElementById('message').style.display = 'none';
    document.getElementById('restartButton').style.display = 'none';

    drawWorld();
    drawNinjaman();
    drawEnemy();
    gameLoop();
}

function gameLoop() {
    if (!gameOver) {
        moveEnemy();
        setTimeout(gameLoop, 1000);
    }
}
gameLoop();
