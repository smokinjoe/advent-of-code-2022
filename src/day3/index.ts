const fs = require("fs");

document.getElementById("app").innerHTML = `<h1>Day 3 of Advent of Code</h1>`;

/**
 * Day 3
 * https://adventofcode.com/2022/day/3
 */

console.log("Day 3");

/**
 * Begin part 1
 */

const exampleRucksacks: Array<string> = [
  "vJrwpWtwJgWrhcsFMMfFFhFp",
  "jqHRNqRjqzjGDLGLrsFMfFZSrLrFZsSL",
  "PmmdzqPrVvPwwTWBwg",
  "wMqvLMZHhHMvwLHjbvcjnnSBnvTQFn",
  "ttgJtRGJQctTZtZT",
  "CrZsJsPPZsGzwwsLwLmpwMDw"
];

const rucksacks: Array<string> = fs
  .readFileSync("/data/day3.txt", { encoding: "utf-8" })
  .split("\n")
  .filter((x: any) => Boolean(x));

console.log(rucksacks);

const priorityScoreHash: Record<string, number> = {
  a: 1,
  b: 2,
  c: 3,
  d: 4,
  e: 5,
  f: 6,
  g: 7,
  h: 8,
  i: 9,
  j: 10,
  k: 11,
  l: 12,
  m: 13,
  n: 14,
  o: 15,
  p: 16,
  q: 17,
  r: 18,
  s: 19,
  t: 20,
  u: 21,
  v: 22,
  w: 23,
  x: 24,
  y: 25,
  z: 26,
  A: 27,
  B: 28,
  C: 29,
  D: 30,
  E: 31,
  F: 32,
  G: 33,
  H: 34,
  I: 35,
  J: 36,
  K: 37,
  L: 38,
  M: 39,
  N: 40,
  O: 41,
  P: 42,
  Q: 43,
  R: 44,
  S: 45,
  T: 46,
  U: 47,
  V: 48,
  W: 49,
  X: 50,
  Y: 51,
  Z: 52
};

const uniq = (a) => {
  return Array.from(new Set(a));
};

const checkRucksack = (rucksack: string) => {
  const pocketOne = rucksack.slice(0, rucksack.length / 2);
  const pocketTwo = rucksack.slice(rucksack.length / 2, rucksack.length);

  // console.log("rucksack: ", rucksack);
  // console.log("pocketOne: ", pocketOne);
  // console.log("pocketTwo: ", pocketTwo);

  const pocketOneHistory: Record<string, boolean> = {};
  const pocketTwoHistory: Record<string, boolean> = {};

  const matches: string[] = [];

  // console.log("==== Begin loop ====");

  for (let i = 0; i < rucksack.length / 2; i++) {
    const itemOne = pocketOne[i];
    const itemTwo = pocketTwo[i];

    // console.log("pocketOneHistory:", { ...pocketOneHistory });
    // console.log("pocketTwoHistory:", { ...pocketTwoHistory });

    if (itemOne === itemTwo) {
      matches.push(itemOne);
    } else if (pocketOneHistory[itemTwo]) {
      matches.push(itemTwo);
    } else if (pocketTwoHistory[itemOne]) {
      matches.push(itemOne);
    }

    pocketOneHistory[itemOne] = true;
    pocketTwoHistory[itemTwo] = true;
  }

  // console.log("JOE: matches: ", matches);
  return uniq(matches);
};

// console.log(checkRucksack(exampleRucksacks[0]));
// console.log(checkRucksack("aaadbdpb"));

const getMatches = () => {
  return exampleRucksacks.map((inventory: string) => {
    return checkRucksack(inventory);
  });
};

const getScores = () => {
  const scores = rucksacks.map((inventory: string) => {
    const matches = checkRucksack(inventory);
    const total = matches.reduce((prev: number, curr) => {
      return Number(prev) + Number(priorityScoreHash[curr as string]);
    }, 0);
    return total;
  });

  return scores.reduce((acc: number, curr) => {
    return Number(acc) + Number(curr);
  }, 0);
};

