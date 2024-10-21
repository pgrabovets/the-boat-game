type Keycodes = {
  LEFT: Record<string, number>;
  RIGHT: Record<string, number>;
  UP: Record<string, number>;
  DOWN: Record<string, number>;
  ENTER: Record<string, number>;
};

export const keycodes: Keycodes = {
  LEFT: {
    KeyA: 1,
  },
  RIGHT: {
    KeyD: 1,
  },
  UP: {
    KeyW: 1,
  },
  DOWN: {
    KeyS: 1,
  },
  ENTER: {
    Enter: 1,
  },
};

type InputState = {
  left: boolean;
  right: boolean;
  up: boolean;
  down: boolean;
  enter: boolean;
};

export default function Input() {
  const state: InputState = {
    left: false,
    right: false,
    up: false,
    down: false,
    enter: false,
  };

  const observers: {
    keyup: ((state: InputState) => void)[];
    keydown: ((state: InputState) => void)[];
  } = {
    keyup: [],
    keydown: [],
  };

  const onKeyDown = (e: KeyboardEvent) => {
    if (keycodes.LEFT[e.code] && !state.left && !state.right) {
      state.left = true;
      observers.keydown.forEach((item) => item(state));
    }

    if (keycodes.RIGHT[e.code] && !state.right && !state.left) {
      state.right = true;
      observers.keydown.forEach((item) => item(state));
    }

    if (keycodes.UP[e.code] && !state.up && !state.down) {
      state.up = true;
      observers.keydown.forEach((item) => item(state));
    }

    if (keycodes.DOWN[e.code] && !state.down && !state.up) {
      state.down = true;
      observers.keydown.forEach((item) => item(state));
    }

    if (keycodes.ENTER[e.code] && !state.down && !state.up) {
      state.enter = true;
      observers.keydown.forEach((item) => item(state));
    }
  };

  const onKeyUp = (e: KeyboardEvent) => {
    if (keycodes.LEFT[e.code] && state.left) {
      state.left = false;
      observers.keyup.forEach((item) => item(state));
    }

    if (keycodes.RIGHT[e.code] && state.right) {
      state.right = false;
      observers.keyup.forEach((item) => item(state));
    }

    if (keycodes.UP[e.code] && state.up) {
      state.up = false;
      observers.keyup.forEach((item) => item(state));
    }

    if (keycodes.DOWN[e.code] && state.down) {
      state.down = false;
      observers.keyup.forEach((item) => item(state));
    }

    if (keycodes.ENTER[e.code] && !state.down && !state.up) {
      state.enter = false;
      observers.keyup.forEach((item) => item(state));
    }
  };

  const createObservable = (key: "keydown" | "keyup") => {
    return {
      subscribe(observer: (state: InputState) => void) {
        observers[key].push(observer);
      },
    };
  };

  return {
    state,
    startListening() {
      document.addEventListener("keydown", onKeyDown);
      document.addEventListener("keyup", onKeyUp);
    },
    stopListening() {
      document.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("keyup", onKeyUp);
    },
    keyUp: createObservable("keyup"),
    keyDown: createObservable("keydown"),
  };
}
