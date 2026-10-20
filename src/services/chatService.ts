export type ChatProvider = 'auto' | 'nim' | 'openrouter';

export interface ChatMessage {
  id: string;
  role: 'system' | 'user' | 'assistant';
  content: string;
  timestamp: string;
  provider?: 'nim' | 'openrouter';
  modelUsed?: string;
  isFailover?: boolean;
}

export interface ChatModelOption {
  id: string;
  name: string;
  provider: 'NVIDIA NIM' | 'OpenAI' | 'Anthropic' | 'DeepSeek' | 'Meta' | 'Google' | 'Mistral' | 'Qwen' | 'Auto Router';
  tier?: 'NIM' | 'OpenRouter' | 'Auto';
  description?: string;
  isFree?: boolean;
}

export interface ChatSettings {
  provider: ChatProvider;
  nimApiKey: string;
  openRouterApiKey: string;
  apiKey?: string; // Legacy OpenRouter API key fallback
  model: string;
  temperature: number;
}

export const RECOMMENDED_MODELS: ChatModelOption[] = [
  // --- AUTO ROUTING VIRTUAL MODELS ---
  {
    id: 'auto/smart-best',
    name: 'Auto: Best Available (NIM or OpenRouter)',
    provider: 'Auto Router',
    tier: 'Auto',
    description: 'Automatically picks fastest & highest quality model with instant failover'
  },
  {
    id: 'auto/llama-3.3-70b',
    name: 'Auto: Llama 3.3 70B (Auto NIM / OpenRouter)',
    provider: 'Auto Router',
    tier: 'Auto',
    description: 'High-speed 70B parameter model with dual-provider redundancy'
  },
  {
    id: 'auto/deepseek-r1',
    name: 'Auto: DeepSeek R1 Reasoning',
    provider: 'Auto Router',
    tier: 'Auto',
    description: 'State-of-the-art chain of thought reasoning model'
  },

  // --- NVIDIA NIM POWERED MODELS (integrate.api.nvidia.com) ---
  {
    id: 'meta/llama-3.3-70b-instruct',
    name: 'Llama 3.3 70B Instruct (Ultra Fast)',
    provider: 'NVIDIA NIM',
    tier: 'NIM',
    description: 'NVIDIA NIM low-latency enterprise inference'
  },
  {
    id: 'deepseek-ai/deepseek-r1',
    name: 'DeepSeek R1 (NIM Reasoning Engine)',
    provider: 'NVIDIA NIM',
    tier: 'NIM',
    description: 'NVIDIA NIM optimized reasoning model'
  },
  {
    id: 'deepseek-ai/deepseek-v3',
    name: 'DeepSeek V3 (NIM 671B MoE)',
    provider: 'NVIDIA NIM',
    tier: 'NIM',
    description: 'Flagship open-weights model hosted on NVIDIA NIM'
  },
  {
    id: 'nvidia/llama-3.1-nemotron-70b-instruct',
    name: 'Llama 3.1 Nemotron 70B',
    provider: 'NVIDIA NIM',
    tier: 'NIM',
    description: 'NVIDIA customized model for helpful and accurate responses'
  },
  {
    id: 'meta/llama-3.1-8b-instruct',
    name: 'Llama 3.1 8B Instruct (Instant)',
    provider: 'NVIDIA NIM',
    tier: 'NIM',
    description: 'Ultra-lightweight and lightning-quick response model'
  },
  {
    id: 'mistralai/mistral-large-2-instruct',
    name: 'Mistral Large 2 (NIM)',
    provider: 'NVIDIA NIM',
    tier: 'NIM',
    description: 'Top-tier multilingual & reasoning capabilities'
  },
  {
    id: 'qwen/qwen2.5-72b-instruct',
    name: 'Qwen 2.5 72B Instruct (NIM)',
    provider: 'NVIDIA NIM',
    tier: 'NIM',
    description: 'High coding and multi-turn precision'
  },

  // --- OPENROUTER POWERED MODELS (openrouter.ai) ---
  {
    id: 'openai/gpt-4o-mini',
    name: 'GPT-4o Mini (Fast & Smart)',
    provider: 'OpenAI',
    tier: 'OpenRouter',
    description: 'Balanced performance, speed and fabric domain knowledge'
  },
  {
    id: 'anthropic/claude-3.5-sonnet',
    name: 'Claude 3.5 Sonnet (Deep Reasoning)',
    provider: 'Anthropic',
    tier: 'OpenRouter',
    description: 'Exceptional nuanced reasoning and garment design advisory'
  },
  {
    id: 'google/gemini-2.0-flash-001',
    name: 'Gemini 2.0 Flash (Super High Speed)',
    provider: 'Google',
    tier: 'OpenRouter',
    description: 'Next-gen Google multimodal speed champion'
  },
  {
    id: 'deepseek/deepseek-chat',
    name: 'DeepSeek V3 (OpenRouter)',
    provider: 'DeepSeek',
    tier: 'OpenRouter',
    description: 'Powerful general purpose assistant'
  },
  {
    id: 'meta-llama/llama-3.3-70b-instruct',
    name: 'Llama 3.3 70B (OpenRouter)',
    provider: 'Meta',
    tier: 'OpenRouter',
    description: 'OpenRouter hosted Meta Llama 3.3'
  },
  {
    id: 'meta-llama/llama-3.1-8b-instruct:free',
    name: 'Llama 3.1 8B (OpenRouter Free Tier)',
    provider: 'Meta',
    tier: 'OpenRouter',
    description: 'Free tier model with no API balance needed',
    isFree: true
  },
  {
    id: 'deepseek/deepseek-r1:free',
    name: 'DeepSeek R1 (OpenRouter Free Tier)',
    provider: 'DeepSeek',
    tier: 'OpenRouter',
    description: 'Free tier reasoning model',
    isFree: true
  }
];

