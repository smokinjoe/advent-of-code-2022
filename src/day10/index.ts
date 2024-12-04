import { parseFile, renderToDocument } from "../utils/";

/**
 * Day 10
 */

// Types

type DayTenProps = {
  commandsList: Command[];
  crtWidth: number;
};

type Command = {
  instruction: "noop" | "addx";
  value: number;
};

type CPUCommand = Command & {
  cycleStart: number;
};

// type Pixel = "#" | ".";

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
  private pixelPosition: number = 0;
  private screen: string = "";
  private registerValue: number = 1;
  private commandsList: Command[] = [];
  private endOfCommandAddress: number = 0;
  private commandStackIndex: number = 0;
  private commandStack: CPUCommand[] = [];
  private signalStrengths: number[] = [];
  private crtWidth: number = 0;

  constructor({ commandsList, crtWidth }: DayTenProps) {
    this.commandsList = commandsList;
    this.endOfCommandAddress = this.commandsList.length;
    this.crtWidth = crtWidth;
  }

  private renderPixel = () => {
    const isPixelLit =
      this.pixelPosition + 1 === this.registerValue ||
      this.pixelPosition === this.registerValue ||
      this.pixelPosition - 1 === this.registerValue;
    this.screen += isPixelLit ? "#" : ".";
  };

  private nextLine = () => {
    this.pixelPosition = 0;
    this.screen += "\n";
  };

  private nextTick = () => {
    ++this.cycle;

    if (this.pixelPosition === this.crtWidth) {
      this.nextLine();
    }
    this.renderPixel();
    this.pixelPosition++;

    this.determineSignalStrength();
    this.processNextCommand();
  };

  private shouldDetermineSignalStrength = (): boolean => {
    if (this.cycle < 20 || this.cycle > 220) {
      return false;
    }

    const isCycleTwenty = this.cycle === 20;
    const isBeyondCycleTwenty = this.cycle > 20;
    const is40nAfterCycle20 = !((this.cycle - 20) % 40);

    return isCycleTwenty || (isBeyondCycleTwenty && is40nAfterCycle20);
  };

  private calculateSignalStrength = () => {
    const signalStrength = this.registerValue * this.cycle;
    return signalStrength;
  };

  private determineSignalStrength = () => {
    const signalStrength = this.calculateSignalStrength();

    if (this.shouldDetermineSignalStrength()) {
      console.log(
        `Signal Strength is ${signalStrength} for cycle: ${this.cycle}`
      );
      this.signalStrengths.push(signalStrength);
    }
  };

  private isProcessing = () => {
    const isProcessingCommandsList = this.commandsList.length > 0;
    const isProcessingCommandStack =
      this.commandStackIndex < this.endOfCommandAddress;

    return isProcessingCommandsList || isProcessingCommandStack;
  };

  private processCommand = () => {
    const currentExecution = this.commandStack[this.commandStackIndex];

    if (currentExecution.instruction === "noop") {
      this.commandStackIndex++;
      return;
    }

    // we have an addx
    if (currentExecution.cycleStart === this.cycle - 1) {
      // we can actually perform this action
      this.registerValue += currentExecution.value;
      this.commandStackIndex++;
      return;
    }
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

    this.processCommand();
  };

  private debug = () => {
    if (180 < this.cycle && this.cycle <= 220) {
      console.log(
        `Cycle Start: ${this.commandStack[this.commandStackIndex]?.cycleStart}`
      );
      console.log(
        `Instruction: ${this.commandStack[this.commandStackIndex]?.instruction}`
      );
      console.log(`Value: ${this.commandStack[this.commandStackIndex]?.value}`);

      console.log(`Register value: ${this.registerValue}`);
      console.log(`Cycle value: ${this.cycle}`);
      console.log("\n\n");
    }
  };

  /**
   * Public
   */

  viewData = () => console.log("Screen: ", this.screen.split("\n"));

  partOne = () => {
    while (this.isProcessing()) {
      this.nextTick();
    }

    const signalStrengthSum = this.signalStrengths.reduce(
      (acc, x) => acc + x,
      0
    );
    console.log(`Combined signal strength: ${signalStrengthSum}`);
  };
}

renderToDocument(10, () => {
  console.log("Let's do Part One!\n\n");
  const commandsList = parseCommands("day10.txt");
  const cpu = new CPU({ commandsList, crtWidth: 40 });
  cpu.partOne();
  cpu.viewData();
});
