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

import { BUSINESS_INFO } from '../config/businessInfo';

export const FABRICPRINT_SYSTEM_PROMPT = `You are "FabricPrint AI", the friendly, knowledgeable expert assistant for Fabric Print Mill & Custom Apparel Studio (located in Tirupur, Tamil Nadu, India).

About Fabric Print Mill & Custom Merch:
- We are a premier digital textile printing mill and customized apparel/merch manufacturing studio based in Tirupur, Tamil Nadu, India (${BUSINESS_INFO.address.fullFormatted}).
- We supply high-grade fabrics by the meter, customized roll printing, test swatches, bespoke apparel (T-shirts, Hoodies, Polos, Jerseys), corporate uniforms, and promotional merchandise.
- Customer Care & Direct Mill WhatsApp: ${BUSINESS_INFO.phone}.

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
5. Contact for direct mill support: WhatsApp ${BUSINESS_INFO.phone}.`;

const SETTINGS_STORAGE_KEY = 'fabricprint_chat_router_settings';
const HISTORY_STORAGE_KEY = 'fabricprint_chat_history';

/**
 * Built-in intelligent domain assistant fallback.
 * Provides instant, expert answers for all textile, apparel, pricing, GSM, and printing questions
 * even when third-party AI API keys (NIM / OpenRouter) are not configured.
 */
