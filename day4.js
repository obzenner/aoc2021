const { getDataFromTxtFile } = require('./helpers/readFile')
const input = getDataFromTxtFile('./inputs/day4.txt');
const emptyLineRegex = /\n{2,}/g
const backSlashNEmptySpaceRegex = /[\\n\s]/g

const inputData = input.split(emptyLineRegex).reduce((acc, curr, index) => {
    if (index === 0) {
        acc.numbers = curr.split(',').map(n => Number(n))
    } else {
        if (!acc.cards) {
            acc.cards = {};
        }
        acc.cards[index - 1] = curr.split(backSlashNEmptySpaceRegex).filter(n => n !== '').reduce((acc, curr) => {
            acc.set(Number(curr), false);
            return acc;
        }, new Map());
    }
    return acc;
}, {});

// INIT DATA EXAMPLE:
// {
//     numbers: [
//        7,  4,  9,  5, 11, 17, 23,  2,
//        0, 14, 21, 24, 10, 16, 13,  6,
//       15, 25, 12, 22, 18, 20,  8, 19,
//        3, 26,  1
//     ],
//     cards: {
//       '0': Map(25) {
//         22 => false,
//         13 => false,
//         17 => false,
//         11 => false,
//         0 => false,
//         8 => false,
//         2 => false,
//         23 => false,
//         4 => false,
//         24 => false,
//         21 => false,
//         9 => false,
//         14 => false,
//         16 => false,
//         7 => false,
//         6 => false,
//         10 => false,
//         3 => false,
//         18 => false,
//         5 => false,
//         1 => false,
//         12 => false,
//         20 => false,
//         15 => false,
//         19 => false
//       },
//       '1': Map(25) {
//         3 => false,
//         15 => false,
//         0 => false,
//         2 => false,
//         22 => false,
//         9 => false,
//         18 => false,
//         13 => false,
//         17 => false,
//         5 => false,
//         19 => false,
//         8 => false,
//         7 => false,
//         25 => false,
//         23 => false,
//         20 => false,
//         11 => false,
//         10 => false,
//         24 => false,
//         4 => false,
//         14 => false,
//         21 => false,
//         16 => false,
//         12 => false,
//         6 => false
//       },
//       '2': Map(25) {
//         14 => false,
//         21 => false,
//         17 => false,
//         24 => false,
//         4 => false,
//         10 => false,
//         16 => false,
//         15 => false,
//         9 => false,
//         19 => false,
//         18 => false,
//         8 => false,
//         23 => false,
//         26 => false,
//         20 => false,
//         22 => false,
//         11 => false,
//         13 => false,
//         6 => false,
//         5 => false,
//         2 => false,
//         0 => false,
//         12 => false,
//         3 => false,
//         7 => false
//       }
//     }
//   }


const bingoChecker = (card, cardSize = 5) => {
    let isRowBingo = false;
    let isColumnBingo = false;
    let row = [];
    let columns = {};
    
    for (let i = 1; i <= card.length; i++) {
        // check columns
        const columnIndex = (i - 1) % cardSize + 1;

        if (!columns[columnIndex]) {
            columns[columnIndex] = [card[i - 1]];
        } else {
            columns[columnIndex] = [...columns[columnIndex], card[i - 1]];
        }

        if (columns[columnIndex].length === cardSize) {
            isColumnBingo = columns[columnIndex].every(c => c[1] === true);
            if (isColumnBingo) {
                return true;
            }
        }

        // check rows
        if (i % cardSize === 0) {
            row = [...row, card[i - 1]];

            isRowBingo = row.every(v => v[1] === true);

            if (isRowBingo) {
                return true;
            } else {
                row = [];
            }
        } else {
            row = [...row, card[i - 1]]
        }
    }

    return false;
}

const calcScore = winner => {
    const sum = Array.from(winner.card).reduce((acc, curr) => {
        if (curr[1] !== true) {
            acc += curr[0];
        }
        return acc;
    }, 0);
    return sum * winner.number;
};

const runBingo = (numbers, cards, lastWinnerCard = false) => {
    let winnerCards = {};
    let winnerCardsObjects = [];

    // PART1
    for (let i = 0; i < numbers.length; i++) {
        for (let j = 0; j < Object.keys(cards).length; j++) {
            const winnerCard = winnerCards[`${j}`];
            const currentCard = cards[`${j}`];
            const currentNumber = numbers[i];

            // only set the number to true if it's false, otherwise do nothing
            if (!winnerCard && currentCard.get(currentNumber) === false) {
                currentCard.set(currentNumber, true);
            }
            // check if card has bingo'ed
            const isBingo = bingoChecker(Array.from(currentCard));

            if (lastWinnerCard && isBingo && !winnerCard) {
                winnerCards[j] = currentCard;
                winnerCardsObjects = [...winnerCardsObjects, {
                    winnerCardId: j,
                    winnerNumber: currentNumber
                }]
            }

            // return final score
            if (!lastWinnerCard && isBingo) {
                return calcScore({
                    card: currentCard,
                    number: currentNumber
                });
            }
        }
    }

    // PART2
    if (lastWinnerCard && winnerCardsObjects.length > 0) {
        // get last card that won
        const lastCardIndex = winnerCardsObjects.length - 1;
        const { winnerCardId, winnerNumber } = winnerCardsObjects[lastCardIndex];

        return calcScore({
            card: winnerCards[`${winnerCardId}`],
            number: winnerNumber
        })
    }

    return 'There was no winner this time! HOHOHO!';
}

const part1 = runBingo(inputData.numbers, inputData.cards, false);
const part2 = runBingo(inputData.numbers, inputData.cards, true);

console.log({
    part1,
    part2
})