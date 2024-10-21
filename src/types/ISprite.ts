export default interface ISprite {
  setPosition(x: number, y: number): void;
  setOffset(x: number, y: number): void;
  getRect(): {
    x: number;
    y: number;
    width: number;
    height: number;
  };
  getPosition(): {
    x: number;
    y: number;
  };
  pointCheck(x: number, y: number): boolean;
  draw(): void;
}
