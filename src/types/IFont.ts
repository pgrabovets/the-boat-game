export interface IFont {
  load(): Promise<unknown>;
  setPosition(x: number, y: number): void;
  draw(str: string): void;
}
