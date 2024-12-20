export type ROM = {
  A: number;
  B: number;
  C: number;
  P: number[];
};

export const sample: ROM = {
  A: 729,
  B: 0,
  C: 0,
  P: [0, 1, 5, 4, 3, 0],
};

export const sample2: ROM = {
  A: 56,
  B: 0,
  C: 0,
  P: [2, 4, 1, 1, 7, 5, 1, 5, 4, 2, 5, 5, 0, 3, 3, 0],
};

export const sample3: ROM = {
  A: 0,
  B: 0,
  C: 0,
  P: [0, 3, 5, 3, 4, 2, 1, 5, 7, 5, 1, 1, 2, 4],
};

export const sample4: ROM = {
  A: 0,
  B: 0,
  C: 1,
  P: [0, 3, 5, 0, 4, 2, 1, 5, 7, 5, 1, 1, 2, 4],
};
