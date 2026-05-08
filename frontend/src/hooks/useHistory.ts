import { useState, useEffect, useCallback } from "react";
import { api } from "../lib/api";
import type { HistoryItem } from "../lib/api";

interface UseHistoryState {
  items: HistoryItem[];
  loading: boolean;
  error: string | null;
}

export function useHistory() {
  const [state, setState] = useState<UseHistoryState>({
    items: [],
    loading: false,
    error: null,
  });

  const fetch = useCallback(async () => {
    setState((s) => ({ ...s, loading: true, error: null }));
    try {
      const res = await api.getHistory();
      setState({ items: res.items, loading: false, error: null });
    } catch (err) {
      setState((s) => ({
        ...s,
        loading: false,
        error: err instanceof Error ? err.message : "Error al cargar el historial",
      }));
    }
  }, []);

  useEffect(() => {
    fetch();
  }, [fetch]);

  return { ...state, refresh: fetch };
}
