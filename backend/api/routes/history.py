from fastapi import APIRouter, Depends
from pydantic import BaseModel
from sqlalchemy.ext.asyncio import AsyncSession
from datetime import datetime
from typing import Optional

from db.session import get_db
from services.history import get_history

router = APIRouter(prefix="/history", tags=["History"])


class HistoryItem(BaseModel):
    id: int
    query_type: str
    user_query: str
    result_summary: Optional[str]
    generated_sql: Optional[str]
    created_at: datetime

    model_config = {"from_attributes": True}


class HistoryResponse(BaseModel):
    items: list[HistoryItem]
    total: int


@router.get("", response_model=HistoryResponse)
async def history_endpoint(
    limit: int = 50,
    session: AsyncSession = Depends(get_db),
) -> HistoryResponse:
    """Returns the most recent query history records."""
    records = await get_history(session, limit=limit)
    return HistoryResponse(
        items=[HistoryItem.model_validate(r) for r in records],
        total=len(records),
    )
