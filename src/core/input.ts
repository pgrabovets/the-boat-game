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
