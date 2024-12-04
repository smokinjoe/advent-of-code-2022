const fs = require("fs");

document.getElementById("app").innerHTML = `<h1>Day 2 of Advent of Code</h1>`;

/**
 * Day 2
 * https://adventofcode.com/2022/day/2
 */

console.log("Day 2");

/**
 * Begin part 1
 */

const strategyGuideArray: Array<string[]> = fs
  .readFileSync("/data/day2.txt", { encoding: "utf-8" })
  .split("\n")
  .filter((x: any) => Boolean(x))
  .map((x: any) => {
    return x.split(" ");
  });

const exampleGuideArray: Array<string[]> = [
  ["A", "Y"],
  ["B", "X"],
  ["C", "Z"]
];

// console.log("JOE: strategyGuideArray: ", strategyGuideArray);

/**
 * A, X Rock      1 point
 * B, Y Paper     2 points
 * C, Z Scissors  3 points
 *
 * Opponent Me
 *    A     Y   Win   6 + 2 = 8 points
 *    B     X   Loss  0 + 1 = 1 points
 *    C     Z   Draw  3 + 3 = 6 points
 *
 */

const selectionPointsHash: Record<string, number> = {
  X: 1,
  Y: 2,
  Z: 3
};

const outcomePointsHash: Record<string, number> = {
  win: 6,
  loss: 0,
  draw: 3
};

const win = "win";
const loss = "loss";
const draw = "draw";

const opp = 0;
const me = 1;

const battle = (me: string, opp: string) => {
  if (opp === "A") {
    if (me === "Y") {
      return win;
    }
    if (me === "X") {
      return draw;
    }
    return loss;
  }

  if (opp === "B") {
    if (me === "Z") {
      return win;
    }
    if (me === "Y") {
      return draw;
    }
    return loss;
  }

  if (opp === "C") {
    if (me === "X") {
      return win;
    }
    if (me === "Z") {
      return draw;
    }
    return loss;
  }

  throw new Error("Invalid choice for opponent");
};

const getRoundPoints = (me: string, opp: string) => {
  const outcome = battle(me, opp);
  const outcomePoints =
    Number(outcomePointsHash[outcome]) + Number(selectionPointsHash[me]);
  return outcomePoints;
};

type Outcome = {
  points: number;
  result: string;
  me: string;
  opp: string;
};

const getOutcomes = () => {
  const outcomes: Outcome[] = [];

  strategyGuideArray.forEach((matchup: string[]) => {
    const result = battle(matchup[me], matchup[opp]);
    const points = getRoundPoints(matchup[me], matchup[opp]);
    const obj = {
      points,
      result,
      me: matchup[me],
      opp: matchup[opp]
    };
    outcomes.push(obj);
  });

  return outcomes;
};

const sumArray = (outcomes: Outcome[]) => {
  const result = outcomes.reduce((acc: number, curr: Outcome) => {
    return acc + curr.points;
  }, 0);

  return result;
};

const results = getOutcomes();

console.log("Part 1:");
console.log(sumArray(results));

/**
 * Part 2
 */

/**
 * X => need to lose
 * Y => need to draw
 * Z => need to win
 */

type ShapePointsHash = {
  rock: number;
  paper: number;
  scissors: number;
};

const shapePointsHash = {
  rock: 1,
  paper: 2,
  scissors: 3
};

type ShapeGuideHash = {
  A: Record<string, string>;
  B: Record<string, string>;
  C: Record<string, string>;
};

const shapeGuideHash: ShapeGuideHash = {
  A: {
    // rock
    X: "scissors",
    Y: "rock",
    Z: "paper"
  },
  B: {
    // paper
    X: "rock",
    Y: "paper",
    Z: "scissors"
  },
  C: {
    // scissors
    X: "paper",
    Y: "scissors",
    Z: "rock"
  }
};

const letterOutcomePointsHash: Record<string, number> = {
  X: 0,
  Y: 3,
  Z: 6
};

const getMyMove = (moves: string[]) => {
  const opp: string = moves[0];
  const outcome: string = moves[1];

  return shapeGuideHash[opp as keyof ShapeGuideHash][outcome];
};

const getTotalPoints = () => {
  let result = 0;

  strategyGuideArray.forEach(([opp, outcome]) => {
    const myMove: string = getMyMove([opp, outcome]);
    const myMovePoints: number =
      shapePointsHash[myMove as keyof ShapePointsHash];
    const outcomePoints = letterOutcomePointsHash[outcome];
    const sum = myMovePoints + outcomePoints;
    result += sum;
  });

  return result;
};

console.log(getTotalPoints());
