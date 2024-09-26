export interface ITileMap {
  data: number[][];
  setPosition(x: number, y: number): void;
  getPosition(): {
    xPos: number;
    yPos: number;
  };
  getTileSize(): number;
  load(): Promise<HTMLImageElement>;
  draw(): void;
}
