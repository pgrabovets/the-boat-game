import { generateDataArray } from "./generateDataArray";
import { createWalker } from "./createWalker";

type MapData = number[][];

let interval: NodeJS.Timeout;

export function mapGenerate(onComplete: (data: MapData) => void) {
  const size = 40;
  const MAX_STEP = 800;

  let step = 0;

  const data = generateDataArray(size);

  const walker = createWalker({
    data: data,
    startPoint: {
      x: 20,
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
  }, 20);
}