export const DEFAULT_CHAT_SETTINGS: ChatSettings = {
  provider: 'auto',
  nimApiKey: '',
  openRouterApiKey: '',
  apiKey: '',
  model: 'auto/smart-best',
  temperature: 0.7
};

export const TEXPRINT_SYSTEM_PROMPT = `You are "TexPrint AI", the friendly, knowledgeable expert assistant for TexPrint Fabric Print Mill & Custom Apparel Studio.

About TexPrint Mill & Custom Merch:
- We are a premier digital textile printing mill and customized apparel/merch manufacturing studio.
- We supply high-grade fabrics by the meter, customized roll printing, test swatches, bespoke apparel (T-shirts, Hoodies, Polos, Jerseys), corporate uniforms, and promotional merchandise.

Key Fabrics & Specifications:
1. Cotton Mulmul (60s x 60s) - 75 GSM, 44" width (₹420/m): Featherlight, ultra-soft, best for scarves, summer kurtis, airy dresses.
2. Organic Cotton Cambric (50s x 50s) - 110 GSM, 44" width (₹480/m): Crisp, breathable, premium for shirts, tunics, tops.
3. Heavy Cotton Canvas (20s x 10s) - 280 GSM, 56" width (₹580/m): Durable, structured, perfect for tote bags, jackets, upholstery, home decor.
4. Pure Flax Linen - 145 GSM, 54" width (₹890/m): Textured, breathable, sustainable luxury for trousers, blazers, and luxury resort-wear.
5. Mulberry Silk Satin - 85 GSM, 44" width (₹1,250/m): Lustrous sheen, butter-soft drape, high-end couture, evening gowns, silk scarves.
6. Pure Silk Crepe - 90 GSM, 44" width (₹1,150/m): Pebbled texture, fluid drape, wrinkle-resistant luxury apparel.
7. Modal Satin - 115 GSM, 44" width (₹540/m): Eco-friendly cellulosic beechwood fiber, silk-like shine, vibrant drape.
8. Viscose Rayon - 125 GSM, 44" width (₹390/m): Ultra-fluid drape, breathable, high dye absorption.
9. Sheer Silk Organza - 45 GSM, 44" width (₹620/m): Ethereal transparency, structured crispness, bridal overlays and dupattas.
10. Dry-Fit Interlock Micro-Poly - 160 GSM, 60" width (₹340/m): Moisture-wicking, anti-bacterial athletic sportswear.
11. Poly Spandex Stretch - 220 GSM, 58" width (₹460/m): 4-way stretch, compression leggings, swimwear, yoga wear.

Apparel & Custom Merch Studio:
- Oversized T-Shirts (240 GSM Heavyweight Terry Cotton) & Classic Tees (180 GSM Bio-Washed Combed Cotton)
- Premium Hoodies & Sweatshirts (360 GSM Brushed Cotton-Poly Fleece)
- Performance Sports Jerseys (Full Sublimation 160 GSM Dry-Fit)
- Corporate Polos (220 GSM Honeycomb Matty Cotton-Blend)
- Merch items: Canvas Tote Bags, Snapback/Trucker Caps, Ceramic Mugs, Stainless Steel Bottles, Enamel Pins, Laptop Sleeves.

Printing Technologies Offered:
- Reactive Digital Printing: Best for natural fibers (Cotton, Silk, Linen, Modal). Chemically bonds with cellulose/protein fibers, 100% soft hand-feel, withstands repeated machine washes.
- Dye-Sublimation: Permanent, high-definition printing on 100% Polyester and Poly blends. Colors never peel or fade.
- Direct-to-Film (DTF): Vibrant multi-color graphics with fine details, suitable for dark/light garments of any fabric blend.
- Screen Printing: Highest opacity and best cost efficiency for high-volume bulk orders (100+ units).

Wholesale & Volume Discounts:
- 1 to 20 meters / units: Standard retail pricing
- 21 to 50 meters / units: 10% Discount
- 51 to 100 meters / units: 18% Discount
- 101+ meters / units: 25% Mill Bulk Discount

Sampling & Swatch Options:
- A4 Swatch Sample: ₹180
- 1-Meter Full Strike-off Sample: ₹450
- Master Swatch Book (all fabric samples + print finish test swatches): ₹499 (includes ₹500 store coupon on subsequent bulk order)

Delivery & Production Timelines:
- Digital Fabric Printing: 3-5 business days for production.
- Custom Apparel: 4-7 business days.
- Express Sampling: 48-hour dispatch.
- Shipping across India & International express worldwide.

Instructions for AI:
1. Be polite, concise, professional, and enthusiastic.
2. Provide direct, helpful answers regarding fabric selection, GSM guidance, printing technique recommendation, pricing calculations, or garment design.
3. Use markdown with bold headings and bullet points for readability.
4. When relevant, guide users to explore the live website tools:
   - "Customizer Studio" for live 3D repeat pattern placement & mockup viewing.
   - "Apparel Studio" for T-shirts, Hoodies, and Jersey customization.
   - "Bulk Inquiry" for custom quotes over 100+ units.
   - "Swatch Books" to feel the physical fabric touch before ordering in bulk.
5. If the user asks about something unrelated, politely steer back to textile printing, apparel, fabrics, design, and manufacturing.`;

