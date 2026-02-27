'use client';

import { useEffect, useCallback } from 'react';
import { createRoot } from 'react-dom/client';
import { FileText } from 'lucide-react';

function nodeToMarkdown(node: Node): string {
  if (node.nodeType === Node.TEXT_NODE) {
    const text = node.textContent?.trim() ?? '';
    return text ? text + ' ' : '';
  }
  if (node.nodeType !== Node.ELEMENT_NODE) return '';
  const el = node as Element;
  const tag = el.tagName.toLowerCase();
  const children = Array.from(el.childNodes)
    .map(nodeToMarkdown)
    .join('')
    .replace(/\n{3,}/g, '\n\n')
    .trim();

  switch (tag) {
    case 'h1':
      return '\n\n# ' + children + '\n\n';
    case 'h2':
      return '\n\n## ' + children + '\n\n';
    case 'h3':
      return '\n\n### ' + children + '\n\n';
    case 'h4':
      return '\n\n#### ' + children + '\n\n';
    case 'p':
      return '\n\n' + children + '\n\n';
    case 'a': {
      const href = el.getAttribute('href') ?? '';
      const isExternal = href.startsWith('http');
      return isExternal ? `[${children.trim()}](${href})` : children;
    }
    case 'li':
      return '\n- ' + children.replace(/^\s+|\s+$/g, '');
    case 'ul':
    case 'ol':
      return '\n' + children + '\n';
    case 'strong':
    case 'b':
      return '**' + children.trim() + '** ';
    case 'em':
    case 'i':
      return '_' + children.trim() + '_ ';
    case 'img': {
      const alt = el.getAttribute('alt') ?? '';
      const src = el.getAttribute('src') ?? '';
      return alt ? `\n![${alt}](${src})\n` : '';
    }
    case 'script':
    case 'style':
    case 'noscript':
      return '';
    default:
      return children;
  }
}

function downloadMarkdown() {
  const main = document.querySelector('main');
  if (!main) return;

  const title = document.title || 'Flow Productions';
  const url = window.location.href;
  const slug = url
    .replace(/https?:\/\/[^/]+/, '')
    .replace(/\//g, '-')
    .replace(/^-|-$/g, '') || 'page';

  const bodyMarkdown = nodeToMarkdown(main)
    .replace(/\n{3,}/g, '\n\n')
    .trim();

  const markdown = `# ${title}\n\nSource: ${url}\n\n---\n\n${bodyMarkdown}`;

  const blob = new Blob([markdown], { type: 'text/markdown;charset=utf-8' });
  const blobUrl = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = blobUrl;
  a.download = `${slug}.md`;
  a.click();
  URL.revokeObjectURL(blobUrl);
}

function DownloadButton() {
  return (
    <button
      type="button"
      onClick={downloadMarkdown}
      aria-label="Download page as Markdown"
      title="Download as Markdown"
      className="inline-flex items-center justify-center ml-3 text-gray-400 opacity-40 transition-opacity hover:opacity-90 focus:outline-none align-middle"
      style={{ verticalAlign: 'middle', background: 'none', border: 'none', padding: 0 }}
    >
      <FileText className="h-4 w-4" aria-hidden />
    </button>
  );
}

export default function CopyPageAsMarkdown() {
  const injectButtons = useCallback(() => {
    const main = document.querySelector('main');
    if (!main) return;

    const h1s = Array.from(main.querySelectorAll('h1'));

    h1s.forEach((h1) => {
      if (h1.querySelector('[data-md-download]')) return;

      const wrapper = document.createElement('span');
      wrapper.setAttribute('data-md-download', 'true');
      wrapper.style.display = 'inline-flex';
      wrapper.style.alignItems = 'center';
      h1.appendChild(wrapper);

      const root = createRoot(wrapper);
      root.render(<DownloadButton />);
    });
  }, []);

  useEffect(() => {
    injectButtons();

    const observer = new MutationObserver(() => {
      injectButtons();
    });

    const main = document.querySelector('main');
    if (main) {
      observer.observe(main, { childList: true, subtree: true });
    }

    return () => observer.disconnect();
  }, [injectButtons]);

  return null;
}
