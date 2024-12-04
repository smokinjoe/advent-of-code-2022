import * as fs from "fs";

const data = fs.readFileSync("/src/day15/input.txt", "utf-8");
const lines = data.split(/\r?\n/);
const maxCoordinate = 4000000;

const noBeaconRanges = new Array<{ fromX: number; toX: number }[]>(
  maxCoordinate
);
for (let y = 0; y < maxCoordinate; ++y) {
  noBeaconRanges[y] = [];
}

for (const line of lines) {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_, sx, sy, bx, by] = line.split(/[^0-9\-]+/).map((v) => +v);
  const distanceToBeacon = Math.abs(by - sy) + Math.abs(bx - sx);
  const yMin = sy - distanceToBeacon;
  for (let y = yMin > 0 ? yMin : 0; y < sy; ++y) {
    // I simply pass ranges to the array but something like min heap would be better here.
    noBeaconRanges[y].push({
      fromX: sx - (y - yMin),
      toX: sx + (y - yMin),
    });
  }
  const yMax = sy + distanceToBeacon;
  for (let y = sy; y < (yMax < maxCoordinate ? yMax : maxCoordinate); ++y) {
    noBeaconRanges[y].push({
      fromX: sx - (yMax - y),
      toX: sx + (yMax - y),
    });
  }
}

// Part 1
let positionsWithoutBeacon = 0;
const lastRange = noBeaconRanges[2000000]
  .sort((a, b) => a.fromX - b.fromX)
  .reduce((lastRange, range) => {
    if (lastRange.toX < range.fromX) {
      positionsWithoutBeacon += lastRange.toX - lastRange.fromX;
      return range;
    } else {
      if (range.toX > lastRange.toX) lastRange.toX = range.toX;
      return lastRange;
    }
  });
positionsWithoutBeacon += lastRange.toX - lastRange.fromX;

// Part 2
function findBeaconTuningFrequency() {
  for (let y = 0; y < noBeaconRanges.length; ++y) {
    const sortedRanges = noBeaconRanges[y].sort((a, b) => a.fromX - b.fromX);
    let maxX = 0;
    for (const range of sortedRanges) {
      if (range.fromX > maxX) {
        return 4000000 * (maxX + 1) + y;
      } else if (maxX < range.toX) {
        if (range.toX > maxCoordinate) break;
        maxX = range.toX;
      }
    }
  }
}

console.log(`Part 1: ${positionsWithoutBeacon}`);
console.log(`Part 2: ${findBeaconTuningFrequency()}`);
