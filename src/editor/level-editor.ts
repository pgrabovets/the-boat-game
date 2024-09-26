import Canvas from "@/core/canvas";
import { Player } from "@/entities/player";
import TileMap from "@/core/tile-map";
import SpriteSheet from "@/core/sprite-sheet";
import type Entity from "@/types/Entity";
import type ILevel from "@/types/ILevel";
import { createGameEntity } from "@/core/game";

export default function LevelEditor(level: ILevel) {
  const canvas = Canvas(document.body, 320);

  const player = Player(canvas.el);
  const tilemap = TileMap(canvas.el, level.tilemap);
  const spriteSheet = SpriteSheet();

  const position = {
    xPos: 0,
    yPos: 0,
  };

  let currentTile = 0;

  let entities: Entity[] = [];

  let newEntity: Entity | null = null;

  const onKeyDown = (e: KeyboardEvent) => {
    if (!tilemap) {
      return;
    }

    const tileSize = tilemap.getTileSize();

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

      const xPos = x - tilemapPos.xPos;
      const yPos = y - tilemapPos.yPos;
      const tileSize = tilemap.getTileSize();

      const j = Math.floor(xPos / tileSize);
      const i = Math.floor(yPos / tileSize);

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
  };

  const preload = () => {
    Promise.all([spriteSheet.load(), player.load(), tilemap.load()]).then(
      () => {
        init();
        update();
      }
    );
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
      newEntity = createGameEntity(canvas.el, key, spriteSheet.getImage());
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
