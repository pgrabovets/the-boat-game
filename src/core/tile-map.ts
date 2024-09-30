import { boxCompare } from "@/utils/box-compare";
import type { ITileMap } from "@/types/ITileMap";

type TilesetRecord = Record<
  number,
  {
    sx: number;
    sy: number;
  }
>;

export default function TileMap(
  canvasEl: HTMLCanvasElement,
  data: number[][],
  scale = 1
): ITileMap {
  const ctx = canvasEl.getContext("2d");

  const tileset = {
    src: "/images/tileset.png",
    tilesW: 8,
    tilesH: 10,
    tileSize: 16,
    offset: 1,
    gap: 2,
  };

  let tilesetImg: HTMLImageElement = new Image();

  const state = {
    xPos: 0,
    yPos: 0,
  };

  const createTilesetMap = () => {
    const tilesetMap: TilesetRecord = {};

    const { offset, gap, tileSize, tilesW, tilesH } = tileset;

    const length = tilesW * tilesH;

    for (let index = 0; index < length; index++) {
      const i = index % tilesW;
      const j = Math.floor(index / tilesW);

      const sx = i * tileSize + gap * i + offset;
      const sy = j * tileSize + gap * j + offset;

      tilesetMap[index + 1] = {
        sx,
        sy,
      };
    }
    return tilesetMap;
  };

  const tilesetRecord = createTilesetMap();

  return {
    data,

    load() {
      const img = new Image();
      img.src = tileset.src;
      tilesetImg = img;
      return new Promise((resolve) => {
        img.addEventListener("load", () => {
          resolve(img);
        });
      });
    },

    setPosition(x: number, y: number) {
      state.xPos = x;
      state.yPos = y;
    },

    getPosition() {
      return {
        xPos: state.xPos,
        yPos: state.yPos,
      };
    },

    getTileSize() {
      return tileset.tileSize;
    },

    draw() {
      const canvasRect = canvasEl.getBoundingClientRect();
      const canvasBox = {
        x: 0,
        y: 0,
        width: canvasRect.width / scale,
        height: canvasRect.height / scale,
      };

      data.forEach((col, i) => {
        col.forEach((row, j) => {
          const tile = data[i][j];

          if (tile === 0) {
            return;
          }

          const { tileSize } = tileset;

          const sx = tilesetRecord[tile].sx;
          const sy = tilesetRecord[tile].sy;
          const size = tileSize;

          const dx = j * tileSize + state.xPos;
          const dy = i * tileSize + state.yPos;

          const tileBox = {
            x: dx,
            y: dy,
            width: tileSize,
            height: tileSize,
          };

          if (boxCompare(canvasBox, tileBox)) {
            ctx?.drawImage(
              tilesetImg,
              sx,
              sy,
              size,
              size,
              dx,
              dy,
              tileSize,
              tileSize
            );
          }
        });
      });
    },
  };
}
