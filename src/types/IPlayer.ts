export type Direction = "left" | "right";

export interface IPlayer {
  setPosition(x: number, y: number): void;
  getPosition(): {
    xPos: number;
    yPos: number;
  };
  setDirecction(dir: Direction): void;
  draw(): void;
  update(): void;
}
