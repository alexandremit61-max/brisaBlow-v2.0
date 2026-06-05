"""
Blow IA Inteligência — servidor FastAPI principal.

Para rodar:
    uvicorn blow_ia_api:app --reload --port 8000

Para produção:
    uvicorn blow_ia_api:app --host 0.0.0.0 --port 8000 --workers 4
"""

import logging
from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from config.settings import settings
from routes import router
from services.blow_ai import blow_ai

# ─── Logging ──────────────────────────────────────────────────────────────────

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s  %(levelname)-8s  %(name)s  %(message)s",
    datefmt="%Y-%m-%d %H:%M:%S",
)
logger = logging.getLogger("blow_ia")


# ─── Lifecycle ────────────────────────────────────────────────────────────────

@asynccontextmanager
async def lifespan(app: FastAPI):
    logger.info(f"Iniciando {settings.ASSISTANT_NAME} v{settings.VERSION}")
    logger.info(f"API configurada: {settings.api_configured} | Modelo: {settings.MODEL_NAME}")
    yield
    logger.info("Encerrando servidor — fechando cliente HTTP...")
    await blow_ai.close()


# ─── App ──────────────────────────────────────────────────────────────────────

app = FastAPI(
    title=settings.ASSISTANT_NAME,
    version=settings.VERSION,
    description=(
        "API da Blow IA Inteligência — assistente técnica integrada ao cockpit brisaBLOW. "
        "Monitora redes de telecomunicações, diagnostica alarmes e automatiza operações."
    ),
    lifespan=lifespan,
)

# ─── CORS ─────────────────────────────────────────────────────────────────────

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ─── Rotas ────────────────────────────────────────────────────────────────────

app.include_router(router)


@app.get("/", tags=["Root"])
async def root():
    return {
        "service": settings.ASSISTANT_NAME,
        "version": settings.VERSION,
        "status": "online",
        "docs": "/docs",
    }
