export interface StringFilter {
  eq?: string;
  ne?: string;
  like?: string;
  ilike?: string;
  in?: string[];
}

export interface BooleanFilter {
  eq?: boolean;
}

export interface NumberFilter {
  eq?: number;
  gt?: number;
  gte?: number;
  lt?: number;
  lte?: number;
}

export interface DateFilter {
  eq?: Date;
  gt?: Date;
  gte?: Date;
  lt?: Date;
  lte?: Date;
}

type MapTypeToFilter<V> = V extends string
  ? StringFilter
  : V extends number
    ? NumberFilter
    : V extends boolean
      ? BooleanFilter
      : V extends Date
        ? DateFilter
        : V extends Array<infer U>
          ? DeepFilter<U>
          : V extends object
            ? DeepFilter<V>
            : never;

export type DeepFilter<T> = {
  [K in keyof T]?: MapTypeToFilter<T[K]>;
};

export type FilterType<T> = DeepFilter<T>;
