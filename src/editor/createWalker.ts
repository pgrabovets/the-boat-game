import { getRandomNum } from "@/utils/get-random-num";

type Point = {
  x: number;
  y: number;
};

type Config = {
  data: number[][];
  startPoint: Point;
};

const directions = {
  DOWN: 1,
  LEFT: 2,
  UP: 3,
  RIGHT: 4,
};

function createNextPoint(currentPoint: Point, direction: number) {
  const nextPoint: Point = {
    x: 0,
    y: 0,
  };

  if (direction === directions.DOWN) {
    nextPoint.x = currentPoint.x;
    nextPoint.y = currentPoint.y + 1;
  }

  if (direction === directions.LEFT) {
    nextPoint.x = currentPoint.x - 1;
    nextPoint.y = currentPoint.y;
  }

  if (direction === directions.UP) {
    nextPoint.x = currentPoint.x;
    nextPoint.y = currentPoint.y - 1;
  }

  if (direction === directions.RIGHT) {
    nextPoint.x = currentPoint.x + 1;
    nextPoint.y = currentPoint.y;
  }

  return nextPoint;
}

export function createWalker(config: Config) {
  const { data, startPoint } = config;

  const walker = {
    prevPoint: {
      x: 0,
      y: 0,
    },
    currentPoint: {
      x: startPoint.x,
      y: startPoint.y,
    },
    direction: 0,
    step: 0,
  };

  const generateRandomDirection = () => {
    walker.direction = getRandomNum(1, 4);
  };

  const makeNextStep = () => {
    if (walker.direction === 0) {
      return;
    }

    let nextPoint = createNextPoint(walker.currentPoint, walker.direction);

    if (data[nextPoint.y] === undefined) {
      return;
    }

    if (data[nextPoint.y][nextPoint.x] === undefined) {
      return;
    }

    if (walker.currentPoint.y !== null && walker.currentPoint.y !== null) {
      data[walker.currentPoint.y][walker.currentPoint.x] = 1;
    }

    walker.prevPoint = walker.currentPoint;
    walker.currentPoint = nextPoint;
    walker.step += 1;
  };

  return {
    ...walker,
    makeNextStep,
    generateRandomDirection,
  };
}
