from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from sqlalchemy.ext.asyncio import AsyncSession

from db.session import get_db
from services.sql_engine import execute_nl_query
from services.history import save_query

router = APIRouter(prefix="/query", tags=["NL2SQL"])


class QueryRequest(BaseModel):
    question: str


class QueryResponse(BaseModel):
    status: str
    generated_sql: str
    columns: list[str]
    data: list[dict]
    row_count: int


@router.post("", response_model=QueryResponse)
async def nl2sql_query(
    body: QueryRequest,
    session: AsyncSession = Depends(get_db),
) -> QueryResponse:
    """
    Converts a natural-language question into SQL, validates it (AST),
    executes it read-only, and returns the result.
    """
    if not body.question.strip():
        raise HTTPException(status_code=400, detail="La pregunta no puede estar vacía.")

    result = await execute_nl_query(session, body.question)

    # Persist to history (non-blocking on failure)
    try:
        summary = f"{result['row_count']} filas retornadas"
        await save_query(
            session=session,
            query_type="nl2sql",
            user_query=body.question,
            result_summary=summary,
            generated_sql=result["generated_sql"],
        )
    except Exception:
        pass  # History failure must never break the main response

    return QueryResponse(**result)
