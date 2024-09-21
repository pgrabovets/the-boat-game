import type { Direction } from "@/types/IPlayer";

type PlayerState = {
  xPos: number;
  yPos: number;
  direction: Direction;
  offset: {
    x: number;
    y: number;
  };
};

export function Player(canvasEl: HTMLCanvasElement) {
  const canvas = canvasEl;
  const canvasCtx = canvas.getContext("2d");

  let spriteSheetImg: HTMLImageElement | null = null;

  const config = {
    WIDTH: 40,
    HEIGHT: 19,
  };

  const frames = {
    LEFT_SIDE: {
      xPos: 0,
      yPos: 20,
    },
    RIGHT_SIDE: {
      xPos: 0,
      yPos: 0,
    },
  };

  const state: PlayerState = {
    xPos: 0,
    yPos: 0,
    direction: "right",
    offset: {
      x: 0,
      y: 0,
    },
  };

  return {
    setSpritSheetImg(img: HTMLImageElement) {
      spriteSheetImg = img;
    },

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

    setDirecction(dir: Direction) {
      state.direction = dir;
    },

    draw() {
      if (!spriteSheetImg) return;

      let frame = frames.LEFT_SIDE;

      if (state.direction === "right") {
        frame = frames.RIGHT_SIDE;
      }

      if (state.direction === "left") {
        frame = frames.LEFT_SIDE;
      }

      canvasCtx?.drawImage(
        spriteSheetImg,
        frame.xPos,
        frame.yPos,
        config.WIDTH,
        config.HEIGHT,
        state.xPos + state.offset.x,
        state.yPos + state.offset.y,
        config.WIDTH,
        config.HEIGHT
      );
    },

    update() {},
  };
}
