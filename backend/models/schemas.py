git add ."""
Schemas Pydantic — contratos de entrada e saída da API Blow IA.
"""

from pydantic import BaseModel, Field, field_validator
from typing import Optional
from datetime import datetime


# ─── Requisição ───────────────────────────────────────────────────────────────

class ChatRequest(BaseModel):
    message: str = Field(..., min_length=1, max_length=4000, description="Mensagem do usuário")
    conversation_id: Optional[str] = Field(None, description="ID da conversa para manter contexto")
    context: Optional[list[dict]] = Field(default=[], description="Histórico de mensagens anteriores")

    @field_validator("message")
    @classmethod
    def sanitize_message(cls, v: str) -> str:
        """Sanitização básica: remove caracteres de controle."""
        return v.strip().replace("\x00", "")


# ─── Resposta ─────────────────────────────────────────────────────────────────

class ChatResponse(BaseModel):
    response: str
    conversation_id: Optional[str] = None
    model_used: str = "mock"
    timestamp: str = Field(default_factory=lambda: datetime.now().isoformat())
    tokens_used: Optional[int] = None


class StatusResponse(BaseModel):
    status: str
    assistant: str
    version: str
    api_configured: bool
    model: str
    timestamp: str = Field(default_factory=lambda: datetime.now().isoformat())


class HealthResponse(BaseModel):
    healthy: bool
    message: str
    api_reachable: bool
    timestamp: str = Field(default_factory=lambda: datetime.now().isoformat())


class ErrorResponse(BaseModel):
    error: str
    detail: Optional[str] = None
    timestamp: str = Field(default_factory=lambda: datetime.now().isoformat())
