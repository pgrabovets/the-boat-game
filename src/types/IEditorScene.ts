import type ILevel from "@/types/ILevel";

export interface IEditorScene {
  createEntity(name: string): void;
  setCurrentTile(tile: number): void;
  getLevelData(): ILevel;
  detach(): void;
}
