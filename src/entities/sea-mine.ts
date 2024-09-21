import type Entity from "@/types/Entity";

const config = {
  sx: 37,
  sy: 1,
  width: 13,
  height: 13,
};

export function SeaMine(
  canvasEl: HTMLCanvasElement,
  spriteSheet: HTMLImageElement
): Entity {
  const canvas = canvasEl;
  const canvasCtx = canvas.getContext("2d");

  const state = {
    xPos: 0,
    yPos: 0,
    offset: {
      x: 0,
      y: 0,
    },
  };

  return {
    type: "sea_mine",

    setPosition(x: number, y: number) {
      state.xPos = x;
      state.yPos = y;
    },

    setOffset(x: number, y: number) {
      state.offset.x = x;
      state.offset.y = y;
    },

    getPosition() {
      return {
        xPos: state.xPos,
        yPos: state.yPos,
      };
    },

    getSize() {
      return {
        width: config.width,
        height: config.height,
      };
    },

    pointCheck(x: number, y: number) {
      return (
        x > state.xPos &&
        x < state.xPos + config.width &&
        y > state.yPos &&
        y < state.yPos + config.height
      );
    },

    draw() {
      canvasCtx?.drawImage(
        spriteSheet,
        config.sx,
        config.sy,
        config.width,
        config.height,
        state.xPos + state.offset.x,
        state.yPos + state.offset.y,
        config.width,
        config.height
      );
    },
  };
}
