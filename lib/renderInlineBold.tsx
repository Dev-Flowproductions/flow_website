import { Fragment, type ReactNode } from 'react';

const BOLD_PATTERN = /(\*\*[^*]+\*\*)/g;

export function renderInlineBold(text: string): ReactNode[] {
  return text.split(BOLD_PATTERN).map((part, index) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return (
        <strong key={index} className="font-semibold text-gray-800">
          {part.slice(2, -2)}
        </strong>
      );
    }
    return part ? <Fragment key={index}>{part}</Fragment> : null;
  });
}
