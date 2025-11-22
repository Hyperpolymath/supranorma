export type Result<T, E = Error> =
  | { success: true; data: T }
  | { success: false; error: E };

export type AsyncResult<T, E = Error> = Promise<Result<T, E>>;

export type Nullable<T> = T | null;

export type Optional<T> = T | undefined;

export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

export type DeepReadonly<T> = {
  readonly [P in keyof T]: T[P] extends object ? DeepReadonly<T[P]> : T[P];
};

export type UnionToIntersection<U> = (
  U extends any ? (k: U) => void : never
) extends (k: infer I) => void
  ? I
  : never;

export type Prettify<T> = {
  [K in keyof T]: T[K];
} & {};

export interface Disposable {
  dispose(): void | Promise<void>;
}

export interface AsyncDisposable {
  dispose(): Promise<void>;
}

export type Constructor<T = any> = new (...args: any[]) => T;

export type ValueOf<T> = T[keyof T];

export type Awaitable<T> = T | Promise<T>;

export type MaybeArray<T> = T | T[];

export interface TimeRange {
  start: Date;
  end: Date;
}

export interface Pagination {
  page: number;
  pageSize: number;
  total?: number;
}

export interface PaginatedResult<T> {
  data: T[];
  pagination: Pagination & { total: number; totalPages: number };
}

export type SortDirection = 'asc' | 'desc';

export interface SortOptions<T = string> {
  field: T;
  direction: SortDirection;
}

export interface FilterOptions {
  [key: string]: any;
}

export interface QueryOptions<T = string> {
  pagination?: Partial<Pagination>;
  sort?: SortOptions<T>[];
  filter?: FilterOptions;
}
