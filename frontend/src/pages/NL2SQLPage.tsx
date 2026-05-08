import React from "react";
import { QueryInput } from "../components/ui/QueryInput";
import { SqlDisplay } from "../components/ui/SqlDisplay";
import { DataTable } from "../components/ui/DataTable";
import { useQuery } from "../hooks/useQuery";
import { LoadingSkeleton } from "../components/ui/LoadingSkeleton";

const EXAMPLES = [
  "¿Cuántos clientes hay en total?",
  "¿Cuál es el pedido más reciente?",
  "Muestra los 5 clientes con más pedidos",
];

export const NL2SQLPage: React.FC = () => {
  const { data, loading, error, execute } = useQuery();

  return (
    <div className="w-full min-h-screen bg-canvas flex flex-col items-center">
      
      {/* Header Section */}
      <section className="w-full max-w-[980px] pt-20 pb-12 px-6 flex flex-col items-center text-center">
        <h1 className="text-[40px] md:text-[56px] font-semibold tracking-[-0.28px] leading-[1.07] text-ink">
          Consultas SQL
        </h1>
        <p className="mt-2 text-[21px] md:text-[28px] text-ink max-w-[600px]">
          Haz preguntas en español y obtén datos al instante de tu base de datos.
        </p>

        <div className="mt-12 w-full max-w-[640px]">
          <QueryInput
            placeholder="Ej: ¿Cuántos clientes hay por empresa?"
            onSubmit={execute}
            loading={loading}
          />
          
          {/* Examples */}
          <div className="mt-6 flex flex-wrap justify-center gap-2">
            {EXAMPLES.map((ex) => (
              <button
                key={ex}
                onClick={() => execute(ex)}
                disabled={loading}
                className="px-4 py-1.5 bg-tile-light border border-hairline rounded-full text-[14px] text-ink hover:bg-canvas hover:shadow-sm transition-all disabled:opacity-50"
              >
                {ex}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Results Section */}
      <section className="w-full max-w-[1024px] px-6 pb-24">
        {/* Error State */}
        {error && (
          <div className="p-6 bg-red-50 border border-red-200 rounded-2xl text-red-700 text-[17px] mb-8 animate-in fade-in slide-in-from-top-2">
            ⚠️ {error}
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="space-y-6">
            <LoadingSkeleton className="h-24 w-full" />
            <LoadingSkeleton className="h-96 w-full" />
          </div>
        )}

        {/* Results State */}
        {data && !loading && (
          <div className="space-y-8 animate-in fade-in duration-500">
            <div className="bg-tile-light rounded-3xl shadow-apple-product overflow-hidden border border-hairline">
              <div className="px-6 py-4 bg-parchment/50 border-b border-hairline">
                <h3 className="text-[14px] font-semibold text-ink">Código SQL Generado</h3>
              </div>
              <SqlDisplay sql={data.generated_sql} />
            </div>

            <div className="bg-tile-light rounded-3xl shadow-apple-product overflow-hidden border border-hairline">
              <div className="px-6 py-4 bg-parchment/50 border-b border-hairline flex justify-between items-center">
                <h3 className="text-[14px] font-semibold text-ink">Resultados de la Consulta</h3>
                <span className="text-[12px] text-gray-500">{data.data.length} filas encontradas</span>
              </div>
              <div className="overflow-x-auto">
                <DataTable columns={data.columns} data={data.data} />
              </div>
            </div>
          </div>
        )}

        {/* Idle State */}
        {!data && !loading && !error && (
          <div className="mt-12 flex flex-col items-center text-center text-gray-400 py-24 bg-parchment rounded-3xl border border-dashed border-hairline">
            <div className="text-5xl mb-4">🔍</div>
            <p className="text-[17px]">Escribe tu consulta arriba para ver los resultados aquí.</p>
          </div>
        )}
      </section>

    </div>
  );
};
