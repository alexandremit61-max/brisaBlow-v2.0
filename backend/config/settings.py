"""
Configurações centrais da Blow IA Inteligência.

Para integrar uma API de IA real, edite o arquivo .env na raiz do backend:
  BLOW_API_KEY=sua_chave_aqui
  BLOW_API_URL=https://api.openai.com/v1/chat/completions   # OpenAI
  # BLOW_API_URL=https://api.anthropic.com/v1/messages      # Anthropic Claude
  # BLOW_API_URL=https://generativelanguage.googleapis.com/ # Google Gemini
  # BLOW_API_URL=https://api.deepseek.com/v1/chat/completions
  # BLOW_API_URL=https://openrouter.ai/api/v1/chat/completions
  MODEL_NAME=gpt-4o                                         # Troque pelo modelo desejado
"""

import os
from dotenv import load_dotenv

load_dotenv()


class Settings:
    # ─── Identidade ───────────────────────────────────────────────────────────
    ASSISTANT_NAME: str = "Blow IA Inteligência"
    VERSION: str = "1.0.0"
    SYSTEM_PROMPT: str = (
        "Você é a Blow IA Inteligência, assistente técnica integrada ao cockpit brisaBLOW. "
        "Você ajuda operadores a monitorar redes de telecomunicações, diagnosticar alarmes, "
        "analisar performance DWDM/METRO/5G e automatizar operações. "
        "Responda sempre em português, de forma clara, técnica e objetiva."
    )

    # ─── API de IA (preencher no .env para ativar) ────────────────────────────
    # ⚠️  PONTO DE INTEGRAÇÃO: adicione sua chave e URL aqui via .env
    BLOW_API_KEY: str = os.getenv("BLOW_API_KEY", "")
    BLOW_API_URL: str = os.getenv("BLOW_API_URL", "")
    MODEL_NAME: str = os.getenv("MODEL_NAME", "gpt-4o")

    # ─── Comportamento ────────────────────────────────────────────────────────
    REQUEST_TIMEOUT: int = int(os.getenv("REQUEST_TIMEOUT", "30"))
    MAX_TOKENS: int = int(os.getenv("MAX_TOKENS", "2048"))
    TEMPERATURE: float = float(os.getenv("TEMPERATURE", "0.7"))

    # ─── Servidor ─────────────────────────────────────────────────────────────
    HOST: str = os.getenv("HOST", "0.0.0.0")
    PORT: int = int(os.getenv("PORT", "8000"))
    CORS_ORIGINS: list[str] = os.getenv("CORS_ORIGINS", "http://localhost:5173").split(",")

    @property
    def api_configured(self) -> bool:
        """Retorna True se uma API real estiver configurada."""
        return bool(self.BLOW_API_KEY and self.BLOW_API_URL)


settings = Settings()
