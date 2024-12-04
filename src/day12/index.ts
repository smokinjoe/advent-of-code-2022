import * as fs from "fs";

/**
 * If true prints the map with the shortest route from start to finish marked.
 */
const PRINT_ROUTE = true;

let endPoint: MapPoint | undefined;
class MapPoint {
  public isStart = false;
  public height: number;
  public visited = false;
  public distanceFromDestination = 0;
  // Variables needed only for printing the map.
  public parent?: MapPoint;
  public onShortestRoute = false;

  constructor(public x: number, public y: number, char: string) {
    if (char === "S") {
      this.isStart = true;
      char = "a";
    } else if (char === "E") {
      // Starting from the end.
      this.visited = true;
      // eslint-disable-next-line @typescript-eslint/no-this-alias
      endPoint = this;
      char = "z";
    }
    this.height = char.charCodeAt(0);
  }

  /**
   * Checks if neighbor is achievable from this map point and sets its parameters.
   * @param neighbor mapPoint to which we want to travel from this
   * @param queue - neighbor is added to the queue if we can travel to him
   * @returns true if found destination, false otherwise.
   */
  public processNeighbor(neighbor: MapPoint, queue: MapPoint[]): boolean {
    if (neighbor && !neighbor.visited && this.height - neighbor.height <= 1) {
      if (neighbor.isStart) {
        // Parent is required only for the route printing.
        let parent = this.parent;
        while (parent) {
          parent.onShortestRoute = true;
          parent = parent.parent;
        }
        return true;
      }
      neighbor.visited = true;
      neighbor.distanceFromDestination = this.distanceFromDestination + 1;
      queue.push(neighbor);
      neighbor.parent = this;
    }
    return false;
  }
}

const data = fs.readFileSync("/src/day12/input.txt", "utf-8");
const heightMap = data
  .split(/\r?\n/)
  .map((row, x) =>
    row.split("").map((height, y) => new MapPoint(x, y, height))
  );

/**
 * Solution is the BFS from the hill top.
 */
let shortestPathB = -1;
function shortestPath() {
  if (endPoint === undefined) {
    throw new Error("There is no start point on the map!");
  }
  const queue = [endPoint];
  for (const point of queue) {
    if (shortestPathB < 0 && point.height === "a".charCodeAt(0))
      shortestPathB = point.distanceFromDestination;
    if (
      point.processNeighbor(heightMap[point.x]?.[point.y + 1], queue) ||
      point.processNeighbor(heightMap[point.x]?.[point.y - 1], queue) ||
      point.processNeighbor(heightMap[point.x + 1]?.[point.y], queue) ||
      point.processNeighbor(heightMap[point.x - 1]?.[point.y], queue)
    )
      return point.distanceFromDestination + 1;
  }
}

const shortestPathA = shortestPath();
// Is the starting position is also a first point with elevation "a" from the top, shortestPathB won't be set.
if (shortestPathA && shortestPathA < shortestPathB)
  shortestPathB = shortestPathA;

if (PRINT_ROUTE) {
  // Printing the map with the shortest path marked with red.
  let map = "\n";
  for (const row of heightMap) {
    for (const point of row) {
      if (point.onShortestRoute)
        map += `\x1b[31m${String.fromCharCode(point.height)}\x1b[0m`;
      else map += String.fromCharCode(point.height);
    }
    map += "\n";
  }
  console.log(map);
}

console.log(`Part 1: ${shortestPathA}`);
console.log(`Part 2: ${shortestPathB}`);
