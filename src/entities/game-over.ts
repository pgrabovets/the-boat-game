import type { IFont } from "@/types/IFont";

export default function GameOver(
  canvas: HTMLCanvasElement,
  font: IFont,
  scale: number
) {
  const canvasCtx = canvas.getContext("2d");

  const width = 174;
  const height = 70;

  return {
    draw() {
      const canvasRect = canvas.getBoundingClientRect();
      const xPos = canvasRect.width / scale / 2 - width / 2;
      const yPos = canvasRect.height / scale / 2 - height / 2;
      canvasCtx?.fillRect(xPos, yPos, width, height);
      font.setPosition(xPos + 64, yPos + 32);
      font.draw("GAME OVER");
    },
  };
}
