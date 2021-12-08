const { getDataFromTxtFile } = require("./helpers/readFile");
const input = getDataFromTxtFile("./inputs/day7.txt")
  .split(",")
  .map((i) => Number(i));

const calcFuelForPosition = (
  input,
  chosenPosition = 1,
  withIncrease = false
) => {
  return input.reduce((acc, p) => {
    let amountOfFuel = 0;

    if (withIncrease) {
      const numberOfSteps = Math.abs(p - chosenPosition);
      for (let i = 0; i <= numberOfSteps; i++) {
        amountOfFuel += i;
      }
    } else {
      amountOfFuel = Math.abs(p - chosenPosition);
    }
    return (acc += amountOfFuel);
  }, 0);
};

const recursivelyFindBestFuel = (input, left, right, withIncrease = false) => {
  const leftFuel = calcFuelForPosition(input, left, withIncrease);
  const rightFuel = calcFuelForPosition(input, right, withIncrease);
  const direction = rightFuel >= leftFuel ? "left" : "right";
  const rightShift = right - 1;
  const leftShift = left + 1;

  if (rightShift <= 0 || leftShift <= 0) {
    return leftFuel > rightFuel ? rightFuel : leftFuel;
  }

  if (direction === "left") {
    return recursivelyFindBestFuel(input, left, rightShift, withIncrease);
  } else {
    return recursivelyFindBestFuel(input, leftShift, right + 1, withIncrease);
  }
};

const highest = Math.max(...input);
// const part1 = recursivelyFindBestFuel(input, 0, highest);
// const part2 = recursivelyFindBestFuel(input, 0, highest, true);

const median = (arr) => {
  const mid = Math.floor(arr.length / 2),
    nums = [...arr].sort((a, b) => a - b);
  return arr.length % 2 !== 0 ? nums[mid] : (nums[mid - 1] + nums[mid]) / 2;
};

console.log(median(input))

// console.log({
//   part1,
//   part2,
// });
