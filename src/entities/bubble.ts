export type IBubble = {
  state: {
    xPos: number;
    yPos: number;
    width: number;
    height: number;
    offset: {
      x: number;
      y: number;
    };
    remove: boolean;
    timer: number;
  };
  setPosition(x: number, y: number): void;
  getPosition(): {
    x: number;
    y: number;
  };
  setOffset(x: number, y: number): void;
  update(): void;
  draw(): void;
};

export default function Bubble(
  canvas: HTMLCanvasElement,
  x: number,
  y: number
): IBubble {
  const canvasCtx = canvas.getContext("2d");

  const vy = 0.2;

  const state = {
    xPos: x,
    yPos: y,
    width: 2,
    height: 2,
    offset: {
      x: 0,
      y: 0,
    },
    remove: false,
    timer: 0,
  };

  return {
    state,

    setPosition(x: number, y: number) {
      state.xPos = x;
      state.yPos = y;
    },

    getPosition() {
      return {
        x: state.xPos,
        y: state.yPos,
      };
    },

    setOffset(x: number, y: number) {
      state.offset.x = x;
      state.offset.y = y;
    },

    update() {
      const minY = 48;
      state.yPos = state.yPos - vy;
      state.timer = state.timer + 1;
      if (state.yPos < minY) {
        state.yPos = minY;
        state.remove = true;
      }

      if (state.timer > 30) {
        state.timer = 40;
        state.remove = true;
      }
    },

    draw() {
      if (!canvasCtx) {
        return;
      }

      canvasCtx.fillStyle = "#005784";
      canvasCtx.fillRect(
        state.xPos + state.offset.x,
        state.yPos + state.offset.y,
        state.width,
        state.height
      );
    },
  };
}
