import loader from "@/core/loader";
import Canvas from "@/core/canvas";
import { Player } from "@/entities/player";
import TileMap from "@/core/tile-map";
import type { ITileMap } from "@/types/ITileMap";
import type Entity from "@/types/Entity";
import type ILevel from "@/types/ILevel";
import { createGameEntity } from "@/core/game";

const config = {
  canvasScaleFactor: 2,
  canvasOffset: 320,
};

const tilesetConfig = {
  tilesW: 8,
  tilesH: 10,
  tileSize: 16,
  offset: 1,
  gap: 2,
};

export default function EditorScene() {
  const canvas = Canvas(
    document.body,
    config.canvasOffset,
    config.canvasScaleFactor
  );

  let player = Player(canvas.el);
  let tilemap: ITileMap | null = null;

  const position = {
    xPos: 0,
    yPos: 0,
  };

  let currentTile = 0;

  let entities: Entity[] = [];

  let newEntity: Entity | null = null;

  const onKeyDown = (e: KeyboardEvent) => {
    const { tileSize } = tilesetConfig;

    if (e.key === "ArrowUp") {
      position.yPos -= tileSize;
    }
    if (e.key === "ArrowDown") {
      position.yPos += tileSize;
    }
    if (e.key === "ArrowLeft") {
      position.xPos -= tileSize;
    }
    if (e.key === "ArrowRight") {
      position.xPos += tileSize;
    }

    update();
  };

  const onKeyUp = (e: KeyboardEvent) => {};

  const handleResize = () => {
    update();
  };

  const editTileMap = (x: number, y: number) => {
    if (tilemap) {
      const tilemapPos = tilemap.getPosition();

      let xPos = x - tilemapPos.xPos;

      const yPos = y - tilemapPos.yPos;

      const j = Math.floor(xPos / tilesetConfig.tileSize);
      const i = Math.floor(yPos / tilesetConfig.tileSize);

      if (i >= 0 && j >= 0) {
        const tile: number = tilemap.data[i][j];
        if (tile !== undefined) {
          tilemap.data[i][j] = currentTile;
          update();
        }
      }
    }
  };

  const removeEntityByClick = (e: MouseEvent) => {
    const { xPos, yPos } = canvas.getMousePosition(e);
    entities = entities.filter((item) => {
      const x = xPos - position.xPos;
      const y = yPos - position.yPos;
      return !item.pointCheck(x, y);
    });
  };

  const handleMouseClick = (e: MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (e.target === canvas.el) {
      const { xPos, yPos } = canvas.getMousePosition(e);

      if (newEntity) {
        entities.push(newEntity);
        newEntity = null;
        update();
        return;
      }

      if (e.ctrlKey) {
        removeEntityByClick(e);
        return;
      }

      editTileMap(xPos, yPos);
    }
  };

  const handleMouseMove = (e: MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (e.target === canvas.el) {
      const { xPos, yPos } = canvas.getMousePosition(e);

      if (newEntity) {
        const size = newEntity?.getSize();
        newEntity.setOffset(position.xPos, position.yPos);
        const x = xPos - size.width - position.xPos;
        const y = yPos - size.height - position.yPos;
        newEntity.setPosition(x, y);
        draw();
        return;
      }

      if (e.type === "mousemove" && e.buttons === 1) {
        editTileMap(xPos, yPos);
        return;
      }
    }
  };

  const startListening = () => {
    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("keyup", onKeyUp);
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("click", handleMouseClick);
    window.addEventListener("resize", handleResize);
  };

  const stopListening = () => {
    document.removeEventListener("keydown", onKeyDown);
    document.removeEventListener("keyup", onKeyUp);
    document.removeEventListener("mousemove", handleMouseMove);
    document.removeEventListener("click", handleMouseClick);
    window.removeEventListener("resize", handleResize);
  };

  const init = () => {
    canvas.mount();

    const boatRes = loader.getImage("boat");
    const tilesetRes = loader.getImage("tileset");
    const levelRes = loader.getLevel("level_01");
    const sprites = loader.getImage("sprites_sheet");

    if (tilesetRes && levelRes && boatRes && sprites) {
      tilemap = TileMap(
        canvas.el,
        tilesetConfig,
        tilesetRes.img,
        levelRes.level.tilemap
      );

      player.setSpritSheetImg(boatRes.img);
      player.setPosition(
        levelRes.level.player.xPos,
        levelRes.level.player.yPos
      );

      levelRes.level.entities.forEach((item) => {
        const entity = createGameEntity(canvas.el, item.type, sprites.img);
        if (entity) {
          entity.setPosition(item.xPos, item.yPos);
          entities.push(entity);
        }
      });

      startListening();
    }
  };

  const preload = () => {
    Promise.all([
      loader.loadImage("boat", "/images/boat_sprite_sheet.png"),
      loader.loadImage("sprites_sheet", "/images/sprites_sheet.png"),
      loader.loadImage("tileset", "/images/tileset.png"),
      loader.loadLevel("level_01", "/level_01.json"),
    ]).then(() => {
      init();
      update();
    });
  };

  const draw = () => {
    canvas.clear();

    tilemap?.draw();
    entities.forEach((item) => item.draw());
    newEntity?.draw();
    player.draw();
  };

  const update = () => {
    tilemap?.setPosition(position.xPos, position.yPos);
    player.setOffset(position.xPos, position.yPos);
    entities.forEach((item) => item.setOffset(position.xPos, position.yPos));

    draw();
  };

  preload();

  return {
    getLevelData() {
      const level: ILevel = {
        player: player.getPosition(),
        tilemap: tilemap?.data || [[]],
        entities: entities.map((item) => {
          const { xPos, yPos } = item.getPosition();
          return {
            type: item.type,
            xPos: xPos,
            yPos: yPos,
          };
        }),
      };
      return level;
    },

    createEntity(key: string) {
      const sprites = loader.getImage("sprites_sheet");
      if (!sprites) {
        return;
      }
      newEntity = createGameEntity(canvas.el, key, sprites.img);
    },

    setCurrentTile(tile: number) {
      currentTile = tile;
    },

    detach() {
      stopListening();
      canvas.detach();
    },
  };
}
