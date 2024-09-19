import type { IPlayer, Direction } from "@/types/IPlayer";

type PlayerState = {
  xPos: number;
  yPos: number;
  direction: Direction;
};

export function Player(canvasEl: any, img: HTMLImageElement): IPlayer {
  const canvas = canvasEl;
  const canvasCtx = canvas.getContext("2d");
  const spriteSheetImg = img;

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
  };

  return {
    setPosition(x: number, y: number) {
      state.xPos = x;
      state.yPos = y;
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
      let frame = frames.LEFT_SIDE;

      if (state.direction === "right") {
        frame = frames.RIGHT_SIDE;
      }

      if (state.direction === "left") {
        frame = frames.LEFT_SIDE;
      }

      canvasCtx.drawImage(
        spriteSheetImg,
        frame.xPos,
        frame.yPos,
        config.WIDTH,
        config.HEIGHT,
        state.xPos,
        state.yPos,
        config.WIDTH,
        config.HEIGHT
      );
    },

    update() {},
  };
}
