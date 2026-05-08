from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import text
from db.schema_introspection import get_secure_schema
from db.security import validate_sql_read_only, SQLSecurityException
from services.llm import generate_sql_from_nl


async def execute_nl_query(session: AsyncSession, user_query: str) -> dict:
    """
    Orchestrates the entire NL2SQL flow:
    1. Reads the secure schema.
    2. Calls LLM to generate SQL.
    3. Validates the SQL AST (Zero-Trust).
    4. Executes the validated SQL.
    """
    # Step 1: Introspection
    schema = await get_secure_schema(session)

    # Step 2: Generation
    raw_sql = await generate_sql_from_nl(user_query, schema)

    # Step 3: Security Validation (AST)
    validated_sql = validate_sql_read_only(raw_sql)

    # Step 4: Execution
    result = await session.execute(text(validated_sql))
    rows = result.fetchall()

    column_names = list(result.keys())
    data = [dict(zip(column_names, row)) for row in rows]

    return {
        "status": "success",
        "generated_sql": validated_sql,
        "columns": column_names,
        "data": data,
        "row_count": len(data),
    }
