import Canvas from "@/core/canvas";
import { Player } from "@/entities/player";
import TileMap from "@/core/tile-map";
import SpriteSheet from "@/core/sprite-sheet";
import { createGameEntity } from "@/core/game";
import { boxCompare } from "@/utils/box-compare";
import Input from "@/core/input";
import Font from "@/core/font";
import StatusBar from "@/entities/status-bar";

import type ILevel from "@/types/ILevel";
import type Entity from "@/types/Entity";

const FPS = 1;

export default function Game(target: HTMLElement, level: ILevel) {
  const config = {
    debug: false,
    SCALE: 2,
    OFFSET: 0,
  };

  const canvas = Canvas(target, config.OFFSET, config.SCALE);
  const msPerFrame = 1000 / FPS;

  const player = Player(canvas.el, config.debug);
  const tilemap = TileMap(canvas.el, level.tilemap, config.SCALE);
  const spriteSheet = SpriteSheet("/images/sprites_sheet.png");
  const font = Font(canvas.el);
  const statusBar = StatusBar(canvas.el, font);
  const input = Input();

  let entities: Entity[] = [];

  const position = {
    xPos: 0,
    yPos: 0,
  };

  let time = 0;

  const getCameraCenter = () => {
    const canvasSize = canvas.getCanvasSize();
    const playerRect = player.getRect();

    const x = Math.floor(
      canvasSize.width / config.SCALE / 2 - playerRect.width / 2
    );
    const y = Math.floor(
      canvasSize.height / config.SCALE / 2 - playerRect.height / 2
    );

    return {
      x,
      y,
    };
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
    input.startListening();

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

    input.keyDown.subscribe((state) => {
      if (state.left) {
        player.startMoveLeft();
      }

      if (state.right) {
        player.startMoveRight();
      }

      if (state.up) {
        player.startMoveUp();
      }

      if (state.down) {
        player.startMoveDown();
      }
    });

    input.keyUp.subscribe((state) => {
      if (!state.left && !state.right) {
        player.stopMoveX();
      }

      if (!state.up && !state.down) {
        player.stopMoveY();
      }
    });

    update();
  };

  const updateCameraPosition = () => {
    const center = getCameraCenter();
    position.xPos = (player.state.xPos - center.x) * -1;
    position.yPos = (player.state.yPos - center.y) * -1;

    if (position.xPos > 0) {
      position.xPos = 0;
    }

    if (position.yPos > 0) {
      position.yPos = 0;
    }

    const tilemapSize = tilemap.getMapSize();
    const canvasSize = canvas.getCanvasSize();
    const w = Math.floor(canvasSize.width / config.SCALE) - tilemapSize.width;
    const h = Math.floor(canvasSize.height / config.SCALE) - tilemapSize.height;

    if (position.xPos < w) {
      position.xPos = w;
    }

    if (position.yPos < h) {
      position.yPos = h;
    }
  };

  const update = () => {
    const now = performance.now();
    const deltaTime = now - time || now;
    time = now;

    player.update();
    statusBar.setBattery(player.state.battery);

    player.updateX();
    if (checkForCollision()) {
      player.toPrevX();
    }

    player.updateY();
    if (checkForCollision()) {
      player.toPrevY();
    }

    updateCameraPosition();

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
    config.debug && tilemap.drawCollisionChunk(rect);

    player.draw();
    statusBar.draw();
  };

  const preload = () => {
    Promise.all([
      spriteSheet.load(),
      player.load(),
      tilemap.load(),
      font.load(),
    ]).then(() => {
      init();
    });
  };

  preload();

  return {
    detach() {
      input.stopListening();
      canvas.detach();
    },
  };
}
