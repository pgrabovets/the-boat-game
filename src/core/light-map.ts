import { boxCompare } from "@/utils/box-compare";
import { circleCompare } from "@/utils/circle-compare";

type TileMapData = number[][];

export default function LightMap(canvas: HTMLCanvasElement, scale: number) {
  const canvasCtx = canvas.getContext("2d");
  const tileSize = 16;

  const circleR = 96;

  const state = {
    xPos: 0,
    yPos: 0,
  };

  const circlePos = {
    xPos: 0,
    yPos: 0,
  };

  let tileMapData: TileMapData = [];

  return {
    setTileMapData(data: TileMapData) {
      tileMapData = data;
    },

    setPosition(x: number, y: number) {
      state.xPos = x;
      state.yPos = y;
    },

    setCirclePos(x: number, y: number) {
      circlePos.xPos = x;
      circlePos.yPos = y;
    },

    draw() {
      if (!canvasCtx) {
        return;
      }

      const canvasRect = canvas.getBoundingClientRect();
      const canvasBox = {
        x: 0,
        y: 0,
        width: canvasRect.width / scale,
        height: canvasRect.height / scale,
      };

      const circleBox = {
        x: circlePos.xPos + state.xPos,
        y: circlePos.yPos + state.yPos,
        r: circleR,
      };

      tileMapData.forEach((col, i) => {
        col.forEach((row, j) => {
          const dx = j * tileSize + state.xPos;
          const dy = i * tileSize + state.yPos;

          const tileBox = {
            x: dx,
            y: dy,
            width: tileSize,
            height: tileSize,
          };

          if (boxCompare(canvasBox, tileBox)) {
            if (!circleCompare(circleBox, tileBox)) {
              canvasCtx.fillRect(dx, dy, tileSize, tileSize);
            }
          }
        });
      });
    },
  };
}
