import React from "react";
import { useHistory } from "../hooks/useHistory";
import { Button } from "../components/ui/Button";
import { LoadingSkeleton } from "../components/ui/LoadingSkeleton";
import { cn } from "../lib/utils";

const TYPE_LABELS: Record<string, string> = {
  nl2sql: "SQL",
  rag: "RAG",
};

const TYPE_COLORS: Record<string, string> = {
  nl2sql: "bg-[#0066cc]",
  rag: "bg-[#30a46c]",
};

function formatDate(iso: string): string {
  return new Date(iso).toLocaleString("es-MX", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export const HistoryPage: React.FC = () => {
  const { items, loading, error, refresh } = useHistory();

  return (
    <div className="w-full min-h-screen bg-canvas flex flex-col items-center">
      
      {/* Header Section */}
      <section className="w-full max-w-[980px] pt-20 pb-12 px-6 flex flex-col items-center text-center">
        <h1 className="text-[40px] md:text-[56px] font-semibold tracking-[-0.28px] leading-[1.07] text-ink">
          Historial
        </h1>
        <p className="mt-2 text-[21px] md:text-[28px] text-ink max-w-[600px]">
          Revisa tus consultas anteriores y los resultados generados por el motor.
        </p>

        <div className="mt-8">
          <Button variant="secondary" onClick={refresh} disabled={loading}>
            {loading ? "Actualizando..." : "↻ Actualizar historial"}
          </Button>
        </div>
      </section>

      {/* List Section */}
      <section className="w-full max-w-[800px] px-6 pb-24">
        {/* Error State */}
        {error && (
          <div className="p-6 bg-red-50 border border-red-200 rounded-2xl text-red-700 text-[17px] mb-8">
            ⚠️ {error}
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="space-y-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <LoadingSkeleton key={i} className="h-24 w-full rounded-2xl" />
            ))}
          </div>
        )}

        {/* Items State */}
        {!loading && items.length > 0 && (
          <div className="space-y-4">
            {items.map((item, idx) => (
              <div
                key={item.id}
                className={cn(
                  "p-6 rounded-2xl border border-hairline transition-all duration-300",
                  "flex flex-col md:flex-row md:items-start gap-4",
                  idx % 2 === 0 ? "bg-white" : "bg-[#fafafc]",
                  "hover:shadow-apple-product hover:scale-[1.01]"
                )}
                style={{ animationDelay: `${idx * 0.05}s` }}
              >
                {/* Type Badge */}
                <span className={cn(
                  "px-3 py-1 rounded-full text-[12px] font-bold text-white uppercase tracking-wider self-start",
                  TYPE_COLORS[item.query_type] ?? "bg-ink"
                )}>
                  {TYPE_LABELS[item.query_type] ?? item.query_type}
                </span>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <p className="text-[17px] font-semibold text-ink mb-1 truncate">
                    {item.user_query}
                  </p>
                  {item.result_summary && (
                    <p className="text-[14px] text-gray-500 line-clamp-2">
                      {item.result_summary}
                    </p>
                  )}
                  {item.generated_sql && (
                    <code className="block mt-2 text-[12px] text-[#0066cc] font-mono truncate bg-blue-50 px-2 py-1 rounded border border-blue-100">
                      {item.generated_sql}
                    </code>
                  )}
                </div>

                {/* Date */}
                <time className="text-[12px] text-gray-400 whitespace-nowrap mt-1">
                  {formatDate(item.created_at)}
                </time>
              </div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && items.length === 0 && !error && (
          <div className="flex flex-col items-center text-center text-gray-300 py-24 bg-white rounded-3xl border border-hairline shadow-sm">
            <div className="text-6xl mb-4">🗒️</div>
            <p className="text-[17px]">No hay consultas en el historial todavía.</p>
          </div>
        )}
      </section>

    </div>
  );
};
