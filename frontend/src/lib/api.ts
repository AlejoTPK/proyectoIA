const BASE_URL = import.meta.env.VITE_API_URL ?? "";

async function apiFetch<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: { "Content-Type": "application/json", ...options?.headers },
    ...options,
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: res.statusText }));
    throw new Error(err.detail ?? "Error desconocido");
  }
  return res.json() as Promise<T>;
}

// ---- Types ----

export interface QueryResult {
  status: string;
  generated_sql: string;
  columns: string[];
  data: Record<string, unknown>[];
  row_count: number;
}

export interface Source {
  chunk_id: number;
  document_id: number;
  excerpt: string;
}

export interface RagResult {
  answer: string;
  sources: Source[];
}

export interface IngestResult {
  document_id: number;
  filename: string;
  total_chunks: number;
  status: string;
}

export interface HistoryItem {
  id: number;
  query_type: string;
  user_query: string;
  result_summary: string | null;
  generated_sql: string | null;
  created_at: string;
}

export interface HistoryResponse {
  items: HistoryItem[];
  total: number;
}

export interface HealthResponse {
  status: string;
  database: string;
  total_documents: number;
  total_queries: number;
}

// ---- API functions ----

export const api = {
  queryNL2SQL: (question: string): Promise<QueryResult> =>
    apiFetch("/api/query", {
      method: "POST",
      body: JSON.stringify({ question }),
    }),

  ingestDocument: (file: File): Promise<IngestResult> => {
    const form = new FormData();
    form.append("file", file);
    return fetch(`${BASE_URL}/api/rag/ingest`, {
      method: "POST",
      body: form,
    }).then(async (res) => {
      if (!res.ok) {
        const err = await res.json().catch(() => ({ detail: res.statusText }));
        throw new Error(err.detail ?? "Error al indexar");
      }
      return res.json();
    });
  },

  askRAG: (question: string): Promise<RagResult> =>
    apiFetch("/api/rag/ask", {
      method: "POST",
      body: JSON.stringify({ question }),
    }),

  getHistory: (limit = 50): Promise<HistoryResponse> =>
    apiFetch(`/api/history?limit=${limit}`),

  getHealth: (): Promise<HealthResponse> =>
    apiFetch("/api/health"),
};
