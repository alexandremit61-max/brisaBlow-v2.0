import { useState, useRef, useEffect, useCallback } from 'react';
import { Mic, Send, Plus, Sparkles, Copy, ThumbsUp, ThumbsDown, RotateCcw, MessageSquare, Trash2, ChevronLeft, ChevronRight } from 'lucide-react';

// ─── Types ────────────────────────────────────────────────────────────────────

type Message = {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
};

type Conversation = {
  id: string;
  title: string;
  messages: Message[];
  createdAt: Date;
  updatedAt: Date;
};

// ─── Constants ────────────────────────────────────────────────────────────────

const API_BASE = '/api/blow';

const WELCOME_MESSAGE: Message = {
  id: 'welcome',
  role: 'assistant',
  content: `Olá! Sou a **Blow IA Inteligência**, assistente técnica integrada ao cockpit **brisaBLOW**.

Posso ajudar você com:

- **Análise de alarmes** - identificação e triagem de incidentes críticos
- **Relatórios de performance** - SLA, latência e disponibilidade da rede
- **Diagnóstico técnico** - DWDM, METRO, Sites 5G e infraestrutura
- **Automação** - comandos de controle e resposta a eventos

Como posso ajudar hoje?`,
  timestamp: new Date(),
};

const SUGGESTIONS = [
  { label: 'Analisar alarmes críticos', prompt: 'Analise os alarmes críticos ativos na rede e sugira ações imediatas.' },
  { label: 'Relatório de SLA', prompt: 'Gere um relatório resumido do SLA de rede das últimas 24 horas.' },
  { label: 'Diagnóstico DWDM', prompt: 'Verifique o status dos links DWDM e identifique possíveis degradações.' },
  { label: 'Sites 5G offline', prompt: 'Quais sites 5G estão offline neste momento e qual é o impacto?' },
];

// ─── Markdown renderer ────────────────────────────────────────────────────────

function renderMarkdown(content: string) {
  const lines = content.split('\n');
  const result: React.ReactNode[] = [];

  lines.forEach((line, i) => {
    if (line.startsWith('## ')) {
      result.push(
        <h2 key={i} className="text-base font-semibold mt-4 mb-2" style={{ color: 'var(--bb-text)' }}>
          {line.slice(3)}
        </h2>
      );
    } else if (line.startsWith('# ')) {
      result.push(
        <h1 key={i} className="text-lg font-bold mt-4 mb-2" style={{ color: 'var(--bb-text)' }}>
          {line.slice(2)}
        </h1>
      );
    } else if (line.startsWith('- ') || line.startsWith('* ')) {
      const text = line.slice(2);
      result.push(
        <div key={i} className="flex items-start gap-2 my-1">
          <span className="mt-2 w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ backgroundColor: 'var(--bb-cyan)' }} />
          <span style={{ color: 'var(--bb-text-muted)' }}>{inlineMarkdown(text)}</span>
        </div>
      );
    } else if (line === '') {
      result.push(<div key={i} className="h-2" />);
    } else {
      result.push(
        <p key={i} className="my-1 leading-relaxed" style={{ color: 'var(--bb-text-muted)' }}>
          {inlineMarkdown(line)}
        </p>
      );
    }
  });

  return result;
}

