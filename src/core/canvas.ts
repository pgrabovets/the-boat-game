export default function Canvas(target: HTMLElement, offsetLeft: number) {
  const canvas = document.createElement("canvas");
  const canvasCtx = canvas.getContext("2d");
  const scale = 2;

  const init = () => {
    canvas.style.marginLeft = `${offsetLeft}px`;
    canvas.width = window.innerWidth - offsetLeft;
    canvas.height = window.innerHeight;
    canvas.className = "canvas-bg-color";
    if (canvasCtx) {
      canvasCtx.imageSmoothingEnabled = false;
      canvasCtx.scale(scale, scale);
    }
  };

  const handleResize = () => {
    init();
  };

  window.addEventListener("resize", handleResize);
  init();

  return {
    el: canvas,
    ctx: canvasCtx,

    getCanvasSize() {
      return {
        width: canvas.width,
        height: canvas.height,
      };
    },

    getMousePosition(e: MouseEvent) {
      return {
        xPos: Math.floor((e.x - offsetLeft) / scale),
        yPos: Math.floor(e.y / scale),
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
