import * as fs from "fs";

type NestedArray<T> = Array<T | NestedArray<T>>;

const data = fs.readFileSync("/src/day13/input.txt", "utf-8");
const pairs = data.split(/\r?\n\r?\n/);

// Part 1 variable
let inRightOrder = 0;

// Part 2 variables
const controlPacket1 = [[2]];
const controlPacket2 = [[6]];
let ctrlPacketPosition1 = 1;
let ctrlPacketPosition2 = 2; // starting with 2 because packet2 > packet1

for (let i = 0; i < pairs.length; ++i) {
  const [left, right] = pairs[i]
    .split(/\r?\n/)
    .map((packet) => JSON.parse(packet)) as [
    NestedArray<number>,
    NestedArray<number>
  ];

  // Part 1
  if (compare(left, right) < 0) {
    inRightOrder += i + 1;
  }

  // Part 2
  if (compare(left, controlPacket1) < 0) {
    // Increasing both because packet1 < packet2
    ctrlPacketPosition1++;
    ctrlPacketPosition2++;
  } else {
    if (compare(left, controlPacket2) < 0) {
      ctrlPacketPosition2++;
    }
  }
  if (compare(right, controlPacket1) < 0) {
    ctrlPacketPosition1++;
    ctrlPacketPosition2++;
  } else {
    if (compare(right, controlPacket2) < 0) {
      ctrlPacketPosition2++;
    }
  }
}

/**
 * Returns -1 if a < b, 0 if a = b and 1 if a > b.
 */
function compare(
  a: number | NestedArray<number>,
  b: number | NestedArray<number>
): number {
  if (a !== undefined && b === undefined) return 1;
  if (typeof a === "number" && typeof b === "number") {
    if (a < b) return -1;
    else if (a === b) return 0;
    else return 1;
  } else {
    if (typeof a === "number") a = [a];
    if (typeof b === "number") b = [b];
    for (let i = 0; i < a.length; ++i) {
      const result = compare(a[i], b[i]);
      if (result) return result;
    }
    if (a.length === b.length) return 0;
    return -1;
  }
}

console.log(`Part 1: ${inRightOrder}`);
console.log(`Part 2: ${ctrlPacketPosition1 * ctrlPacketPosition2}`);
