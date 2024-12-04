import { assertIsDefined } from "../utils/assertions";
const fs = require("fs");

/**
 * Day 6
 *
 * Part One
 *
 * Some details,,
 *
 *   the start of a packet is indicated by a sequence
 *    of four characters that are all different.
 *
 *   your subroutine needs to identify the first
 *    position where the four most recently received
 *    characters were all different
 *
 *   Specifically, it needs to report the number of
 *    characters from the beginning of the buffer to
 *    the end of the first such four-character marker.
 *
 * Example:
 *   str = mjqjpqmgbljsphdztnvjfqwrcgsmlb
 *            jpqm
 *
 * bvwbjplbgvbhsrlpgdmjqwftvncz: first marker after character 5 (index: 4)
 *  vwbj
 * nppdvjthqldpwncqszvftbrmjlhg: first marker after character 6 (index: 5)
 *   pdvj
 * nznrnfrfntjfmvfwmzdfjlvtqnbhcprsg: first marker after character 10 (index: 9)
 *       rfnt
 * zcfzfwzzqfrljwzlrfnpqdbhtmscgvjw: first marker after character 11 (index: 10)
 *        zqfr
 */

/**
 * utils that I can't import for some reason
 */

// type AssertError = string;

// function handleError(
//   defaultMessage: string,
//   errorMessage?: AssertError
// ): never {
//   throw new Error(errorMessage ?? defaultMessage);
// }

// export function assertIsDefined<T>(
//   value: T,
//   error?: AssertError
// ): asserts value is NonNullable<T> {
//   if (value == null) {
//     handleError("The value must be defined and not null", error);
//   }
// }

/**
 * My Types
 */

type DataStore = {
  message: string;
  exampleMessages: string[];
  config: {
    startOfStreamUniqueCount: number;
  };
};

type DaySixProps = {
  filename: string;
  exampleFilename: string;
  startOfStreamUniqueCount: number;
};

/**
 * My Class
 */

class DaySix {
  private dataStore: DataStore;
  private isVerbose: boolean = false;

  constructor(private deps: DaySixProps) {
    document.getElementById(
      "app"
    ).innerHTML = `<h1>Day 6 of Advent of Code</h1>`;

    const dataObject = fs.readFileSync(`/src/data/${deps.filename}`, {
      encoding: "utf-8"
    });
    // .filter((x: any) => Boolean(x));

    const examples = fs
      .readFileSync(`/src/data/${deps.exampleFilename}`, { encoding: "utf-8" })
      .split("\n")
      .filter((x: any) => Boolean(x));

    this.dataStore = {
      message: dataObject,
      exampleMessages: examples,
      config: {
        startOfStreamUniqueCount: deps.startOfStreamUniqueCount
      }
    };
  }

  // private parseMessage = (message: string) => {
  //   let count = 0;
  //   let uniqueCount = 0;
  //   let letterHash: Record<string, boolean> = {};

  //   const reset = () => {
  //     letterHash = {};
  //     uniqueCount = 0;
  //   };

  //   message.split("").forEach((letter, index) => {
  //     count = index + 1;

  //     if (letterHash[letter]) {
  //       reset();
  //       return;
  //     }
  //     ++uniqueCount;
  //     letterHash[letter] = true;
  //   });
  // };

  private log = (message: string) => this.isVerbose && console.log(message);

  private startOfStream = () => this.dataStore.config.startOfStreamUniqueCount;

  private parseMessage = (message: string) => {
    console.log("Begin parseMessage of message: ", message);
    const holdingCell: string[] = [];
    let isAnswerFound = false;
    let finalCount = 0;
    let finalArray: string[] = [];

    const addLetter = (letter: string) => {
      this.log(`Adding ${letter} to ${holdingCell}`);
      holdingCell.push(letter);
    };

    message.split("").forEach((letter, index) => {
      if (isAnswerFound) {
        return;
      }
      this.log(`Checking ${letter}`);

      if (holdingCell.length === this.startOfStream()) {
        finalCount = index;
        finalArray = [...holdingCell];
        isAnswerFound = true;
        this.log(`Answer was found with the final count being: ${finalCount}`);
        return;
      }

      // if (index < 3) {
      //   addLetter(letter);
      //   return;
      // }

      // [...holdingCell].forEach((cellLetter, index) => {
      //   if (letter === cellLetter) {
      //     this.log(`Letter match was found at index ${index}`);
      //     for (let i = 0; i < index + 1; i++) {
      //       holdingCell.shift();
      //     }
      //     addLetter(letter);
      //     return;
      //   }
      // });

      const cellIndex = holdingCell.indexOf(letter);

      if (cellIndex > -1) {
        this.log(`Letter match was found at index ${cellIndex}`);
        for (let i = 0; i < cellIndex + 1; i++) {
          holdingCell.shift();
        }
        // addLetter(letter);
      }

      // if (letter === holdingCell[0]) {
      //   this.log(`Letter match was found at index ${0}`);
      //   holdingCell.shift();
      //   addLetter(letter);
      //   return;
      // }

      // if (letter === holdingCell[1]) {
      //   this.log(`Letter match was found at index ${1}`);
      //   holdingCell.shift();
      //   holdingCell.shift();
      //   addLetter(letter);
      //   return;
      // }

      // if (letter === holdingCell[2]) {
      //   this.log(`Letter match was found at index ${2}`);
      //   holdingCell.shift();
      //   holdingCell.shift();
      //   holdingCell.shift();
      //   addLetter(letter);
      //   return;
      // }

      addLetter(letter);
    });

    return {
      finalCount,
      finalArray
    };
  };

  viewData = () => console.log(this.dataStore);

  verbose = () => {
    this.isVerbose = !this.isVerbose;
    console.log(`Verbose is set to: ${this.isVerbose}`);
  };

  parseExample = (index = -1) => {
    const useAll = index === -1;

    let answers = [];

    if (index >= this.dataStore.exampleMessages.length) {
      throw new Error("Out of range! Pick another index.");
    }

    if (useAll) {
      answers = this.dataStore.exampleMessages.map((message) => {
        return this.parseMessage(message);
      });
    } else {
      answers = [this.parseMessage(this.dataStore.exampleMessages[index])];
    }

    // return { answers };
    console.log("Result: ", answers);
  };

  partOne = () => {
    console.log("Result: ", this.parseMessage(this.dataStore.message));
  };

  partTwo = () => {
    console.log("Result: ", this.parseMessage(this.dataStore.message));
  };
}

const daySix = new DaySix({
  filename: "day6.txt",
  exampleFilename: "day6example2.txt",
  startOfStreamUniqueCount: 14
});

// daySix.verbose();
// daySix.parseExample();
// daySix.viewData();
// daySix.partOne();
daySix.partTwo();
// daySix.verbose();
// daySix.parseExample();
