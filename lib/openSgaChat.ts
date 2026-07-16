export type OpenSgaChatDetail = { diagnosticContext?: Record<string, unknown> };

const queue: OpenSgaChatDetail[] = [];
let consumer: ((detail: OpenSgaChatDetail | undefined) => void) | null = null;

type WindowWithSgaBridge = Window & { __sgaChatBridgeInstalled?: boolean };

export function registerSgaChatConsumer(
  handler: (detail: OpenSgaChatDetail | undefined) => void
) {
  consumer = handler;
  while (queue.length > 0) {
    handler(queue.shift());
  }
  return () => {
    if (consumer === handler) {
      consumer = null;
    }
  };
}

export function installOpenSgaChatBridge() {
  if (typeof window === 'undefined') {
    return () => {};
  }

  const win = window as WindowWithSgaBridge;
  if (win.__sgaChatBridgeInstalled) {
    return () => {};
  }
  win.__sgaChatBridgeInstalled = true;

  const listener = (e: Event) => {
    const detail = (e as CustomEvent<OpenSgaChatDetail>).detail;
    if (consumer) {
      consumer(detail);
      return;
    }
    queue.push(detail ?? {});
  };

  window.addEventListener('open-sga-chat', listener);
  return () => {
    window.removeEventListener('open-sga-chat', listener);
    win.__sgaChatBridgeInstalled = false;
  };
}
