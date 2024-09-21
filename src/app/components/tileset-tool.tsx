"use client";

import { useEffect, useRef, useState } from "react";

type Props = {
  onTileSelect?: (index: number) => void;
};

function TilesetTool({ onTileSelect }: Props) {
  const [active, setActive] = useState(0);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [img, seetImg] = useState<HTMLImageElement | null>(null);

  const tilesetSrc = "/images/tileset.png";

  const width = 288;
  const height = 360;

  const createTilesetArray = () => {
    const col = 8;
    const row = 10;
    const size = col * row;
    const arr: number[] = [];
    for (let index = 0; index < size; index++) {
      arr.push(index);
    }
    return arr;
  };

  const tiles = createTilesetArray();

  const handleTileClick = (index: number) => {
    setActive(index);
    onTileSelect && onTileSelect(index);
  };

  useEffect(() => {
    const img = new Image();
    img.src = tilesetSrc;

    img.addEventListener("load", () => {
      seetImg(img);
    });
  }, []);

  useEffect(() => {
    if (img && canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.imageSmoothingEnabled = false;
        ctx.save();
        ctx.scale(2, 2);
        ctx.drawImage(img, 0, 0);
        ctx.restore();
      }
    }
  }, [img, canvasRef.current]);

  return (
    <div className="relative w-[288px] h-[360px]">
      <canvas ref={canvasRef} width={width} height={height} />
      <div className="absolute inset-0 grid grid-cols-8 grid-rows-10">
        {tiles.map((tile) => (
          <div
            key={tile}
            className={`${
              active === tile ? "border-2 border-black" : ""
            } hover:cursor-pointer rounded-md flex justify-center items-center`}
            onClick={() => {
              handleTileClick(tile);
            }}
          ></div>
        ))}
      </div>
    </div>
  );
}

export default TilesetTool;
