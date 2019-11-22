let currBoard;
let inProgress = false;
let gen = 1;

document.addEventListener('DOMContentLoaded', function() {
	currBoard = newBoard();
	makeTable(currBoard);
});

function startGame() {
	gen = 1;
	document.getElementById("output").textContent = "";
	inProgress = true;
	toVisible();
	runGame();
}

function runGame() {
	if(!inProgress) return;
	const pop = getPop(currBoard);
	if(pop == 0) {
		endGame();
		return;
	}
	updateBoard(currBoard);
	makeTable(currBoard);
	document.getElementById("output").textContent = `Generation ${gen}. Population: ${pop}`;
	gen++
	setTimeout(runGame, 300);
}

function endGame() {
	inProgress = false;
	toVisible();
}

function newBoard() {
	let size = 10;
	let board = [];
	for(let y=0;y<size;y++) {
		board.push([]);
		for(let x=0;x<size;x++) {
			board[y][x] = 0;
		}
	}
	return board;
}

function makeTable(grid) {
	const table = document.getElementById("table");
	table.innerHTML = "";
	for(let r=0; r<grid.length;r++) {
		const row = table.insertRow();
		for(let c=0;c<grid[0].length;c++) {
			cell = row.insertCell();
			if(currBoard[r][c] == 1) cell.classList.add("clicked");
			cell.dataset.y = r;
			cell.dataset.x = c;
			cell.addEventListener('click', handleClick);
		}
	}
}

function updateBoard(board) {
	const countBoard = board.map((row, i) => row.map((_, j) => {
		const near = [
 			[1,0],[-1,0],[0,1],[0,-1],[1,1],[1,-1],[-1,1],[-1,-1]
		].map((d) => [d[0]+i, d[1]+j]);
		return near.reduce((a, c) => a + ((board[c[0]] || [])[c[1]] || 0), 0);
	}));

	const boardCopy = currBoard;
	const rules = [0, 0, 1, 1, 0, 0, 0, 0, 0];
	for(let y=0; y<boardCopy.length; y++) {
		for(let x=0; x<boardCopy[0].length; x++) {
			let count = countBoard[y][x];
			if(boardCopy[y][x] == 0 && count == 3) {
				currBoard[y][x] = 1;
			}
			else {
				currBoard[y][x] = rules[count];
			}
		}
	}
}

function getPop(grid) {
	let count = 0;
	for(let y=0; y<grid.length; y++) {
		for(let x=0; x<grid[0].length; x++) {
			if(grid[y][x]) count++;
		}
	}
	return count;
}

function clearBoard() {
	currBoard = newBoard();
	makeTable(currBoard);
	document.getElementById("output").textContent = "";
}

function toVisible() {
	const items = document.getElementsByClassName("toHide");
	for(let i=0; i<items.length; i++) {
		items[i].classList.toggle("hid");
	}
}

function handleClick(evn) {
	if(inProgress) return;
	const target = evn.target;
	currBoard[target.dataset.y][target.dataset.x] = (target.classList.contains("clicked") ? 0 : 1);
	target.classList.toggle("clicked");
}