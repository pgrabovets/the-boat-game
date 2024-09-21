export default interface Entity {
  type: string;
  setPosition(x: number, y: number): void;
  getPosition(): {
    xPos: number;
    yPos: number;
  };
  setOffset(x: number, y: number): void;
  getSize(): {
    width: number;
    height: number;
  };
  pointCheck(x: number, y: number): boolean;
  draw(): void;
}
