'use client';

interface ScrollToDiagnosticProps {
  children: React.ReactNode;
  className?: string;
}

export default function ScrollToDiagnostic({ children, className }: ScrollToDiagnosticProps) {
  const handleClick = () => {
    const element = document.getElementById('diagnostico');
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
