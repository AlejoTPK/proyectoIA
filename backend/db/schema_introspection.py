from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import text
from typing import List, Dict

async def get_secure_schema(session: AsyncSession) -> str:
    """
    Retrieves the database schema formatted for LLM consumption,
    strictly filtering out system and auth tables to prevent data leaks.
    """
    
    # Query to get tables and columns, ignoring system catalogs
    query = text("""
        SELECT table_name, column_name, data_type
        FROM information_schema.columns
        WHERE table_schema = 'public'
          AND table_name NOT IN ('alembic_version')
          AND table_name NOT LIKE 'auth_%'
          AND table_name NOT LIKE 'users%'
        ORDER BY table_name, ordinal_position;
    """)
    
    result = await session.execute(query)
    rows = result.fetchall()
    
    schema_dict: Dict[str, List[Dict[str, str]]] = {}
    for row in rows:
        t_name = row.table_name
        if t_name not in schema_dict:
            schema_dict[t_name] = []
        schema_dict[t_name].append({
            "column": row.column_name,
            "type": row.data_type
        })
        
    # Format for the LLM
    schema_text = "Database Schema:\n"
    for table, columns in schema_dict.items():
        schema_text += f"Table: {table}\n"
        for col in columns:
            schema_text += f"  - {col['column']} ({col['type']})\n"
        schema_text += "\n"
        
    return schema_text
