import sqlglot
from sqlglot.errors import ParseError

class SQLSecurityException(Exception):
    pass

def validate_sql_read_only(sql_query: str) -> str:
    """
    Validates that a SQL query is read-only and does not contain destructive operations.
    Uses Abstract Syntax Tree (AST) parsing via sqlglot.
    """
    try:
        # Parse the query into an AST
        expressions = sqlglot.parse(sql_query, read="postgres")
    except ParseError as e:
        raise SQLSecurityException(f"Failed to parse SQL query: {str(e)}")

    if not expressions:
        raise SQLSecurityException("Empty SQL query provided.")

    for expr in expressions:
        if not expr:
            continue
            
        # We only allow SELECT statements
        if not isinstance(expr, sqlglot.exp.Select):
            raise SQLSecurityException(
                f"Destructive or non-SELECT operation detected: {expr.key.upper()}"
            )

        # Walk through the AST to catch nested malicious statements
        for node in expr.walk():
            # Check for things like subqueries that might try to mutate (though unlikely in standard SELECT, good defense in depth)
            if isinstance(node, (sqlglot.exp.Delete, sqlglot.exp.Insert, sqlglot.exp.Update, sqlglot.exp.Drop, sqlglot.exp.Alter, sqlglot.exp.Command)):
                raise SQLSecurityException(f"Forbidden operation detected in AST: {node.key.upper()}")

    # If it passes, return the parsed and standardized SQL
    # This also helps mitigate SQL injection by formatting it cleanly
    return expressions[0].sql(dialect="postgres")
