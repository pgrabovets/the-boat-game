"use client";
import type ILevel from "@/types/ILevel";
import { useEffect, useRef, useState } from "react";
import { useMountedState } from "@/hooks/use-mounted-state";
import Game from "@/game/game";

export default function PlayPage() {
  const isMounted = useMountedState();
  const divRef = useRef(null);
  const [levelData, setLeveData] = useState<ILevel | null>(null);

  useEffect(() => {
    if (!isMounted) {
      return;
    }

    fetchLevelData();
  }, [isMounted]);

  useEffect(() => {
    if (divRef.current && levelData) {
      const game = Game(divRef.current, levelData);

      return () => {
        game.detach();
      };
    }
  }, [divRef.current, levelData]);

  const fetchLevelData = () => {
    fetch("/level_01.json")
      .then((res) => {
        return res.json();
      })
      .then((data: ILevel) => {
        setLeveData(data);
      });
  };

  return (
    <div
      className="absolute left-0 top-0 w-full h-full flex justify-center items-center"
      ref={divRef}
    ></div>
  );
}
