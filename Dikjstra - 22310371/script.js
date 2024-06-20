const rows = 12;
const cols = 15;
let startNode = null;
let endNode = null;

document.addEventListener('DOMContentLoaded', () => {
    const gridContainer = document.getElementById('grid-container');
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
            const cell = document.createElement('div');
            cell.classList.add('cell');
            cell.dataset.row = r;
            cell.dataset.col = c;
            cell.addEventListener('click', () => selectNode(cell));
            cell.addEventListener('contextmenu', (e) => {
                e.preventDefault();
                toggleBlock(cell);
            });
            gridContainer.appendChild(cell);
        }
    }
});

function selectNode(cell) {
    if (cell.classList.contains('blocked')) return;

    if (!startNode) {
        startNode = cell;
        cell.classList.add('start');
    } else if (!endNode) {
        endNode = cell;
        cell.classList.add('end');
    }
}

function toggleBlock(cell) {
    if (cell.classList.contains('start') || cell.classList.contains('end')) return;
    cell.classList.toggle('blocked');
}

function findShortestPath() {


    const start = {
        row: parseInt(startNode.dataset.row),
        col: parseInt(startNode.dataset.col)
    };
    const end = {
        row: parseInt(endNode.dataset.row),
        col: parseInt(endNode.dataset.col)
    };

    const path = dijkstra(start, end);
    if (path) {
        for (const node of path) {
            const cell = document.querySelector(`.cell[data-row='${node.row}'][data-col='${node.col}']`);
            if (!cell.classList.contains('start') && !cell.classList.contains('end')) {
                cell.classList.add('path');
            }
        }
    } else {
        alert('No se encontró una ruta.');
    }
}

function resetGrid() {
    startNode = null;
    endNode = null;
    const cells = document.querySelectorAll('.cell');
    cells.forEach(cell => {
        cell.classList.remove('start', 'end', 'path', 'blocked');
    });
}

function dijkstra(start, end) {
    const grid = Array.from({ length: rows }, () => Array(cols).fill(Infinity));
    grid[start.row][start.col] = 0;

    const pq = [[start, 0]];
    const directions = [
        { row: -1, col: 0 },
        { row: 1, col: 0 },
        { row: 0, col: -1 },
        { row: 0, col: 1 }
    ];
    const prev = Array.from({ length: rows }, () => Array(cols).fill(null));

    while (pq.length > 0) {
        pq.sort((a, b) => a[1] - b[1]);
        const [current, dist] = pq.shift();
        const { row, col } = current;

        if (row === end.row && col === end.col) {
            const path = [];
            let step = end;
            while (step) {
                path.push(step);
                step = prev[step.row][step.col];
            }
            return path.reverse();
        }

        for (const { row: dr, col: dc } of directions) {
            const newRow = row + dr;
            const newCol = col + dc;
            if (
                newRow >= 0 && newRow < rows &&
                newCol >= 0 && newCol < cols &&
                !document.querySelector(`.cell[data-row='${newRow}'][data-col='${newCol}']`).classList.contains('blocked')
            ) {
                const newDist = dist + 1;
                if (newDist < grid[newRow][newCol]) {
                    grid[newRow][newCol] = newDist;
                    pq.push([{ row: newRow, col: newCol }, newDist]);
                    prev[newRow][newCol] = { row, col };
                }
            }
        }
    }
    return null;
}