const SETTINGS_STORAGE_KEY = 'texprint_chat_router_settings';
const LEGACY_STORAGE_KEY = 'texprint_openrouter_settings';
const HISTORY_STORAGE_KEY = 'texprint_chat_history';

export function getStoredChatSettings(): ChatSettings {
  try {
    const raw = localStorage.getItem(SETTINGS_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      return { ...DEFAULT_CHAT_SETTINGS, ...parsed };
    }
    // Fallback migration from legacy settings
    const legacyRaw = localStorage.getItem(LEGACY_STORAGE_KEY);
    if (legacyRaw) {
      const legacy = JSON.parse(legacyRaw);
      return {
        ...DEFAULT_CHAT_SETTINGS,
        openRouterApiKey: legacy.apiKey || '',
        apiKey: legacy.apiKey || '',
        model: legacy.model || 'auto/smart-best',
        temperature: legacy.temperature ?? 0.7
      };
    }
  } catch (e) {
    console.error('Failed to parse chat settings from localStorage', e);
  }
  return DEFAULT_CHAT_SETTINGS;
}

export function saveChatSettings(settings: Partial<ChatSettings>): ChatSettings {
  const current = getStoredChatSettings();
  const updated: ChatSettings = {
    ...current,
    ...settings,
    // Keep openRouterApiKey and legacy apiKey synced if either changes
    openRouterApiKey: settings.openRouterApiKey !== undefined ? settings.openRouterApiKey : (settings.apiKey || current.openRouterApiKey),
    apiKey: settings.openRouterApiKey !== undefined ? settings.openRouterApiKey : (settings.apiKey || current.apiKey)
  };

  try {
    localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(updated));
    localStorage.setItem(LEGACY_STORAGE_KEY, JSON.stringify({
      apiKey: updated.openRouterApiKey,
      model: updated.model,
      temperature: updated.temperature
    }));
  } catch (e) {
    console.error('Failed to save chat settings to localStorage', e);
  }
  return updated;
}

