from fastapi import APIRouter, Depends
from pydantic import BaseModel
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import text

from db.session import get_db
from services.rag import get_document_count
from services.history import get_query_count

router = APIRouter(prefix="/health", tags=["Health"])


class HealthResponse(BaseModel):
    status: str
    database: str
    total_documents: int
    total_queries: int


@router.get("", response_model=HealthResponse)
async def health_endpoint(
    session: AsyncSession = Depends(get_db),
) -> HealthResponse:
    """Returns the health status of the API and its dependencies."""
    try:
        await session.execute(text("SELECT 1"))
        db_status = "connected"
    except Exception:
        db_status = "error"

    doc_count = await get_document_count(session)
    query_count = await get_query_count(session)

    return HealthResponse(
        status="ok",
        database=db_status,
        total_documents=doc_count,
        total_queries=query_count,
    )
