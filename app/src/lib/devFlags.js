// src/lib/devFlags.js
export function isMockEnabled() {
  if (typeof window !== "undefined") {
    const v = window.localStorage.getItem("USE_MOCK");
    if (v === "1") return true;
    if (v === "0") return false;
  }
  return process.env.NEXT_PUBLIC_USE_MOCK === "1";
}

export function setMockEnabled(value) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem("USE_MOCK", value ? "1" : "0");
}
