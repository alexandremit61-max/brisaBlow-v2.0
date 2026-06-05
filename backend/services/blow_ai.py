"""
BlowAI — classe principal de integração com APIs de IA.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  PONTO DE INTEGRAÇÃO — como conectar sua API:

  1. Edite o arquivo backend/.env:
       BLOW_API_KEY=sk-...
       BLOW_API_URL=https://api.openai.com/v1/chat/completions
       MODEL_NAME=gpt-4o

  2. Exemplos de URL por provedor:
       OpenAI:      https://api.openai.com/v1/chat/completions
       Anthropic:   https://api.anthropic.com/v1/messages
       Google:      https://generativelanguage.googleapis.com/v1beta/...
       DeepSeek:    https://api.deepseek.com/v1/chat/completions
       Mistral:     https://api.mistral.ai/v1/chat/completions
       OpenRouter:  https://openrouter.ai/api/v1/chat/completions
       API própria: http://seu-servidor/v1/chat

  3. O método send_message() já está estruturado para o formato
     OpenAI-compatible (usado pela maioria dos provedores).
     Para Anthropic, ajuste apenas o método _call_anthropic().
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
"""

import httpx
import logging
import random
from datetime import datetime
from typing import Optional

from config.settings import settings

logger = logging.getLogger("blow_ia")


# Respostas mock para quando nenhuma API estiver configurada
MOCK_RESPONSES = [
    (
        "Analisando os dados da rede brisaBLOW...\n\n"
        "**Status atual da infraestrutura:**\n"
        "- Links DWDM: operando dentro dos parâmetros normais\n"
        "- Sites 5G: {online} online, {alerts} em alerta\n"
        "- Latência média: 28ms (dentro do limite de 40ms)\n\n"
        "Posso detalhar alguma região específica ou gerar um relatório completo?"
    ),
    (
        "Processando sua solicitação sobre a rede...\n\n"
        "Com base nos dados em tempo real:\n"
        "- **SLA atual:** 99.5% (meta: 99.9%)\n"
        "- **Alarmes críticos:** 3 ativos\n"
        "- **Sites sem AC:** 5 unidades em bateria\n\n"
        "Recomendo verificar os sites `JUO0001` e `MRO0005` com maior urgência — "
        "autonomia crítica detectada. Deseja que eu gere o despacho técnico?"
    ),
    (
        "**Diagnóstico concluído:**\n\n"
        "```\nSite: MRO0005 — Mossoró Alto Base\n"
        "Status: CRÍTICO\nBateria: 18%\nPrevisão esgotamento: 15:45\n```\n\n"
        "Ação recomendada: despacho imediato de equipe técnica. "
        "Posso abrir o Google Maps com a localização exata do site."
    ),
    (
        "Realizei uma varredura completa nos links METRO e DWDM.\n\n"
        "**Resultados:**\n"
        "- Canal C21 (FLA100 → NAT100): **DOWN** — requer atenção\n"
        "- Canal C11 (FLA100 → PAR100): operacional · 400 Gbps\n"
        "- Canal C04 (PEN100 → SMA100): operacional · 200 Gbps\n\n"
        "O canal C21 está em modo TRÂNSITO. Sugiro verificar o amplificador EDFA no nó FLA100."
    ),
]


