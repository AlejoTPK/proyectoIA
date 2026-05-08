import React from "react";
import { FileUpload } from "../components/ui/FileUpload";
import { QueryInput } from "../components/ui/QueryInput";
import { useRAG } from "../hooks/useRAG";
import { LoadingSkeleton } from "../components/ui/LoadingSkeleton";

export const KnowledgePage: React.FC = () => {
  const { answer, ingestResult, loadingAsk, loadingIngest, error, ingest, ask } = useRAG();

  return (
    <div className="w-full min-h-screen bg-canvas flex flex-col items-center">
      
      {/* Upload Section */}
      <section className="w-full max-w-[980px] pt-20 pb-12 px-6 flex flex-col items-center text-center">
        <h1 className="text-[40px] md:text-[56px] font-semibold tracking-[-0.28px] leading-[1.07] text-ink">
          Base de Conocimiento
        </h1>
        <p className="mt-2 text-[21px] md:text-[28px] text-ink max-w-[640px]">
          Sube tus archivos y deja que la IA aprenda de ellos al instante.
        </p>

        <div className="mt-12 w-full max-w-[640px]">
          <FileUpload onUpload={ingest} loading={loadingIngest} />
          
          {ingestResult && (
            <div className="mt-6 p-4 bg-blue-50 border border-blue-100 rounded-2xl text-[#0066cc] text-[15px] animate-in fade-in zoom-in-95">
              ✅ <strong>{ingestResult.filename}</strong> indexado correctamente — {ingestResult.total_chunks} fragmentos generados.
            </div>
          )}
        </div>
      </section>

      {/* Ask Section */}
      <section className="w-full max-w-[1024px] px-6 pb-24 space-y-12">
        <div className="flex flex-col items-center text-center">
          <h2 className="text-[34px] font-semibold tracking-tight text-ink">Consulta tus documentos</h2>
          <p className="mt-2 text-[17px] text-ink-muted max-w-[600px]">
            El sistema recuperará los fragmentos más relevantes para fundamentar su respuesta.
          </p>
          <div className="mt-8 w-full max-w-[640px]">
            <QueryInput
              placeholder="¿Qué dice el documento sobre...?"
              onSubmit={ask}
              loading={loadingAsk}
            />
          </div>
        </div>

        {/* Results Area */}
        <div className="min-h-[200px]">
          {/* Error State */}
          {error && (
            <div className="p-6 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-600 dark:text-red-400 text-[17px] animate-in fade-in">
              ⚠️ {error}
            </div>
          )}

          {/* Loading State */}
          {loadingAsk && (
            <div className="space-y-4 max-w-[800px] mx-auto">
              <LoadingSkeleton className="h-6 w-full" />
              <LoadingSkeleton className="h-6 w-5/6" />
              <LoadingSkeleton className="h-6 w-4/6" />
            </div>
          )}

          {/* Answer State */}
          {answer && !loadingAsk && (
            <div className="max-w-[800px] mx-auto space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="bg-canvas border border-hairline rounded-3xl p-8 shadow-sm relative">
                <div className="absolute -top-3 left-8 px-3 py-1 bg-canvas border border-hairline rounded-full text-[12px] font-semibold text-ink uppercase tracking-wider">
                  Respuesta fundamentada
                </div>
                <p className="text-ink text-[18px] leading-relaxed font-body whitespace-pre-wrap">
                  {answer.answer}
                </p>
              </div>

              {/* Sources */}
              {answer.sources.length > 0 && (
                <div className="space-y-4">
                  <h4 className="text-[14px] font-semibold text-ink-muted uppercase tracking-widest pl-2">
                    Fuentes recuperadas ({answer.sources.length})
                  </h4>
                  <div className="grid gap-4">
                    {answer.sources.map((src, i) => (
                      <div
                        key={src.chunk_id}
                        className="bg-tile-light p-6 rounded-2xl border border-hairline shadow-sm hover:border-ink-muted transition-colors"
                      >
                        <div className="flex items-center gap-2 mb-3">
                          <span className="px-2 py-0.5 bg-canvas border border-hairline rounded text-[10px] font-bold text-ink-muted uppercase">
                            Fragmento {i + 1}
                          </span>
                          <span className="text-[12px] text-blue-600 dark:text-blue-400 font-medium">ID: {src.document_id}</span>
                        </div>
                        <p className="text-[14px] text-ink-muted italic leading-snug">
                          "...{src.excerpt}..."
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Idle State */}
          {!answer && !loadingAsk && !error && (
            <div className="flex flex-col items-center text-center text-ink-muted py-16">
              <div className="text-6xl mb-4">📖</div>
              <p className="text-[17px]">Tu conocimiento aparecerá aquí cuando hagas una pregunta.</p>
            </div>
          )}
        </div>
      </section>

    </div>
  );
};
