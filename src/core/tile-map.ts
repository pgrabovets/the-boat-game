import { boxCompare } from "@/utils/box-compare";
import type { ITileMap } from "@/types/ITileMap";
import type { Rectangle } from "@/types/Rectangle";

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

  const getTilesChunk = (rect: Rectangle) => {
    const { tileSize } = tileset;
    const j1 = Math.floor((rect.x - 1) / tileSize) - 1;
    const j2 = Math.floor((rect.x + rect.width) / tileSize) + 1;
    const i1 = Math.floor((rect.y - 1) / tileSize) - 1;
    const i2 = Math.floor((rect.y + rect.height) / tileSize) + 1;

    const tiles: {
      i: number;
      j: number;
      value: number;
    }[] = [];

    for (let i = i1; i <= i2; i++) {
      for (let j = j1; j <= j2; j++) {
        if (data[i] && data[i][j]) {
          const tileCode = data[i][j];
          tiles.push({
            i,
            j,
            value: tileCode,
          });
        }
      }
    }

    return tiles;
  };

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

    getCollisionBoxes(rect: Rectangle) {
      const { tileSize } = tileset;
      const tilesChunk = getTilesChunk(rect);

      const boxes: Rectangle[] = [];

      tilesChunk.forEach((tile) => {
        const dx = tile.j * tileSize + state.xPos;
        const dy = tile.i * tileSize + state.yPos;

        if (tile.value === 3) {
          boxes.push({
            x: dx,
            y: dy,
            width: tileSize,
            height: tileSize,
          });
        }
      });

      return boxes;
    },

    drawCollisionChunk(rect: Rectangle) {
      const { tileSize } = tileset;
      const tiles = getTilesChunk(rect);

      tiles.forEach((tile) => {
        if (tile.value === 3) {
          const sx = tilesetRecord[6].sx;
          const sy = tilesetRecord[6].sy;
          const dx = tile.j * tileSize + state.xPos;
          const dy = tile.i * tileSize + state.yPos;
          ctx?.drawImage(
            tilesetImg,
            sx,
            sy,
            tileSize,
            tileSize,
            dx,
            dy,
            tileSize,
            tileSize
          );
        }
      });
    },

    getMapSize() {
      const { tileSize } = tileset;
      return {
        width: data[0].length * tileSize,
        height: data.length * tileSize,
      };
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
