/// <reference types="react" />

// Provide a permissive JSX namespace to avoid IntrinsicElements errors in strict TS configs.
declare namespace JSX {
  interface IntrinsicElements {
    [elemName: string]: any
  }
}

