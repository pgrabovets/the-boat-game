// Compare two collision boxes for a collision.

type CollisionBox = {
  x: number;
  y: number;
  width: number;
  height: number;
};

export function boxCompare(box1: CollisionBox, box2: CollisionBox) {
  let crashed = false;

  if (
    box1.x < box2.x + box2.width &&
    box1.x + box1.width > box2.x &&
    box1.y < box2.y + box2.height &&
    box1.height + box1.y > box2.y
  ) {
    crashed = true;
  }

  return crashed;
}
