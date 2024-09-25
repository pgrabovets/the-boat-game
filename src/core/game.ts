import type Entity from "@/types/Entity";
import { SeaMine } from "@/entities/sea-mine";
import { Chest } from "@/entities/chest";
import { Oxygen } from "@/entities/oxygen";
import { Battery } from "@/entities/battery";

export function createGameEntity(
  canvas: HTMLCanvasElement,
  key: string,
  img: HTMLImageElement
): Entity | null {
  if (key === "sea_mine") {
    return SeaMine(canvas, img);
  }

  if (key === "chest") {
    return Chest(canvas, img);
  }

  if (key === "oxygen") {
    return Oxygen(canvas, img);
  }

  if (key === "battery") {
    return Battery(canvas, img);
  }

  return null;
}
