const calcScore = (diceState, playerPosition = 1, currentScore = 0, boardSize = 10, diceSides = 100) => {
    let i = 1;
    let sumOfThrows = diceState;

    while (i <= 2) {
        sumOfThrows += diceState + i;
        i++;
    }

    const newScore = (playerPosition + sumOfThrows) % boardSize === 0 ? boardSize : (playerPosition + sumOfThrows) % boardSize;
    const newDiceState = (diceState + 3) % diceSides === 0 ? diceSides : (diceState + 3) % diceSides;

    return {
        diceState: newDiceState,
        playerPosition: newScore,
        currentScore: currentScore + newScore
    };
}

const round = (diceState, diceRolled, players, boardSize = 10) => {
    let updatedDiceState = diceState;
    let updatedPlayers = [];

    for (let i = 0; i < players.length; i++) {
        const playerState = calcScore(updatedDiceState, players[i].position, players[i].score, boardSize);
        updatedPlayers = [...updatedPlayers, { id: players[i].id, position: playerState.playerPosition, score: playerState.currentScore }]
        updatedDiceState = playerState.diceState;

        // made a mistake of not reading what's expected as the answer so had to 
        //  add player ids so I could filter out the ones who didn't win since we need to also know the
        //  state of prev player's at the time the game ends so we could calc the final answer
        if (playerState.currentScore >= 1000) {
            const addedIds = updatedPlayers.reduce((acc, p) => {
                acc = [...acc, p.id];
                return acc;
            }, []);

            const withNotWinning = [...updatedPlayers, ...players.filter(p => addedIds.indexOf(p.id) === -1)];
            return {
                players: withNotWinning,
                diceState: updatedDiceState,
                diceRolled: diceRolled + updatedPlayers.length * 3
            }
        }
    }

    return {
        players: updatedPlayers,
        diceState: updatedDiceState,
        diceRolled: diceRolled + updatedPlayers.length * 3
    };
};

const game = (diceState = 1, diceRolled = 0, players, boardSize = 10) => {
    const highestScore = players.sort((a, b) => b.score - a.score)[0].score;

    if (highestScore < 1000) {
        const newState = round(diceState, diceRolled, players, boardSize);
        return game(newState.diceState, newState.diceRolled, newState.players, boardSize);
    } else {
        return {
            players,
            diceRolled
        };
    }
};

const players = [{
    id: Math.floor(Math.random() * 100 / Math.random() * 10),
    position: 4,
    score: 0
}, {
    id: Math.floor(Math.random() * 100 / Math.random() * 10),
    position: 6,
    score: 0
}];

const gameResult = game(1, 0, players, 10);
const losingPlayerScore = gameResult.players.sort((a, b) => a.score - b.score)[0].score;
const part1 = losingPlayerScore * gameResult.diceRolled;

const result = {
    part1
}

console.log(result);