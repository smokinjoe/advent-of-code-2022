import { assertIsDefined, parseFile, renderToDocument } from "../utils/";

/**
 * Day 7
 */

type DataStore = {
  history: Array<string>;
  exampleHistory: Array<string>;
  directoryLookup: Record<string, Directory>;
  hardDrive: FileSystem;
  memory: {
    totalSize: number;
    minUnusedSize: number;
  };
};

type DaySevenProps = {
  filename: string;
  exampleFilename: string;
  totalSize: number;
  minUnusedSize: number;
};

type Directory = {
  type: "Directory";
  name: string;
  parent: Directory | null;
  children: (Directory | File)[];
  size: number;
};

type File = {
  type: "File";
  name: string;
  parent: Directory;
  size: number;
};

type FileSystem = {
  root: Directory;
  directories: Directory[];
};

class DaySeven {
  private dataStore: DataStore;
  private isVerbose: boolean = false;
  private totalUsedSize: number = 0;
  private totalUnusedSize: number = 0;

  constructor(deps: DaySevenProps) {
    renderToDocument(7);

    const history = this.parseFile(deps.filename);
    const exampleHistory = this.parseFile(deps.exampleFilename);

    this.dataStore = {
      history,
      exampleHistory,
      hardDrive: {
        // TODO: This eventually will go elsewhere
        root: {
          type: "Directory",
          name: "/",
          parent: null,
          children: [],
          size: 0
        },
        directories: []
      },
      // TODO: will contain hardDrive.root and others
      directoryLookup: {},
      memory: {
        totalSize: deps.totalSize,
        minUnusedSize: deps.minUnusedSize
      }
    };
  }

  /**
   * Private methods
   */

  private getTotalUsedSize = (reset = false) => {
    if (!reset && this.totalUsedSize > 0) {
      return this.totalUsedSize;
    }
    const totalUsedSize = this.calculateDirectorySizes();
    this.totalUsedSize = totalUsedSize;
    return this.totalUsedSize;
  };

  private getTotalUnusedSize = (reset = false) => {
    if (!reset && this.totalUnusedSize > 0) {
      return this.totalUnusedSize;
    }
    const totalUnusedSize =
      this.dataStore.memory.totalSize - this.getTotalUsedSize();
    this.totalUnusedSize = totalUnusedSize;
    return this.totalUnusedSize;
  };

  private getMinSizeToDelete = () => {
    return this.dataStore.memory.minUnusedSize - this.getTotalUnusedSize();
  };

  private parseFile = (filename: string) => {
    this.log(`Begin parsing ${filename}`);
    const result = parseFile(filename)
      .split("\n$")
      .map((x: string) => x.trim());

    const valueToShift = result[0].split("");
    valueToShift.shift();
    valueToShift.shift();

    result[0] = valueToShift.join("");

    return result;
  };

  private parseCommand = (command: string) => `${command[0]}${command[1]}`;

  private parseAndRemoveCommand = (commandString: string) => {
    const command = this.parseCommand(commandString);
    const commandArray = commandString.split("");
    commandArray.shift();
    commandArray.shift();
    const result = {
      command,
      commandString: commandArray.join("").trim()
    };
    this.log(`Command parsed: ${result.command}`);
    this.log(`Remaining command string: ${result.commandString}`);
    return result;
  };

  private calculateDirectorySize = (directory: Directory): number => {
    this.log(`Calculating directory ${directory.name}`);
    let sum = 0;

    for (let i = 0; i < directory.children.length; i++) {
      if (directory.children[i].type === "Directory") {
        sum += this.calculateDirectorySize(directory.children[i] as Directory);
      } else {
        sum += directory.children[i].size;
      }
    }

    directory.size = sum;
    return sum;
  };

  private calculateDirectorySizes = () => {
    let sum = 0;

    sum = this.calculateDirectorySize(this.dataStore.hardDrive.root);

    this.log(`Total size: ${sum}`);

    return sum;
  };

  private log = (message: string) => this.isVerbose && console.log(message);

  /**
   * Public methods
   */

