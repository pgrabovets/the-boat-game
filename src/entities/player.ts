import type { Direction } from "@/types/IPlayer";

type CollisionBox = {
  x: number;
  y: number;
  width: number;
  height: number;
};

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
};

export function Player(canvasEl: HTMLCanvasElement) {
  const canvas = canvasEl;
  const canvasCtx = canvas.getContext("2d");

  let spriteSheetImg: HTMLImageElement | null = null;

  const config = {
    src: "/images/boat_sprite_sheet.png",
    WIDTH: 40,
    HEIGHT: 19,
    VELOCITY_X: 0.5,
    VELOCITY_Y: 0.25,
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

  const collision: {
    left: CollisionBox[];
    right: CollisionBox[];
  } = {
    left: [
      {
        x: 13,
        y: 0,
        width: 8,
        height: 5,
      },
      {
        x: 0,
        y: 7,
        width: 3,
        height: 10,
      },
      {
        x: 3,
        y: 5,
        width: 28,
        height: 14,
      },
      {
        x: 31,
        y: 7,
        width: 8,
        height: 10,
      },
    ],
    right: [
      {
        x: 19,
        y: 0,
        width: 8,
        height: 5,
      },
      {
        x: 1,
        y: 7,
        width: 8,
        height: 10,
      },
      {
        x: 9,
        y: 5,
        width: 28,
        height: 14,
      },
      {
        x: 37,
        y: 7,
        width: 3,
        height: 10,
      },
    ],
  };

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
  };

  return {
    state,

    load() {
      const img = new Image();
      img.src = config.src;
      spriteSheetImg = img;
      return new Promise((resolve) => {
        img.addEventListener("load", () => {
          resolve(img);
        });
      });
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

    drawCollisionBoxes() {
      if (!canvasCtx) return;

      canvasCtx.save();
      canvasCtx.strokeStyle = "#fff";

      collision[state.direction].forEach((box) => {
        const x = box.x + state.offset.x + state.xPos;
        const y = box.y + state.offset.y + state.yPos;
        canvasCtx.strokeRect(x, y, box.width, box.height);
      });
      canvasCtx.restore();
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

    update() {
      state.xPos = state.xPos + state.velocity.x;
      state.yPos = state.yPos + state.velocity.y;
    },
  };
}
