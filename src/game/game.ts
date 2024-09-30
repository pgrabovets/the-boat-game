import Canvas from "@/core/canvas";
import { Player } from "@/entities/player";
import TileMap from "@/core/tile-map";
import SpriteSheet from "@/core/sprite-sheet";
import { createGameEntity } from "@/core/game";
import { keycodes } from "@/core/input";
import { boxCompare } from "@/utils/box-compare";

import type ILevel from "@/types/ILevel";
import type Entity from "@/types/Entity";

const FPS = 1;

export default function Game(target: HTMLElement, level: ILevel) {
  const config = {
    SCALE: 2,
    OFFSET: 0,
  };

  const canvas = Canvas(target, config.OFFSET, config.SCALE);
  const msPerFrame = 1000 / FPS;

  const player = Player(canvas.el);
  const tilemap = TileMap(canvas.el, level.tilemap, config.SCALE);
  const spriteSheet = SpriteSheet();

  let entities: Entity[] = [];

  const position = {
    xPos: 0,
    yPos: 0,
  };

  let time = 0;

  const onKeyDown = (e: KeyboardEvent) => {
    if (keycodes.LEFT[e.key]) {
      player.startMoveLeft();
    }

    if (keycodes.RIGHT[e.key]) {
      player.startMoveRight();
    }

    if (keycodes.UP[e.key]) {
      player.startMoveUp();
    }

    if (keycodes.DOWN[e.key]) {
      player.startMoveDown();
    }
  };

  const onKeyUp = (e: KeyboardEvent) => {
    if (keycodes.LEFT[e.key] || keycodes.RIGHT[e.key]) {
      player.stopMoveX();
    }

    if (keycodes.UP[e.key] || keycodes.DOWN[e.key]) {
      player.stopMoveY();
    }
  };

  const handleResize = () => {
    update();
  };

  const startListening = () => {
    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("keyup", onKeyUp);
    window.addEventListener("resize", handleResize);
  };

  const stopListening = () => {
    document.removeEventListener("keydown", onKeyDown);
    document.removeEventListener("keyup", onKeyUp);
    window.removeEventListener("resize", handleResize);
  };

  const checkForCollision = () => {
    const playerRect = player.getRect();
    const tileBoxes = tilemap.getCollisionBoxes(playerRect);
    const playerBoxes = player.getCollisionBoxes();

    let isCollided = false;

    playerBoxes.forEach((box1) => {
      tileBoxes.forEach((box2) => {
        if (boxCompare(box1, box2)) {
          isCollided = true;
        }
      });
    });

    return isCollided;
  };

  const init = () => {
    canvas.mount();

    player.setPosition(level.player.xPos, level.player.yPos);

    level.entities.forEach((item) => {
      const entity = createGameEntity(
        canvas.el,
        item.type,
        spriteSheet.getImage()
      );
      if (entity) {
        entity.setPosition(item.xPos, item.yPos);
        entities.push(entity);
      }
    });

    startListening();
    update();
  };

  const update = () => {
    const now = performance.now();
    const deltaTime = now - time || now;
    time = now;

    player.update();
    if (checkForCollision()) {
      player.toPrevStep();
    }

    position.xPos = (player.state.xPos - 430) * -1;
    position.yPos = (player.state.yPos - 272) * -1;

    player.setOffset(position.xPos, position.yPos);
    tilemap.setPosition(position.xPos, position.yPos);
    entities.forEach((item) => item.setOffset(position.xPos, position.yPos));

    draw();
    scheduleNextUpdate();
  };

  const scheduleNextUpdate = () => {
    requestAnimationFrame(() => {
      update();
    });
  };

  const draw = () => {
    canvas.clear();

    tilemap?.draw();
    entities.forEach((item) => item.draw());

    const rect = player.getRect();
    tilemap.drawCollisionChunk(rect);

    player.draw();
  };

  const preload = () => {
    Promise.all([spriteSheet.load(), player.load(), tilemap.load()]).then(
      () => {
        init();
      }
    );
  };

  preload();

  return {
    detach() {
      stopListening();
      canvas.detach();
    },
  };
}
