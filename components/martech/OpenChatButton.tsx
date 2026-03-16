'use client';

interface OpenChatButtonProps {
  children: React.ReactNode;
  className?: string;
}

export default function OpenChatButton({ children, className }: OpenChatButtonProps) {
  const openChat = () => {
    window.dispatchEvent(new Event('open-sga-chat'));
  };

  return (
    <button type="button" onClick={openChat} className={className}>
      {children}
    </button>
  );
}