class BlowAI:
    """
    Classe principal da Blow IA Inteligência.
    Gerencia configuração, comunicação com a API e respostas mock.
    """

    def __init__(self):
        self.config = self.load_config()
        self._client: Optional[httpx.AsyncClient] = None

    # ─── Configuração ─────────────────────────────────────────────────────────

    def load_config(self) -> dict:
        """Carrega e valida a configuração do ambiente."""
        config = {
            "api_key": settings.BLOW_API_KEY,
            "api_url": settings.BLOW_API_URL,
            "model": settings.MODEL_NAME,
            "timeout": settings.REQUEST_TIMEOUT,
            "max_tokens": settings.MAX_TOKENS,
            "temperature": settings.TEMPERATURE,
            "system_prompt": settings.SYSTEM_PROMPT,
            "configured": settings.api_configured,
        }

        if config["configured"]:
            logger.info(f"API configurada: {config['api_url']} · modelo: {config['model']}")
        else:
            logger.warning("Nenhuma API configurada — usando respostas mock. "
                           "Adicione BLOW_API_KEY e BLOW_API_URL no arquivo .env")

        return config

    # ─── Cliente HTTP ─────────────────────────────────────────────────────────

    async def _get_client(self) -> httpx.AsyncClient:
        if self._client is None or self._client.is_closed:
            self._client = httpx.AsyncClient(timeout=self.config["timeout"])
        return self._client

    async def close(self):
        if self._client and not self._client.is_closed:
            await self._client.aclose()

    # ─── Envio de mensagem ────────────────────────────────────────────────────

    async def send_message(
        self,
        message: str,
        context: list[dict] | None = None,
    ) -> dict:
        """
        Envia mensagem para a API de IA e retorna a resposta.

        Se nenhuma API estiver configurada, retorna resposta mock.
        O formato segue o padrão OpenAI-compatible (messages array).

        ⚠️  PONTO DE INTEGRAÇÃO:
        Para adaptar ao formato Anthropic, substitua _call_openai_compatible()
        por _call_anthropic() e ajuste os headers conforme necessário.
        """
        if not self.config["configured"]:
            return self._mock_response(message)

        messages = self._build_messages(message, context or [])

        try:
            # ── OpenAI / DeepSeek / Mistral / OpenRouter / API própria ───────
            # Todos usam o mesmo formato OpenAI-compatible
            return await self._call_openai_compatible(messages)

            # ── Para Anthropic Claude, descomente a linha abaixo: ────────────
            # return await self._call_anthropic(message, context or [])

        except httpx.TimeoutException:
            logger.error("Timeout na chamada à API de IA")
            return {"response": "Tempo limite excedido. Tente novamente.", "error": True}

        except httpx.HTTPStatusError as e:
            logger.error(f"Erro HTTP {e.response.status_code}: {e.response.text}")
            return {"response": f"Erro na API: {e.response.status_code}.", "error": True}

        except Exception as e:
            logger.exception(f"Erro inesperado ao chamar API: {e}")
            return {"response": "Erro interno. Verifique os logs.", "error": True}

    # ─── Chamadas por provedor ────────────────────────────────────────────────

    async def _call_openai_compatible(self, messages: list[dict]) -> dict:
        """
        Chamada padrão OpenAI-compatible.
        Funciona com: OpenAI, DeepSeek, Mistral, OpenRouter, API própria.

        ⚠️  PONTO DE INTEGRAÇÃO:
        Ajuste os headers se seu provedor exigir chaves diferentes.
        Ex.: OpenRouter requer 'HTTP-Referer' e 'X-Title'.
        """
        client = await self._get_client()

        headers = {
            "Authorization": f"Bearer {self.config['api_key']}",
            "Content-Type": "application/json",
            # OpenRouter — descomente se necessário:
            # "HTTP-Referer": "https://brisablow.com",
            # "X-Title": "brisaBLOW Blow IA",
        }

        payload = {
            "model": self.config["model"],
            "messages": messages,
            "max_tokens": self.config["max_tokens"],
            "temperature": self.config["temperature"],
        }

        resp = await client.post(self.config["api_url"], json=payload, headers=headers)
        resp.raise_for_status()
        data = resp.json()

        return {
            "response": data["choices"][0]["message"]["content"],
            "model_used": data.get("model", self.config["model"]),
            "tokens_used": data.get("usage", {}).get("total_tokens"),
        }

    async def _call_anthropic(self, message: str, context: list[dict]) -> dict:
        """
        Chamada específica para Anthropic Claude.

        ⚠️  PONTO DE INTEGRAÇÃO:
        Configure BLOW_API_URL=https://api.anthropic.com/v1/messages
        e MODEL_NAME=claude-opus-4-7 (ou outro modelo Claude)
        """
        client = await self._get_client()

        headers = {
            "x-api-key": self.config["api_key"],
            "anthropic-version": "2023-06-01",
            "Content-Type": "application/json",
        }

        # Converte contexto para o formato Anthropic
        messages = [
            {"role": m["role"], "content": m["content"]}
            for m in context
            if m["role"] in ("user", "assistant")
        ]
        messages.append({"role": "user", "content": message})

        payload = {
            "model": self.config["model"],
            "max_tokens": self.config["max_tokens"],
            "system": self.config["system_prompt"],
            "messages": messages,
        }

        resp = await client.post(self.config["api_url"], json=payload, headers=headers)
        resp.raise_for_status()
        data = resp.json()

        return {
            "response": data["content"][0]["text"],
            "model_used": data.get("model", self.config["model"]),
            "tokens_used": data.get("usage", {}).get("input_tokens", 0)
                         + data.get("usage", {}).get("output_tokens", 0),
        }

    # ─── Health check ─────────────────────────────────────────────────────────

    async def health_check(self) -> dict:
        """Verifica se a API externa está acessível."""
        if not self.config["configured"]:
            return {
                "healthy": True,
                "message": "Rodando em modo mock — configure .env para ativar IA real.",
                "api_reachable": False,
            }

        try:
            client = await self._get_client()
            resp = await client.get(
                self.config["api_url"].replace("/chat/completions", "/models"),
                headers={"Authorization": f"Bearer {self.config['api_key']}"},
                timeout=5,
            )
            reachable = resp.status_code < 500
            return {
                "healthy": reachable,
                "message": "API acessível." if reachable else f"API retornou {resp.status_code}.",
                "api_reachable": reachable,
            }
        except Exception as e:
            logger.warning(f"Health check falhou: {e}")
            return {
                "healthy": False,
                "message": f"API inacessível: {type(e).__name__}",
                "api_reachable": False,
            }

    # ─── Mock ─────────────────────────────────────────────────────────────────

    def _mock_response(self, message: str) -> dict:
        """Resposta simulada para desenvolvimento sem API configurada."""
        template = random.choice(MOCK_RESPONSES)
        response = template.format(online=4, alerts=5)
        return {
            "response": f"**[MODO DEMONSTRAÇÃO]** — Conecte uma API no `.env` para respostas reais.\n\n{response}",
            "model_used": "mock",
            "tokens_used": None,
        }

    # ─── Helpers ──────────────────────────────────────────────────────────────

    def _build_messages(self, message: str, context: list[dict]) -> list[dict]:
        """Monta o array de mensagens com system prompt + contexto + nova mensagem."""
        messages = [{"role": "system", "content": self.config["system_prompt"]}]
        for m in context[-10:]:  # mantém as últimas 10 trocas para não esgotar tokens
            if m.get("role") in ("user", "assistant"):
                messages.append({"role": m["role"], "content": m["content"]})
        messages.append({"role": "user", "content": message})
        return messages


# Instância global (singleton)
blow_ai = BlowAI()
