export function getCanvasSize(canvasEl: any) {
  return {
    width: canvasEl.width as number,
    height: canvasEl.height as number,
  };
}

export function getContext(canvasEl: any) {
  return canvasEl.getContext("2d");
}

export function clearCanvas(canvasCtx: any, width: number, height: number) {
  return canvasCtx.clearRect(0, 0, width, height);
}
