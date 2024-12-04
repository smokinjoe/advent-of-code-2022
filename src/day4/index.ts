const fs = require("fs");

document.getElementById("app").innerHTML = `<h1>Day 4 of Advent of Code</h1>`;

/**
 * Day 4
 * https://adventofcode.com/2022/day/4
 */

console.log("Day 4");

/**
 * Begin part 1
 */

const assignments: Array<string[]> = fs
  .readFileSync("/data/day4.txt", { encoding: "utf-8" })
  .split("\n")
  .filter((x: any) => Boolean(x))
  .map((x: any) => {
    return x.split(",");
  });

const exampleAssignments: Array<string[]> = [
  ["2-4", "6-8"],
  ["2-3", "4-5"],
  ["5-7", "7-9"],
  ["2-8", "3-7"],
  ["6-6", "4-6"],
  ["2-6", "4-8"]
];

const fragmentArray: Array<string[]> = [
  // Added from actual array
  ["5-96:", "6-99"],
  ["63-89", "76-90"],
  ["7-70", "11-69"],
  ["32-76", "20-77"]
];

// console.log(assignments);

type DayFourProps = {
  assignments: Array<Array<string>>;
};

class DayFour {
  private assignments: Array<string[]>;

  constructor(private deps: DayFourProps) {
    this.assignments = deps.assignments;
  }

  numberOfAssignments = () => {
    return this.assignments.length;
  };

  comparePair = (one: string, two: string) => {
    // console.log("TESTING: ", one, two);
    const [oneMin, oneMax] = one.split("-");
    const [twoMin, twoMax] = two.split("-");

    let oneContainsOther = false;

    if (+twoMin >= +oneMin && +oneMax >= +twoMax) {
      oneContainsOther = true;
    } else if (+oneMin >= +twoMin && +twoMax >= +oneMax) {
      oneContainsOther = true;
    }

    // console.log("Matches? ", oneContainsOther);
    return oneContainsOther;
  };

  partOne = () => {
    console.log("Part One");
    const result = this.assignments.map((jobsPair) => {
      return this.comparePair(jobsPair[0], jobsPair[1]);
    });

    let count = 0;
    result.forEach((x) => {
      if (x) {
        count++;
      }
    });

    console.log(count);
  };

  comparePairPartTwo = (one: string, two: string) => {
    // console.log("TESTING: ", one, two);
    const [oneMin, oneMax] = one.split("-");
    const [twoMin, twoMax] = two.split("-");

    let overLaps = false;

    if (+oneMax >= +twoMin && +oneMin <= +twoMax) {
      overLaps = true;
    } else if (+twoMax >= +oneMin && +twoMin <= +oneMax) {
      overLaps = true;
    }

    // console.log("Matches? ", overLaps);
    return overLaps;
  };

  partTwo = () => {
    console.log("Part Two");
    const result = this.assignments.map((jobsPair) => {
      return this.comparePairPartTwo(jobsPair[0], jobsPair[1]);
    });

    let count = 0;
    result.forEach((x) => {
      if (x) {
        count++;
      }
    });

    console.log(count);
  };
}

const dayFour = new DayFour({ assignments });

dayFour.partTwo();

// console.log(dayFour.numberOfAssignments());
