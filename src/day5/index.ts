const fs = require("fs");

type AssertError = string;

function handleError(
  defaultMessage: string,
  errorMessage?: AssertError
): never {
  throw new Error(errorMessage ?? defaultMessage);
}

export function assertIsDefined<T>(
  value: T,
  error?: AssertError
): asserts value is NonNullable<T> {
  if (value == null) {
    handleError("The value must be defined and not null", error);
  }
}

/**
 * My Types
 */

type DataStore = {
  moveList: string[];
  stacks: string[];

  parsedStacks: Record<number, string[]>;
  // inProgressStacks: Record<number, string[]>;
  finalParsedStacks: Record<number, string[]>;

  parsedMoveList: Array<Move>;
  stackIndexArray: Array<number>;
  partOne: string;
  partTwo: string;
};

type Move = {
  howManyMoved: number;
  start: number;
  end: number;
};

type DayFiveProps = {
  filename: string;
};

/**
 * Class
 */

class DayFive {
  private datastore: DataStore;

  constructor(private deps: DayFiveProps) {
    document.getElementById(
      "app"
    ).innerHTML = `<h1>Day 5 of Advent of Code</h1>`;

    const dataObject = fs
      .readFileSync(`/src/data/${deps.filename}`, { encoding: "utf-8" })
      .split("_")
      .filter((x: any) => Boolean(x));

    const stacks = dataObject[0].split("\n").filter((x) => x !== "");
    const moveList = dataObject[1].trim().split("\n");

    this.datastore = {
      stacks,
      moveList,
      parsedStacks: {
        1: [],
        2: [],
        3: [],
        4: [],
        5: [],
        6: [],
        7: [],
        8: [],
        9: []
      },
      finalParsedStacks: {
        1: [],
        2: [],
        3: [],
        4: [],
        5: [],
        6: [],
        7: [],
        8: [],
        9: []
      },
      parsedMoveList: [],
      stackIndexArray: [1, 5, 9, 13, 17, 21, 25, 29, 33],
      // stackIndexArray: [1, 5, 9],
      partOne: "",
      partTwo: ""
    };
  }

  viewData = () => console.log(this.datastore);

  // private parseStacks = () => {
  //   for (let j = this.datastore.stacks.length; j > -1; j--) {
  //     for (let i = 1; i < this.datastore.stacks[0].length; i++) {}
  //   }
  // };

  private parseMove = (moveString: string) => {
    const stringResult = moveString.slice(5, moveString.length).split(" from ");
    const numberResult = [
      stringResult[0],
      ...stringResult[1].split(" to ")
    ].map((x) => Number(x));
    return numberResult;
  };

  private makeMove = ({ howManyMoved, start, end }: Move) => {
    const { parsedStacks } = this.datastore;

    let tempStore: string[] = [];

    const clearStore = () => (tempStore = []);

    for (let i = 0; i < howManyMoved; i++) {
      const box = parsedStacks[start].pop();
      assertIsDefined(box, "A box was undefined.");
      tempStore.push(box);
    }

    tempStore.reverse();

    tempStore.forEach((box) => {
      parsedStacks[end].push(box);
    });

    clearStore();
  };

  parseStacks = () => {
    const { stacks, stackIndexArray } = this.datastore;

    for (let i = stacks.length - 2; i >= 0; i--) {
      stackIndexArray.forEach((stackIndex, index) => {
        const parsedStacksIndex = index + 1;
        if (stacks[i][stackIndex] !== " ") {
          this.datastore.parsedStacks[parsedStacksIndex].push(
            stacks[i][stackIndex]
          );
        }
      });
    }

    // console.log("this.datastore.parsedStacks: ", this.datastore.parsedStacks);
  };

  /**
   * 
   * type Move = {
  howManyMoved: number;
  start: number;
  end: number;
};
   */
  parseMoves = () => {
    // const testStringOne = "move 1 from 2 to 7";
    // const testStringTwo = "move 12 from 9 to 1";

    // const result = this.parseMove(testStringTwo);
    // console.log(result);
    const { moveList } = this.datastore;
    const parsedMoveList = moveList.map((moveString) => {
      const result = this.parseMove(moveString);
      return {
        howManyMoved: Number(result[0]),
        start: Number(result[1]),
        end: Number(result[2])
      };
    });

    this.datastore.parsedMoveList = parsedMoveList;
  };

  makeMoves = () => {
    const { parsedMoveList, parsedStacks } = this.datastore;

    let stackSnapshot = { ...parsedStacks };

    parsedMoveList.forEach(({ howManyMoved, start, end }) => {
      for (let j = 0; j < howManyMoved; j++) {
        stackSnapshot[end].push(stackSnapshot[start].pop() ?? "JOE");
      }
    });

    this.datastore.finalParsedStacks = stackSnapshot;
  };

  partOne = () => {
    const { finalParsedStacks } = this.datastore;
    const result = Object.keys(finalParsedStacks).map((key) => {
      const stack = finalParsedStacks[+key];
      return stack[stack.length - 1];
    });

    this.datastore.partOne = result.join("");
  };

  makeMoves9001 = () => {
    const { parsedMoveList } = this.datastore;

    // this.datastore.inProgressStacks = { ...this.datastore.parsedStacks };

    parsedMoveList.forEach((move: Move) => {
      this.makeMove(move);
    });
  };

  partTwo = () => {
    const { parsedStacks } = this.datastore;
    const result = Object.keys(parsedStacks).map((key) => {
      const stack = parsedStacks[+key];
      return stack[stack.length - 1];
    });

    this.datastore.partTwo = result.join("");
  };
}

const dayFive = new DayFive({ filename: "day5.txt" });
dayFive.parseStacks();
dayFive.parseMoves();

dayFive.makeMoves9001();
dayFive.partTwo();

dayFive.viewData();
