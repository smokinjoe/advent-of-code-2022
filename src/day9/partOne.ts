import { parseFile, renderToDocument } from "../utils/";

/**
 * Day 9
 */

type Move = {
  direction: string;
  steps: number;
};

type DataStore = {
  moves: Move[];
  grid: Array<Array<boolean>>;
  currentHeadLocation: Array<number>;
  currentTailLocation: Array<number>;
};

type DayNineProps = {
  filename: string;
  exampleFilename: string;
  useExample: boolean;
};

class DayNine {
  private dataStore: DataStore;
  private isVerbose: boolean = false;

  constructor(deps: DayNineProps) {
    const standard = this.parseFile(deps.filename);
    const example = this.parseFile(deps.exampleFilename);

    const moves = deps.useExample ? example : standard;
    const grid: Array<Array<boolean>> = [];
    const currentHeadLocation = [0, 0];
    const currentTailLocation = [0, 0];

    this.dataStore = {
      moves,
      grid,
      currentHeadLocation,
      currentTailLocation
    };
  }

  /**
   * Private
   */

  parseFile = (filename: string): Move[] => {
    const parsedFile = parseFile(filename)
      .split("\n")
      .filter((x) => Boolean(x))
      .map((x) => {
        const movesArray = x.split(" ");
        return {
          direction: movesArray[0],
          steps: Number(movesArray[1])
        };
      });

    return parsedFile;
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

  moveTailDirection = () => {
    const [headX, headY] = this.dataStore.currentHeadLocation;
    let [tailX, tailY] = this.dataStore.currentTailLocation;

    if (headX === headY) {
    }
  };

  moveHeadDirection = (direction: string) => {
    const { currentHeadLocation } = this.dataStore;
    // const oldLocation = [...currentHeadLocation];

    switch (direction) {
      case "U":
        currentHeadLocation[0]++;
        break;
      case "D":
        currentHeadLocation[0]--;
        break;
      case "L":
        currentHeadLocation[1]--;
        break;
      case "R":
        currentHeadLocation[1]++;
        break;
      default:
        return;
    }

    this.moveTailDirection();
  };

  moveHead = (move: Move) => {
    for (let i = 0; i < move.steps; i++) {
      this.moveHeadDirection(move.direction);
    }
  };

  /**
   * Public
   */

  viewData = () => this.log(this.dataStore, true);
  verbose = () => (this.isVerbose = !this.isVerbose);

  partOne = () => {
    const { moves } = this.dataStore;

    moves.forEach((move) => {
      this.moveHead(move);
    });
  };
}

renderToDocument(9, () => {
  console.log("JOE: Let's begin part one!");
  const dayNine = new DayNine({
    filename: "day9.txt",
    exampleFilename: "day9example.txt",
    useExample: true
  });

  dayNine.verbose();
  dayNine.partOne();
  dayNine.viewData();
});
