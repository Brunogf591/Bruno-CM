let totalRow = 10;
let totalColumn = 10;
let qtdMinas = 20;
let flagsLeft = qtdMinas;
let gameOver = false;
let cellsOpened = 0;

let Square = {
    row: 0,
    column: 0,
    state: "closed",
    hasMine: false,
    nearMines: 0
};

function criaSquare(row, col) {
    let square = Object.create(Square);
    square.row = row;
    square.column = col;
    return square;
}

function criaMatrizCampo(rows, cols) {
    let matrizCampo = [];
    for (let i = 0; i < rows; i++) {
        let row = [];
        for (let j = 0; j < cols; j++) {
            let square = criaSquare(i, j);
            row.push(square);
        }
        matrizCampo.push(row);
    }
    return matrizCampo;
}

function sorteiaMinas(matrizCampo, qtdMinas) {
    let totalRow = matrizCampo.length;
    let totalColumn = matrizCampo[0].length;
    let minasSorteadas = 0;

    while (minasSorteadas < qtdMinas) {
        let row = Math.floor(totalRow * Math.random());
        let col = Math.floor(totalColumn * Math.random());

        if (!matrizCampo[row][col].hasMine) {
            matrizCampo[row][col].hasMine = true;
            minasSorteadas++;
        }
    }
}

function contaVizinhos(matrizCampo) {
    let totalRow = matrizCampo.length;
    let totalColumn = matrizCampo[0].length;

    for (let i = 0; i < totalRow; i++) {
        for (let j = 0; j < totalColumn; j++) {
            if (!matrizCampo[i][j].hasMine) {
                let minasAoRedor = 0;

                for (let x = -1; x <= 1; x++) {
                    for (let y = -1; y <= 1; y++) {
                        let newRow = i + x;
                        let newCol = j + y;

                        if (newRow >= 0 && newRow < totalRow && newCol >= 0 && newCol < totalColumn) {
                            if (matrizCampo[newRow][newCol].hasMine) {
                                minasAoRedor++;
                            }
                        }
                    }
                }

                matrizCampo[i][j].nearMines = minasAoRedor;
            }
        }
    }
}

function renderCampoMinado(matrizCampo) {
    const minefield = document.getElementById('minefield');
    minefield.innerHTML = ''; // Limpa o campo

    matrizCampo.forEach(row => {
        row.forEach(square => {
            const cell = document.createElement('div');
            cell.classList.add('cell');
            cell.dataset.row = square.row;
            cell.dataset.column = square.column;

            const mineImage = document.createElement('img');
            mineImage.src = "images/bomb.jpg"; // Ajuste o caminho da imagem
            mineImage.classList.add('mine-image');
            cell.appendChild(mineImage);

            const flagImage = document.createElement('img');
            flagImage.src = "images/flag.jpg"; // Ajuste o caminho da imagem
            flagImage.classList.add('flag-image');
            cell.appendChild(flagImage);

            cell.addEventListener('click', () => abreCelula(square, cell));
            cell.addEventListener('contextmenu', (e) => {
                e.preventDefault();
                marcaCelula(square, cell);
            });

            minefield.appendChild(cell);
        });
    });
}

function abreCelula(square, cell) {
    if (square.state === "opened" || square.state === "flagged" || gameOver) {
        return;
    }
    
    square.state = "opened";
    cell.classList.add('opened');
    cellsOpened++;

    if (square.hasMine) {
        cell.querySelector('img.flag-image').style.display = 'none';  // Esconde a bandeira se estiver presente
        cell.querySelector('img.mine-image').style.display = 'block';
        alert("Game Over!");
        gameOver = true;
        revealMines(); // Revela todas as minas
    } else {
        if (square.nearMines > 0) {
            cell.textContent = square.nearMines;
        } else {
            abreVizinhos(square);
        }

        if (cellsOpened === totalRow * totalColumn - qtdMinas) {
            alert("Você venceu!");
            gameOver = true;
        }
    }
}

function marcaCelula(square, cell) {
    if (square.state === "opened" || gameOver) {
        return;
    }

    if (square.state === "flagged") {
        square.state = "closed";
        cell.querySelector('img.flag-image').style.display = 'none';
        flagsLeft++;
    } else if (flagsLeft > 0) {
        square.state = "flagged";
        cell.querySelector('img.flag-image').style.display = 'block';
        flagsLeft--;
    }

    document.getElementById('flags-left').textContent = `Bandeiras Restantes: ${flagsLeft}`;
}

function abreVizinhos(square) {
    let directions = [
        [-1, -1], [-1, 0], [-1, 1],
        [0, -1], [0, 1],
        [1, -1], [1, 0], [1, 1]
    ];

    directions.forEach(([dx, dy]) => {
        let newRow = square.row + dx;
        let newCol = square.column + dy;

        if (newRow >= 0 && newRow < totalRow && newCol >= 0 && newCol < totalColumn) {
            let vizinho = matrizCampo[newRow][newCol];
            let cell = document.querySelector(`.cell[data-row='${newRow}'][data-column='${newCol}']`);
            if (vizinho.state === "closed") {
                abreCelula(vizinho, cell);
            }
        }
    });
}

function revealMines() {
    matrizCampo.forEach(row => {
        row.forEach(square => {
            if (square.hasMine) {
                let cell = document.querySelector(`.cell[data-row='${square.row}'][data-column='${square.column}']`);
                cell.querySelector('img.flag-image').style.display = 'none'; // Esconde a bandeira
                cell.querySelector('img.mine-image').style.display = 'block'; // Mostra a mina
            }
        });
    });
}

function reiniciarJogo() {
    gameOver = false;
    flagsLeft = qtdMinas;
    cellsOpened = 0;
    document.getElementById('flags-left').textContent = `Bandeiras Restantes: ${flagsLeft}`;
    matrizCampo = criaMatrizCampo(totalRow, totalColumn);
    sorteiaMinas(matrizCampo, qtdMinas);
    contaVizinhos(matrizCampo);
    renderCampoMinado(matrizCampo);
}

document.getElementById('restart-button').addEventListener('click', reiniciarJogo);

let matrizCampo = criaMatrizCampo(totalRow, totalColumn);
sorteiaMinas(matrizCampo, qtdMinas);
contaVizinhos(matrizCampo);
renderCampoMinado(matrizCampo);