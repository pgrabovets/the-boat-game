import loader from "@/core/loader";
import { Player } from "@/entities/player";

import type IPlayer from "@/types/IPlayer";

export default function EditorScene(canvasEl: any) {
  const canvas = canvasEl;
  const canvasCtx = canvasEl.getContext("2d");

  canvasCtx.imageSmoothingEnabled = false;
  canvasCtx.scale(2, 2);

  let player: IPlayer | null = null;

  const onKeyDown = (e: KeyboardEvent) => {
    if (player) {
      const { xPos, yPos } = player.getPosition();
      player.setPosition(xPos + 1, yPos);
      player.draw();
    }
  };

  const onKeyUp = (e: KeyboardEvent) => {};

  const startListening = () => {
    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("keyup", onKeyUp);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("keyup", onKeyUp);
    };
  };

  const init = () => {
    const boatRes = loader.getImage("boat");
    if (boatRes) {
      player = Player(canvas, boatRes.img);
      player.setPosition(40, 30);
      player.draw();
    }
  };

  const preload = () => {
    return loader.loadImage("boat", "/images/boat_sprite_sheet.png");
  };

  return {
    preload,
    init,
    startListening,
  };
}