export function getSmartAssistantFallbackResponse(userPrompt: string): string {
  const query = userPrompt.toLowerCase();

  // Fabric recommendations
  if (query.includes('summer') || query.includes('kurti') || query.includes('shirt') || query.includes('breathable') || query.includes('mulmul') || query.includes('cambric')) {
    return `### 🌸 Best Fabrics for Summer Wear & Kurtis

For hot & humid weather, natural cellulosic fibers with high breathability are ideal:

1. **Cotton Mulmul (60s x 60s) - 75 GSM (₹420/m)**
   - *Feel:* Featherlight, airy, semi-sheer, butter-soft touch.
   - *Best for:* Summer kurtis, flowing anarkalis, lightweight scarves, and dupattas.
2. **Organic Cotton Cambric (50s x 50s) - 110 GSM (₹480/m)**
   - *Feel:* Crisp, opaque, highly breathable, structured drape.
   - *Best for:* Tailored formal/casual shirts, everyday kurtas, tunics, and co-ord sets.
3. **Pure Flax Linen - 145 GSM (₹890/m)**
   - *Feel:* Characteristic slub texture, cooling properties, gets softer with every wash.
   - *Best for:* Premium resort wear, trousers, and breathable linen shirts.

💡 **Tip:** Both Mulmul and Cambric are printed with **Reactive Dyes**, ensuring 100% natural soft hand-feel and high wash-fastness. Would you like to order a **1-meter strike-off sample**?`;
  }

  // DTF vs Sublimation
  if (query.includes('dtf') || query.includes('sublimation') || query.includes('difference between') || query.includes('printing technique')) {
    return `### 🖨️ DTF vs. Dye-Sublimation: Comparison

Here is how the two printing methods differ for custom apparel:

| Feature | Direct-to-Film (DTF) | Dye-Sublimation |
| :--- | :--- | :--- |
| **Compatible Fabrics** | 100% Cotton, Poly, Blends, Canvas, Denim | 100% Polyester & Poly-rich fabrics only |
| **Garment Colors** | Works brilliantly on **Dark & Light** fabrics | Best on **White & Pastel** fabrics |
| **Texture & Hand-feel** | Thin, flexible soft elastomeric layer | Zero hand-feel (dye gas bonds inside fiber) |
| **Durability** | 50+ washes with proper care | Lifetime permanent (never cracks or peels) |
| **Ideal For** | Oversized Cotton Tees, Hoodies, Caps, Tote Bags | Sports Jerseys, Dry-Fit Athletic wear, Flags |

💡 Need help picking for your design? Share your garment style and quantity on WhatsApp at **+91 89031 20006**!`;
  }

  // GSM guide
  if (query.includes('gsm') || query.includes('weight') || query.includes('thickness')) {
    return `### ⚖️ Fabric & Garment GSM Guide

**GSM** (Grams per Square Meter) measures the weight and density of the fabric:

- **Ultra-Lightweight (40 – 80 GSM):**
  - *Fabrics:* Sheer Organza (45 GSM), Cotton Mulmul (75 GSM), Silk Satin (85 GSM).
  - *Usage:* Scarves, dupattas, overlays, airy summer apparel.
- **Medium Weight (110 – 180 GSM):**
  - *Fabrics:* Cotton Cambric (110 GSM), Rayon (125 GSM), Linen (145 GSM), Classic T-Shirts (180 GSM).
  - *Usage:* Shirts, dresses, standard tees, blouses.
- **Heavyweight (220 – 360+ GSM):**
  - *Fabrics:* Canvas (280 GSM), Oversized Streetwear Tees (240 GSM), Hoodies & Sweatshirts (360 GSM fleece).
  - *Usage:* Structured streetwear, winter apparel, tote bags, upholstery.`;
  }

  // Pricing & Discounts
  if (query.includes('discount') || query.includes('wholesale') || query.includes('bulk') || query.includes('price') || query.includes('pricing') || query.includes('rate')) {
    return `### 💰 Wholesale Volume Pricing & Tiered Discounts

We offer direct mill pricing with automatic volume discounts:

- **1 to 20 meters / units:** Standard catalogue pricing
- **21 to 50 meters / units:** **10% OFF**
- **51 to 100 meters / units:** **18% OFF**
- **101+ meters / units:** **25% OFF Mill Wholesale Discount**

✨ **Samples & Swatches:**
- A4 Swatch Sample: **₹180**
- 1-Meter Strike-off: **₹450**
- Master Swatch Book (all fabric samples + print finish swatches): **₹499** *(includes ₹500 cashback coupon for your next bulk order)*

For custom bulk production (>100 pieces), reach our production desk on WhatsApp at **+91 89031 20006**.`;
  }

  // Turnaround, Shipping, Delivery
  if (query.includes('shipping') || query.includes('delivery') || query.includes('turnaround') || query.includes('how long') || query.includes('time') || query.includes('dispatch')) {
    return `### 🚚 Production & Shipping Timelines

- **Digital Fabric Printing (By the meter):** 3 to 5 business days production.
- **Custom Apparel (Tees, Hoodies, Polos):** 4 to 7 business days.
- **Express Sampling (A4 / 1m Strike-offs):** Dispatched within 48 hours.
- **Shipping Partners:** Bluedart, Delhivery, DTDC across India (2-4 days transit).
- **International Shipping:** DHL Express worldwide (4-7 days transit).

📦 Tracking numbers are shared via SMS & WhatsApp as soon as your shipment leaves our Tirupur mill hub!`;
  }

  // Address, Contact, Location
  if (query.includes('address') || query.includes('location') || query.includes('tirupur') || query.includes('surat') || query.includes('contact') || query.includes('phone') || query.includes('call')) {
    return `### 📍 FabricPrint Mill Contact & Location

- **Mill & Studio Hub:** ${BUSINESS_INFO.address.fullFormatted}
- **Direct Mill Helpline & WhatsApp:** [${BUSINESS_INFO.displayPhone}](${BUSINESS_INFO.whatsapp.supportUrl})
- **Email:** ${BUSINESS_INFO.email}
- **Operating Hours:** ${BUSINESS_INFO.operatingHours}

You can also submit your artwork and custom requirement via the **Bulk Inquiry** button on the header!`;
  }

  // T-Shirts / Hoodies / Apparel
  if (query.includes('t-shirt') || query.includes('tshirt') || query.includes('tee') || query.includes('hoodie') || query.includes('jersey') || query.includes('uniform') || query.includes('merch')) {
    return `### 👕 Custom Apparel & Merchandise Studio

We produce custom apparel using direct mill garments:
- **Oversized Streetwear Tees:** 240 GSM 100% Super-Combed French Terry Cotton, drop-shoulder cut.
- **Classic Crewneck Tees:** 180 GSM Bio-Washed Combed Cotton.
- **Winter Hoodies & Sweatshirts:** 360 GSM Heavyweight Brushed Cotton-Poly Fleece with double-lined hoods.
- **Performance Jerseys:** 160 GSM Dry-Fit Honeycomb Micro-Poly with full 360° all-over dye sublimation.
- **Custom Merch:** Heavy Canvas Tote Bags, Snapback Caps, Enamel Pins, Coffee Mugs.

🎨 Try our **Apparel Studio** tab to preview 3D mockups and upload your graphics!`;
  }

  // Default friendly textile assistant response
  return `### 👋 FabricPrint Mill Assistant

Thank you for reaching out! I can assist you with:
- **Fabric Selection:** Cotton Mulmul, Cambric, Pure Linen, Mulberry Silk, Canvas, Rayon, Modal & Dry-Fit.
- **GSM Advice:** Choosing the right weight for garments, scarves, or upholstery.
- **Printing Methods:** Reactive Digital Printing, DTF, Dye-Sublimation, and Screen Printing.
- **Sampling & Swatch Books:** Order 1-meter strike-offs or master swatches.
- **Bulk Production:** Tiered discounts up to 25% off for 100+ meters or apparel units.

Feel free to ask any specific question, or chat with our master printing specialists directly on WhatsApp at **${BUSINESS_INFO.displayPhone}**!`;
}

