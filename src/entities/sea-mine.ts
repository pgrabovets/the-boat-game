import Sprite from "@/core/sprite";
import type Entity from "@/types/Entity";

export function SeaMine(
  canvasEl: HTMLCanvasElement,
  spriteSheet: HTMLImageElement
): Entity {
  const sprite = Sprite(canvasEl, {
    sx: 37,
    sy: 1,
    width: 13,
    height: 13,
    img: spriteSheet,
  });

  return {
    type: "sea_mine",
    ...sprite,
  };
}
