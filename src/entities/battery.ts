import Sprite from "@/core/sprite";
import type Entity from "@/types/Entity";

export function Battery(
  canvasEl: HTMLCanvasElement,
  spriteSheet: HTMLImageElement
): Entity {
  const sprite = Sprite(canvasEl, {
    sx: 1,
    sy: 38,
    width: 18,
    height: 14,
    img: spriteSheet,
  });

  return {
    type: "battery",
    ...sprite,
  };
}
