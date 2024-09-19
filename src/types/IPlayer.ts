export default interface IPlayer {
  setPosition(x: number, y: number): void;
  getPosition(): {
    xPos: number;
    yPos: number;
  };
  draw(): void;
  update(): void;
}
