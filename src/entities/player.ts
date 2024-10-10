import SpriteSheet from "@/core/sprite-sheet";

import type { Direction } from "@/types/IPlayer";
import type { CollisionBox } from "@/types/CollisionBox";

type PlayerState = {
  velocity: {
    x: number;
    y: number;
  };
  xPos: number;
  yPos: number;
  direction: Direction;
  offset: {
    x: number;
    y: number;
  };
  prev: {
    xPos: number;
    yPos: number;
  };
};

export function Player(canvasEl: HTMLCanvasElement, debug = false) {
  const canvas = canvasEl;
  const canvasCtx = canvas.getContext("2d");

  const config = {
    src: "/images/boat_sprite_sheet.png",
    WIDTH: 40,
    HEIGHT: 19,
    VELOCITY_X: 1,
    VELOCITY_Y: 1,
    MIN_Y: 25,
  };

  const boatSpriteSheet = SpriteSheet(config.src);

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

  const collisions: CollisionBox[] = [
    {
      x: 0,
      y: 5,
      width: 40,
      height: 14,
    },
    {
      x: 14,
      y: 0,
      width: 12,
      height: 5,
    },
  ];

  const state: PlayerState = {
    velocity: {
      x: 0,
      y: 0,
    },
    xPos: 0,
    yPos: 0,
    direction: "right",
    offset: {
      x: 0,
      y: 0,
    },
    prev: {
      xPos: 0,
      yPos: 0,
    },
  };

  const drawCollisionBoxes = () => {
    if (!canvasCtx) return;

    canvasCtx.save();
    canvasCtx.strokeStyle = "#a3ce27";

    collisions.forEach((box) => {
      const x = box.x + state.offset.x + state.xPos;
      const y = box.y + state.offset.y + state.yPos;
      canvasCtx.strokeRect(x, y, box.width, box.height);
    });
    canvasCtx.restore();
  };

  return {
    state,

    load() {
      return boatSpriteSheet.load();
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
        x: state.xPos,
        y: state.yPos,
      };
    },

    setDirecction(dir: Direction) {
      state.direction = dir;
    },

    startMoveLeft() {
      state.velocity.x = -1 * config.VELOCITY_X;
      state.direction = "left";
    },

    startMoveRight() {
      state.velocity.x = 1 * config.VELOCITY_X;
      state.direction = "right";
    },

    stopMoveX() {
      state.velocity.x = 0;
    },

    startMoveUp() {
      state.velocity.y = -1 * config.VELOCITY_Y;
    },

    startMoveDown() {
      state.velocity.y = 1 * config.VELOCITY_Y;
    },

    stopMoveY() {
      state.velocity.y = 0;
    },

    getCollisionBoxes() {
      return collisions.map((item) => {
        return {
          x: item.x + state.xPos + state.offset.x,
          y: item.y + state.yPos + state.offset.y,
          width: item.width,
          height: item.height,
        };
      });
    },

    getRect() {
      return {
        x: state.xPos,
        y: state.yPos,
        width: config.WIDTH,
        height: config.HEIGHT,
      };
    },

    toPrevStep() {
      state.xPos = state.prev.xPos;
      state.yPos = state.prev.yPos;
    },

    draw() {
      if (!boatSpriteSheet) return;

      let frame = frames.LEFT_SIDE;

      if (state.direction === "right") {
        frame = frames.RIGHT_SIDE;
      }

      if (state.direction === "left") {
        frame = frames.LEFT_SIDE;
      }

      const boatImg = boatSpriteSheet.getImage();

      canvasCtx?.drawImage(
        boatImg,
        frame.xPos,
        frame.yPos,
        config.WIDTH,
        config.HEIGHT,
        state.xPos + state.offset.x,
        state.yPos + state.offset.y,
        config.WIDTH,
        config.HEIGHT
      );

      debug && drawCollisionBoxes();
    },

    updateX() {
      state.prev.xPos = state.xPos;
      state.xPos = state.xPos + state.velocity.x;
    },

    toPrevX() {
      state.xPos = state.prev.xPos;
    },

    updateY() {
      state.prev.yPos = state.yPos;
      state.yPos = state.yPos + state.velocity.y;

      if (state.yPos < config.MIN_Y) {
        state.yPos = config.MIN_Y;
      }
    },

    toPrevY() {
      state.yPos = state.prev.yPos;
    },

    update() {},
  };
}
