import SpriteSheet from "@/core/sprite-sheet";
import type { IFont } from "@/types/IFont";

const fontMap = [
  [0, 4],
  [5, 1],
  [7, 3],
  [11, 5],
  [17, 4],
  [22, 5],
  [28, 5],
  [34, 1],
  [36, 2],
  [39, 2],
  [42, 3],
  [46, 3],
  [50, 2],
  [53, 3],
  [57, 1],
  [59, 5],
  [65, 4],
  [70, 2],
  [73, 4],
  [78, 4],
  [83, 4],
  [88, 4],
  [93, 4],
  [98, 4],
  [103, 4],
  [108, 4],
  [113, 1],
  [115, 1],
  [117, 3],
  [121, 3],
  [125, 3],
  [129, 4],
  [134, 5],
  [140, 4],
  [145, 4],
  [150, 3],
  [154, 4],
  [159, 3],
  [163, 3],
  [167, 4],
  [172, 4],
  [177, 3],
  [181, 4],
  [186, 4],
  [191, 3],
  [195, 5],
  [201, 4],
  [206, 4],
  [211, 0],
  [216, 4],
  [221, 4],
  [226, 4],
  [231, 3],
  [235, 4],
  [240, 4],
  [245, 5],
  [251, 4],
  [256, 4],
  [261, 3],
  [265, 2],
  [268, 5],
  [274, 2],
  [277, 3],
  [281, 4],
  [286, 2],
  [289, 4],
  [294, 4],
  [299, 3],
  [303, 4],
  [308, 4],
  [313, 3],
  [317, 4],
  [322, 4],
  [327, 1],
  [329, 2],
  [332, 4],
  [337, 1],
  [339, 5],
  [345, 4],
  [350, 4],
  [355, 4],
  [360, 4],
  [365, 3],
  [369, 4],
  [374, 3],
  [378, 4],
  [383, 4],
  [388, 5],
  [394, 3],
  [398, 4],
  [403, 4],
  [408, 1],
  [412, 1],
  [414, 3],
  [418, 4],
];

export default function Font(canvas: HTMLCanvasElement): IFont {
  const canvasCtx = canvas.getContext("2d");
  const font = SpriteSheet("/images/04b03.font.png");

  const firstChar = 32;
  const height = 7;

  const state = {
    xPos: 0,
    yPos: 0,
  };

  return {
    load() {
      return font.load();
    },
    setPosition(x: number, y: number) {
      state.xPos = x;
      state.yPos = y;
    },
    draw(str: string) {
      const img = font.getImage();
      const line = str.split("");

      let offset = 0;

      line.forEach((char) => {
        const code = char.charCodeAt(0);
        const index = code - firstChar;
        const [sx, width] = fontMap[index];
        const sy = 0;

        canvasCtx?.drawImage(
          img,
          sx,
          sy,
          width,
          height,
          state.xPos + offset,
          state.yPos,
          width,
          height
        );

        offset = offset + width + 1;
      });
    },
  };
}