/**
 * Begin part 2
 */

const checkTwoRucksacks = (
  inventoryOne: string,
  inventoryTwo: string
): string[] => {
  // const inventoryOne = rucksack.slice(0, rucksack.length / 2);
  // const inventoryTwo = rucksack.slice(rucksack.length / 2, rucksack.length);

  // console.log("rucksack: ", rucksack);
  // console.log("inventoryOne: ", inventoryOne);
  // console.log("inventoryTwo: ", inventoryTwo);

  const inventoryOneHistory: Record<string, boolean> = {};
  const inventoryTwoHistory: Record<string, boolean> = {};

  const matches: string[] = [];

  // console.log("==== Begin loop ====");

  for (
    let i = 0;
    i < Math.max(...[inventoryOne.length, inventoryTwo.length]);
    i++
  ) {
    const itemOne = inventoryOne[i];
    const itemTwo = inventoryTwo[i];

    // console.log("inventoryOneHistory:", { ...inventoryOneHistory });
    // console.log("inventoryTwoHistory:", { ...inventoryTwoHistory });

    if (itemOne === itemTwo) {
      matches.push(itemOne);
    } else if (inventoryOneHistory[itemTwo]) {
      matches.push(itemTwo);
    } else if (inventoryTwoHistory[itemOne]) {
      matches.push(itemOne);
    }

    inventoryOneHistory[itemOne] = true;
    inventoryTwoHistory[itemTwo] = true;
  }

  // console.log("JOE: matches: ", matches);
  return uniq(matches);
};

const checkThreeRucksacks = (
  inventoryOne: string,
  inventoryTwo: string,
  inventoryThree: string
) => {
  console.log("inventoryOne: ", inventoryOne);
  console.log("inventoryTwo: ", inventoryTwo);
  console.log("inventoryThree: ", inventoryThree);

  const resultOne: string[] = checkTwoRucksacks(inventoryOne, inventoryTwo);
  const resultTwo: string[] = checkTwoRucksacks(inventoryTwo, inventoryThree);

  console.log("resultOne: ", resultOne);
  console.log("resultTwo: ", resultTwo);

  const masterResult = checkTwoRucksacks(
    resultOne.join(""),
    resultTwo.join("")
  );

  // console.log(masterResult);

  // const oneHash: Record<string, boolean> = {};
  // const twoHash: Record<string, boolean> = {};
  // const threeHash: Record<string, boolean> = {};

  // for (
  //   let i = 0;
  //   i <
  //   Math.max(
  //     ...[inventoryOne.length, inventoryTwo.length, inventoryThree.length]
  //   );
  //   i++
  // ) {
  //   const isOneDef = inventoryOne[i] !== undefined;
  //   const isTwoDef = inventoryTwo[i] !== undefined;
  //   const isThreeDef = inventoryThree[i] !== undefined;

  //   const itemOne = inventoryOne[i];
  //   const itemTwo = inventoryTwo[i];
  //   const itemThree = inventoryThree[i];
  // }

  return masterResult;
};

// console.log(checkThreeRucksacks());
// console.log(rucksacks.length);
const theArray = [...rucksacks];

const checkThreeRucksacksV2 = (one: string, two: string, three: string) => {
  let letter: string = "";
  for (let i = 0; i < one.length; i++) {
    if (two.includes(one[i]) && three.includes(one[i])) {
      letter = one[i];
    }
  }

  return Number(priorityScoreHash[letter]);
};

const partTwo = () => {
  let results = 0;
  for (let i = 0; i < theArray.length; i += 3) {
    // if (i === 18) {
    const score = checkThreeRucksacksV2(
      theArray[i],
      theArray[i + 1],
      theArray[i + 2]
    );

    results += score;
    // }
  }

  console.log(results);
};

partTwo();
