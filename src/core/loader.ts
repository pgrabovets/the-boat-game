type ImageRes = {
  name: string;
  src: string;
  img: HTMLImageElement;
};

const images: ImageRes[] = [];

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

export default {
  loadImage,
  getImage,
};
