export default interface ICanvas {
  el: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D | null;
  getCanvasSize(): {
    width: number;
    height: number;
  };
  clear(): void;
  mount(): void;
  detach(): void;
}
