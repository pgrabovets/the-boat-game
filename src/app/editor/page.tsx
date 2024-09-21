"use client";
import { useEffect, useState } from "react";
import { Button } from "flowbite-react";
import { Play } from "lucide-react";
import TilesetTool from "@/app/components/tileset-tool";
import EntityTool from "@/app/components/entity-tool";
import EditorScene from "@/scenes/editor-scene";
import { mapGenerate } from "@/editor/map-generate";
import { saveMapData } from "@/app/actions";
import type { IEditorScene } from "@/types/IEditorScene";

export default function Editor() {
  const [isMounted, setIsMounted] = useState(false);
  const [tile, setTile] = useState(1);
  const [scene, setScene] = useState<IEditorScene | null>(null);
  const [isGeneratingMap, setIsGenerationgMap] = useState(false);

  const LEVEL_NAME = "test_level";

  const handleTileSelect = (index: number) => {
    setTile(index + 1);
  };

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!isMounted) {
      return;
    }

    const scene = EditorScene();
    scene.setCurrentTile(tile);
    setScene(scene);

    return () => {
      scene.detach();
    };
  }, [isMounted]);

  useEffect(() => {
    scene?.setCurrentTile(tile);
  }, [tile]);

  const handleGenerateMap = () => {
    setIsGenerationgMap(true);
    mapGenerate((data) => {
      saveMapData(LEVEL_NAME, data);
      setIsGenerationgMap(false);
    });
  };

  const handleSaveMap = () => {
    const data = scene?.getTilemapData();
    if (data) {
      saveMapData(LEVEL_NAME, data);
    }
  };

  const handleEntityCreate = (key: string) => {
    scene?.createEntity(key);
  };

  return (
    <div className="absolute inset-0 w-[320px] h-[100vh] p-2">
      <div className="flex flex-col gap-4 h-full">
        <div className="flex gap-2">
          <Button color="dark">
            <div className="flex flex-row items-center gap-1">
              <Play size={16} /> Run
            </div>
          </Button>
        </div>
        <div className="flex flex-row flex-wrap gap-2">
          <Button
            isProcessing={isGeneratingMap}
            color="light"
            onClick={handleGenerateMap}
          >
            Generate map
          </Button>
          <Button color="light" onClick={handleSaveMap}>
            Save map
          </Button>
        </div>
        <div>
          <p>Tile: {tile}</p>
          <div className="flex justify-center py-2 rounded-lg border border-gray-300">
            <TilesetTool onTileSelect={handleTileSelect} />
          </div>
        </div>

        <div>
          <EntityTool onSelect={handleEntityCreate} />
        </div>
      </div>
    </div>
  );
}
