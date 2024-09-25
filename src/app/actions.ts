"use server";
import fs from "node:fs";
import type ILevel from "@/types/ILevel";

export async function saveLevelData(name: string, level: ILevel) {
  const filename = name === "" ? "deffault" : name;
  fs.writeFileSync(`./public/${filename}.json`, JSON.stringify(level));
}
