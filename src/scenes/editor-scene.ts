import loader from "@/core/loader";
import type ICanvas from "@/types/ICanvas";
import { Player } from "@/entities/player";

import type { IPlayer } from "@/types/IPlayer";

export default function EditorScene(canvas: ICanvas) {
  let player: IPlayer | null = null;

  const onKeyDown = (e: KeyboardEvent) => {
    if (!player) return;

    const { xPos, yPos } = player.getPosition();

    if (e.key === "d") {
      player.setDirecction("right");
      player.setPosition(xPos + 1, yPos);
    }

    if (e.key === "a") {
      player.setDirecction("left");
      player.setPosition(xPos - 1, yPos);
    }

    update();
  };

  const onKeyUp = (e: KeyboardEvent) => {};

  const startListening = () => {
    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("keyup", onKeyUp);
  };

  const stopListening = () => {
    document.removeEventListener("keydown", onKeyDown);
    document.removeEventListener("keyup", onKeyUp);
  };

  const init = () => {
    const boatRes = loader.getImage("boat");
    if (boatRes) {
      player = Player(canvas.el, boatRes.img);
      player.setPosition(40, 30);

      startListening();
      update();
    }
  };

  const preload = () => {
    loader.loadImage("boat", "/images/boat_sprite_sheet.png").then(() => {
      init();
    });
  };

  const update = () => {
    if (!player) return;

    canvas.clear();
    player.draw();
  };

  preload();

  return {
    detach() {
      stopListening();
    },
  };
}
