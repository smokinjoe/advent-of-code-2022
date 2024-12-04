const fs = require("fs");

document.getElementById("app").innerHTML = `
<h1>Day 1 of Advent of Code</h1>
`;

/**
 * Day 1
 * https://adventofcode.com/2022/day/1
 */

console.log("Day 1");

/**
 * Begin part 1
 */
const elvesWithIndividualCalorieCounts = fs
  .readFileSync("/data/day1.txt", { encoding: "utf-8" })
  .split("\n\n")
  .filter((x: any) => Boolean(x))
  .map((x: any) => {
    return x.split("\n");
  });

const elvesWithTotalCalorieCounts = elvesWithIndividualCalorieCounts.map(
  (calorieCounts: string[]) => {
    let totalCalories = 0;

    calorieCounts.forEach(
      (calorieString: string) => (totalCalories += Number(calorieString))
    );

    return totalCalories;
  }
);

const getOrderedCalorieList = () => {
  const result = [...elvesWithTotalCalorieCounts];
  result.sort((a, b) => b - a);
  return result;
};

const getTopCalorieCount = () => {
  const orderedCalorieCounts = getOrderedCalorieList();
  return Math.max(...orderedCalorieCounts);
};

// Day 1 part 1 result:
console.log("Part 1 result: ", getTopCalorieCount());

/**
 * Begin part 2
 */
const getTopThree = () => {
  const orderedCalorieCounts = getOrderedCalorieList();

  const result = orderedCalorieCounts.slice(0, 3);
  return result;
};

const getSum = (param: number[]) => {
  const sum = param.reduce((acc: number, curr: number) => {
    return acc + curr;
  }, 0);

  return sum;
};

// Day 1 part 2 result:
console.log("Part 2 result: ", getSum(getTopThree()));
