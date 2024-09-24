import Sprite from "@/core/sprite";
import type Entity from "@/types/Entity";

export function Oxygen(
  canvasEl: HTMLCanvasElement,
  spriteSheet: HTMLImageElement
): Entity {
  const sprite = Sprite(canvasEl, {
    sx: 1,
    sy: 17,
    width: 12,
    height: 20,
    img: spriteSheet,
  });

  return {
    type: "oxygen",
    ...sprite,
  };
}
