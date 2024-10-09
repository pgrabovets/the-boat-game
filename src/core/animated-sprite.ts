import SpriteSheet from "@/core/sprite-sheet";

type Config = {
  src: string;
  animations: number[];
  width: number;
  height: number;
};

export default function AnimatedSprite(
  canvasEl: HTMLCanvasElement,
  config: Config
) {
  const canvasCtx = canvasEl.getContext("2d");
  const spriteSheet = SpriteSheet(config.src);

  const state = {
    xPos: 0,
    yPos: 0,
    offset: {
      x: 0,
      y: 0,
    },
    frame: 0,
    counter: 0,
  };

  const getSourceRect = (frame: number) => {
    const { width, height } = config;
    const sx = frame * width;
    const sy = 0;

    return {
      sx,
      sy,
      width,
      height,
    };
  };

  return {
    load() {
      return spriteSheet.load();
    },

    setPosition(x: number, y: number) {
      state.xPos = x;
      state.yPos = y;
    },

    setOffset(x: number, y: number) {
      state.offset.x = x;
      state.offset.y = y;
    },

    update() {
      state.counter += 1;
      if (state.counter > 12) {
        state.counter = 0;
        state.frame += 1;
        if (state.frame > config.animations.length - 1) {
          state.frame = 0;
        }
      }
    },

    draw() {
      const frame = config.animations[state.frame];
      const { sx, sy, width, height } = getSourceRect(frame);

      if (spriteSheet) {
        canvasCtx?.drawImage(
          spriteSheet.getImage(),
          sx,
          sy,
          width,
          height,
          state.xPos + state.offset.x,
          state.yPos + state.offset.y,
          width,
          height
        );
      }
    },
  };
}
