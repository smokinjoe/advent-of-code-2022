// usefull consts
const singleLineSplit = /\r?\n/;
const doubleLineSplit = /\r?\n\r?\n/;

// Monkey 0:
//   Starting items: 79, 98
//   Operation: new = old * 19
//   Test: divisible by 23
//     If true: throw to monkey 2
//     If false: throw to monkey 3

// Monkey 1:
//   Starting items: 54, 65, 75, 74
//   Operation: new = old + 6
//   Test: divisible by 19
//     If true: throw to monkey 2
//     If false: throw to monkey 0

// Monkey 2:
//   Starting items: 79, 60, 97
//   Operation: new = old * old
//   Test: divisible by 13
//     If true: throw to monkey 1
//     If false: throw to monkey 3

// Monkey 3:
//   Starting items: 74
//   Operation: new = old + 3
//   Test: divisible by 17
//     If true: throw to monkey 0
//     If false: throw to monkey 1
// each turn monke inspects all items
// Monky inspects item (operation), worry level divided by 3 and Math.floor
// then test item by modulo this.test === 0 and push item to monkey with index ifTrue or ifFalse
// after 20 rounds should looks like this:
// After round 20, the monkeys are holding items with these worry levels:
// Monkey 0: 10, 12, 14, 26, 34
// Monkey 1: 245, 93, 53, 199, 115
// Monkey 2:
// Monkey 3:
// Monkey 0: 10, 12, 14, 26, 34
// Monkey 1: 245, 93, 53, 199, 115
// Monkey 2:
// Monkey 3:
// every time monkey inspects item ++ activity, multiply activity of two most actove monkeys -> 10605

class Monkey {
  items: number[];
  operation: string[];
  test: number;
  ifTrue: number;
  ifFalse: number;
  constructor(input: string) {
    const monkey: string[] = input.split(singleLineSplit);
    this.items = monkey[1]
      .split(": ")[1]
      .split(", ")
      .map((x) => parseInt(x));
    this.operation = monkey[2].split("new = old ")[1].split(" ");
    this.test = parseInt(monkey[3].split("divisible by ")[1]);
    this.ifTrue = parseInt(monkey[4].split("to monkey ")[1]);
    this.ifFalse = parseInt(monkey[5].split("to monkey ")[1]);
  }
  get len(): number {
    return this.items.length;
  }
  inspect(item: number, woried: boolean): [boolean, number] {
    const factor: number =
      this.operation[1] === "old" ? item : parseInt(this.operation[1]);
    let worryLevel = item;
    if (this.operation[0] === "+") {
      worryLevel = worryLevel + factor;
    } else {
      worryLevel = worryLevel * factor;
    }
    if (!woried) {
      worryLevel = Math.floor(worryLevel / 3);
    }
    const test: boolean = worryLevel % this.test === 0;
    // debugger
    return [test, worryLevel];
  }
}

function printMonkeys(monkeys: Monkey[]): void {
  console.log(
    monkeys
      .map((monkey, i) => `Monkey ${i}: `.concat(monkey.items.join(", ")))
      .join("\n")
  );
}
function printInspectedItems(monkeys: number[]): void {
  console.log(
    monkeys
      .map((monkey, i) => `Monkey ${i}: inspected items ${monkey} times`)
      .join("\n")
  );
}

function solution1(
  input: string[],
  woried: boolean = false,
  rounds: number = 20
): string | number {
  const monkeys: Monkey[] = input.map((x) => new Monkey(x));
  const monkeysLen: number = monkeys.length;
  const monkeysOverhead: number = monkeys
    .map((monkey) => monkey.test)
    .reduce((a, x) => a * x); // cap on bignumbers
  const monkeysActivity: number[] = Array(monkeysLen).fill(0);
  for (let i: number = 0; i < rounds; i++) {
    // console.log(`Round: ${i}`)
    for (let m: number = 0; m < monkeysLen; m++) {
      const currentMonkey: Monkey = monkeys[m];
      const itemsLen: number = currentMonkey.len;
      if (itemsLen > 0) {
        for (let mi: number = 0; mi < itemsLen; mi++) {
          const currentItem: number = currentMonkey.items.shift()!;
          const [test, itemPostInspection] = currentMonkey.inspect(
            currentItem,
            woried
          );
          monkeys[
            test ? currentMonkey.ifTrue : currentMonkey.ifFalse
          ].items.push(itemPostInspection % monkeysOverhead);
          monkeysActivity[m]++;
          // debugger
        }
      }
    }
    if (i < 20 || (i + 1) % 1000 === 0) {
      console.log(`== After round ${i + 1} ==`);
      printMonkeys(monkeys);
      printInspectedItems(monkeysActivity);
    }
  }
  const sorted = monkeysActivity.sort((a, b) => b - a);
  // debugger
  return sorted[0] * sorted[1];
}

// woried if monkeys ever return items (not divide worryLevel by 3) and play lasts 10000 rounds
// now expect 2713310158
function solution2(input: string[]): string | number {
  return solution1(input, true, 10000);
}

// boilerprint
function job(input: string): void {
  const lines: string[] = input.trim().split(doubleLineSplit);
  const span1 = document.querySelector("#answer1") as HTMLElement;
  const answer1: string | number = solution1(lines);
  span1.innerText = typeof answer1 == "number" ? answer1.toString() : answer1;
  const span2 = document.querySelector("#answer2") as HTMLElement;
  const answer2: string | number = solution2(lines);
  span2.innerText = typeof answer2 == "number" ? answer2.toString() : answer2;
}

document.querySelector("button")!.addEventListener("click", function () {
  if (document.body.contains(document.querySelector("select"))) {
    job(document.querySelector("textarea")!.value);
  } else {
    job(document.querySelector("textarea")!.value);
  }
});

const fileUrl = "/src/day11/input.txt";
fetch(fileUrl)
  .then((r) => r.text())
  .then((t) => job(t));
