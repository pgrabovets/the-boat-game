"use client";
import { useEffect, useState } from "react";
import { Button } from "flowbite-react";
import { Play } from "lucide-react";
import EditorScene from "@/scenes/editor-scene";
import Canvas from "@/core/canvas";

export default function Editor() {
  const [cursorPos, setCursorPos] = useState("");
  const [isMounted, setIsMounted] = useState(false);
  const canvasOffset = 320;

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!isMounted) {
      return;
    }

    const canvas = Canvas(document.body, canvasOffset);
    canvas.mount();
    const scene = EditorScene(canvas);

    return () => {
      canvas.detach();
      scene.detach();
    };
  }, [isMounted]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setCursorPos(`${e.x} ${e.y}`);
    };

    document.addEventListener("mousemove", handleMouseMove);

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  return (
    <div className="absolute inset-0 w-[320px] h-[100vh] bg-slate-50 p-2">
      <div className="flex flex-col justify-between h-full">
        <div>
          <Button color="dark">
            <div className="flex flex-row items-center gap-1">
              <Play size={16} /> Run
            </div>
          </Button>
        </div>
        <div className="text-sm">{cursorPos}</div>
      </div>
    </div>
  );
}
