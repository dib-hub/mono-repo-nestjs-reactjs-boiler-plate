// Make all properties of T required
export type Required<T> = {
  [P in keyof T]-?: T[P];
};

// Make all properties of T readonly
export type ReadOnly<T> = {
  readonly [P in keyof T]: T[P];
};

// Pick specific properties from T
export type Subset<T, K extends keyof T> = {
  [P in K]: T[P];
};

// Omit is already in TS lib, but we can define custom ones
export type WithId<T> = T & {
  id: string;
};

export type WithTimestamps<T> = T & {
  createdAt: Date;
  updatedAt: Date;
};

export type Nullable<T> = T | null;

export type Optional<T> = T | undefined;
