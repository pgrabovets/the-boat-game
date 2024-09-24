import Sprite from "@/core/sprite";
import type Entity from "@/types/Entity";

export function Chest(
  canvasEl: HTMLCanvasElement,
  spriteSheet: HTMLImageElement
): Entity {
  const sprite = Sprite(canvasEl, {
    sx: 1,
    sy: 1,
    width: 18,
    height: 15,
    img: spriteSheet,
  });

  return {
    type: "chest",
    ...sprite,
  };
}
