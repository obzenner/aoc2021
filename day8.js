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
};

const isUniqueNumberOfSegments = (numberOfSegments, stringOfSegments) => {
    const matched = stringOfSegments.match(new RegExp(`${numberOfSegments}`, 'g'));
    return matched && matched.length === 1;
};

const calcUniqueSegmentsInOutputs = (outputs, stringOfSegments) => {
    const numberOfUniqueOutputs = outputs.reduce((acc, o) => {
        const uniquePerOutput = o.reduce((acc, oValue) => {
            const isUnique = isUniqueNumberOfSegments(oValue.length, stringOfSegments);
            if (isUnique) {
                acc += 1;
            }
            return acc;
        }, 0);

        acc += uniquePerOutput;
        return acc;
    }, 0);

    return numberOfUniqueOutputs;
}

const outputs = signalsInput.map(l => l.outputs);
const stringOfSegmentValues = Object.values(SEGMENTS_PER_DIGIT).toString();

const part1 = calcUniqueSegmentsInOutputs(outputs, stringOfSegmentValues);

console.log({
    part1
})