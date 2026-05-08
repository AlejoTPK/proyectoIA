import React, { useState } from "react";
import { Button } from "./Button";
import { cn } from "../../lib/utils";

interface QueryInputProps {
  placeholder?: string;
  onSubmit: (value: string) => void;
  loading?: boolean;
}

export const QueryInput: React.FC<QueryInputProps> = ({
  placeholder = "Escribe tu pregunta...",
  onSubmit,
  loading = false,
}) => {
  const [value, setValue] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = value.trim();
    if (!trimmed || loading) return;
    onSubmit(trimmed);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex items-center gap-3 w-full max-w-[640px]"
    >
      <div className="relative flex-1">
        <input
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder={placeholder}
          disabled={loading}
          className={cn(
            "w-full h-11 bg-canvas text-ink border border-hairline rounded-full px-6",
            "font-body text-[17px] tracking-[-0.374px] outline-none transition-all",
            "focus:border-[#0066cc] focus:ring-4 focus:ring-[#0066cc]/10",
            "disabled:opacity-50 disabled:bg-parchment"
          )}
        />
        {loading && (
          <div className="absolute right-4 top-1/2 -translate-y-1/2">
            <div className="w-4 h-4 border-2 border-[#0066cc]/30 border-t-[#0066cc] rounded-full animate-spin" />
          </div>
        )}
      </div>
      <Button
        type="submit"
        variant="primary"
        disabled={loading || !value.trim()}
        className="h-11"
      >
        {loading ? "Consultando..." : "Consultar"}
      </Button>
    </form>
  );
};
