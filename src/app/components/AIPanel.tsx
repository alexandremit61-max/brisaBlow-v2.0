import { useState, useRef, useEffect } from 'react';
import { Mic, Send, Volume2 } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { ScrollArea } from './ui/scroll-area';
import { Tabs, TabsList, TabsTrigger } from './ui/tabs';

type Message = {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
};

type Agent = 'sura' | 'aslan';

export default function AIPanel() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: 'Olá! Sou **Sura**, sua assistente de IA do brisaBLOW. Como posso ajudar com o monitoramento da rede hoje?',
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [activeAgent, setActiveAgent] = useState<Agent>('sura');
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      role: 'user',
      content: input,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');

    // Simular resposta da IA
    setTimeout(() => {
      const agentName = activeAgent === 'sura' ? 'Sura' : 'Aslan';
      const response: Message = {
        role: 'assistant',
        content: `[${agentName}] Analisando sua solicitação: "${input}". Aguarde enquanto processo os dados da rede...`,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, response]);
    }, 1000);
  };

  const handleVoiceCommand = () => {
    setIsListening(!isListening);
    // Implementação real de reconhecimento de voz seria adicionada aqui
  };

  const renderMessage = (content: string) => {
    // Suporte básico para Markdown
    const parts = content.split(/(\*\*.*?\*\*)/g);
    return parts.map((part, i) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return <strong key={i}>{part.slice(2, -2)}</strong>;
      }
      return <span key={i}>{part}</span>;
    });
  };

  return (
    <div className="w-[380px] bg-[#0f1419] border-l border-gray-800 flex flex-col">
      {/* Header - Agent Selector */}
      <div className="p-4 border-b border-gray-800">
        <Tabs value={activeAgent} onValueChange={(v) => setActiveAgent(v as Agent)}>
          <TabsList className="w-full bg-[#151b2b] border border-gray-700">
            <TabsTrigger 
              value="sura" 
              className="flex-1 data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600 data-[state=active]:to-violet-500 data-[state=active]:text-white"
            >
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${activeAgent === 'sura' ? 'bg-purple-300 animate-pulse' : 'bg-gray-600'}`}></div>
                <span>Sura</span>
              </div>
            </TabsTrigger>
            <TabsTrigger 
              value="aslan" 
              className="flex-1 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-cyan-500 data-[state=active]:text-white"
            >
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${activeAgent === 'aslan' ? 'bg-cyan-300 animate-pulse' : 'bg-gray-600'}`}></div>
                <span>Aslan</span>
              </div>
            </TabsTrigger>
          </TabsList>
        </Tabs>

        {/* Voice Wave Indicator */}
        <div className="mt-3 flex items-center justify-center gap-1 h-8">
          {isListening ? (
            <>
              {[...Array(20)].map((_, i) => (
                <div
                  key={i}
                  className={`w-1 rounded-full ${
                    activeAgent === 'sura' ? 'bg-purple-500' : 'bg-cyan-500'
                  }`}
                  style={{
                    height: `${Math.random() * 100}%`,
                    animation: `pulse ${0.5 + Math.random() * 0.5}s ease-in-out infinite`,
                  }}
                ></div>
              ))}
            </>
          ) : (
            <div className="text-xs text-gray-600">
              {activeAgent === 'sura' ? '🎵 Sura em Standby' : '🎵 Aslan em Standby'}
            </div>
          )}
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4" ref={scrollRef}>
        <div className="space-y-4">
          {messages.map((message, idx) => (
            <div
              key={idx}
              className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[85%] rounded-lg px-4 py-2.5 ${
                  message.role === 'user'
                    ? 'bg-[#00d9ff]/10 border border-[#00d9ff]/30 text-[#00d9ff]'
                    : activeAgent === 'sura'
                    ? 'bg-purple-500/10 border border-purple-500/30 text-purple-200'
                    : 'bg-cyan-500/10 border border-cyan-500/30 text-cyan-200'
                }`}
              >
                <div className="text-sm leading-relaxed">
                  {renderMessage(message.content)}
                </div>
                <div className="text-[10px] text-gray-500 mt-1">
                  {message.timestamp.toLocaleTimeString('pt-BR', {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Input Area */}
      <div className="p-4 border-t border-gray-800">
        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Digite sua dúvida técnica..."
              className="pr-10 bg-[#151b2b] border-gray-700 text-white placeholder:text-gray-600 focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
            />
            <button
              onClick={handleVoiceCommand}
              className={`absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-md transition-all ${
                isListening
                  ? activeAgent === 'sura'
                    ? 'bg-purple-500 text-white'
                    : 'bg-cyan-500 text-white'
                  : 'text-gray-500 hover:text-white hover:bg-gray-700'
              }`}
            >
              <Mic className="w-4 h-4" />
            </button>
          </div>
          <Button
            onClick={handleSend}
            size="icon"
            className={`${
              activeAgent === 'sura'
                ? 'bg-purple-600 hover:bg-purple-700'
                : 'bg-cyan-600 hover:bg-cyan-700'
            }`}
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>

        <div className="mt-2 text-[10px] text-gray-600 flex items-center gap-1">
          <Volume2 className="w-3 h-3" />
          <span>Comandos de voz para automação IoT e controle de PC</span>
        </div>
      </div>
    </div>
  );
}