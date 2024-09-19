import type IPlayer from "@/types/IPlayer";

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

  const state = {
    xPos: 0,
    yPos: 0,
  };

  return {
    setPosition(x: number, y: number) {
      state.xPos = x;
      state.yPos = y;
    },

    getPosition() {
      return state;
    },

    draw() {
      canvasCtx.drawImage(
        spriteSheetImg,
        frames.LEFT_SIDE.xPos,
        frames.LEFT_SIDE.yPos,
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
