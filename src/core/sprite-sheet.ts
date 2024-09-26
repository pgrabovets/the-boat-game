export default function SpriteSheet() {
  const config = {
    src: "/images/sprites_sheet.png",
  };

  let spriteSheetImg: HTMLImageElement = new Image();

  return {
    load() {
      const img = new Image();
      img.src = config.src;
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
