"use server";

import fs from "node:fs";

export async function saveMapData(name: string, data: number[][]) {
  const filename = name === "" ? "deffault" : name;
  fs.writeFileSync(`./public/${filename}.json`, JSON.stringify(data));
}
