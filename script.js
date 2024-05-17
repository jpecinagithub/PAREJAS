document.addEventListener("DOMContentLoaded", () => {
    const BOARD_WIDTH = 6;
    const BOARD_HEIGHT = 6;
    const TILE_SIZE = 100;
    const imagesDir = 'images';
    let animalImages = [];
    for (let i = 1; i <= 18; i++) {
        animalImages.push(`${imagesDir}/image${i}.png`);
    }
    animalImages = [...animalImages, ...animalImages]; // Duplicate images for pairs
    shuffle(animalImages);

    let board = [];
    let revealed = Array.from({ length: BOARD_HEIGHT }, () => Array(BOARD_WIDTH).fill(false));
    let firstSelection = null;
    let secondSelection = null;
    let currentPlayer = 0; // 0 for Red, 1 for Blue
    let scores = [0, 0];
    let gameOver = false;
    let showingPairs = false;

    const gameBoard = document.getElementById('game-board');
    const playerRed = document.getElementById('playerRed');
    const playerBlue = document.getElementById('playerBlue');

    // Create the board
    for (let y = 0; y < BOARD_HEIGHT; y++) {
        let row = [];
        for (let x = 0; x < BOARD_WIDTH; x++) {
            let tile = document.createElement('div');
            tile.classList.add('tile');
            let img = document.createElement('img');
            img.src = animalImages.pop();
            tile.appendChild(img);
            gameBoard.appendChild(tile);
            tile.addEventListener('click', () => onTileClick(x, y));
            row.push(tile);
        }
        board.push(row);
    }

    function onTileClick(x, y) {
        if (gameOver || showingPairs || revealed[y][x]) return;

        let tile = board[y][x];
        let img = tile.querySelector('img');
        img.style.display = 'block';
        revealed[y][x] = true;

        if (!firstSelection) {
            firstSelection = { x, y };
        } else if (!secondSelection) {
            secondSelection = { x, y };
            checkForMatch();
        }
    }

    function checkForMatch() {
        let { x: x1, y: y1 } = firstSelection;
        let { x: x2, y: y2 } = secondSelection;
        let img1 = board[y1][x1].querySelector('img').src;
        let img2 = board[y2][x2].querySelector('img').src;

        if (img1 === img2) {
            scores[currentPlayer] += 10;
            updateScores();
            firstSelection = secondSelection = null;
            checkGameOver();
        } else {
            showingPairs = true;
            setTimeout(() => {
                board[y1][x1].querySelector('img').style.display = 'none';
                board[y2][x2].querySelector('img').style.display = 'none';
                revealed[y1][x1] = revealed[y2][x2] = false;
                firstSelection = secondSelection = null;
                showingPairs = false;
                currentPlayer = (currentPlayer + 1) % 2;
                updateScores();
            }, 1000);
        }
    }

    function checkGameOver() {
        if (revealed.flat().every(cell => cell)) {
            gameOver = true;
            alert(`¡Jugador ${scores[0] > scores[1] ? 'Rojo' : 'Azul'} gana!`);
        }
    }

    function updateScores() {
        playerRed.textContent = `Rojo: ${scores[0]}`;
        playerBlue.textContent = `Azul: ${scores[1]}`;
        playerRed.classList.toggle('active', currentPlayer === 0);
        playerBlue.classList.toggle('active', currentPlayer === 1);
    }

    function shuffle(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    }

    // Initialize the scores
    updateScores();
});


