const fs = require("fs");

export const parseFile = (filename: string) => {
  return fs.readFileSync(`/src/data/${filename}`, { encoding: "utf-8" });
};
