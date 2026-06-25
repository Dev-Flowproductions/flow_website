export const PENDING_SCROLL_KEY = 'flow:pending-scroll';

export interface PendingScroll {
  targetId: string;
  center?: boolean;
}

export function scrollToSection(targetId: string, center = false) {
  const element = document.getElementById(targetId);
  if (!element) return;

  if (center) {
    const elementRect = element.getBoundingClientRect();
    const elementHeight = elementRect.height;
    const windowHeight = window.innerHeight;
    const offset = elementRect.top + window.scrollY - (windowHeight - elementHeight) / 2;

    window.scrollTo({
      top: Math.max(0, offset),
      behavior: 'smooth',
    });
    return;
  }

  const headerOffset = 100;
  const elementPosition = element.getBoundingClientRect().top + window.scrollY;

  window.scrollTo({
    top: elementPosition - headerOffset,
    behavior: 'smooth',
  });
}

export function normalizeRoutePath(path: string) {
  return path.replace(/^\/(en|pt|fr)(?=\/|$)/, '').replace(/^\//, '') || '';
}

export function pathsMatch(currentPathname: string, hrefPath: string) {
  if (!hrefPath) return true;
  return normalizeRoutePath(currentPathname) === normalizeRoutePath(hrefPath);
}

export function queuePendingScroll(targetId: string, center = false) {
  const payload: PendingScroll = { targetId, center };
  sessionStorage.setItem(PENDING_SCROLL_KEY, JSON.stringify(payload));
}

export function consumePendingScroll(): PendingScroll | null {
  const raw = sessionStorage.getItem(PENDING_SCROLL_KEY);
  if (!raw) return null;

  sessionStorage.removeItem(PENDING_SCROLL_KEY);

  try {
    return JSON.parse(raw) as PendingScroll;
  } catch {
    return null;
  }
}

export function defaultCenterForTarget(targetId: string) {
  return targetId === 'diagnostico';
}
