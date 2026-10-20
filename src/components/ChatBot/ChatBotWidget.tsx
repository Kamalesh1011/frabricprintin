import React, { useState, useEffect, useRef } from 'react';
import {
  MessageSquare,
  X,
  Send,
  Trash2,
  Settings,
  Maximize2,
  Minimize2,
  Check,
  Copy,
  Sliders,
  Sparkles
} from 'lucide-react';
import {
  ChatMessage,
  ChatSettings,
  ChatModelOption,
  RECOMMENDED_MODELS,
  getStoredChatSettings,
  saveChatSettings,
  getStoredChatHistory,
  saveChatHistory,
  clearStoredChatHistory,
  fetchChatConfig,
  sendChatMessage
} from '../../services/chatService';

interface ChatBotWidgetProps {
  onNavigate?: (tab: string) => void;
  onOpenBulkInquiry?: () => void;
}

const QUICK_SUGGESTIONS = [
  'Best fabric for summer kurtis & shirts?',
  'Difference between DTF & Sublimation?',
  'How to pick the right GSM for apparel?',
  'Wholesale volume discount pricing?'
];

export const ChatBotWidget: React.FC<ChatBotWidgetProps> = ({
  onNavigate,
  onOpenBulkInquiry
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMaximized, setIsMaximized] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  // Settings
  const [settings, setSettings] = useState<ChatSettings>(getStoredChatSettings);
  const [selectedModel, setSelectedModel] = useState(settings.model || 'auto/smart-best');
  const [temperature, setTemperature] = useState(settings.temperature ?? 0.7);
  const [modelsList, setModelsList] = useState<ChatModelOption[]>(RECOMMENDED_MODELS);

  // Messages
  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    const saved = getStoredChatHistory();
    if (saved && saved.length > 0) return saved;
    return [
      {
        id: 'welcome-1',
        role: 'assistant',
        content: `Hi there! 👋 How can I help you with fabric printing, GSM recommendations, or custom apparel today?`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ];
  });

  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    fetchChatConfig().then((cfg) => {
      if (cfg.recommendedModels && cfg.recommendedModels.length > 0) {
        setModelsList(cfg.recommendedModels);
      }
    });
  }, []);

  useEffect(() => {
    saveChatHistory(messages);
  }, [messages]);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen, isLoading]);

  useEffect(() => {
    if (isOpen && !showSettings) {
      setTimeout(() => inputRef.current?.focus(), 150);
    }
  }, [isOpen, showSettings]);

  const handleSendMessage = async (textToSend?: string) => {
    const text = (textToSend || inputMessage).trim();
    if (!text || isLoading) return;

    const userMsg: ChatMessage = {
      id: `usr-${Date.now()}`,
      role: 'user',
      content: text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInputMessage('');
    setIsLoading(true);

    try {
      const result = await sendChatMessage(newMessages, {
        model: settings.model,
        temperature: settings.temperature
      });

      const botMsg: ChatMessage = {
        id: `bot-${Date.now()}`,
        role: 'assistant',
        content: result.content,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        provider: result.provider,
        modelUsed: result.modelUsed
      };

      setMessages((prev) => [...prev, botMsg]);
    } catch (err: any) {
      const errMsg = err?.message || 'Unable to connect to AI. Please try again.';
      const errorBotMsg: ChatMessage = {
        id: `bot-err-${Date.now()}`,
        role: 'assistant',
        content: `⚠️ ${errMsg}`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages((prev) => [...prev, errorBotMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveSettings = () => {
    const updated = saveChatSettings({
      model: selectedModel,
      temperature: Number(temperature)
    });
    setSettings(updated);
    setShowSettings(false);
  };

  const handleClearChat = () => {
    if (window.confirm('Clear conversation?')) {
      clearStoredChatHistory();
      setMessages([
        {
          id: 'welcome-reset',
          role: 'assistant',
          content: `Chat history cleared. How can I help you today?`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    }
  };

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const parseInlineMarkdown = (text: string) => {
    const parts = text.split(/(\*\*.*?\*\*|\*.*?\*|`.*?`)/g);
    return parts.map((part, i) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return <strong key={i} className="font-semibold text-white">{part.slice(2, -2)}</strong>;
      }
      if (part.startsWith('*') && part.endsWith('*')) {
        return <em key={i} className="italic text-slate-300">{part.slice(1, -1)}</em>;
      }
      if (part.startsWith('`') && part.endsWith('`')) {
        return (
          <code key={i} className="px-1.5 py-0.5 rounded bg-slate-800 text-cyan-300 font-mono text-xs">
            {part.slice(1, -1)}
          </code>
        );
      }
      return part;
    });
  };

  const renderContent = (content: string) => {
    const lines = content.split('\n');
    return (
      <div className="space-y-1.5 text-sm leading-relaxed">
        {lines.map((line, idx) => {
          if (line.startsWith('### ')) {
            return <h4 key={idx} className="font-semibold text-sm text-cyan-300 mt-2 mb-1">{line.replace('### ', '')}</h4>;
          }
          if (line.startsWith('## ')) {
            return <h3 key={idx} className="font-bold text-base text-white mt-2.5 mb-1">{line.replace('## ', '')}</h3>;
          }
          if (line.startsWith('# ')) {
            return <h2 key={idx} className="font-bold text-lg text-white mt-3 mb-1.5">{line.replace('# ', '')}</h2>;
          }
          if (line.trim().startsWith('- ') || line.trim().startsWith('* ')) {
            return (
              <div key={idx} className="flex items-start space-x-2 pl-1 my-0.5">
                <span className="text-cyan-400 font-bold">•</span>
                <div className="flex-1">{parseInlineMarkdown(line.trim().substring(2))}</div>
              </div>
            );
          }
          const numMatch = line.trim().match(/^(\d+)\.\s+(.*)/);
          if (numMatch) {
            return (
              <div key={idx} className="flex items-start space-x-2 pl-1 my-0.5">
                <span className="text-cyan-300 font-medium text-xs font-mono">{numMatch[1]}.</span>
                <div className="flex-1">{parseInlineMarkdown(numMatch[2])}</div>
              </div>
            );
          }
          if (!line.trim()) return <div key={idx} className="h-1" />;
          return <p key={idx}>{parseInlineMarkdown(line)}</p>;
        })}
      </div>
    );
  };

  return (
    <>
      {/* Minimal Floating Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-20 lg:bottom-6 right-4 sm:right-6 z-40 p-3.5 rounded-full bg-slate-900 hover:bg-slate-800 text-white shadow-xl border border-slate-700/80 transition-all duration-200 transform hover:scale-105 active:scale-95 flex items-center justify-center group focus:outline-none focus:ring-2 focus:ring-cyan-400/40"
          aria-label="Open AI Assistant"
        >
          <div className="relative flex items-center justify-center">
            <MessageSquare className="w-5 h-5 text-cyan-400" />
            <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-emerald-400" />
          </div>
          <span className="hidden group-hover:inline-block ml-2 text-xs font-medium text-slate-200 pr-1">
            Chat
          </span>
        </button>
      )}

      {/* Minimal Chat Window */}
      {isOpen && (
        <div
          className={`fixed z-50 transition-all duration-200 flex flex-col shadow-2xl border border-slate-800 bg-slate-950 text-slate-100 ${
            isMaximized
              ? 'inset-3 sm:inset-6 rounded-2xl'
              : 'bottom-20 lg:bottom-4 right-2 sm:right-4 w-[94vw] sm:w-[390px] h-[520px] max-h-[75vh] rounded-2xl'
          }`}
        >
          {/* Minimal Header */}
          <div className="px-4 py-3 border-b border-slate-800/80 bg-slate-900/60 flex items-center justify-between select-none">
            <div className="flex items-center space-x-2.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              <div>
                <h3 className="font-semibold text-sm text-white leading-tight">TexPrint AI</h3>
                <p className="text-[11px] text-slate-400 leading-tight">Online • Instant Help</p>
              </div>
            </div>

            <div className="flex items-center space-x-1">
              <button
                onClick={() => setShowSettings(!showSettings)}
                title="Settings"
                className={`p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition ${
                  showSettings ? 'text-cyan-400 bg-slate-800' : ''
                }`}
              >
                <Sliders className="w-4 h-4" />
              </button>

              <button
                onClick={handleClearChat}
                title="Clear Chat"
                className="p-1.5 rounded-lg text-slate-400 hover:text-red-400 hover:bg-slate-800 transition"
              >
                <Trash2 className="w-4 h-4" />
              </button>

              <button
                onClick={() => setIsMaximized(!isMaximized)}
                title={isMaximized ? 'Restore' : 'Maximize'}
                className="hidden sm:block p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
              >
                {isMaximized ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
              </button>

              <button
                onClick={() => setIsOpen(false)}
                title="Close"
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Body Content */}
          <div className="flex-1 flex flex-col overflow-hidden bg-slate-950">
            {showSettings ? (
              /* Minimal Settings */
              <div className="flex-1 p-5 overflow-y-auto space-y-4 text-xs bg-slate-900/40">
                <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                  <span className="font-semibold text-sm text-white">Chatbot Settings</span>
                  <button
                    onClick={() => setShowSettings(false)}
                    className="text-slate-400 hover:text-white"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="space-y-1.5">
                  <label className="font-medium text-slate-300">AI Model</label>
                  <select
                    value={selectedModel}
                    onChange={(e) => setSelectedModel(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500"
                  >
                    <option value="auto/smart-best">⚡ Auto (Best NIM / OpenRouter)</option>
                    <option value="meta/llama-3.3-70b-instruct">🟢 Llama 3.3 70B (NVIDIA NIM)</option>
                    <option value="deepseek-ai/deepseek-r1">🟢 DeepSeek R1 (NVIDIA NIM)</option>
                    <option value="openai/gpt-4o-mini">🔵 GPT-4o Mini (OpenRouter)</option>
                    <option value="anthropic/claude-3.5-sonnet">🔵 Claude 3.5 Sonnet (OpenRouter)</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <div className="flex justify-between font-medium text-slate-300">
                    <span>Creativity</span>
                    <span className="text-slate-400">{temperature}</span>
                  </div>
                  <input
                    type="range"
                    min="0.1"
                    max="1.0"
                    step="0.1"
                    value={temperature}
                    onChange={(e) => setTemperature(parseFloat(e.target.value))}
                    className="w-full accent-cyan-500 cursor-pointer"
                  />
                </div>

                <button
                  onClick={handleSaveSettings}
                  className="w-full py-2 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white font-semibold text-xs transition"
                >
                  Save
                </button>
              </div>
            ) : (
              /* Message Thread */
              <div className="flex-1 p-4 overflow-y-auto space-y-3">
                {messages.map((msg) => {
                  const isUser = msg.role === 'user';
                  return (
                    <div
                      key={msg.id}
                      className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}
                    >
                      <div
                        className={`group relative max-w-[85%] rounded-2xl px-3.5 py-2.5 text-sm ${
                          isUser
                            ? 'bg-blue-600 text-white rounded-tr-sm'
                            : 'bg-slate-900 border border-slate-800 text-slate-200 rounded-tl-sm'
                        }`}
                      >
                        {!isUser && (
                          <button
                            onClick={() => handleCopy(msg.content, msg.id)}
                            className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition p-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-400"
                            title="Copy"
                          >
                            {copiedId === msg.id ? (
                              <Check className="w-3 h-3 text-emerald-400" />
                            ) : (
                              <Copy className="w-3 h-3" />
                            )}
                          </button>
                        )}
                        {renderContent(msg.content)}
                      </div>
                      <span className="text-[10px] text-slate-400 px-1 pt-1">
                        {msg.timestamp}
                      </span>
                    </div>
                  );
                })}

                {/* Loading indicator */}
                {isLoading && (
                  <div className="flex items-start space-x-2 text-slate-400 text-xs py-1">
                    <div className="flex space-x-1 items-center bg-slate-900 border border-slate-800 rounded-xl px-3 py-2">
                      <span className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                      <span className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                      <span className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-bounce"></span>
                      <span className="ml-2 text-[11px] text-slate-400">Thinking...</span>
                    </div>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>
            )}

            {/* Quick Suggestions (Only when conversation is short) */}
            {!showSettings && messages.length <= 2 && (
              <div className="px-3 py-2 border-t border-slate-800/60 bg-slate-900/20">
                <div className="flex gap-1.5 overflow-x-auto no-scrollbar py-0.5">
                  {QUICK_SUGGESTIONS.map((suggestion, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleSendMessage(suggestion)}
                      className="shrink-0 text-xs px-2.5 py-1.5 rounded-full bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 hover:text-white transition whitespace-nowrap"
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Minimal Input Bar */}
          {!showSettings && (
            <div className="p-3 border-t border-slate-800 bg-slate-900/40">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSendMessage();
                }}
                className="flex items-center space-x-2 bg-slate-900 border border-slate-700/80 rounded-full px-3.5 py-1.5 focus-within:border-cyan-500 transition"
              >
                <textarea
                  ref={inputRef}
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSendMessage();
                    }
                  }}
                  rows={1}
                  placeholder="Ask a question..."
                  disabled={isLoading}
                  className="flex-1 bg-transparent text-sm text-slate-100 placeholder-slate-400 focus:outline-none resize-none py-1 max-h-20 disabled:opacity-50"
                />

                <button
                  type="submit"
                  disabled={isLoading || !inputMessage.trim()}
                  className="p-1.5 rounded-full bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold disabled:opacity-30 disabled:cursor-not-allowed transition shrink-0"
                >
                  <Send className="w-3.5 h-3.5" />
                </button>
              </form>
            </div>
          )}
        </div>
      )}
    </>
  );
};
