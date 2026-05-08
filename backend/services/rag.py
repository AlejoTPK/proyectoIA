from typing import List
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func, text
from db.models import Document, DocumentChunk
from services.llm import generate_embedding, generate_rag_answer


def chunk_text(text_content: str, chunk_size: int = 512, overlap: int = 64) -> List[str]:
    """
    Splits text into overlapping chunks for better retrieval coverage.
    """
    words = text_content.split()
    chunks: List[str] = []
    start = 0
    while start < len(words):
        end = start + chunk_size
        chunk = " ".join(words[start:end])
        if chunk.strip():
            chunks.append(chunk)
        start += chunk_size - overlap
    return chunks


async def ingest_document(
    session: AsyncSession,
    filename: str,
    text_content: str,
) -> dict:
    """
    Ingests a document: chunks it, generates embeddings, and stores everything.
    Returns a summary of the ingestion.
    """
    # Persist the parent document
    document = Document(filename=filename, content=text_content)
    session.add(document)
    await session.flush()  # Get the generated ID

    # Chunk and embed
    chunks = chunk_text(text_content)
    if not chunks:
        raise ValueError("El documento no contiene texto extraíble.")

    for idx, chunk_content in enumerate(chunks):
        embedding = await generate_embedding(chunk_content)
        chunk = DocumentChunk(
            document_id=document.id,
            chunk_index=idx,
            content=chunk_content,
            embedding=embedding,
        )
        session.add(chunk)

    await session.commit()

    return {
        "document_id": document.id,
        "filename": filename,
        "total_chunks": len(chunks),
        "status": "ingested",
    }


async def search_similar_chunks(
    session: AsyncSession,
    query: str,
    top_k: int = 5,
) -> List[DocumentChunk]:
    """
    Performs cosine similarity search on document chunks using pgvector.
    """
    query_embedding = await generate_embedding(query)

    # pgvector cosine distance operator: <=>
    result = await session.execute(
        select(DocumentChunk)
        .order_by(DocumentChunk.embedding.cosine_distance(query_embedding))
        .limit(top_k)
    )
    return list(result.scalars().all())


async def ask_rag(session: AsyncSession, query: str) -> dict:
    """
    Full RAG pipeline: search → retrieve chunks → generate answer.
    """
    similar_chunks = await search_similar_chunks(session, query)

    if not similar_chunks:
        return {
            "answer": "No encontré documentos indexados. Por favor, sube un documento primero.",
            "sources": [],
        }

    context_texts = [chunk.content for chunk in similar_chunks]
    sources = [
        {
            "chunk_id": chunk.id,
            "document_id": chunk.document_id,
            "excerpt": chunk.content[:200] + "..." if len(chunk.content) > 200 else chunk.content,
        }
        for chunk in similar_chunks
    ]

    answer = await generate_rag_answer(query, context_texts)

    return {
        "answer": answer,
        "sources": sources,
    }


async def get_document_count(session: AsyncSession) -> int:
    """Returns total number of indexed documents."""
    result = await session.execute(select(func.count()).select_from(Document))
    return result.scalar_one()
