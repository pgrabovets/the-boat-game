export default function TileMap(
  canvasEl: any,
  tilesetImg: any,
  data: number[][]
) {
  const canvas = canvasEl;
  const ctx = canvasEl.getContext("2d");

  const config = {
    tileWidth: 16,
    tileHeight: 16,
    tileSize: 16,
    offset: 1,
  };

  const state = {
    xPos: 0,
    yPos: 0,
  };

  return {
    draw() {
      //
    },
  };
}
