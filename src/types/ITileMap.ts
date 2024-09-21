export interface ITileMap {
  data: number[][];
  setPosition(x: number, y: number): void;
  getPosition(): {
    xPos: number;
    yPos: number;
  };
  draw(): void;
}