export function getStoredChatSettings(): ChatSettings {
  try {
    // Clean any legacy texprint keys
    if (localStorage.getItem('texprint_chat_router_settings')) {
      localStorage.removeItem('texprint_chat_router_settings');
    }
    if (localStorage.getItem('texprint_openrouter_settings')) {
      localStorage.removeItem('texprint_openrouter_settings');
    }

    const raw = localStorage.getItem(SETTINGS_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      return { ...DEFAULT_CHAT_SETTINGS, ...parsed };
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
    openRouterApiKey: settings.openRouterApiKey !== undefined ? settings.openRouterApiKey : (settings.apiKey || current.openRouterApiKey),
    apiKey: settings.openRouterApiKey !== undefined ? settings.openRouterApiKey : (settings.apiKey || current.apiKey)
  };

  try {
    localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(updated));
  } catch (e) {
    console.error('Failed to save chat settings to localStorage', e);
  }
  return updated;
}

export function getStoredChatHistory(): ChatMessage[] {
  try {
    if (localStorage.getItem('texprint_chat_history')) {
      localStorage.removeItem('texprint_chat_history');
    }
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
    // Silently proceed with local defaults and expert fallback
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
    { role: 'system', content: FABRICPRINT_SYSTEM_PROMPT },
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

    if (res.ok) {
      const data: any = await res.json();
      const replyContent = data.choices?.[0]?.message?.content;
      if (replyContent) {
        return {
          content: replyContent,
          provider: data.provider || (data.model?.includes('meta/') || data.model?.includes('nvidia/') ? 'nim' : 'openrouter'),
          modelUsed: data.model || currentSettings.model,
          isFailover: data.isFailover || false
        };
      }
    }
  } catch (_networkErr) {
    // Network down or endpoint unreachable, continue to direct client-side fallback
  }

  // 2. Direct Client-Side Fallback (if user configured their own keys)
  const canTryNim = effectiveNimKey && effectiveNimKey.length > 5;
  const canTryOpenRouter = effectiveOpenRouterKey && effectiveOpenRouterKey.length > 5;

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
      const nimData: any = await nimRes.json();
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
          'X-Title': 'FabricPrint Fabric Mill Assistant',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: orModel,
          messages: apiMessages,
          temperature: currentSettings.temperature ?? 0.7,
          max_tokens: 1200
        })
      });

      const directData: any = await directRes.json();
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

  // 3. Built-in Smart Domain Knowledge Fallback
  // If no external API keys are configured, or if services are unreachable,
  // provide instant, accurate, rich textile expertise directly without ever failing or throwing an error!
  const lastUserMsg = [...messages].reverse().find((m) => m.role === 'user')?.content || '';
  const domainAnswer = getSmartAssistantFallbackResponse(lastUserMsg);

  return {
    content: domainAnswer,
    provider: 'nim',
    modelUsed: 'FabricPrint Knowledge Assistant',
    isFailover: true
  };
}

// Backwards-compatible export for existing components
export async function sendOpenRouterChatMessage(
  messages: ChatMessage[],
  settings?: Partial<ChatSettings>
): Promise<string> {
  const result = await sendChatMessage(messages, settings);
  return result.content;
}
