// TAKEN FROM: https://github.com/TunHuang/advent-of-code-2021/blob/main/day-6/index.js

const { getDataFromTxtFile } = require("./helpers/readFile");
const input = getDataFromTxtFile("./inputs/day6.txt");

const inputArray = input.split(",");

const fishes = Array.from("012345678").reduce((acc, f) => {
  acc[f] = 0;
  return acc;
}, {});

const initialFishesState = inputArray.reduce((acc, fishTimer) => {
  acc[fishTimer]++;
  return acc;
}, fishes);

const grow = (schoolObj) => {
  const tempZero = schoolObj[0];
  for (let i = 0; i < 8; i++) {
    schoolObj[i] = schoolObj[i + 1];
  }
  schoolObj[8] = tempZero;
  schoolObj[6] += tempZero;
  return schoolObj;
};

const numberAfterDays = (schoolObj, days) => {
  let schoolCopy = { ...schoolObj };

  for (let i = 0; i < days; i++) {
    schoolCopy = grow(schoolCopy);
  }
  return Object.values(schoolCopy).reduce((acc, curr) => acc + curr);
};

const part1 = numberAfterDays(initialFishesState, 80);
const part2 = numberAfterDays(initialFishesState, 256);

console.log({
  part1,
  part2,
});
