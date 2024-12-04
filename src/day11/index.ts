// import * as fs from "fs";
const fs = require("fs");

class Monkey {
  static gang: Monkey[] = [];
  static worryLevelCommonDivider = 1;
  private items: number[];
  private inspectA: (old: number) => number;
  private inspectB: (old: number) => number;
  private _nrOfInspections = 0;
  private test: (item: number) => void;

  constructor(monkeyInput: string) {
    const lines = monkeyInput.split(/\r?\n/);
    const nr = lines.shift()?.split(" ")[1].slice(0, -1);
    const [items, operation, test, ifTrue, ifFalse] = lines.map((property) =>
      property.slice(property.search(":") + 2)
    );
    this.items = items.split(", ").map((i) => +i);
    this.inspectA = this.constructInspectFunction(operation, 1);
    this.inspectB = this.constructInspectFunction(operation, 2);
    this.test = this.constructTestFunction(test, ifTrue, ifFalse);
    if (nr === undefined) throw new Error("Wrong input format!");
    Monkey.gang[+nr] = this;
  }

  public get nrOfInspections() {
    return this._nrOfInspections;
  }

  public giveItem(worryLevel: number) {
    this.items.push(worryLevel);
  }

  public playRound(problemPart: 1 | 2) {
    for (let item of this.items) {
      if (problemPart === 1) {
        item = this.inspectA(item) % Monkey.worryLevelCommonDivider;
      } else {
        item = this.inspectB(item) % Monkey.worryLevelCommonDivider;
      }
      this.test(item);
    }
    this.items = [];
  }

  private constructInspectFunction(operation: string, problemPart: 1 | 2) {
    return (oldWorryLevel: number) => {
      let newWorryLevel: number;
      const [arg1Str, op, arg2Str] = operation.split(" ").slice(2);
      let arg1: number, arg2: number;
      if (arg1Str === "old") {
        arg1 = oldWorryLevel;
      } else {
        arg1 = +arg1Str;
      }
      if (arg2Str === "old") {
        arg2 = oldWorryLevel;
      } else {
        arg2 = +arg2Str;
      }
      if (op === "*") newWorryLevel = arg1 * arg2;
      else newWorryLevel = arg1 + arg2;

      this._nrOfInspections++;
      if (problemPart === 1) return Math.floor(newWorryLevel / 3);
      else return newWorryLevel;
    };
  }

  private constructTestFunction(test: string, ifTrue: string, ifFalse: string) {
    const divisibility = +test.split(" ")[2];
    Monkey.worryLevelCommonDivider *= divisibility;

    return (item: number) => {
      if (item === undefined) return;
      const passToOnTrue = ifTrue.split(" ").at(-1);
      const passToOnFalse = ifFalse.split(" ").at(-1);
      if (passToOnFalse === undefined || passToOnTrue === undefined) {
        throw new Error("Wrong action after test input!");
      }
      if (item % divisibility === 0) {
        Monkey.gang[passToOnTrue].giveItem(item);
      } else {
        Monkey.gang[passToOnFalse].giveItem(item);
      }
    };
  }
}

function calculateMonkeyBusiness() {
  let maxInspections1 = 0;
  let maxInspections2 = 0;
  for (const monkey of Monkey.gang) {
    if (monkey.nrOfInspections > maxInspections1) {
      maxInspections2 = maxInspections1;
      maxInspections1 = monkey.nrOfInspections;
    } else if (monkey.nrOfInspections > maxInspections2) {
      maxInspections2 = monkey.nrOfInspections;
    }
  }
  console.log("JOE: Monkey.gang: ", Monkey.gang);
  return maxInspections1 * maxInspections2;
}

const data = fs.readFileSync("/src/day11/input.txt", "utf-8");
const monkeysInput = data.split(/\r?\n\r?\n/);

// Part 1
for (const monkeyInput of monkeysInput) {
  new Monkey(monkeyInput);
}
for (let i = 0; i < 20; ++i) {
  for (const monkey of Monkey.gang) {
    monkey.playRound(1);
  }
}
console.log(`Part 1: ${calculateMonkeyBusiness()}`);

// Part 2
// Monkey.gang = [];
// Monkey.worryLevelCommonDivider = 1;
// for (const monkeyInput of monkeysInput) {
//   new Monkey(monkeyInput);
// }
// const roundNumber = 10000;
// for (let i = 0; i < roundNumber; ++i) {
//   for (const monkey of Monkey.gang) {
//     monkey.playRound(2);
//   }
// }
// console.log(`Part 2: ${calculateMonkeyBusiness()}`);
