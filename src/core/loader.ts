import type ILevel from "@/types/ILevel";

export type ImageRes = {
  name: string;
  src: string;
  img: HTMLImageElement;
};

export type TileMapRes = {
  name: string;
  data: number[][];
};

const images: ImageRes[] = [];
const tilemaps: TileMapRes[] = [];

const levels: { name: string; level: ILevel }[] = [];

function loadImage(name: string, src: string): Promise<ImageRes> {
  const image = images.find((item) => {
    return item.name === name;
  });

  if (image) {
    return Promise.resolve(image);
  }

  const img = new Image();
  img.src = src;

  return new Promise((resolve) => {
    img.addEventListener("load", () => {
      const imgRes = {
        name: name,
        src: src,
        img: img,
      };
      images.push(imgRes);
      resolve(imgRes);
    });
  });
}

function getImage(name: string) {
  return images.find((item) => {
    return name === item.name;
  });
}

function loadTileMap(name: string, url: string) {
  return fetch(url)
    .then((res) => {
      return res.json();
    })
    .then((data) => {
      tilemaps.push({
        name: name,
        data: data,
      });
      return data;
    });
}

function getTileMap(name: string) {
  return tilemaps.find((item) => {
    return name === item.name;
  });
}

function loadLevel(name: string, url: string): Promise<ILevel> {
  return fetch(url)
    .then((res) => {
      return res.json();
    })
    .then((data: ILevel) => {
      levels.push({
        name: name,
        level: data,
      });
      return data;
    });
}

function getLevel(name: string) {
  return levels.find((item) => {
    return name === item.name;
  });
}

export default {
  loadImage,
  getImage,
  loadTileMap,
  loadLevel,
  getLevel,
  getTileMap,
};
