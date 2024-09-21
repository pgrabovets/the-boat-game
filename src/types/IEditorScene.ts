export interface IEditorScene {
  getTilemapData(): number[][] | null;
  createEntity(name: string): void;
  setCurrentTile(tile: number): void;
  detach(): void;
}
