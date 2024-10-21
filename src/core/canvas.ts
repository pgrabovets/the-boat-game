export default function Canvas(target: HTMLElement, offsetLeft = 0, scale = 1) {
  const canvas = document.createElement("canvas");
  const canvasCtx = canvas.getContext("2d");

  const init = () => {
    canvas.style.marginLeft = `${offsetLeft}px`;

    let w = window.innerWidth;
    let h = window.innerHeight;

    if (offsetLeft === 0) {
      if (w > 1280) {
        w = 1280;
      }

      if (h > 960) {
        h = 960;
      }
    }

    canvas.width = w - offsetLeft;
    canvas.height = h;
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
