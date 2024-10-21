"use server";
import fs from "node:fs";
import type ILevel from "@/types/ILevel";

export async function saveLevelData(name: string, level: ILevel) {
  if (process.env.NODE_ENV === "development") {
    const filename = name === "" ? "deffault" : name;
    fs.writeFileSync(`./public/${filename}.json`, JSON.stringify(level));
  }
}
