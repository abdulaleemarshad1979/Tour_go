// Minimal shims to satisfy TypeScript when @types/react is not installed
declare namespace React {
  type FC<P = any> = (props: P) => any;
  type ReactNode = any;
  type MouseEvent<T = any> = any;
  type FormEvent = any;
  type RefObject<T> = { current: T | null };
  function useState<S = any>(initialState?: S | (() => S)): [S, (s: S | ((prev: S) => S)) => void];
  function useRef<T = any>(initial?: T | null): RefObject<T>;
}

declare module 'react' {
  export = React;
}

declare module 'react/jsx-runtime' {
  export const jsx: any;
  export const jsxs: any;
  export const Fragment: any;
}

declare namespace JSX {
  interface IntrinsicElements {
    [elemName: string]: any;
  }
}
