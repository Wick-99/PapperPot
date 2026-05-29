"use client";
const listeners = new Set<(v: number) => void>();
let current = 0;

export function setScrollVelocity(v: number) {
  current = v;
  listeners.forEach((l) => l(v));
}

export function getScrollVelocity() {
  return current;
}

export function subscribeScrollVelocity(fn: (v: number) => void) {
  listeners.add(fn);
  return () => listeners.delete(fn);
}
