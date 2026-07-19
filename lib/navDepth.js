// #92: nav-depth tracking for the shared Back/Home control.
//
// We keep a small breadcrumb stack of the in-app pages visited SINCE the last
// time the person was at home ("/"). A maintained stack is more reliable than
// window.history.length across deep links, refreshes, and external referrers
// (the todo note calls this out explicitly).
//
// Model (stack holds NON-home pathnames, in visit order):
//   - Landing on "/"            → clear the stack (you're home; depth 0).
//   - Navigating to a new path  → push it.
//   - Navigating BACK to a path already in the stack → truncate to it
//     (so bouncing forward/back doesn't inflate depth).
//
// depth = stack.length = how many pages deep you are.
//   depth 0 → at home
//   depth 1 → one page off home (Back already lands on home → Home is redundant)
//   depth 2+ → show a Home button beside Back
//
// Side-effect-free and dependency-free; safe to import from server-rendered
// modules (all access is guarded for the no-window case).

const KEY = "sq-nav-stack";

function read() {
  try {
    const raw = sessionStorage.getItem(KEY);
    const arr = raw ? JSON.parse(raw) : [];
    return Array.isArray(arr) ? arr : [];
  } catch {
    return [];
  }
}

function write(arr) {
  try {
    sessionStorage.setItem(KEY, JSON.stringify(arr));
  } catch {}
}

// Record a navigation and return the resulting depth (non-home page count).
export function recordNav(pathname) {
  if (typeof window === "undefined") return 0;
  if (!pathname || pathname === "/") {
    write([]);
    return 0;
  }
  const stack = read();
  const existingIdx = stack.indexOf(pathname);
  let next;
  if (existingIdx !== -1) {
    // Going back to a page already in the trail — truncate to it.
    next = stack.slice(0, existingIdx + 1);
  } else {
    next = [...stack, pathname];
  }
  write(next);
  return next.length;
}

// Current depth without recording anything.
export function currentDepth() {
  if (typeof window === "undefined") return 0;
  return read().length;
}
