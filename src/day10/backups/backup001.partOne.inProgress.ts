import { parseFile, renderToDocument } from "../utils/";

/**
 * This can't handle the second addx -5
 */

/**
 * Day 10
 */

// Types

type Command = {
  instruction: "noop" | "addx";
  value: number;
};

type CPUCommand = Command & {
  cycleStart: number;
};

// Data
const parseCommands = (filename: string): Command[] => {
  return parseFile(filename)
    .split("\n")
    .map((row: string) => {
      const [instruction, value] = row.split(" ");
      return {
        instruction,
        value: parseInt(value, 10)
      };
    });
};

class CPU {
  private cycle: number = 0;
  private pointerValue: number = 1;
  private commandsList: Command[] = [];
  private commandStackIndex: number = 0;
  private commandStack: CPUCommand[] = [];

  constructor(commandsList: Command[]) {
    this.commandsList = commandsList;
  }

  private nextTick = () => {
    ++this.cycle;
    this.processNextCommand();
    console.log(`Cycle: ${this.cycle} with pointerValue: ${this.pointerValue}`);
  };

  private isProcessing = () => {
    return this.commandsList.length > 0;
  };

  private processNextCommand = () => {
    if (
      !this.commandStack[this.commandStackIndex] &&
      this.commandsList.length > 0
    ) {
      const nextCommand = this.commandsList.shift() as Command;
      const cpuCommand: CPUCommand = {
        ...nextCommand,
        cycleStart: this.cycle
      };
      this.commandStack.push(cpuCommand);
    }

    const currentExecution = this.commandStack[this.commandStackIndex];

    if (currentExecution.instruction === "noop") {
      this.commandStackIndex++;
      return;
    }

    // we have an addx
    if (currentExecution.cycleStart === this.cycle - 1) {
      // we can actually perform this action
      this.pointerValue += currentExecution.value;
      this.commandStackIndex++;
      return;
    }

    // we have just added this addx, so we can cycle
  };

  viewData = () => console.log(`Cycles: ${this.cycle}`);

  partOne = () => {
    while (this.isProcessing()) {
      this.nextTick();
    }
  };
}

renderToDocument(10, () => {
  console.log("Let's do Part One!");
  const commandsList = parseCommands("day10example.txt");
  const cpu = new CPU(commandsList);
  cpu.viewData();
  cpu.partOne();
});
