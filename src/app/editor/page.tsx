"use client";
import { useEffect, useState } from "react";
import { Button } from "flowbite-react";
import { Play } from "lucide-react";
import TilesetTool from "@/app/components/tileset-tool";
import EntityTool from "@/app/components/entity-tool";
import LevelEditor from "@/editor/level-editor";
import { generateLevelData } from "@/editor/map-generate";
import { saveLevelData } from "@/app/actions";
import type { IEditorScene } from "@/types/IEditorScene";
import type ILevel from "@/types/ILevel";

export default function Editor() {
  const [isMounted, setIsMounted] = useState(false);
  const [tile, setTile] = useState(1);
  const [level, setLevel] = useState<IEditorScene | null>(null);
  const [isGeneratingMap, setIsGenerationgMap] = useState(false);

  const handleTileSelect = (index: number) => {
    setTile(index + 1);
  };

  const fetchLevelData = () => {
    fetch("/level_01.json")
      .then((res) => {
        return res.json();
      })
      .then((data: ILevel) => {
        const level = LevelEditor(data);
        level.setCurrentTile(tile);
        setLevel(level);
      });
  };

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!isMounted) {
      return;
    }
    fetchLevelData();
    return () => {
      level?.detach();
    };
  }, [isMounted]);

  useEffect(() => {
    level?.setCurrentTile(tile);
  }, [tile]);

  const handleGenerateMap = () => {
    setIsGenerationgMap(true);
    generateLevelData((data) => {
      const levelData: ILevel = {
        player: {
          xPos: 0,
          yPos: 0,
        },
        entities: [],
        tilemap: data,
      };
      level?.detach();
      setIsGenerationgMap(false);

      saveLevelData("level_01", levelData).then(() => {
        fetchLevelData();
      });
    });
  };

  const handleSaveMap = () => {
    if (!level) {
      return;
    }
    saveLevelData("level_01", level.getLevelData());
  };

  const handleEntityCreate = (key: string) => {
    level?.createEntity(key);
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
            Generate level
          </Button>
          <Button color="light" onClick={handleSaveMap}>
            Save level
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
