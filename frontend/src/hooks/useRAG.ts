import { useState, useCallback } from "react";
import { api } from "../lib/api";
import type { RagResult, IngestResult } from "../lib/api";

interface UseRAGState {
  answer: RagResult | null;
  ingestResult: IngestResult | null;
  loadingAsk: boolean;
  loadingIngest: boolean;
  error: string | null;
}

export function useRAG() {
  const [state, setState] = useState<UseRAGState>({
    answer: null,
    ingestResult: null,
    loadingAsk: false,
    loadingIngest: false,
    error: null,
  });

  const ingest = useCallback(async (file: File) => {
    setState((s) => ({ ...s, loadingIngest: true, error: null, ingestResult: null }));
    try {
      const result = await api.ingestDocument(file);
      setState((s) => ({ ...s, loadingIngest: false, ingestResult: result }));
    } catch (err) {
      setState((s) => ({
        ...s,
        loadingIngest: false,
        error: err instanceof Error ? err.message : "Error al indexar documento",
      }));
    }
  }, []);

  const ask = useCallback(async (question: string) => {
    setState((s) => ({ ...s, loadingAsk: true, error: null, answer: null }));
    try {
      const result = await api.askRAG(question);
      setState((s) => ({ ...s, loadingAsk: false, answer: result }));
    } catch (err) {
      setState((s) => ({
        ...s,
        loadingAsk: false,
        error: err instanceof Error ? err.message : "Error al consultar la base de conocimiento",
      }));
    }
  }, []);

  return { ...state, ingest, ask };
}
