import Canvas from "@/core/canvas";
import { Player } from "@/entities/player";
import TileMap from "@/core/tile-map";
import SpriteSheet from "@/core/sprite-sheet";
import { createGameEntity } from "@/core/game";
import { boxCompare } from "@/utils/box-compare";
import Input from "@/core/input";
import Font from "@/core/font";
import StatusBar from "@/entities/status-bar";
import GameOver from "@/entities/game-over";

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

  const gameOver = GameOver(canvas.el, font, config.SCALE);

  let entities: Entity[] = [];

  const position = {
    xPos: 0,
    yPos: 0,
  };

  let time = 0;

  let playing = true;

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

  const checkForEntityCollision = () => {
    const playerRect = player.getRect();

    let isCollided = false;
    let entity: Entity | null = null;

    entities.forEach((item) => {
      const entityRect = item.getRect();
      if (boxCompare(playerRect, entityRect)) {
        isCollided = true;
        entity = item;
      }
    });

    const result: [boolean, Entity | null] = [isCollided, entity];
    return result;
  };

  const initGameState = () => {
    player.setPosition(level.player.xPos, level.player.yPos);

    entities = [];
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
  };

  const init = () => {
    canvas.mount();
    input.startListening();

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

      if (state.enter) {
        startGame();
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

    initGameState();
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

  const startGame = () => {
    playing = true;
    statusBar.resetState();
    initGameState();
    update();
  };

  const endGame = () => {
    playing = false;
  };

  const removeEntity = (entity: Entity) => {
    entities = entities.filter((item) => item !== entity);
  };

  const update = () => {
    const now = performance.now();
    const deltaTime = now - time || now;
    time = now;

    if (!playing) {
      gameOver.draw();
      return;
    }

    player.updateX();
    if (checkForCollision()) {
      player.toPrevX();
    }

    player.updateY();
    if (checkForCollision()) {
      player.toPrevY();
    }

    updateCameraPosition();

    player.update();
    statusBar.setBattery(player.state.battery);
    statusBar.setOxygen(player.state.oxygen);

    player.setOffset(position.xPos, position.yPos);
    tilemap.setPosition(position.xPos, position.yPos);
    entities.forEach((item) => item.setOffset(position.xPos, position.yPos));

    const [isCollided, entity] = checkForEntityCollision();
    if (isCollided && entity?.type) {
      if (entity.type === "battery") {
        player.setBattery(100);
        removeEntity(entity);
      }

      if (entity.type === "oxygen") {
        player.setOxygen(100);
        removeEntity(entity);
      }

      if (entity.type === "chest") {
        removeEntity(entity);
      }

      if (entity.type === "sea_mine") {
        endGame();
        removeEntity(entity);
      }
    }

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
