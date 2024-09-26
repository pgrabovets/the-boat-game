import { generateDataArray } from "./generateDataArray";
import { createWalker } from "./createWalker";
import { noise } from "@/utils/perlin";

type MapData = number[][];

let interval: NodeJS.Timeout;

export function generateLevelData(onComplete: (data: MapData) => void) {
  const size = 60;
  const MAX_STEP = 800;

  let step = 0;

  const data = generateDataArray(size);

  const walker = createWalker({
    data: data,
    startPoint: {
      x: 30,
      y: 1,
    },
  });

  clearInterval(interval);
  interval = setInterval(() => {
    if (step === MAX_STEP) {
      onComplete(data);
      clearInterval(interval);
      return;
    }

    walker.generateRandomDirection();
    walker.makeNextStep();

    step++;
  }, 33);
}

export function generateTilemap(size = 32) {
  const data = generateDataArray(size);
  noise.seed(Math.random());
  for (let y = 0; y < data.length; y++) {
    for (let x = 0; x < data[0].length; x++) {
      const value = noise.simplex2(x / 16, y / 16);
      data[y][x] = value > 0 ? 3 : 1;
    }
  }
  return data;
}

export function transformData(data: number[][]) {
  noise.seed(Math.random());
  for (let y = 0; y < data.length; y++) {
    for (let x = 0; x < data[0].length; x++) {
      const value = noise.simplex2(x / 16, y / 16);
      data[y][x] = value > 0 ? 3 : 1;
    }
  }
  return data;
}