function inlineMarkdown(text: string): React.ReactNode[] {
  const parts = text.split(/(\*\*.*?\*\*|`.*?`)/g);
  return parts.map((p, j) => {
    if (p.startsWith('**') && p.endsWith('**')) {
      return <strong key={j} style={{ color: 'var(--bb-text)' }}>{p.slice(2, -2)}</strong>;
    }
    if (p.startsWith('`') && p.endsWith('`')) {
      return (
        <code key={j} className="px-1.5 py-0.5 rounded text-xs font-mono" style={{ backgroundColor: 'var(--bb-surface-raised)', color: 'var(--bb-cyan)' }}>
          {p.slice(1, -1)}
        </code>
      );
    }
    return p;
  });
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function newConversation(): Conversation {
  return {
    id: Date.now().toString(),
    title: 'Nova conversa',
    messages: [{ ...WELCOME_MESSAGE, id: 'welcome-' + Date.now(), timestamp: new Date() }],
    createdAt: new Date(),
    updatedAt: new Date(),
  };
}

function deriveTitle(messages: Message[]): string {
  const first = messages.find((m) => m.role === 'user');
  if (!first) return 'Nova conversa';
  return first.content.slice(0, 40) + (first.content.length > 40 ? '...' : '');
}

function loadConversations(): Conversation[] {
  try {
    const raw = localStorage.getItem('bb-blow-conversations');
    if (!raw) return [];
    const parsed = JSON.parse(raw) as Conversation[];
    return parsed.map((c) => ({
      ...c,
      createdAt: new Date(c.createdAt),
      updatedAt: new Date(c.updatedAt),
      messages: c.messages.map((m) => ({ ...m, timestamp: new Date(m.timestamp) })),
    }));
  } catch {
    return [];
  }
}

function saveConversations(convs: Conversation[]) {
  localStorage.setItem('bb-blow-conversations', JSON.stringify(convs));
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function BlowIA() {
  const [conversations, setConversations] = useState<Conversation[]>(() => {
    const saved = loadConversations();
    return saved.length > 0 ? saved : [newConversation()];
  });
  const [activeId, setActiveId] = useState<string>(() => {
    const saved = loadConversations();
    return saved.length > 0 ? saved[0].id : conversations[0]?.id || '';
  });
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [historySidebarOpen, setHistorySidebarOpen] = useState(true);
  const [apiStatus, setApiStatus] = useState<'unknown' | 'online' | 'mock'>('unknown');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const activeConv = conversations.find((c) => c.id === activeId) || conversations[0];

  // Persist to localStorage on every change
  useEffect(() => {
    saveConversations(conversations);
  }, [conversations]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activeConv?.messages, isTyping]);

  // Check API status once on mount
  useEffect(() => {
    fetch(`${API_BASE}/status`)
      .then((r) => r.json())
      .then((d) => setApiStatus(d.api_configured ? 'online' : 'mock'))
      .catch(() => setApiStatus('mock'));
  }, []);

  const updateConv = useCallback((id: string, updater: (c: Conversation) => Conversation) => {
    setConversations((prev) => prev.map((c) => (c.id === id ? updater(c) : c)));
  }, []);

  const handleSend = useCallback(async (promptOverride?: string) => {
    const text = (promptOverride || input).trim();
    if (!text) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: text,
      timestamp: new Date(),
    };

    let updatedMessages: Message[] = [];
    updateConv(activeId, (c) => {
      updatedMessages = [...c.messages, userMsg];
      return {
        ...c,
        messages: updatedMessages,
        title: deriveTitle(updatedMessages),
        updatedAt: new Date(),
      };
    });

    setInput('');
    if (textareaRef.current) textareaRef.current.style.height = 'auto';
    setIsTyping(true);

    try {
      const context = updatedMessages
        .filter((m) => m.role === 'user' || m.role === 'assistant')
        .slice(-10)
        .map((m) => ({ role: m.role, content: m.content }));

      const resp = await fetch(`${API_BASE}/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text,
          conversation_id: activeId,
          context,
        }),
      });

      const data = resp.ok ? await resp.json() : null;
      const responseText = data?.response || getFallbackResponse(text);

      const assistantMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: responseText,
        timestamp: new Date(),
      };

      updateConv(activeId, (c) => ({
        ...c,
        messages: [...c.messages, userMsg, assistantMsg].filter((m, i, a) =>
          a.findIndex((x) => x.id === m.id) === i
        ),
        updatedAt: new Date(),
      }));
    } catch {
      const fallbackMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: getFallbackResponse(text),
        timestamp: new Date(),
      };

      updateConv(activeId, (c) => ({
        ...c,
        messages: [...c.messages, userMsg, fallbackMsg].filter((m, i, a) =>
          a.findIndex((x) => x.id === m.id) === i
        ),
        updatedAt: new Date(),
      }));
    } finally {
      setIsTyping(false);
    }
  }, [input, activeId, updateConv]);

  const handleNewChat = () => {
    const conv = newConversation();
    setConversations((prev) => [conv, ...prev]);
    setActiveId(conv.id);
    setInput('');
  };

  const handleDeleteConv = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setConversations((prev) => {
      const next = prev.filter((c) => c.id !== id);
      if (next.length === 0) {
        const fresh = newConversation();
        setActiveId(fresh.id);
        return [fresh];
      }
      if (id === activeId) setActiveId(next[0].id);
      return next;
    });
  };

  const handleCopy = (msg: Message) => {
    navigator.clipboard.writeText(msg.content).then(() => {
      setCopiedId(msg.id);
      setTimeout(() => setCopiedId(null), 2000);
    });
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
    e.target.style.height = 'auto';
    e.target.style.height = `${Math.min(e.target.scrollHeight, 200)}px`;
  };

  const isEmptyChat = activeConv?.messages.length === 1 && activeConv.messages[0].role === 'assistant';

  return (
    <div className="flex h-full overflow-hidden" style={{ backgroundColor: 'var(--bb-bg)' }}>
      {/* History Sidebar */}
      <div
        className="flex-shrink-0 flex flex-col border-r transition-all duration-300 overflow-hidden"
        style={{
          width: historySidebarOpen ? '240px' : '0px',
          borderColor: 'var(--bb-border)',
          backgroundColor: 'var(--bb-surface)',
        }}
      >
        <div className="flex-1 flex flex-col overflow-hidden" style={{ minWidth: '240px' }}>
          {/* Sidebar header */}
          <div className="flex items-center justify-between px-3 py-3 border-b flex-shrink-0" style={{ borderColor: 'var(--bb-border)' }}>
            <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--bb-text-dim)' }}>
              Conversas
            </span>
            <button
              onClick={handleNewChat}
              className="p-1.5 rounded-lg hover:opacity-70 transition-opacity"
              style={{ color: 'var(--bb-cyan)' }}
              title="Nova conversa"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>

          {/* Conversation list */}
          <div className="flex-1 overflow-y-auto py-2 px-2">
            {conversations.map((conv) => (
              <button
                key={conv.id}
                onClick={() => setActiveId(conv.id)}
                className="group w-full flex items-center gap-2 px-2 py-2 rounded-lg mb-1 text-left transition-all relative"
                style={{
                  backgroundColor: conv.id === activeId ? 'var(--bb-surface-raised)' : 'transparent',
                  color: conv.id === activeId ? 'var(--bb-text)' : 'var(--bb-text-muted)',
                  borderLeft: conv.id === activeId ? '2px solid var(--bb-cyan)' : '2px solid transparent',
                }}
              >
                <MessageSquare className="w-3.5 h-3.5 flex-shrink-0 opacity-60" />
                <div className="flex-1 min-w-0">
                  <p className="text-xs truncate">{conv.title}</p>
                  <p className="text-xs opacity-50" style={{ fontSize: '10px' }}>
                    {conv.updatedAt.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })}
                  </p>
                </div>
                <button
                  onClick={(e) => handleDeleteConv(conv.id, e)}
                  className="opacity-0 group-hover:opacity-60 hover:!opacity-100 p-0.5 rounded transition-opacity flex-shrink-0"
                  style={{ color: 'var(--bb-red)' }}
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              </button>
            ))}
          </div>

          {/* API status */}
          <div className="px-3 py-2 border-t flex-shrink-0" style={{ borderColor: 'var(--bb-border)' }}>
            <div className="flex items-center gap-2">
              <div
                className="w-1.5 h-1.5 rounded-full"
                style={{ backgroundColor: apiStatus === 'online' ? 'var(--bb-green)' : apiStatus === 'mock' ? 'var(--bb-orange)' : 'var(--bb-text-dim)' }}
              />
              <span className="text-xs" style={{ color: 'var(--bb-text-dim)' }}>
                {apiStatus === 'online' ? 'API conectada' : apiStatus === 'mock' ? 'Modo demonstracao' : 'Verificando...'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Toggle sidebar button */}
      <button
        onClick={() => setHistorySidebarOpen((v) => !v)}
        className="flex-shrink-0 flex items-center justify-center w-5 border-r transition-all hover:opacity-70"
        style={{ borderColor: 'var(--bb-border)', backgroundColor: 'var(--bb-surface)', color: 'var(--bb-text-dim)' }}
        title={historySidebarOpen ? 'Recolher histórico' : 'Expandir histórico'}
      >
        {historySidebarOpen ? <ChevronLeft className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
      </button>

      {/* Main chat area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <div
          className="flex items-center justify-between px-5 py-3 border-b flex-shrink-0"
          style={{ borderColor: 'var(--bb-border)', backgroundColor: 'var(--bb-surface)' }}
        >
          <div className="flex items-center gap-3">
            <div
              className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
              style={{ background: 'linear-gradient(135deg, #a855f7, #00d9ff)' }}
            >
              <Sparkles className="w-3.5 h-3.5 text-white" />
            </div>
            <div>
              <h2 className="text-sm font-semibold" style={{ color: 'var(--bb-text)' }}>
                Blow IA Inteligência
              </h2>
              <div className="flex items-center gap-1.5">
                <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                <span className="text-xs" style={{ color: 'var(--bb-text-dim)' }}>
                  brisaBLOW Neural v2.0
                </span>
              </div>
            </div>
          </div>

          <button
            onClick={handleNewChat}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs transition-all hover:opacity-80"
            style={{ backgroundColor: 'var(--bb-surface-raised)', color: 'var(--bb-text-muted)' }}
          >
            <Plus className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Nova conversa</span>
          </button>
        </div>

        {/* Messages or Welcome */}
        <div className="flex-1 overflow-y-auto">
          {isEmptyChat ? (
            <div className="flex flex-col items-center justify-center h-full px-4 py-8 max-w-2xl mx-auto text-center">
              <div
                className="w-14 h-14 rounded-2xl flex items-center justify-center mb-5"
                style={{ background: 'linear-gradient(135deg, #a855f7 0%, #00d9ff 100%)' }}
              >
                <Sparkles className="w-7 h-7 text-white" />
              </div>
              <h1 className="text-xl font-bold mb-2" style={{ color: 'var(--bb-text)' }}>
                Blow IA Inteligência
              </h1>
              <p className="text-sm mb-6 max-w-md" style={{ color: 'var(--bb-text-muted)' }}>
                Assistente inteligente integrado ao cockpit brisaBLOW. Analise a rede, diagnostique problemas e automatize operacoes.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 w-full max-w-xl">
                {SUGGESTIONS.map((s, i) => (
                  <button
                    key={i}
                    onClick={() => handleSend(s.prompt)}
                    className="text-left px-4 py-3 rounded-xl border transition-all hover:border-[#00d9ff]"
                    style={{ backgroundColor: 'var(--bb-surface)', borderColor: 'var(--bb-border)', color: 'var(--bb-text)' }}
                  >
                    <span className="text-sm font-medium">{s.label}</span>
                    <p className="text-xs mt-1" style={{ color: 'var(--bb-text-dim)' }}>{s.prompt}</p>
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="max-w-3xl mx-auto px-4 py-5 space-y-5">
              {activeConv?.messages.map((message) => (
                <div key={message.id}>
                  {message.role === 'user' ? (
                    <div className="flex justify-end">
                      <div
                        className="max-w-[80%] px-4 py-3 rounded-2xl rounded-tr-sm text-sm leading-relaxed"
                        style={{ backgroundColor: 'var(--bb-cyan)', color: '#000' }}
                      >
                        {message.content}
                      </div>
                    </div>
                  ) : (
                    <div className="flex gap-3">
                      <div
                        className="w-7 h-7 rounded-lg flex-shrink-0 flex items-center justify-center mt-1"
                        style={{ background: 'linear-gradient(135deg, #a855f7, #00d9ff)' }}
                      >
                        <Sparkles className="w-3.5 h-3.5 text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-xs mb-2" style={{ color: 'var(--bb-text-dim)' }}>
                          Blow IA - {message.timestamp.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                        </div>
                        <div className="text-sm leading-relaxed">{renderMarkdown(message.content)}</div>
                        <div className="flex items-center gap-1 mt-2.5">
                          <button
                            className="p-1.5 rounded-md transition-all hover:opacity-70"
                            style={{ color: copiedId === message.id ? 'var(--bb-green)' : 'var(--bb-text-dim)' }}
                            onClick={() => handleCopy(message)}
                            title="Copiar"
                          >
                            <Copy className="w-3.5 h-3.5" />
                          </button>
                          <button className="p-1.5 rounded-md hover:opacity-70" style={{ color: 'var(--bb-text-dim)' }} title="Util">
                            <ThumbsUp className="w-3.5 h-3.5" />
                          </button>
                          <button className="p-1.5 rounded-md hover:opacity-70" style={{ color: 'var(--bb-text-dim)' }} title="Nao util">
                            <ThumbsDown className="w-3.5 h-3.5" />
                          </button>
                          <button
                            className="p-1.5 rounded-md hover:opacity-70"
                            style={{ color: 'var(--bb-text-dim)' }}
                            onClick={() => handleSend(activeConv.messages.find((m) => m.role === 'user')?.content)}
                            title="Regenerar"
                          >
                            <RotateCcw className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}

              {isTyping && (
                <div className="flex gap-3">
                  <div
                    className="w-7 h-7 rounded-lg flex-shrink-0 flex items-center justify-center"
                    style={{ background: 'linear-gradient(135deg, #a855f7, #00d9ff)' }}
                  >
                    <Sparkles className="w-3.5 h-3.5 text-white" />
                  </div>
                  <div className="flex items-center gap-1 py-2.5">
                    {[0, 1, 2].map((i) => (
                      <div
                        key={i}
                        className="w-2 h-2 rounded-full animate-bounce"
                        style={{ backgroundColor: 'var(--bb-cyan)', animationDelay: `${i * 0.15}s` }}
                      />
                    ))}
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        {/* Input Area */}
        <div
          className="px-4 py-3 border-t flex-shrink-0"
          style={{ borderColor: 'var(--bb-border)', backgroundColor: 'var(--bb-surface)' }}
        >
          <div className="max-w-3xl mx-auto">
            <div
              className="relative rounded-2xl border"
              style={{ backgroundColor: 'var(--bb-surface-raised)', borderColor: 'var(--bb-border)' }}
            >
              <textarea
                ref={textareaRef}
                value={input}
                onChange={handleTextareaChange}
                onKeyDown={handleKeyDown}
                placeholder="Pergunte sobre a rede, alarmes, performance ou automacao..."
                rows={1}
                className="w-full px-4 py-3.5 pr-24 bg-transparent resize-none outline-none text-sm leading-relaxed"
                style={{ color: 'var(--bb-text)', maxHeight: '200px' }}
              />
              <div className="absolute right-2 bottom-2 flex items-center gap-1">
                <button
                  onClick={() => setIsListening((v) => !v)}
                  className={`p-2 rounded-lg transition-all ${isListening ? 'bg-purple-500 text-white' : 'hover:opacity-70'}`}
                  style={!isListening ? { color: 'var(--bb-text-dim)' } : {}}
                  title="Comando de voz"
                >
                  <Mic className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleSend()}
                  disabled={!input.trim() || isTyping}
                  className="p-2 rounded-lg transition-all disabled:opacity-30"
                  style={{
                    background: input.trim() ? 'linear-gradient(135deg, #a855f7, #00d9ff)' : 'var(--bb-surface-raised)',
                    color: input.trim() ? '#fff' : 'var(--bb-text-dim)',
                  }}
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>
            <p className="text-center text-xs mt-1.5" style={{ color: 'var(--bb-text-dim)' }}>
              Blow IA pode cometer erros. Verifique informacoes criticas com as equipes tecnicas.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Fallback (no backend) ────────────────────────────────────────────────────

function getFallbackResponse(message: string): string {
  const lower = message.toLowerCase();

  if (lower.includes('alarm') || lower.includes('critico') || lower.includes('critica')) {
    return `**[MODO DEMONSTRACAO]** - Conecte o backend para respostas reais.

**Alarmes criticos ativos:**

- \`MRO0005\` - Mossoró Alto Base - Bateria critica (18%)
- \`JUO0001\` - Juazeiro do Norte Leste - Temperatura elevada
- \`NAT100\` - Link DWDM C21 degradado

**Recomendacao:** Despacho imediato para MRO0005. Autonomia estimada: 45 minutos.`;
  }

  if (lower.includes('sla') || lower.includes('performance') || lower.includes('relatorio')) {
    return `**[MODO DEMONSTRACAO]** - Conecte o backend para respostas reais.

**SLA das ultimas 24 horas:**

- **Disponibilidade geral:** 99.5% (meta: 99.9%)
- **Latencia media:** 28ms (limite: 40ms)
- **Sites offline:** 2 de 9
- **Links DWDM degradados:** 1 canal

**Periodo critico:** 03:15 - 04:22 (indisponibilidade no enlace FLA100 - NAT100)`;
  }

  if (lower.includes('dwdm') || lower.includes('data center') || lower.includes('canal')) {
    return `**[MODO DEMONSTRACAO]** - Conecte o backend para respostas reais.

**Status dos canais DWDM:**

- Canal C11 (FLA100 -> NAT100): **operacional** - 400 Gbps
- Canal C21 (FLA100 -> NAT100): **DEGRADADO** - atenuacao elevada
- Canal C04 (PEN100 -> SMA100): **operacional** - 200 Gbps
- Canal C08 (MAC100 -> REC100): **operacional** - 400 Gbps

**Acao sugerida:** Verificar EDFA no no FLA100 - possivel degradacao no amplificador.`;
  }

  return `**[MODO DEMONSTRACAO]** - Conecte o backend para respostas reais.

Sua consulta sobre **"${message.slice(0, 60)}${message.length > 60 ? '...' : ''}"** foi recebida.

Com base nos dados da rede brisaBLOW:

- **SLA atual:** 99.5% - abaixo da meta de 99.9%
- **Alarmes criticos:** 3 ativos
- **Sites sem AC:** 5 unidades em bateria

Para respostas com IA real, configure \`BLOW_API_KEY\` e \`BLOW_API_URL\` no arquivo \`backend/.env\`.`;
}
