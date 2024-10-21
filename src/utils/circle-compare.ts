type CollisionBox = {
  x: number;
  y: number;
  width: number;
  height: number;
};

type CollisionCircle = {
  x: number;
  y: number;
  r: number;
};

export function circleCompare(circle: CollisionCircle, box: CollisionBox) {
  let testX = circle.x;
  let testY = circle.y;

  if (circle.x < box.x) {
    testX = box.x;
  }

  if (circle.x > box.x + box.width) {
    testX = box.x + box.width;
  }

  if (circle.y < box.y) {
    testY = box.y;
  }

  if (circle.y > box.y + box.height) {
    testY = box.y + box.height;
  }

  const distX = circle.x - testX;
  const distY = circle.y - testY;
  const distance = Math.sqrt(distX * distX + distY * distY);

  if (distance <= circle.r) {
    return true;
  }

  return false;
}
