'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export interface ActionPlanSection {
  title: string;
  points: string[];
}

interface ActionPlanModalProps {
  sectionTitle: string;
  sectionSubtitle: string;
  sections: ActionPlanSection[];
  triggerLabel: string;
  generatingLabel?: string;
  closeLabel?: string;
  triggerClassName?: string;
}

export default function ActionPlanModal({
  sectionTitle,
  sectionSubtitle,
  sections,
  triggerLabel,
  generatingLabel = 'Generating your plan...',
  closeLabel = 'Close',
  triggerClassName,
}: ActionPlanModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleOpen = () => {
    setIsOpen(true);
    setIsGenerating(true);
  };

  useEffect(() => {
    if (!isOpen) return;
    const t = setTimeout(() => setIsGenerating(false), 1400);
    return () => clearTimeout(t);
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const onEscape = (e: KeyboardEvent) => e.key === 'Escape' && setIsOpen(false);
    document.addEventListener('keydown', onEscape);
    return () => document.removeEventListener('keydown', onEscape);
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = '';
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  return (
    <>
      <button type="button" onClick={handleOpen} className={triggerClassName}>
        {triggerLabel}
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[10000] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
            onClick={() => setIsOpen(false)}
            role="dialog"
            aria-modal
            aria-label={sectionTitle}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.25, ease: [0.25, 0.46, 0.45, 0.94] }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-2xl max-h-[85vh] flex flex-col bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden"
            >
              {/* Header */}
              <div className="shrink-0 px-6 py-5 border-b border-gray-100 bg-gradient-to-b from-[#5b54a0]/8 to-white">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h2 className="text-xl md:text-2xl font-bold text-gray-900">{sectionTitle}</h2>
                    <p className="text-gray-600 mt-1">{sectionSubtitle}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsOpen(false)}
                    className="shrink-0 p-2 -m-2 rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
                    aria-label={closeLabel}
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Content area */}
              <div className="flex-1 min-h-0 overflow-y-auto">
                <AnimatePresence mode="wait">
                  {isGenerating ? (
                    <motion.div
                      key="generating"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="flex flex-col items-center justify-center py-20 px-6"
                    >
                      <div className="w-12 h-12 rounded-full border-2 border-[#5b54a0]/30 border-t-[#5b54a0] animate-spin mb-6" />
                      <p className="text-gray-600 font-medium">{generatingLabel}</p>
                      <div className="flex gap-1 mt-4">
                        {[0, 1, 2].map((i) => (
                          <motion.span
                            key={i}
                            className="w-2 h-2 rounded-full bg-[#5b54a0]"
                            animate={{ opacity: [0.4, 1, 0.4] }}
                            transition={{ duration: 0.8, repeat: Infinity, delay: i * 0.15 }}
                          />
                        ))}
                      </div>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="plan"
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                      className="p-6 space-y-6"
                    >
                      {sections.map((section, i) => (
                        <div
                          key={i}
                          className="bg-gray-50 rounded-xl p-5 border border-gray-100"
                        >
                          <h3 className="text-base font-bold text-gray-900 mb-3">{section.title}</h3>
                          <ul className="space-y-2">
                            {section.points.map((point, j) => (
                              <li key={j} className="flex items-start gap-3 text-sm text-gray-700">
                                <span className="text-[#5b54a0] mt-0.5 shrink-0 font-bold">→</span>
                                <span>{point}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Footer */}
              {!isGenerating && (
                <div className="shrink-0 px-6 py-4 border-t border-gray-100 bg-gray-50/80">
                  <button
                    type="button"
                    onClick={() => setIsOpen(false)}
                    className="w-full py-3 px-4 bg-[#5b54a0] text-white rounded-xl font-medium hover:bg-[#4a4480] transition-colors"
                  >
                    {closeLabel}
                  </button>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
