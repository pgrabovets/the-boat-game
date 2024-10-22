import SpriteSheet from "@/core/sprite-sheet";
import Bubble from "@/entities/bubble";
import { getRandomNum } from "@/utils/get-random-num";

import type { Direction } from "@/types/IPlayer";
import type { CollisionBox } from "@/types/CollisionBox";
import type { IBubble } from "@/entities/bubble";

export function Player(canvasEl: HTMLCanvasElement, debug = false) {
  const canvas = canvasEl;
  const canvasCtx = canvas.getContext("2d");

  let bubbles: IBubble[] = [];

  let timer = 0;

  const config = {
    src: "/images/boat_sprite_sheet.png",
    WIDTH: 40,
    HEIGHT: 19,
    VELOCITY_X: 1,
    VELOCITY_Y: 1,
    MIN_Y: 42,
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

  const state = {
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
    battery: 100,
    oxygen: 100,
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

  const updateBattery = () => {
    if (state.velocity.x !== 0 || state.velocity.y !== 0) {
      state.battery = state.battery - 0.04;
      if (state.battery < 0) {
        state.battery = 0;
      }
    }

    if (state.yPos <= config.MIN_Y) {
      state.battery = state.battery + 0.5;
      if (state.battery > 100) {
        state.battery = 100;
      }
    }
  };

  const updateOxygen = () => {
    if (state.yPos > config.MIN_Y) {
      state.oxygen = state.oxygen - 0.02;
    } else {
      state.oxygen = state.oxygen + 0.5;
    }

    if (state.oxygen < 0) {
      state.oxygen = 0;
    }

    if (state.oxygen > 100) {
      state.oxygen = 100;
    }
  };

  const createBubble = () => {
    if (timer === 0) {
      const offset = getRandomNum(0, 9) + 6;

      if (state.velocity.x > 0) {
        const bubble = Bubble(canvasEl, state.xPos, state.yPos + offset);
        bubbles.push(bubble);
      }

      if (state.velocity.x < 0) {
        const bubble = Bubble(
          canvasEl,
          state.xPos + config.WIDTH,
          state.yPos + offset
        );
        bubbles.push(bubble);
      }
    }
  };

  const updateBubbles = () => {
    bubbles.forEach((b) => b.update());
    bubbles = bubbles.filter((b) => !b.state.remove);
  };

  const updateTimer = () => {
    timer = timer + 1;
    if (timer > 8) {
      timer = 0;
    }
  };

  return {
    state,

    load() {
      return boatSpriteSheet.load();
    },

    setBattery(value: number) {
      state.battery = value;
    },

    setOxygen(value: number) {
      state.oxygen = value;
    },

    setPosition(x: number, y: number) {
      state.xPos = x;
      state.yPos = y;
    },

    setOffset(x: number, y: number) {
      state.offset.x = x;
      state.offset.y = y;
      bubbles.forEach((b: any) => {
        b.setOffset(x, y);
      });
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
      if (!boatSpriteSheet || !canvasCtx) return;

      let frame = frames.LEFT_SIDE;

      if (state.direction === "right") {
        frame = frames.RIGHT_SIDE;
      }

      if (state.direction === "left") {
        frame = frames.LEFT_SIDE;
      }

      const boatImg = boatSpriteSheet.getImage();

      const x = state.xPos + state.offset.x;
      const y = state.yPos + state.offset.y;

      canvasCtx.drawImage(
        boatImg,
        frame.xPos,
        frame.yPos,
        config.WIDTH,
        config.HEIGHT,
        x,
        y,
        config.WIDTH,
        config.HEIGHT
      );

      bubbles.forEach((b) => b.draw());

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

      if (state.velocity.x !== 0) {
        createBubble();
      }
    },

    toPrevY() {
      state.yPos = state.prev.yPos;
    },

    update() {
      updateBattery();
      updateOxygen();
      updateBubbles();
      updateTimer();
    },
  };
}
