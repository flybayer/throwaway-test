import { NextApiRequest, NextApiResponse } from "next";
import pkgDir from "pkg-dir";
import fs from "fs";
import path from "path";

const rootDir = pkgDir.sync();
const queryResolvers = fs.readdirSync(path.join(rootDir, "app/queries"));
console.log("Found query resolvers:", queryResolvers);

const routes: Record<string, any> = {};

for (let filename of queryResolvers) {
  const filenameWithoutExt = filename
    .split(".")
    .slice(0, -1)
    .join(".");

  routes[filenameWithoutExt] = require(path.join(
    rootDir,
    "app/queries/",
    filename
  )).default;
}

export default async (req: NextApiRequest, res: NextApiResponse) => {
  console.log("REQUEST", req.method, req.query);

  const result = await routes[req.query.blitz[0]]();

  res.status(200).json({ result });
};
