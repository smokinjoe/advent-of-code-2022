import * as fs from "fs";

// If true the program prints the map after the sand is settled.
const PRINT_MAP = false;

/**
 * I use coordinates like indexes in matrixes.
 * x is the first map coordinate corresponding to row number.
 * y is the second map coordinate corresponding to column number.
 */

const data = fs.readFileSync("/src/day14/input.txt", "utf-8");
const lines = data.split(/\r?\n/);

/**
 * Map rows and columns must be big enough for the second part of the problem.
 * For the first part it's better to set it low for better pictures.
 */
const mapRows = 185;
const mapColumns = 700;
// How far shift x = 0 coordinate to the right. For better printing images.
const shift = 50;

const map = new Array<string[]>(mapRows);
for (let x = 0; x < map.length; ++x) {
  map[x] = new Array(mapColumns).fill(".");
}

// Mark sand source.
map[0][500 - shift] = "+";

/**
 * Adds stone line marked with "#" on the map.
 * @param from - beginning of the line
 * @param to - end of the line
 * @param where - second, constant coordinate of the line (x if horizontal = true, y otherwise)
 * @param horizontal - tells if line is horizontal
 */
function addStoneLine(
  from: number,
  to: number,
  where: number,
  horizontal: boolean
): void {
  if (from > to) {
    const temp = to;
    to = from;
    from = temp;
  }
  if (horizontal) {
    for (let i = from; i <= to; ++i) {
      map[where][i - shift] = "#";
    }
  } else {
    for (let i = from; i <= to; ++i) {
      map[i][where - shift] = "#";
    }
  }
}

/**
 * Simulates drop of a single sand unit and marks it on the map as "o"
 * in the place where it has settled (or dropped into the void).
 * @param x - x coordinate of sand source
 * @param y - y coordinate of sand source
 * @returns true if sand is settled, false if it dropped to the void.
 */
function dropSand(x, y): boolean {
  while (x < lowestPoint + 1) {
    if (map[x + 1][y] === ".") x++;
    else if (map[x + 1][y - 1] === ".") {
      x++;
      y--;
    } else if (map[x + 1][y + 1] === ".") {
      x++;
      y++;
    } else {
      map[x][y] = "o";
      return false;
    }
  }
  map[x][y] = "o";
  return true;
}

// Converting problem input into a map.
let lowestPoint = 0;
for (const line of lines) {
  const corners = line.split(" -> ");
  const x0 = +corners[0].split(",")[1];
  if (x0 > lowestPoint) lowestPoint = x0;
  for (let i = 1; i < corners.length; ++i) {
    const [y1, x1] = corners[i - 1].split(",");
    const [y2, x2] = corners[i].split(",");
    if (+x2 > lowestPoint) {
      lowestPoint = +x2;
    }
    addStoneLine(+x1, +x2, +y1, false);
    addStoneLine(+y1, +y2, +x1, true);
  }
}

// Sand simulation.

// Part 1
let sandUnitsA = 0;
while (!dropSand(0, 500 - shift)) sandUnitsA++;

// Part 2
let sandUnitsB = sandUnitsA;
while (map[0][500 - shift] !== "o") {
  dropSand(0, 500 - shift);
  sandUnitsB++;
}

if (PRINT_MAP) map.map((row) => console.log(row.join("")));

console.log(`Part 1: ${sandUnitsA}`);
console.log(`Part 2: ${sandUnitsB}`);
