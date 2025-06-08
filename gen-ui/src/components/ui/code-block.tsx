import { Copy } from 'lucide-react';

export function CodeBlock({ code, language }: { code: string; language: string }) {
  return (
    <pre className="relative bg-gray-100 p-4 rounded overflow-auto">
      <button
        className="absolute top-2 right-2 text-gray-500 hover:text-black"
        onClick={() => navigator.clipboard.writeText(code)}
      >
        <Copy size={16} />
      </button>
      <code className={`language-${language}`}>{code}</code>
    </pre>
  );
}