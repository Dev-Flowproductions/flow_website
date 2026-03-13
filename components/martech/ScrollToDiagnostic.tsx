'use client';

interface ScrollToDiagnosticProps {
  children: React.ReactNode;
  className?: string;
  targetId?: string;
}

export default function ScrollToDiagnostic({ children, className, targetId = 'diagnostico' }: ScrollToDiagnosticProps) {
  const handleClick = () => {
    const element = document.getElementById(targetId);
    if (element) {
      const elementRect = element.getBoundingClientRect();
      const elementHeight = elementRect.height;
      const windowHeight = window.innerHeight;
      const offset = elementRect.top + window.scrollY - (windowHeight - elementHeight) / 2;
      
      window.scrollTo({
        top: Math.max(0, offset),
        behavior: 'smooth',
      });
    }
  };

  return (
    <button onClick={handleClick} className={className}>
      {children}
    </button>
  );
}
