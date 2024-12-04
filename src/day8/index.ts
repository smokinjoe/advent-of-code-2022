import { parseFile, renderToDocument } from "../utils/";

/**
 * Day 8
 */

type DataStore = {
  grid: Array<Array<number>>;
  // exampleGrid: Array<Array<number>>;
  partOne: {
    totalVisible: number;
    totalInvisible: number;
  };
};

type DayEightProps = {
  filename: string;
  exampleFilename: string;
  useExample: boolean;
};

class DayEight {
  private dataStore: DataStore;
  private isVerbose: boolean = false;

  constructor(deps: DayEightProps) {
    const grid = this.parseFile(deps.filename);
    const exampleGrid = this.parseFile(deps.exampleFilename);

    const realGrid = deps.useExample ? exampleGrid : grid;

    this.dataStore = {
      grid: realGrid,
      // exampleGrid,
      partOne: {
        totalVisible: 0,
        totalInvisible: 0
      }
    };
  }

  /**
   * Private
   */

  parseFile = (filename: string) => {
    const fileString = parseFile(filename)
      .split("\n")
      .filter((x) => Boolean(x));

    return fileString;
  };

  log = (messageOrObject: string | Record<any, any>, override = false) => {
    if (!this.isVerbose && !override) {
      return;
    }

    const isMessage = typeof messageOrObject === "string";

    if (isMessage) {
      console.log(messageOrObject);
      return;
    }

    console.log("Logging object: ", messageOrObject);
  };

  isInvisibleFromAbove = (x, y) => {
    // this.log(`Checking node: ${node} above`);

    const { grid } = this.dataStore;
    const node = grid[x][y];

    for (let i = y - 1; i >= 0; i--) {
      const nodeToCheck = grid[x][i];
      this.log(`Checking above node: ${nodeToCheck} at [x:${x}, y:${i}]`);
      const isViable = +node <= +nodeToCheck;

      if (isViable) {
        return isViable;
      }
    }

    return false;
  };

  isInvisibleFromBelow = (x, y) => {
    const { grid } = this.dataStore;
    const node = grid[x][y];

    for (let i = y + 1; i < grid.length; i++) {
      const nodeToCheck = grid[x][i];
      this.log(`Checking below node: ${nodeToCheck} at [x:${x}, y:${i}]`);
      const isViable = +node <= +nodeToCheck;

      if (isViable) {
        return isViable;
      }
    }

    return false;

    // const nodeToCheck = grid[x][y + 1];
    // this.log(`Checking node: ${node} <= below node to check ${nodeToCheck}`);
    // return +node <= +nodeToCheck;
  };

  isInvisibleFromRight = (x, y) => {
    const { grid } = this.dataStore;
    const node = grid[x][y];
    // const nodeToCheck = grid[x + 1][y];
    // this.log(`Checking node: ${node} <= right node to check ${nodeToCheck}`);
    // return +node <= +nodeToCheck;

    for (let i = x + 1; i < grid.length; i++) {
      const nodeToCheck = grid[i][y];
      this.log(`Checking right node: ${nodeToCheck} at [x:${i}, y:${y}]`);
      const isViable = +node <= +nodeToCheck;

      if (isViable) {
        return isViable;
      }
    }

    return false;
  };

  isInvisibleFromLeft = (x, y) => {
    const { grid } = this.dataStore;
    const node = grid[x][y];
    // const nodeToCheck = grid[x - 1][y];
    // this.log(`Checking node: ${node} <= left node to check ${nodeToCheck}`);
    // return +node <= +nodeToCheck;

    for (let i = x - 1; i >= 0; i--) {
      const nodeToCheck = grid[i][y];
      this.log(`Checking left node: ${nodeToCheck} at [x:${i}, y:${y}]`);
      const isViable = +node <= +nodeToCheck;

      if (isViable) {
        return isViable;
      }
    }

    return false;
  };

  checkNode = (x, y) => {
    this.log(`==============================`);
    this.log(`Checking Node: ${this.dataStore.grid[x][y]} at [x:${x}, y:${y}]`);

    return (
      this.isInvisibleFromAbove(x, y) &&
      this.isInvisibleFromBelow(x, y) &&
      this.isInvisibleFromRight(x, y) &&
      this.isInvisibleFromLeft(x, y)
    );
  };

  // checkNode = (x, y) => {
  //   this.log(`==============================`);
  //   this.log(`Checking Node: ${this.dataStore.grid[x][y]} at [x:${x}, y:${y}]`);

  //   const { grid } = this.dataStore;

  //   const innerEdge = 0;
  //   const outerEdge = grid.length - 1;

  //   const node = grid[x][y];
  //   const above = grid[x][innerEdge];
  //   const below = grid[x][outerEdge];
  //   const left = grid[outerEdge][y];
  //   const right = grid[innerEdge][y];

  //   this.log(`Node edges are:`);
  //   this.log(`  Above: ${above}`);
  //   this.log(`  Below: ${below}`);
  //   this.log(`  Left: ${left}`);
  //   this.log(`  Right: ${right}`);

  //   const isViable =
  //     node <= above && node <= below && node <= left && node <= right;

  //   const message = isViable
  //     ? "Node is viable!"
  //     : "I'm sorry, the node is too visible.";

  //   this.log(message);

  //   return isViable;
  // };

  /**
   * Public
   */

  viewData = () => this.log(this.dataStore, true);
  verbose = () => (this.isVerbose = !this.isVerbose);

  parseGrid = () => {
    const { grid } = this.dataStore;
    const viableSpots = [];

    for (let i = 1; i < grid.length - 1; i++) {
      for (let j = 1; j < grid[i].length - 1; j++) {
        const isInvisible = this.checkNode(j, i);
        if (isInvisible) {
          this.log(`We found an invisible at i=${i}, j=${j}`);
          viableSpots.push([i, j]);
        }
      }
    }

    this.dataStore.partOne.totalInvisible = viableSpots.length;
    this.dataStore.partOne.totalVisible =
      grid.length * grid.length - viableSpots.length;
  };

  partOne = () => {
    this.log(
      `Number of visible nodes: ${this.dataStore.partOne.totalVisible}`,
      true
    );
  };
}

renderToDocument(8, () => {
  console.log("JOE: Let's begin part one!");
  const dayEight = new DayEight({
    filename: "day8.txt",
    exampleFilename: "day8example.txt",
    useExample: true
  });

  // dayEight.verbose();
  dayEight.parseGrid();
  dayEight.viewData();
  // dayEight.partOne();
});