export function getStoredChatHistory(): ChatMessage[] {
  try {
    const raw = localStorage.getItem(HISTORY_STORAGE_KEY);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch (e) {
    console.error('Failed to load chat history from localStorage', e);
  }
  return [];
}

export function saveChatHistory(messages: ChatMessage[]): void {
  try {
    // Keep max 50 messages in local storage to prevent bloat
    const trimmed = messages.slice(-50);
    localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(trimmed));
  } catch (e) {
    console.error('Failed to save chat history to localStorage', e);
  }
}

export function clearStoredChatHistory(): void {
  try {
    localStorage.removeItem(HISTORY_STORAGE_KEY);
  } catch (e) {
    console.error('Failed to clear chat history', e);
  }
}

export interface ChatConfigResponse {
  hasServerNimKey: boolean;
  hasServerOpenRouterKey: boolean;
  hasServerKey: boolean; // backwards compatibility
  defaultProvider: ChatProvider;
  defaultModel: string;
  recommendedModels: ChatModelOption[];
}

export async function fetchChatConfig(): Promise<ChatConfigResponse> {
  try {
    const res = await fetch('/api/chat/config');
    if (res.ok) {
      return await res.json();
    }
  } catch (e) {
    console.warn('Could not fetch server chat config, using local defaults', e);
  }
  return {
    hasServerNimKey: false,
    hasServerOpenRouterKey: false,
    hasServerKey: false,
    defaultProvider: 'auto',
    defaultModel: 'auto/smart-best',
    recommendedModels: RECOMMENDED_MODELS
  };
}

export interface SendChatMessageResult {
  content: string;
  provider?: 'nim' | 'openrouter';
  modelUsed?: string;
  isFailover?: boolean;
}

