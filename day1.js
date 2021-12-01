
const { getDataFromTxtFile } = require('./helpers/readFile')
const input = getDataFromTxtFile('./inputs/day1.txt');
const inputArray = input.split(/\r?\n/).map(v => Number(v));

const isHigher = (val1, val2) => val2 > val1;

// PART 1
const numberOfIncreased = (inputArray) => inputArray.reduce((acc, curr, index, array) => {
    if (isHigher(array[index - 1], curr)) {
        acc++
    }

    return acc;
}, 0)

// PART 2
const measurements = (inputArray) => inputArray.reduce((acc, curr, index, array) => {
    let measurementSum = 0;
    let i = 0;

    while (i < 3) {
        const nextOfThree = array[index + i];
        if (nextOfThree) {
            measurementSum += nextOfThree;
        } else {
            return acc;
        }
        i++;
    }

    acc = [...acc, measurementSum];
    return acc;
}, []);

const part1 = numberOfIncreased(inputArray);

const depthMeasurements = measurements(inputArray);
const part2 = numberOfIncreased(depthMeasurements);

console.log({
    part1,
    part2
});