import type { IFont } from "@/types/IFont";

export default function StatusBar(canvasEl: HTMLCanvasElement, font: IFont) {
  const canvasCtx = canvasEl.getContext("2d");

  const xPos = 0;
  const yPos = 0;

  const state = {
    battery: 100,
    oxygen: 100,
  };

  const offset = 4;
  const bgHeight = 13;

  return {
    setBattery(value: number) {
      state.battery = Math.round(value);
    },
    setOxygen(value: number) {
      state.oxygen = Math.round(value);
    },

    resetState() {
      state.battery = 100;
      state.oxygen = 100;
    },

    draw() {
      if (!canvasCtx) return;

      canvasCtx.fillStyle = "#e06f8b";
      canvasCtx.fillRect(xPos, yPos, canvasEl.width, bgHeight);

      font.setPosition(xPos + offset, yPos + offset);
      font.draw(`Battery: ${state.battery}`);

      font.setPosition(xPos + 62 + offset, yPos + offset);
      font.draw(`Oxygen: ${state.oxygen}`);

      font.setPosition(xPos + 120 + offset, yPos + offset);
      font.draw("Money: 255");
    },
  };
}
