// إعدادات اللعبة داخل الـ Worker
const winningConditions = [
    [0, 1, 2, 3, 4], [5, 6, 7, 8, 9], [10, 11, 12, 13, 14], [15, 16, 17, 18, 19], [20, 21, 22, 23, 24],
    [0, 5, 10, 15, 20], [1, 6, 11, 16, 21], [2, 7, 12, 17, 22], [3, 8, 13, 18, 23], [4, 9, 14, 19, 24],
    [0, 6, 12, 18, 24], [4, 8, 12, 16, 20]
];
const searchOrder = [12, 6, 7, 8, 11, 13, 16, 17, 18, 0, 4, 20, 24, 1, 2, 3, 5, 9, 10, 14, 15, 19, 21, 22, 23];
const transpositionTable = new Map();

self.onmessage = function(e) {
    const { gameState, depthLimit } = e.data;
    transpositionTable.clear();
    
    let bestScore = -Infinity;
    let move;

    for (let i of searchOrder) {
        if (gameState[i] === "") {
            gameState[i] = "O";
            let score = minimax(gameState, 0, -Infinity, Infinity, false, depthLimit);
            gameState[i] = "";
            if (score > bestScore) {
                bestScore = score;
                move = i;
            }
        }
    }
    
    self.postMessage(move);
};

function minimax(boardState, depth, alpha, beta, isMaximizing, maxDepth) {
    const stateKey = boardState.join('');
    if (transpositionTable.has(stateKey)) return transpositionTable.get(stateKey);

    let result = evaluateBoard(boardState);
    if (result !== null) {
        let score = result === "O" ? 1000 - depth : (result === "X" ? depth - 1000 : 0);
        transpositionTable.set(stateKey, score);
        return score;
    }

    if (depth === maxDepth) {
        let score = calculateHeuristic(boardState);
        transpositionTable.set(stateKey, score);
        return score;
    }

    let bestVal = isMaximizing ? -Infinity : Infinity;
    for (let i of searchOrder) {
        if (boardState[i] === "") {
            boardState[i] = isMaximizing ? "O" : "X";
            let score = minimax(boardState, depth + 1, alpha, beta, !isMaximizing, maxDepth);
            boardState[i] = "";
            if (isMaximizing) {
                bestVal = Math.max(score, bestVal);
                alpha = Math.max(alpha, bestVal);
            } else {
                bestVal = Math.min(score, bestVal);
                beta = Math.min(beta, bestVal);
            }
            if (beta <= alpha) break;
        }
    }
    transpositionTable.set(stateKey, bestVal);
    return bestVal;
}

function evaluateBoard(state) {
    for (let condition of winningConditions) {
        const [a, b, c, d, e] = condition;
        if (state[a] && state[a] === state[b] && state[a] === state[c] && state[a] === state[d] && state[a] === state[e]) {
            return state[a];
        }
    }
    return state.includes("") ? null : "draw";
}

function calculateHeuristic(state) {
    let score = 0;
    for (let condition of winningConditions) {
        let x = 0, o = 0;
        for (let idx of condition) {
            if (state[idx] === 'X') x++;
            else if (state[idx] === 'O') o++;
        }
        if (x === 0 && o > 0) score += Math.pow(5, o);
        if (o === 0 && x > 0) score -= Math.pow(5, x);
    }
    return score;
}