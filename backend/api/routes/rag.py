from fastapi import APIRouter, Depends, HTTPException, UploadFile, File
from pydantic import BaseModel
from sqlalchemy.ext.asyncio import AsyncSession

from db.session import get_db
from services.rag import ingest_document, ask_rag
from services.history import save_query

router = APIRouter(prefix="/rag", tags=["RAG"])


class AskRequest(BaseModel):
    question: str


class Source(BaseModel):
    chunk_id: int
    document_id: int
    excerpt: str


class AskResponse(BaseModel):
    answer: str
    sources: list[Source]


class IngestResponse(BaseModel):
    document_id: int
    filename: str
    total_chunks: int
    status: str


@router.post("/ingest", response_model=IngestResponse)
async def ingest_endpoint(
    file: UploadFile = File(...),
    session: AsyncSession = Depends(get_db),
) -> IngestResponse:
    """
    Uploads a PDF or TXT document, extracts its text, chunks it,
    generates embeddings and indexes them in PostgreSQL via pgvector.
    """
    allowed_types = {"application/pdf", "text/plain"}
    if file.content_type not in allowed_types:
        raise HTTPException(
            status_code=415,
            detail="Solo se aceptan archivos PDF o TXT.",
        )

    raw_bytes = await file.read()
    text_content = ""

    if file.content_type == "application/pdf":
        try:
            from pypdf import PdfReader
            import io
            reader = PdfReader(io.BytesIO(raw_bytes))
            for page in reader.pages:
                extracted = page.extract_text()
                if extracted:
                    text_content += extracted + "\n"
        except Exception as e:
            raise HTTPException(status_code=422, detail=f"Error al leer el PDF: {str(e)}")
    else:
        text_content = raw_bytes.decode("utf-8", errors="replace")

    if not text_content.strip():
        raise HTTPException(status_code=422, detail="No se pudo extraer texto del documento.")

    result = await ingest_document(
        session=session,
        filename=file.filename or "documento.txt",
        text_content=text_content,
    )
    return IngestResponse(**result)


@router.post("/ask", response_model=AskResponse)
async def ask_endpoint(
    body: AskRequest,
    session: AsyncSession = Depends(get_db),
) -> AskResponse:
    """
    Answers a natural-language question using RAG:
    retrieves similar document chunks and generates a grounded answer.
    """
    if not body.question.strip():
        raise HTTPException(status_code=400, detail="La pregunta no puede estar vacía.")

    result = await ask_rag(session, body.question)

    try:
        await save_query(
            session=session,
            query_type="rag",
            user_query=body.question,
            result_summary=result["answer"][:500],
        )
    except Exception:
        pass

    return AskResponse(**result)
