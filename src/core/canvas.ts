import type ICanvas from "@/types/ICanvas";

export default function Canvas(target: HTMLElement, offset: number): ICanvas {
  const canvas = document.createElement("canvas");
  const canvasCtx = canvas.getContext("2d");
  canvas.style.marginLeft = `${offset}px`;
  canvas.width = window.innerWidth - offset;
  canvas.height = window.innerHeight;

  if (canvasCtx) {
    canvasCtx.imageSmoothingEnabled = false;
    canvasCtx.scale(2, 2);
  }

  const handleResize = () => {
    canvas.width = window.innerWidth - offset;
    canvas.height = window.innerHeight;
  };

  window.addEventListener("resize", handleResize);

  return {
    el: canvas,
    ctx: canvasCtx,

    getCanvasSize() {
      return {
        width: canvas.width,
        height: canvas.height,
      };
    },

    clear() {
      canvasCtx?.clearRect(0, 0, canvas.width, canvas.height);
    },

    mount() {
      target.appendChild(canvas);
    },

    detach() {
      window.removeEventListener("resize", handleResize);
      target.removeChild(canvas);
    },
  };
}
