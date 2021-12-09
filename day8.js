const { getDataFromTxtFile } = require("./helpers/readFile");
const newLineReturnRGX = /\r?\n/;
const input = getDataFromTxtFile("./inputs/day8.txt").split(newLineReturnRGX);
const matchLettersRGX = /([a-z])\w+/g;

// INPUT
const signalsInput = input.reduce((acc, l) => {
    const splitted = l.split('|');
    const signalPatterns = splitted[0].match(matchLettersRGX);
    const outputs = splitted[1].match(matchLettersRGX);
    acc = [...acc, {
        signalPatterns,
        outputs
    }];
    return acc;
}, []);

const sortAlphabetically = str => str.split('').sort().join('');

const SEGMENTS_PER_DIGIT = {
    '0': 6,
    '1': 2,
    '2': 5,
    '3': 5,
    '4': 4,
    '5': 5,
    '6': 6,
    '7': 3,
    '8': 7,
    '9': 6
}

const isUniqueNumberOfSegments = (numberOfSegments, stringOfSegments) => {
    const matched = stringOfSegments.match(new RegExp(`${numberOfSegments}`, 'g'));
    return matched && matched.length === 1;
};

const getUniquesPerPattern = (pattern, stringOfSegments) => {
    return pattern.reduce((acc, oValue) => {
        const isUnique = isUniqueNumberOfSegments(oValue.length, stringOfSegments);
        if (isUnique) {
            acc.numberOfUniques += 1;
            acc.uniques = [...acc.uniques, oValue];
        }
        return acc;
    }, { numberOfUniques: 0, uniques: []});
}

const calcUniqueSegmentsInOutputs = (outputs, stringOfSegments) => {
    const numberOfUniqueOutputs = outputs.reduce((acc, o) => {
        const uniquePerOutput = getUniquesPerPattern(o, stringOfSegments);

        acc.allUniques += uniquePerOutput.numberOfUniques;
        acc.uniques = [...acc.uniques, ...uniquePerOutput.uniques]
        return acc;
    }, { allUniques: 0, uniques: []});

    return numberOfUniqueOutputs;
}

const outputs = signalsInput.map(l => l.outputs);
const stringOfSegmentValues = Object.values(SEGMENTS_PER_DIGIT).reduce((acc, seg) => {
    return acc += `${seg}`;
}, '');

const part1 = calcUniqueSegmentsInOutputs(outputs, stringOfSegmentValues);


// Part 2
const stringContainsOtherString = (str1, str2) => {
    let isTrue = true;
    for (let i = 0; i < str2.length; i++) {
        if (str1.indexOf(str2[i]) === -1) {
            isTrue = false
        }
    }
    return isTrue;
};

const getUniqueMap = uniques => {
    return uniques.reduce((acc, u) => {
        const value = Object.keys(SEGMENTS_PER_DIGIT).find(key => SEGMENTS_PER_DIGIT[key] === u.length);
        acc[value] = u;
        return acc;
    }, {});
}

const getDigitsForPattern = (pattern, uniques) => {
    // top (1) segment (i.e. dddd) is the diff between 1 and 7
    const oneDigitLetters = uniques['1'];
    const fourDigitLetters = uniques['4'];
    const sevenDigitLetters = uniques['7'];
    const eightDigitLetters = uniques['8'];

    // if 5 digits and has e it's 5, if 5 digits and has a and no b it's 2, if 5 digits and none of the others, 3
    const threeDigitLetters = pattern.filter(d => {
        if (d.length === 5 && stringContainsOtherString(d, oneDigitLetters)) {
            return d;
        }
    })[0];

    // 3, 4, 7, 1
    const nineDigitLetters = pattern.filter(d => {
        const containsOne = stringContainsOtherString(d, oneDigitLetters);
        const containsFour = stringContainsOtherString(d, fourDigitLetters);
        const containsSeven = stringContainsOtherString(d, sevenDigitLetters);

        if (d.length === 6 && containsOne && containsFour && containsSeven) {
            return d;
        }
    })[0];

    const zeroDigitLetters = pattern.filter(d => {
        const doesNotContainFour = !stringContainsOtherString(d, fourDigitLetters);
        const containsSeven = stringContainsOtherString(d, sevenDigitLetters);

        if (d.length === 6 && doesNotContainFour && containsSeven) {
            return d;
        }
    })[0];

    // 2, 5, 6 
    const fiveDigitLetters = pattern.filter(d => {
        const nineContainsFive = stringContainsOtherString(nineDigitLetters, d);

        if (d.length === 5 && nineContainsFive && d !== threeDigitLetters) {
            return d;
        }
    })[0];

    const sixDigitLetters = pattern.filter(d => {
        if (d.length === 6 && d !== zeroDigitLetters && d !== nineDigitLetters) {
            return d;
        }
    })[0];

    const twoDigitLetters = pattern.filter(d => d.length === 5 & d !== fiveDigitLetters && d !== threeDigitLetters)[0];

    return {
        '0': zeroDigitLetters,
        '1': oneDigitLetters,
        '2': twoDigitLetters,
        '3': threeDigitLetters,
        '4': fourDigitLetters,
        '5': fiveDigitLetters,
        '6': sixDigitLetters,
        '7': sevenDigitLetters,
        '8': eightDigitLetters,
        '9': nineDigitLetters
    }
}

const signalPatterns = signalsInput.map(l => l.signalPatterns);

const calcOutputValues = outputs.reduce((acc, output, index) => {
    const pattern = signalPatterns[index];
    const uniquesForPattern = getUniquesPerPattern(pattern, stringOfSegmentValues);
    const digitsPerPattern = getDigitsForPattern(pattern, getUniqueMap(uniquesForPattern.uniques));

    const outputValue = output.reduce((acc, v) => {
        const digit = Object.keys(digitsPerPattern).find(key => sortAlphabetically(digitsPerPattern[key]) === sortAlphabetically(v));
        acc += digit;
        return acc;
    }, '');

    acc = [...acc, Number(outputValue)];
    return acc;
}, []);

console.log({
    part1: part1.allUniques,
    part2: calcOutputValues.reduce((acc, curr) => acc + curr)
})