import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../components/ui/Button";

export const DashboardPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="w-full flex flex-col items-center">
      
      {/* Sección 1: Blanco puro (Hero) */}
      <section className="w-full bg-canvas flex flex-col items-center pt-24 pb-12 overflow-hidden border-b border-hairline transition-colors duration-300">
        <h1 className="font-display text-[40px] md:text-[56px] font-semibold tracking-[-0.28px] text-ink leading-[1.07] text-center">
          Motor IA
        </h1>
        <p className="mt-2 font-display text-[21px] md:text-[28px] font-normal tracking-[0.196px] text-ink text-center">
          Dile hola a la nueva generación de consultas.
        </p>
        
        <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Button variant="primary" onClick={() => navigate("/consulta")}>Más información</Button>
          <Button variant="secondary" onClick={() => navigate("/conocimiento")}>Ver documentos</Button>
        </div>

        {/* Placeholder Imagen Principal */}
        <div className="mt-16 w-full max-w-[800px] aspect-[16/10] bg-parchment rounded-t-3xl shadow-apple-product flex items-center justify-center border-t border-x border-hairline">
          <span className="text-ink-muted font-body text-sm">Inserta tu imagen aquí (e.g. Dashboard Hero)</span>
        </div>
      </section>

      {/* Sección 2: Pergamino (SQL) */}
      <section className="w-full bg-parchment flex flex-col items-center pt-24 pb-20 overflow-hidden border-b border-hairline transition-colors duration-300">
        <h2 className="font-display text-[34px] md:text-[40px] font-semibold tracking-tight text-ink text-center">
          ✦ Consultas SQL
        </h2>
        <p className="mt-2 font-display text-[21px] text-ink text-center">
          Una gran forma de hablar con tus datos.
        </p>
        
        <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Button variant="primary" onClick={() => navigate("/consulta")}>Probar ahora</Button>
        </div>

        {/* Placeholder Imagen Secundaria */}
        <div className="mt-16 w-full max-w-[600px] aspect-[3/2] bg-canvas rounded-[18px] shadow-apple-product flex items-center justify-center border border-hairline">
          <span className="text-ink-muted font-body text-sm">Inserta imagen de UI SQL aquí</span>
        </div>
      </section>

      {/* Sección 3: Tile Oscuro (RAG) */}
      <section className="w-full bg-tile-dark flex flex-col items-center pt-24 pb-20 overflow-hidden transition-colors duration-300">
        <h2 className="font-display text-[34px] md:text-[40px] font-semibold tracking-tight text-on-dark text-center">
          Base de Conocimiento
        </h2>
        <p className="mt-2 font-display text-[21px] text-ink-muted text-center">
          Tus documentos, procesados al instante.
        </p>
        
        <div className="mt-6 flex items-center justify-center">
           <Button variant="primary" onClick={() => navigate("/conocimiento")}>Explorar documentos</Button>
        </div>

        {/* Placeholder Imagen Oscura */}
        <div className="mt-16 w-full max-w-[700px] aspect-[16/9] bg-tile-light rounded-[18px] shadow-apple-product flex items-center justify-center border border-hairline">
          <span className="text-ink-muted font-body text-sm">Inserta imagen de RAG aquí</span>
        </div>
      </section>

      {/* Footer-like section */}
      <footer className="w-full bg-parchment py-16 px-8 transition-colors duration-300">
        <div className="max-w-[980px] mx-auto grid grid-cols-2 md:grid-cols-4 gap-8">
          <div className="flex flex-col gap-2">
            <h4 className="font-body text-[14px] font-semibold text-ink">Explorar</h4>
            <a href="/" className="text-[12px] text-ink-muted hover:underline">Dashboard</a>
            <a href="/consulta" className="text-[12px] text-ink-muted hover:underline">Consultas SQL</a>
          </div>
          <div className="flex flex-col gap-2">
            <h4 className="font-body text-[14px] font-semibold text-ink">Recursos</h4>
            <a href="/conocimiento" className="text-[12px] text-ink-muted hover:underline">Documentos</a>
            <a href="/historial" className="text-[12px] text-ink-muted hover:underline">Historial</a>
          </div>
        </div>
      </footer>

    </div>
  );
};
