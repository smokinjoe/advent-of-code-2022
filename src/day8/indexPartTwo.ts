import { parseFile, renderToDocument } from "../utils/";

/**
 * Day 8
 */

type DataStore = {
  grid: Array<Array<number>>;
  partTwo: {
    scenicScores: Array<number>;
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
      partTwo: {
        scenicScores: []
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
    const { grid } = this.dataStore;
    const node = grid[x][y];
    let score = 0;

    for (let i = y - 1; i >= 0; i--) {
      const nodeToCheck = grid[x][i];
      this.log(`ABOVE: Checking node: ${nodeToCheck}`);
      const isBlocked = +node <= +nodeToCheck;

      score++;

      if (isBlocked) {
        return score;
      }
    }

    return score;
  };

  isInvisibleFromBelow = (x, y) => {
    const { grid } = this.dataStore;
    const node = grid[x][y];
    let score = 0;

    for (let i = y + 1; i < grid.length; i++) {
      const nodeToCheck = grid[x][i];
      this.log(`BELOW: Checking node: ${nodeToCheck}`);
      const isBlocked = +node <= +nodeToCheck;

      score++;

      if (isBlocked) {
        return score;
      }
    }

    return score;
  };

  isInvisibleFromRight = (x, y) => {
    const { grid } = this.dataStore;
    const node = grid[x][y];
    let score = 0;

    for (let i = x + 1; i < grid.length; i++) {
      const nodeToCheck = grid[i][y];
      this.log(`RIGHT: Checking node: ${nodeToCheck}`);
      const isBlocked = +node <= +nodeToCheck;

      score++;

      if (isBlocked) {
        return score;
      }
    }

    return score;
  };

  isInvisibleFromLeft = (x, y) => {
    const { grid } = this.dataStore;
    const node = grid[x][y];
    let score = 0;

    for (let i = x - 1; i >= 0; i--) {
      const nodeToCheck = grid[i][y];
      this.log(`LEFT: Checking node: ${nodeToCheck}`);
      const isBlocked = +node <= +nodeToCheck;

      score++;

      if (isBlocked) {
        return score;
      }
    }

    return score;
  };

  checkNode = (x, y) => {
    this.log(`==============================`);
    this.log(`Checking Node: ${this.dataStore.grid[x][y]} at [x:${x}, y:${y}]`);

    const scoreAbove = this.isInvisibleFromAbove(x, y);
    this.log(`Score above: ${scoreAbove}`);
    const scoreBelow = this.isInvisibleFromBelow(x, y);
    this.log(`Score below: ${scoreBelow}`);
    const scoreLeft = this.isInvisibleFromLeft(x, y);
    this.log(`Score left: ${scoreLeft}`);
    const scoreRight = this.isInvisibleFromRight(x, y);
    this.log(`Score right: ${scoreRight}`);

    return scoreAbove * scoreBelow * scoreLeft * scoreRight;
  };

  /**
   * Public
   */

  viewData = () => this.log(this.dataStore, true);
  verbose = () => (this.isVerbose = !this.isVerbose);

  parseGrid = () => {
    const { grid } = this.dataStore;
    const scenicScores = [];

    for (let i = 1; i < grid.length - 1; i++) {
      for (let j = 1; j < grid[i].length - 1; j++) {
        const scenicScore = this.checkNode(j, i);

        scenicScores.push(scenicScore);
      }
    }

    // this.dataStore.partOne.totalInvisible = viableSpots.length;
    // this.dataStore.partOne.totalVisible =
    //   grid.length * grid.length - viableSpots.length;
    this.dataStore.partTwo.scenicScores = scenicScores;
  };

  partTwo = () => {
    const largest = Math.max(...this.dataStore.partTwo.scenicScores);
    console.log(`Largest scenic score: ${largest}`);
  };
}

renderToDocument(8, () => {
  console.log("JOE: Let's begin part two!");
  const dayEight = new DayEight({
    filename: "day8.txt",
    exampleFilename: "day8example.txt",
    useExample: false
  });

  // dayEight.verbose();
  dayEight.parseGrid();
  dayEight.partTwo();
  // dayEight.partOne();
});
