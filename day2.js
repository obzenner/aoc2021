const { getDataFromTxtFile } = require('./helpers/readFile')
const input = getDataFromTxtFile('./inputs/day2.txt');

const inputArray = input.split(/\r?\n/).reduce((acc, curr) => {
    const currentValues = curr.split(' ');
    const valuesObject = {};
    valuesObject[currentValues[0]] = Number(currentValues[1]);
    
    return [...acc, valuesObject];
}, []);

// PART1
const calcFinalPosition = (inputArray) => inputArray.reduce((acc, curr) => {
    if (curr.forward) {
        acc.horizontalPosition += curr.forward;
    }

    if (curr.down) {
        acc.depth += curr.down;
    }

    if (curr.up) {
        acc.depth -= curr.up;
    }

    return acc;
}, {horizontalPosition: 0, depth: 0})

const finalPosition = calcFinalPosition(inputArray);

// PART2
const calcFinalPositionWithAim = (inputArray) => inputArray.reduce((acc, curr) => {
    if (curr.forward) {
        acc.horizontalPosition += curr.forward;
        acc.depth += curr.forward * acc.aim
    }

    if (curr.down) {
        acc.aim += curr.down;
    }

    if (curr.up) {
        acc.aim -= curr.up;
    }

    return acc;
}, {horizontalPosition: 0, depth: 0, aim: 0})

const finalPositionWithAim = calcFinalPositionWithAim(inputArray);

console.log({
    part1: finalPosition.horizontalPosition * finalPosition.depth,
    part2: finalPositionWithAim.horizontalPosition * finalPositionWithAim.depth
})