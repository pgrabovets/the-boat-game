type TilesetRecord = Record<
  number,
  {
    sx: number;
    sy: number;
  }
>;

type Config = {
  tilesW: number;
  tilesH: number;
  tileSize: number;
  offset: number;
  gap: number;
};

export default function TileMap(
  canvasEl: HTMLCanvasElement,
  config: Config,
  tilesetImg: any,
  data: number[][]
) {
  const canvas = canvasEl;
  const ctx = canvasEl.getContext("2d");

  const state = {
    xPos: 0,
    yPos: 0,
  };

  const createTilesetMap = () => {
    const tilesetMap: TilesetRecord = {};

    const { offset, gap, tileSize, tilesW, tilesH } = config;

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

    draw() {
      if (ctx === null) return;

      data.forEach((col, i) => {
        col.forEach((row, j) => {
          const tile = data[i][j];

          if (tile === 0) {
            return;
          }

          const { tileSize } = config;

          const sx = tilesetRecord[tile].sx;
          const sy = tilesetRecord[tile].sy;
          const size = tileSize;

          const dx = j * tileSize + state.xPos;
          const dy = i * tileSize + state.yPos;

          ctx.drawImage(
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
        });
      });
    },
  };
}