export async function sendChatMessage(
  messages: ChatMessage[],
  settings?: Partial<ChatSettings>
): Promise<SendChatMessageResult> {
  const currentSettings = { ...getStoredChatSettings(), ...settings };
  const effectiveOpenRouterKey = (currentSettings.openRouterApiKey || currentSettings.apiKey || '').trim();
  const effectiveNimKey = (currentSettings.nimApiKey || '').trim();

  // Prepare messages array including the system prompt
  const apiMessages = [
    { role: 'system', content: TEXPRINT_SYSTEM_PROMPT },
    ...messages.map((m) => ({
      role: m.role,
      content: m.content
    }))
  ];

  const payload = {
    messages: apiMessages,
    provider: currentSettings.provider || 'auto',
    model: currentSettings.model || 'auto/smart-best',
    nimApiKey: effectiveNimKey || undefined,
    openRouterApiKey: effectiveOpenRouterKey || undefined,
    apiKey: effectiveOpenRouterKey || undefined, // backwards compatibility
    temperature: currentSettings.temperature ?? 0.7,
    max_tokens: 1200
  };

  try {
    // 1. Try unified auto-routing endpoint first
    let res = await fetch('/api/chat/message', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    // Fallback to legacy endpoint if /api/chat/message is 404
    if (res.status === 404) {
      res = await fetch('/api/chat/openrouter', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });
    }

    const data = await res.json();

    if (!res.ok) {
      if (res.status === 401 || data.needApiKey) {
        throw new Error(
          data.message ||
          'Please provide your NVIDIA NIM API Key or OpenRouter API Key in Chatbot Settings (⚙️ icon) to start chatting.'
        );
      }
      throw new Error(data.error || `Server responded with status ${res.status}`);
    }

    const replyContent = data.choices?.[0]?.message?.content;
    if (!replyContent) {
      throw new Error('Received an empty response from AI model API.');
    }

    return {
      content: replyContent,
      provider: data.provider || (data.model?.includes('meta/') || data.model?.includes('nvidia/') ? 'nim' : 'openrouter'),
      modelUsed: data.model || currentSettings.model,
      isFailover: data.isFailover || false
    };
  } catch (error: any) {
    // Direct Client-Side Fallback (if backend is offline or static preview)
    const canTryNim = effectiveNimKey && effectiveNimKey.length > 5;
    const canTryOpenRouter = effectiveOpenRouterKey && effectiveOpenRouterKey.length > 5;

    // Direct NIM try
    if ((currentSettings.provider === 'nim' || currentSettings.provider === 'auto') && canTryNim) {
      try {
        const nimModel = currentSettings.model.startsWith('auto/')
          ? 'meta/llama-3.3-70b-instruct'
          : (currentSettings.model.includes('/') && !currentSettings.model.startsWith('openai/') ? currentSettings.model : 'meta/llama-3.3-70b-instruct');

        const nimRes = await fetch('https://integrate.api.nvidia.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${effectiveNimKey}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            model: nimModel,
            messages: apiMessages,
            temperature: currentSettings.temperature ?? 0.7,
            max_tokens: 1200
          })
        });
        const nimData = await nimRes.json();
        if (nimRes.ok && nimData.choices?.[0]?.message?.content) {
          return {
            content: nimData.choices[0].message.content,
            provider: 'nim',
            modelUsed: nimModel
          };
        }
      } catch (nimDirectErr) {
        console.warn('Direct NIM fallback failed:', nimDirectErr);
      }
    }

    // Direct OpenRouter try
    if (canTryOpenRouter) {
      try {
        const orModel = currentSettings.model.startsWith('auto/')
          ? 'openai/gpt-4o-mini'
          : (currentSettings.model.startsWith('meta/') ? 'meta-llama/llama-3.3-70b-instruct' : currentSettings.model);

        const directRes = await fetch('https://openrouter.ai/api/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${effectiveOpenRouterKey}`,
            'HTTP-Referer': window.location.origin,
            'X-Title': 'TexPrint Fabric Mill Assistant',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            model: orModel,
            messages: apiMessages,
            temperature: currentSettings.temperature ?? 0.7,
            max_tokens: 1200
          })
        });

        const directData = await directRes.json();
        if (directRes.ok && directData.choices?.[0]?.message?.content) {
          return {
            content: directData.choices[0].message.content,
            provider: 'openrouter',
            modelUsed: orModel,
            isFailover: canTryNim ? true : false
          };
        }
      } catch (directErr) {
        console.error('Direct OpenRouter call fallback failed:', directErr);
      }
    }

    throw error;
  }
}

// Backwards-compatible export for existing components
export async function sendOpenRouterChatMessage(
  messages: ChatMessage[],
  settings?: Partial<ChatSettings>
): Promise<string> {
  const result = await sendChatMessage(messages, settings);
  return result.content;
}
