type Keycodes = {
  LEFT: Record<string, number>;
  RIGHT: Record<string, number>;
  UP: Record<string, number>;
  DOWN: Record<string, number>;
};

export const keycodes: Keycodes = {
  LEFT: {
    a: 1,
  },
  RIGHT: {
    d: 1,
  },
  UP: {
    w: 1,
  },
  DOWN: {
    s: 1,
  },
};

type InputState = {
  left: boolean;
  right: boolean;
  up: boolean;
  down: boolean;
};

export default function Input() {
  const state: InputState = {
    left: false,
    right: false,
    up: false,
    down: false,
  };

  const observers: {
    keyup: ((state: InputState) => void)[];
    keydown: ((state: InputState) => void)[];
  } = {
    keyup: [],
    keydown: [],
  };

  const onKeyDown = (e: KeyboardEvent) => {
    if (keycodes.LEFT[e.key] && !state.left && !state.right) {
      state.left = true;
      observers.keydown.forEach((item) => item(state));
    }

    if (keycodes.RIGHT[e.key] && !state.right && !state.left) {
      state.right = true;
      observers.keydown.forEach((item) => item(state));
    }

    if (keycodes.UP[e.key] && !state.up && !state.down) {
      state.up = true;
      observers.keydown.forEach((item) => item(state));
    }

    if (keycodes.DOWN[e.key] && !state.down && !state.up) {
      state.down = true;
      observers.keydown.forEach((item) => item(state));
    }
  };

  const onKeyUp = (e: KeyboardEvent) => {
    if (keycodes.LEFT[e.key] && state.left) {
      state.left = false;
      observers.keyup.forEach((item) => item(state));
    }

    if (keycodes.RIGHT[e.key] && state.right) {
      state.right = false;
      observers.keyup.forEach((item) => item(state));
    }

    if (keycodes.UP[e.key] && state.up) {
      state.up = false;
      observers.keyup.forEach((item) => item(state));
    }

    if (keycodes.DOWN[e.key] && state.down) {
      state.down = false;
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
