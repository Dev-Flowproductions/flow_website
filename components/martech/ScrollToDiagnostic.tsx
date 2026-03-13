'use client';

interface ScrollToDiagnosticProps {
  children: React.ReactNode;
  className?: string;
  targetId?: string;
  center?: boolean;
}

export default function ScrollToDiagnostic({ children, className, targetId = 'diagnostico', center = true }: ScrollToDiagnosticProps) {
  const handleClick = () => {
    const element = document.getElementById(targetId);
    if (element) {
      if (center) {
        const elementRect = element.getBoundingClientRect();
        const elementHeight = elementRect.height;
        const windowHeight = window.innerHeight;
        const offset = elementRect.top + window.scrollY - (windowHeight - elementHeight) / 2;
        
        window.scrollTo({
          top: Math.max(0, offset),
          behavior: 'smooth',
        });
      } else {
        const headerOffset = 100;
        const elementPosition = element.getBoundingClientRect().top + window.scrollY;
        
        window.scrollTo({
          top: elementPosition - headerOffset,
          behavior: 'smooth',
        });
      }
    }
  };

  return (
    <button onClick={handleClick} className={className}>
      {children}
    </button>
  );
}
