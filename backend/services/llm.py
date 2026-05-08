import os
from groq import AsyncGroq

client = AsyncGroq(api_key=os.environ.get("GROQ_API_KEY"))


async def generate_sql_from_nl(natural_language_query: str, schema_context: str) -> str:
    """
    Uses Groq to generate a PostgreSQL query based on the schema and user input.
    Returns ONLY the raw SQL string.
    """
    system_prompt = f"""You are an expert PostgreSQL developer.
Your job is to write a strictly READ-ONLY SQL query (SELECT) to answer the user's question based on the following schema:

{schema_context}

CRITICAL RULES:
1. NEVER use DROP, DELETE, UPDATE, INSERT, ALTER, or TRUNCATE.
2. Output ONLY the raw SQL query, without markdown formatting like ```sql or explanations.
3. Ensure the SQL is compatible with PostgreSQL.
"""

    chat_completion = await client.chat.completions.create(
        messages=[
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": natural_language_query},
        ],
        model="llama-3.3-70b-versatile",
        temperature=0.0,
    )
    return chat_completion.choices[0].message.content.strip()


async def generate_rag_answer(query: str, context_chunks: list[str]) -> str:
    """
    Uses Groq to answer a question based on retrieved document chunks.
    """
    context = "\n\n---\n\n".join(context_chunks)
    system_prompt = f"""You are a helpful assistant that answers questions based ONLY on the provided context.
If the answer is not in the context, say "No encontré información relevante en los documentos."

Context:
{context}
"""

    chat_completion = await client.chat.completions.create(
        messages=[
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": query},
        ],
        model="llama-3.3-70b-versatile",
        temperature=0.1,
    )
    return chat_completion.choices[0].message.content.strip()


async def generate_embedding(text: str) -> list[float]:
    """
    Generates a text embedding using Groq's embedding endpoint.
    Falls back to a dummy vector if the model is unavailable.
    Note: Groq currently uses 'nomic-embed-text-v1.5' for embeddings (768 dims).
    We pad to 1536 dims to match the pgvector column.
    """
    try:
        response = await client.embeddings.create(
            model="nomic-embed-text-v1.5",
            input=text,
        )
        embedding = response.data[0].embedding
        # Pad to 1536 dims if needed
        if len(embedding) < 1536:
            embedding = embedding + [0.0] * (1536 - len(embedding))
        return embedding[:1536]
    except Exception:
        # Fallback: return zero vector (graceful degradation)
        return [0.0] * 1536
