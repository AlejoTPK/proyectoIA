import React, { useState } from "react";
import { cn } from "../../lib/utils";

interface SqlDisplayProps {
  sql: string;
}

export const SqlDisplay: React.FC<SqlDisplayProps> = ({ sql }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(sql);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="w-full bg-[#1d1d1f] rounded-2xl overflow-hidden shadow-apple-product">
      {/* Header bar */}
      <div className="flex items-center justify-between px-6 py-3 bg-[#2d2d2f] border-b border-white/5">
        <span className="font-body text-[12px] text-gray-400 font-medium tracking-tight">
          SQL Generado
        </span>
        <button
          onClick={handleCopy}
          className={cn(
            "text-[12px] font-medium transition-colors duration-200",
            copied ? "text-[#30a46c]" : "text-[#2997ff] hover:text-[#53adff]"
          )}
        >
          {copied ? "✓ Copiado" : "Copiar"}
        </button>
      </div>

      {/* Code block */}
      <div className="p-6 overflow-x-auto">
        <pre className="font-mono text-[13px] leading-relaxed text-gray-300 whitespace-pre-wrap break-words">
          {sql}
        </pre>
      </div>
    </div>
  );
};
