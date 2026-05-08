import { useState, useCallback } from "react";
import { api } from "../lib/api";
import type { QueryResult } from "../lib/api";

interface UseQueryState {
  data: QueryResult | null;
  loading: boolean;
  error: string | null;
}

export function useQuery() {
  const [state, setState] = useState<UseQueryState>({
    data: null,
    loading: false,
    error: null,
  });

  const execute = useCallback(async (question: string) => {
    setState({ data: null, loading: true, error: null });
    try {
      const result = await api.queryNL2SQL(question);
      setState({ data: result, loading: false, error: null });
    } catch (err) {
      setState({
        data: null,
        loading: false,
        error: err instanceof Error ? err.message : "Error al ejecutar la consulta",
      });
    }
  }, []);

  return { ...state, execute };
}
