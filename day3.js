const { count } = require('console');
const { getDataFromTxtFile } = require('./helpers/readFile')
const input = getDataFromTxtFile('./inputs/day3.txt');
const inputArray = input.split(/\r?\n/);

const countZerosOnes = inputArray => {
    const numberOfColumns = inputArray[0].length;
    let result = {};

    for (let i = 0; i < numberOfColumns; i++) {
        inputArray.forEach(row => {
            if (!result[i]) {
                result[i] = [];
                if (row[i] === '0') {
                    result[i].zero = 1;
                    result[i].one = 0;
                } else {
                    result[i].zero = 0;
                    result[i].one = 1;
                }
            } else {
                if (row[i] === '0') {
                    result[i].zero += 1;
                } else {
                    result[i].one += 1;
                }
            }
        });
    }

    return result;
}

const zerosOnes = countZerosOnes(inputArray);

const common = ({ zero, one }, mostCommon = true) => {
    if (zero === one) {
        return 'equal';
    }
    const condition = mostCommon ? zero > one : zero < one;
    return condition ? '0' : '1';
}

const gammaEpsilon = (input, mostCommon) => {
    return Object.keys(input).reduce((acc, curr) => {
        const commonValue = common(input[curr], mostCommon);
        return `${acc}${commonValue}`;
    }, '');
}
const gamma = gammaEpsilon(zerosOnes);
const epsilon = gammaEpsilon(zerosOnes, false);

const part1 = parseInt(gamma, 2) * parseInt(epsilon, 2);

const generatorRating = (inputArray, mostCommon, numberOfIterations, iteration) => {
    while (iteration < numberOfIterations) {
        const zeroesOnes = countZerosOnes(inputArray);
        const genCommon = mostCommon ? '1' : '0';
        const mostCommonResult = common(zeroesOnes[iteration], mostCommon);
        const evaluator = mostCommonResult === 'equal' ? genCommon : mostCommonResult;

        if (inputArray.length === 1) {
            return inputArray;
        }

        const reduced = inputArray.reduce((acc, curr) => {
            if (curr[iteration] === evaluator) {
                acc = [...acc, curr]
            }
            return acc;
        }, []); 
        return generatorRating(reduced, mostCommon, numberOfIterations, iteration + 1);
    }

    return inputArray;
}

const oxygen = generatorRating([...inputArray], true, inputArray[0].length, 0);
const carbondioxide = generatorRating([...inputArray], false, inputArray[0].length - 1, 0);

const part2 = parseInt(oxygen[0], 2) * parseInt(carbondioxide[0], 2);
console.log({
    part1,
    part2
})