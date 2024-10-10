export default function SpriteSheet(src: string) {
  let spriteSheetImg: HTMLImageElement = new Image();

  return {
    load() {
      const img = new Image();
      img.src = src;
      spriteSheetImg = img;
      return new Promise((resolve) => {
        img.addEventListener("load", () => {
          resolve(img);
        });
      });
    },
    getImage() {
      return spriteSheetImg;
    },
  };
}
