export default function Chicken(
  canvasEl: HTMLCanvasElement,
  spriteSheet: HTMLImageElement
) {
  const config = {
    width: 0,
    height: 0,
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
    width: 2,
    height: 2,
    offset: {
      x: 0,
      y: 0,
    },
    remove: false,
    timer: 0,
  };

  return {};
}
