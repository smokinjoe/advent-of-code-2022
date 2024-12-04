import { parseFile, renderToDocument } from "../utils/";

/**
 * Day 9
 */

type Move = {
  direction: "U" | "D" | "R" | "L";
  distance: number;
};

const parseInstructions = (filename: string): Move[] => {
  const parsedFile = parseFile(filename)
    .split("\n")
    .filter((x) => Boolean(x))
    .map((x) => {
      const [direction, distance] = x.split(" ");
      return {
        direction,
        distance: parseInt(distance, 10)
      };
    });

  return parsedFile;
};

const getVisitedPositions = (moves: Move[], numberOfKnots: number) => {
  // const headTailKnots = [
  //   { row: 0, column: 0 },
  //   { row: 0, column: 0 }
  // ];

  const knots = Array.from({ length: numberOfKnots }, () => ({
    row: 0,
    column: 0
  }));

  const visitedPositions = new Set();

  const moveHead = (direction: string) => {
    const head = knots[0];

    switch (direction) {
      case "U":
        head.row++;
        break;
      case "D":
        head.row--;
        break;
      case "L":
        head.column--;
        break;
      case "R":
        head.column++;
        break;
      default:
        return;
    }
  };

  const moveKnot = (index) => {
    const head = knots[index - 1];
    const tail = knots[index];

    const rowDifference = head.row - tail.row;
    const columnDifference = head.column - tail.column;

    if (Math.abs(rowDifference) > 1 && columnDifference === 0) {
      tail.row += Math.sign(rowDifference);
    } else if (Math.abs(columnDifference) > 1 && rowDifference === 0) {
      tail.column += Math.sign(columnDifference);
    } else if (Math.abs(columnDifference) + Math.abs(rowDifference) > 2) {
      tail.row += Math.sign(rowDifference);
      tail.column += Math.sign(columnDifference);
    }
  };

  moves.forEach(({ direction, distance }) => {
    for (let i = 0; i < distance; i++) {
      moveHead(direction);

      for (let j = 1; j < knots.length; j++) {
        moveKnot(j);
      }

      visitedPositions.add(
        `${knots[knots.length - 1].row} - ${knots[knots.length - 1].column}`
      );
    }
  });

  console.log(knots);

  return visitedPositions;
};

renderToDocument(9, () => {
  const moves = parseInstructions("day9.txt");
  const visited = getVisitedPositions(moves, 10);
  console.log(visited.size);
});