  verbose = () => (this.isVerbose = !this.isVerbose);
  viewData = () => console.log(this.dataStore);

  parseFileSystem = (useExample = false) => {
    const commandHistory = useExample
      ? this.dataStore.exampleHistory
      : this.dataStore.history;

    // const filesystem = {};
    const directoryHistory: Directory[] = [];
    let currentDirectory: Directory = {
      name: "",
      parent: null,
      children: [],
      size: 0,
      type: "Directory"
    };

    const directories: Directory[] = [];

    commandHistory.forEach((cmd, index) => {
      const { command, commandString } = this.parseAndRemoveCommand(cmd);

      if (command === "cd") {
        if (commandString === "..") {
          directoryHistory.pop();
          currentDirectory = directoryHistory[directoryHistory.length - 1];
          return;
        }

        // parseDirectory
        const directory: Directory = {
          name: commandString,
          children: [],
          parent: currentDirectory.name !== "" ? { ...currentDirectory } : null,
          size: 0,
          type: "Directory"
        };

        if (currentDirectory.name !== "") {
          currentDirectory.children.push(directory);
        }

        if (commandString.trim() === "/") {
          console.log("JOE: root found!");
          // we're lookin at root!
          this.dataStore.hardDrive.root = directory;
        }

        currentDirectory = directory;
        directoryHistory.push(directory);
        directories.push(directory);
        return;
      }

      if (command === "ls") {
        // parseCurrentDirectory
        const contents = commandString
          .trim()
          .split("\n")
          .map((x) => x.split(" "));

        contents.forEach((row) => {
          if (row[0] === "dir") {
            // const directory: Directory = {
            //   name: row[1],
            //   parent: currentDirectory,
            //   children: []
            // };
            // currentDirectory.children.push(directory);
          } else {
            const size = Number(row[0]);
            const name = row[1];
            const file: File = {
              name,
              size,
              parent: { ...currentDirectory },
              type: "File"
            };

            currentDirectory.children.push(file);
          }
        });
      }
    });

    this.dataStore.hardDrive.directories = directories;
    this.calculateDirectorySizes();
  };

  partOne = () => {
    let sum = 0;
    this.dataStore.hardDrive.directories.forEach((dir) => {
      sum += dir.size <= 100000 ? dir.size : 0;
    });

    console.log(`Part one sum: ${sum}`);
  };

  partTwo = () => {
    const minSizeToDelete = this.getMinSizeToDelete();
    let overkill = 99999999;
    let bestShot: Directory = this.dataStore.hardDrive.root;

    const { directories } = this.dataStore.hardDrive;

    directories.forEach((dir) => {
      const isViable = minSizeToDelete <= dir.size;

      if (!isViable) {
        return;
      }

      // if (overkill < 0) {
      //   // Initialize
      //   bestShot = dir;
      //   overkill = dir.size - minSizeToDelete;
      //   return;
      // }

      const currentOverkill = dir.size - minSizeToDelete;
      if (currentOverkill < overkill) {
        overkill = currentOverkill;
        bestShot = dir;
      }
    });

    // console.log(
    //   `The best shot that you have is ${bestShot} with an overkill of, ${overkill}`
    // );

    console.log(`Best shot would delete ${bestShot.size}. `, bestShot);
    console.log(`Overkill comes out as: ${overkill}`);
  };

  public_getTotalUsedSize = () => {
    console.log(`Total used size: ${this.getTotalUsedSize()}`);
  };

  public_getMinSizeToDelete = () => {
    console.log(
      `Minimum size required to delete: ${this.getMinSizeToDelete()}`
    );
  };
}

const daySeven = new DaySeven({
  filename: "day7.txt",
  exampleFilename: "day7example.txt",
  totalSize: 70000000,
  minUnusedSize: 30000000
});

// daySeven.verbose();
// daySeven.parseFileSystem();
// daySeven.public_getMinSizeToDelete();
// daySeven.public_getTotalUsedSize();
// daySeven.partOne();
// daySeven.viewData();
// daySeven.partTwo();
