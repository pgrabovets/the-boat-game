"use client";
import { createPortal } from "react-dom";
import { useWindowSize } from "@/hooks/use-window-size";
import { useEffect, useState, useRef } from "react";
import { Button } from "flowbite-react";
import { Play } from "lucide-react";
import EditorScene from "@/scenes/editor-scene";

export default function Editor() {
  const canvasRef = useRef(null);
  const [size] = useWindowSize();
  const [isMounted, setIsMounted] = useState(false);
  const now = Date.now();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    let dispose = null;

    if (canvasRef?.current) {
      const scene = EditorScene(canvasRef.current);
      scene.preload().then(() => {
        scene.init();
      });
      dispose = scene.startListening();
    }

    return () => {
      dispose && dispose();
    };
  }, [isMounted, size, canvasRef.current]);

  return (
    <>
      <div className="flex flex-row absolute inset-0">
        <div className="w-[320px] bg-slate-50 p-2">
          <Button color="dark">
            <div className="flex flex-row items-center gap-1">
              <Play size={16} /> Run
            </div>
          </Button>
        </div>
      </div>
      {isMounted &&
        createPortal(
          <canvas
            key={now}
            width={size.width - 320}
            ref={canvasRef}
            height={size.height}
            className="ml-[320px]"
          ></canvas>,
          document.body
        )}
    </>
  );
}
