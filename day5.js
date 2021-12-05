const { getDataFromTxtFile } = require('./helpers/readFile')
const input = getDataFromTxtFile('./inputs/day5.txt');
const linefeedRegex = /\n/g;
const arrowSpacesRegex = /\s[->]+\s/g;

const lines = input.split(linefeedRegex).map(l => l.split(arrowSpacesRegex));

const getCoordinates = line => {
    return {
        x1: Number(line[0].split(',')[0]),
        x2: Number(line[1].split(',')[0]),
        y1: Number(line[0].split(',')[1]),
        y2: Number(line[1].split(',')[1])
    }
}

const isVerticalHorizontal = line => {
    const { x1, x2, y1, y2 } = getCoordinates(line);

    const isVertical = x1 === x2;
    const isHorizontal = y1 === y2;

    return {
        isHorizontal,
        isVertical,
        isValid: isHorizontal || isVertical
    };
}

const addCoordinate = (map, coord) => {
    const exists = map.get(coord);

    if (exists) {
        map.set(coord, exists + 1);
    } else {
        map.set(coord, 1);
    }
}

const calcDangerPoints = coords => {
    return coords.reduce((acc, point) => {
        if (point[1] > 1) {
            acc += 1;
        }
        return acc;
    }, 0);
}

const drawLines = (lines) => {
    let coords = new Map();

    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        const { x1, x2, y1, y2 } = getCoordinates(line);
        const distance = x1 - x2 !== 0 ? Math.abs(x1 - x2) : Math.abs(y1 - y2);
        
        for (let i = 0; i < distance + 1; i++) {
            let nextX;
            let nextY;

            if (x1 === x2) {
                nextX = x1;
            } else {
                nextX = x1 > x2 ? x1 - i : x1 + i;
            }

            if (y1 === y2) {
                nextY = y1;
            } else {
                nextY = y1 > y2 ? y1 - i : y1 + i;
            }

            const coord = `${nextX},${nextY}`;
            addCoordinate(coords, coord);
        }
    }

    return calcDangerPoints(Array.from(coords));
}

const linesWithoutDiagonals = lines.filter(l => isVerticalHorizontal(l).isValid);

const part1 = drawLines(linesWithoutDiagonals);
const part2 = drawLines(lines);

console.log({
    part1,
    part2
});