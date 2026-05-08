from typing import List, Optional
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from db.models import QueryHistory


async def save_query(
    session: AsyncSession,
    query_type: str,
    user_query: str,
    result_summary: Optional[str] = None,
    generated_sql: Optional[str] = None,
) -> QueryHistory:
    """
    Persists a query execution to the history table.
    query_type must be 'nl2sql' or 'rag'.
    """
    record = QueryHistory(
        query_type=query_type,
        user_query=user_query,
        result_summary=result_summary,
        generated_sql=generated_sql,
    )
    session.add(record)
    await session.commit()
    await session.refresh(record)
    return record


async def get_history(
    session: AsyncSession,
    limit: int = 50,
) -> List[QueryHistory]:
    """Returns the most recent query history records, newest first."""
    result = await session.execute(
        select(QueryHistory)
        .order_by(QueryHistory.created_at.desc())
        .limit(limit)
    )
    return list(result.scalars().all())


async def get_query_count(session: AsyncSession) -> int:
    """Returns total number of queries executed."""
    from sqlalchemy import func
    result = await session.execute(
        select(func.count()).select_from(QueryHistory)
    )
    return result.scalar_one()
