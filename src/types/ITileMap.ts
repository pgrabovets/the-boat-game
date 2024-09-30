import type { Rectangle } from "@/types/Rectangle";

export interface ITileMap {
  data: number[][];
  setPosition(x: number, y: number): void;
  getPosition(): {
    xPos: number;
    yPos: number;
  };
  getTileSize(): number;
  load(): Promise<HTMLImageElement>;
  drawCollisionChunk(rect: Rectangle): void;
  getCollisionBoxes(rect: Rectangle): Rectangle[];
  draw(): void;
}
