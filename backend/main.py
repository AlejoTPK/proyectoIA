from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from db.session import engine
from db.models import Base
from api.routes.query import router as query_router
from api.routes.rag import router as rag_router
from api.routes.history import router as history_router
from api.routes.health import router as health_router


from sqlalchemy import text

@asynccontextmanager
async def lifespan(app: FastAPI):
    """Creates all DB tables on startup using the async engine."""
    async with engine.begin() as conn:
        await conn.execute(text("CREATE EXTENSION IF NOT EXISTS vector"))
        await conn.run_sync(Base.metadata.create_all)
    yield


app = FastAPI(
    title="AI-Powered Knowledge & SQL Engine",
    description="Backend API para Motor de Conocimiento e Inteligencia SQL con IA",
    version="1.0.0",
    lifespan=lifespan,
)

# Strict CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://frontend:5173"],
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=["Content-Type", "Authorization", "Accept"],
)

# Register all routers under /api prefix
app.include_router(query_router, prefix="/api")
app.include_router(rag_router, prefix="/api")
app.include_router(history_router, prefix="/api")
app.include_router(health_router, prefix="/api")
