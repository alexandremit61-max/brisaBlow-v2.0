"""
Rotas FastAPI — Blow IA Inteligência.
"""

import uuid
import logging
from fastapi import APIRouter, HTTPException

from models import ChatRequest, ChatResponse, StatusResponse, HealthResponse, ErrorResponse
from services.blow_ai import blow_ai
from config.settings import settings

logger = logging.getLogger("blow_ia")

router = APIRouter(prefix="/api/blow", tags=["Blow IA"])


@router.get("/status", response_model=StatusResponse)
async def status():
    """Retorna o status atual do serviço Blow IA."""
    return StatusResponse(
        status="online",
        assistant=settings.ASSISTANT_NAME,
        version=settings.VERSION,
        api_configured=settings.api_configured,
        model=settings.MODEL_NAME,
    )


@router.get("/health", response_model=HealthResponse)
async def health():
    """Verifica a saúde do serviço e conectividade com a API de IA."""
    result = await blow_ai.health_check()
    return HealthResponse(**result)


@router.post("/chat", response_model=ChatResponse)
async def chat(req: ChatRequest):
    """
    Envia uma mensagem para a Blow IA e retorna a resposta.

    - Se nenhuma API estiver configurada, retorna resposta mock.
    - Mantém contexto via `conversation_id` e array `context`.
    """
    try:
        result = await blow_ai.send_message(
            message=req.message,
            context=req.context or [],
        )

        if result.get("error"):
            raise HTTPException(status_code=502, detail=result["response"])

        return ChatResponse(
            response=result["response"],
            conversation_id=req.conversation_id or str(uuid.uuid4()),
            model_used=result.get("model_used", "mock"),
            tokens_used=result.get("tokens_used"),
        )

    except HTTPException:
        raise
    except Exception as e:
        logger.exception(f"Erro inesperado no endpoint /chat: {e}")
        raise HTTPException(status_code=500, detail="Erro interno do servidor.")
