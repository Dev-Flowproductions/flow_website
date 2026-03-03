'use client';

import { useState, useCallback, useEffect } from 'react';
import Image from 'next/image';

const SGA_URL = 'https://sga.flowproductions.pt/';
const MIC_CONSENT_KEY = 'sga-mic-consent-asked';

export default function SGAChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [micPermission, setMicPermission] = useState<'prompt' | 'granted' | 'denied' | null>(null);

  const open = useCallback(() => setIsOpen(true), []);
  const close = useCallback(() => setIsOpen(false), []);

  const requestMicrophone = useCallback(async () => {
    if (typeof navigator === 'undefined' || !navigator.mediaDevices?.getUserMedia) return;
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      stream.getTracks().forEach((t) => t.stop());
      setMicPermission('granted');
      if (typeof sessionStorage !== 'undefined') sessionStorage.setItem(MIC_CONSENT_KEY, '1');
    } catch {
      setMicPermission('denied');
    }
  }, []);

  useEffect(() => {
    if (!isOpen) return;
    if (typeof sessionStorage !== 'undefined' && sessionStorage.getItem(MIC_CONSENT_KEY)) {
      setMicPermission(null);
      return;
    }
    setMicPermission('prompt');
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [isOpen, close]);

  return (
    <>
      {/* Floating bubble — white icon on black */}
      <button
        type="button"
        onClick={open}
        aria-label="Abrir assistente Flowi - Strategic Growth Advisor"
        aria-expanded={isOpen}
        className="fixed bottom-6 right-6 z-[9999] flex h-14 w-14 items-center justify-center rounded-full bg-black text-white shadow-lg transition hover:scale-105 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-black"
      >
        <Image
          src="/images/sga-chat-icon.png"
          alt=""
          width={28}
          height={28}
          className="h-7 w-7 object-contain"
        />
      </button>

      {/* Panel with iframe — only mounted when open for performance */}
      {isOpen && (
        <div
          className="fixed inset-0 z-[9998] flex items-end justify-end p-4 pb-20 sm:p-6 sm:pb-24"
          aria-modal
          aria-label="Assistente Flowi"
          role="dialog"
        >
          {/* Backdrop — click to close, darker */}
          <div
            className="absolute inset-0 bg-black/50"
            onClick={close}
            onKeyDown={(e) => e.key === 'Escape' && close()}
            aria-hidden
          />
          {/* Panel — header black, assistant highlighted */}
          <div className="relative flex h-[min(85vh,600px)] w-full max-w-[min(420px,100%)] flex-col overflow-hidden rounded-2xl bg-white shadow-2xl">
            <div className="flex shrink-0 flex-col border-b border-gray-100">
              <div className="flex items-center justify-between bg-black px-4 py-3">
                <div className="flex flex-col">
                  <span className="text-sm font-bold tracking-tight text-white">
                    Flow Productions
                  </span>
                  <span className="text-[10px] font-semibold uppercase tracking-widest text-white/80">
                    Strategic Growth Advisor
                  </span>
                </div>
                <button
                  type="button"
                  onClick={close}
                  aria-label="Fechar assistente"
                  className="rounded-full p-2 text-white/90 transition hover:bg-white/10 hover:text-white focus:outline-none focus:ring-2 focus:ring-white/50 focus:ring-offset-2 focus:ring-offset-black"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="h-5 w-5"
                  >
                    <path
                      fillRule="evenodd"
                      d="M5.47 5.47a.75.75 0 0 1 1.06 0L12 10.94l5.47-5.47a.75.75 0 1 1 1.06 1.06L13.06 12l5.47 5.47a.75.75 0 1 1-1.06 1.06L12 13.06l-5.47 5.47a.75.75 0 0 1-1.06-1.06L10.94 12 5.47 6.53a.75.75 0 0 1 0-1.06Z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
              </div>
              {micPermission === 'prompt' && (
                <div className="flex items-center justify-between gap-3 bg-gray-50 px-4 py-2.5">
                  <span className="text-xs text-gray-600">
                    Voice calls use the microphone. Allow access when prompted.
                  </span>
                  <button
                    type="button"
                    onClick={requestMicrophone}
                    className="shrink-0 rounded-full bg-black px-3 py-1.5 text-xs font-medium text-white transition hover:bg-gray-800"
                  >
                    Allow microphone
                  </button>
                </div>
              )}
              {micPermission === 'denied' && (
                <div className="px-4 py-2.5 bg-amber-50">
                  <span className="text-xs text-amber-800">
                    Microphone was denied. You can allow it in the browser to use voice calls.
                  </span>
                </div>
              )}
            </div>
            <div className="relative min-h-0 flex-1">
              <iframe
                src={SGA_URL}
                title="Flowi - Strategic Growth Advisor"
                className="absolute inset-0 h-full w-full border-0"
                sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
