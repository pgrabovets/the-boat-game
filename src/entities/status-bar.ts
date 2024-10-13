import type { IFont } from "@/types/IFont";

export default function StatusBar(canvasEl: HTMLCanvasElement, font: IFont) {
  const canvasCtx = canvasEl.getContext("2d");

  const state = {
    battery: 100,
    oxygen: 100,
    xPos: 0,
    yPos: 0,
  };

  const offset = 4;
  const bgHeight = 14;

  return {
    setBattery(value: number) {
      state.battery = Math.round(value);
    },
    setOxygen(value: number) {
      state.oxygen = Math.round(value);
    },
    draw() {
      if (!canvasCtx) return;

      canvasCtx.beginPath();
      canvasCtx.rect(state.xPos, state.yPos, canvasEl.width, bgHeight);
      canvasCtx.fill();
      font.setPosition(state.xPos + offset, state.yPos + offset);
      font.draw(`Battery: ${state.battery}`);

      font.setPosition(state.xPos + 62 + offset, state.yPos + offset);
      font.draw(`Oxygen: ${state.oxygen}`);

      font.setPosition(state.xPos + 120 + offset, state.yPos + offset);
      font.draw("Money: 255");
    },
  };
}
