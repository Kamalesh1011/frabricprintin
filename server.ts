import express from 'express';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { db } from './src/server/db.js';
import { Product, Category, Order, User, AdminCustomizerSettings, PreloadedDesign, SwatchBook } from './src/types.js';
dotenv.config();

// Dynamic helper to get active API keys from process.env or .env file directly
function getEffectiveEnvKeys() {
  try {
    const envPath = path.resolve(process.cwd(), '.env');
    if (fs.existsSync(envPath)) {
      const content = fs.readFileSync(envPath, 'utf-8');
      const parsed = dotenv.parse(content);
      for (const [k, v] of Object.entries(parsed)) {
        if (v && v !== 'MY_OPENROUTER_API_KEY' && v !== 'MY_NVIDIA_NIM_API_KEY') {
          process.env[k] = v;
        }
      }
    }
  } catch (e) {
    // ignore
  }

  const clean = (val?: string) => {
    if (!val) return '';
    const trimmed = val.trim().replace(/^["']|["']$/g, '');
    if (
      trimmed === 'MY_OPENROUTER_API_KEY' ||
      trimmed === 'MY_NVIDIA_NIM_API_KEY' ||
      trimmed === 'undefined' ||
      trimmed === 'null'
    ) {
      return '';
    }
    return trimmed;
  };

  const nimKey = clean(
    process.env.NVIDIA_NIM_API_KEY ||
    process.env.NIM_API_KEY ||
    process.env.NVIDIA_API_KEY ||
    process.env.NV_API_KEY ||
    process.env.NIM_KEY
  );

  const openRouterKey = clean(
    process.env.OPENROUTER_API_KEY ||
    process.env.OPEN_ROUTER_API_KEY ||
    process.env.OPENROUTER_KEY ||
    process.env.OPEN_ROUTER_KEY
  );

  return { nimKey, openRouterKey };
}

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// CORS Headers for API requests
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});

// JSON Body Parser with higher limit for design image uploads
app.use(express.json({ limit: '35mb' }));
app.use(express.urlencoded({ extended: true, limit: '35mb' }));

// ==========================================
// API ROUTES
// ==========================================

// Root API check & Health check
app.get('/api', (req, res) => {
  res.json({ status: 'ok', name: 'Fabric Print Mill API', timestamp: new Date().toISOString() });
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

  // ==========================================
  // CHATBOT MULTI-PROVIDER ROUTER (NIM & OPENROUTER)
  // ==========================================

  // CHAT CONFIG API
  app.get('/api/chat/config', (req, res) => {
    const { nimKey, openRouterKey } = getEffectiveEnvKeys();
    const hasNimServerKey = !!nimKey;
    const hasOpenRouterServerKey = !!openRouterKey;

    res.json({
      hasServerNimKey: hasNimServerKey,
      hasServerOpenRouterKey: hasOpenRouterServerKey,
      hasServerKey: hasNimServerKey || hasOpenRouterServerKey,
      defaultProvider: process.env.CHAT_ROUTING_MODE || 'auto',
      defaultModel: process.env.CHAT_DEFAULT_MODEL || 'auto/smart-best',
      recommendedModels: [
        // Auto routing virtual models
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
          description: 'High-speed 70B parameter model with dual redundancy'
        },
        {
          id: 'auto/deepseek-r1',
          name: 'Auto: DeepSeek R1 Reasoning',
          provider: 'Auto Router',
          tier: 'Auto',
          description: 'State-of-the-art chain of thought reasoning model'
        },
        // NVIDIA NIM models
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
          description: 'NVIDIA customized model for high accuracy'
        },
        {
          id: 'meta/llama-3.1-8b-instruct',
          name: 'Llama 3.1 8B Instruct (Instant)',
          provider: 'NVIDIA NIM',
          tier: 'NIM',
          description: 'Ultra-lightweight fast response model'
        },
        {
          id: 'mistralai/mistral-large-2-instruct',
          name: 'Mistral Large 2 (NIM)',
          provider: 'NVIDIA NIM',
          tier: 'NIM',
          description: 'Top-tier reasoning & multilingual capabilities'
        },
        {
          id: 'qwen/qwen2.5-72b-instruct',
          name: 'Qwen 2.5 72B Instruct (NIM)',
          provider: 'NVIDIA NIM',
          tier: 'NIM',
          description: 'High precision and coding capability'
        },
        // OpenRouter models
        {
          id: 'openai/gpt-4o-mini',
          name: 'GPT-4o Mini (Fast & Smart)',
          provider: 'OpenAI',
          tier: 'OpenRouter',
          description: 'Balanced performance, speed and fabric domain knowledge'
        },
        {
          id: 'anthropic/claude-3.5-sonnet',
          name: 'Claude 3.5 Sonnet (Advanced Reasoning)',
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
      ]
    });
  });

  // Helper: Call NVIDIA NIM API
  async function callNvidiaNim(messages: any[], model: string, apiKey: string, temperature = 0.7, max_tokens = 1200) {
    const nimBaseUrl = (process.env.NIM_BASE_URL || 'https://integrate.api.nvidia.com/v1').replace(/\/+$/, '');
    
    // Model resolution for NIM
    let targetModel = model;
    if (model === 'auto/smart-best' || model === 'auto/llama-3.3-70b') {
      targetModel = 'meta/llama-3.3-70b-instruct';
    } else if (model === 'auto/deepseek-r1') {
      targetModel = 'deepseek-ai/deepseek-r1';
    } else if (model.startsWith('meta-llama/')) {
      targetModel = model.replace('meta-llama/', 'meta/').replace(':free', '');
    } else if (model.startsWith('deepseek/')) {
      targetModel = model.replace('deepseek/', 'deepseek-ai/').replace(':free', '');
    }

    const response = await fetch(`${nimBaseUrl}/chat/completions`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: targetModel,
        messages,
        temperature,
        max_tokens
      })
    });

    const data: any = await response.json();
    if (!response.ok) {
      const errorMsg = data?.error?.message || data?.message || `NVIDIA NIM Error: ${response.status} ${response.statusText}`;
      throw new Error(errorMsg);
    }

    return {
      data,
      provider: 'nim',
      modelUsed: targetModel
    };
  }

  // Helper: Call OpenRouter API
  async function callOpenRouter(messages: any[], model: string, apiKey: string, temperature = 0.7, max_tokens = 1200, referer = 'http://localhost:3000') {
    let targetModel = model;
    if (model === 'auto/smart-best') {
      targetModel = process.env.OPENROUTER_DEFAULT_MODEL || 'openai/gpt-4o-mini';
    } else if (model === 'auto/llama-3.3-70b') {
      targetModel = 'meta-llama/llama-3.3-70b-instruct';
    } else if (model === 'auto/deepseek-r1') {
      targetModel = 'deepseek/deepseek-r1:free';
    } else if (model.startsWith('meta/') && !model.startsWith('meta-llama/')) {
      targetModel = model.replace('meta/', 'meta-llama/');
    } else if (model.startsWith('deepseek-ai/')) {
      targetModel = model.replace('deepseek-ai/', 'deepseek/');
    }

    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'HTTP-Referer': referer,
        'X-Title': 'Fabric Print Mill AI Assistant',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: targetModel,
        messages,
        temperature,
        max_tokens
      })
    });

    const data: any = await response.json();
    if (!response.ok) {
      const errorMsg = data?.error?.message || data?.message || `OpenRouter API Error: ${response.status} ${response.statusText}`;
      throw new Error(errorMsg);
    }

    return {
      data,
      provider: 'openrouter',
      modelUsed: targetModel
    };
  }

  function getBackendSmartAssistantReply(userPrompt: string): string {
    const q = (userPrompt || '').toLowerCase();
    if (q.includes('moq') || q.includes('minimum') || q.includes('quantity')) {
      return `### ⚡ Minimum Order Quantities (MOQ)\n\n- **Digital Fabric Printing Sampling:** Just **1 Meter** (full-width strike-off print test).\n- **Bulk Roll Production:** 10m / 50m / 100m+ tiered wholesale mill rates.\n- **Custom Apparel & Merchandise:** 1 Unit for DTF/DTG sample; 10+ units for bulk team & corporate pricing.\n- **Master Swatch Book:** Contains 250+ certified plain base fabrics ready for sampling (₹499).`;
    }
    if (q.includes('summer') || q.includes('kurti') || q.includes('shirt') || q.includes('mulmul') || q.includes('cambric')) {
      return `### 🌸 Best Fabrics for Summer Wear & Kurtis\n\n1. **Cotton Mulmul (60s x 60s) - 75 GSM (₹420/m):** Ultra-breathable, featherlight, semi-sheer.\n2. **Organic Cotton Cambric (50s x 50s) - 110 GSM (₹480/m):** Crisp, structured, everyday comfort.\n3. **Pure Flax Linen - 145 GSM (₹890/m):** Naturally cooling luxury weave.\n\n💡 Printed with skin-safe reactive dyes for permanent soft hand-feel!`;
    }
    if (q.includes('dtf') || q.includes('sublimation') || q.includes('technique')) {
      return `### 🖨️ DTF vs. Sublimation Printing\n\n- **DTF (Direct-to-Film):** Ideal for 100% cotton, hoodies, canvas totes, and dark colors.\n- **Dye-Sublimation:** Permanent molecular gas dye for 100% poly and jerseys; zero hand-feel.\n\nNeed guidance for your quantity? Reach our production team on WhatsApp: +91 89031 20006!`;
    }
    if (q.includes('gsm') || q.includes('weight')) {
      return `### ⚖️ Fabric & Garment GSM Guide\n\n- **Lightweight (40–80 GSM):** Sheer Organza (45 GSM), Mulmul (75 GSM), Silk Satin (85 GSM).\n- **Medium (110–180 GSM):** Cambric (110 GSM), Rayon (125 GSM), Classic Tees (180 GSM).\n- **Heavy (240–360 GSM):** Oversized Streetwear Tees (240 GSM), Heavy Winter Hoodies (360 GSM fleece).`;
    }
    if (q.includes('price') || q.includes('discount') || q.includes('wholesale') || q.includes('bulk')) {
      return `### 💰 Volume Pricing & Tiered Discounts\n\n- 1–20m / units: Catalogue base price\n- 21–50m: **10% OFF**\n- 51–100m: **18% OFF**\n- 101+m: **25% Wholesale Mill Discount**\n\n✨ 1m Strike-Off Sample: ₹450 | Master Swatch Book (250+ swatches): ₹499.`;
    }
    if (q.includes('address') || q.includes('location') || q.includes('located') || q.includes('where') || q.includes('tirupur') || q.includes('contact') || q.includes('phone')) {
      return `### 📍 Fabric Print Mill & Studio\n\n- **Production Hub:** Fabric Print Studio & Mill Hub, Near Textile Market, Tirupur, Tamil Nadu, 641602, India\n- **Direct WhatsApp & Phone:** +91 89031 20006\n- **Email:** support@fabricprint.in\n- **Hours:** Mon–Sat: 9:00 AM – 8:00 PM IST`;
    }
    return `### 👋 Fabric Print Mill Technical Assistant\n\nHello! I am your Fabric Print technical assistant. I can help you with:\n- Fabric selection (Mulmul, Cambric, Pure Linen, Silk Satin, Modal)\n- GSM weight recommendations & shrinkage testing\n- Custom strike-off sampling from 1 meter\n- Wholesale pricing & bulk orders\n- File preparation (300 DPI, TIFF / PDF / PSD / AI)\n\nHow may I help with your textile or apparel project today?`;
  }

  // UNIFIED AUTO-ROUTER HANDLER
  async function handleChatCompletions(req: express.Request, res: express.Response) {
    try {
      const {
        messages,
        model = 'auto/smart-best',
        provider = 'auto',
        nimApiKey,
        openRouterApiKey,
        apiKey, // legacy compatibility
        temperature = 0.7,
        max_tokens = 1200
      } = req.body;

      if (!messages || !Array.isArray(messages) || messages.length === 0) {
        return res.status(400).json({ error: 'Messages array is required.' });
      }

      const userPrompt = (Array.isArray(messages) ? [...messages].reverse().find((m: any) => m.role === 'user')?.content : '') || '';

      // 1. Resolve keys from request or dynamic server environment
      const envKeys = getEffectiveEnvKeys();
      const effectiveNimKey = (nimApiKey ? nimApiKey.trim() : envKeys.nimKey).replace(/^["']|["']$/g, '');
      const effectiveOpenRouterKey = (openRouterApiKey ? openRouterApiKey.trim() : (apiKey ? apiKey.trim() : envKeys.openRouterKey)).replace(/^["']|["']$/g, '');

      const hasNim = !!effectiveNimKey && effectiveNimKey !== 'MY_NVIDIA_NIM_API_KEY' && effectiveNimKey.length > 10;
      const hasOpenRouter = !!effectiveOpenRouterKey && effectiveOpenRouterKey !== 'MY_OPENROUTER_API_KEY' && effectiveOpenRouterKey.length > 10;

      // Fail-safe: If no valid keys are set, provide immediate expert textile reply without error banner
      if (!hasNim && !hasOpenRouter) {
        return res.json({
          choices: [{
            message: {
              role: 'assistant',
              content: getBackendSmartAssistantReply(userPrompt)
            }
          }],
          provider: 'mill-knowledge-engine',
          model: 'FabricPrint Knowledge Engine',
          isFallback: true
        });
      }

      // 3. Routing Strategy Determination
      let primaryProvider: 'nim' | 'openrouter';
      let allowFailover = true;

      if (provider === 'nim') {
        if (!hasNim) {
          return res.json({
            choices: [{
              message: {
                role: 'assistant',
                content: getBackendSmartAssistantReply(userPrompt)
              }
            }],
            provider: 'mill-knowledge-engine',
            model: 'FabricPrint Knowledge Engine',
            isFallback: true
          });
        }
        primaryProvider = 'nim';
        allowFailover = hasOpenRouter;
      } else if (provider === 'openrouter') {
        if (!hasOpenRouter) {
          return res.json({
            choices: [{
              message: {
                role: 'assistant',
                content: getBackendSmartAssistantReply(userPrompt)
              }
            }],
            provider: 'mill-knowledge-engine',
            model: 'FabricPrint Knowledge Engine',
            isFallback: true
          });
        }
        primaryProvider = 'openrouter';
        allowFailover = hasNim;
      } else {
        // Auto routing logic
        if (hasNim && hasOpenRouter) {
          const isNimNative =
            model.startsWith('meta/') ||
            model.startsWith('deepseek-ai/') ||
            model.startsWith('nvidia/') ||
            model.startsWith('mistralai/') ||
            model.startsWith('qwen/') ||
            model === 'auto/llama-3.3-70b' ||
            model === 'auto/smart-best' ||
            model === 'auto/deepseek-r1';

          primaryProvider = isNimNative ? 'nim' : 'openrouter';
        } else if (hasNim) {
          primaryProvider = 'nim';
        } else {
          primaryProvider = 'openrouter';
        }
      }

      const referer = req.headers.referer || 'http://localhost:3000';

      // 4. Primary Provider Attempt
      try {
        if (primaryProvider === 'nim') {
          console.log(`[Chat Router] Routing request to NVIDIA NIM (Model: ${model})...`);
          const result = await callNvidiaNim(messages, model, effectiveNimKey, temperature, max_tokens);
          return res.json({
            ...(result.data as any),
            provider: 'nim',
            model: result.modelUsed,
            isFailover: false
          });
        } else {
          console.log(`[Chat Router] Routing request to OpenRouter (Model: ${model})...`);
          const result = await callOpenRouter(messages, model, effectiveOpenRouterKey, temperature, max_tokens, referer);
          return res.json({
            ...(result.data as any),
            provider: 'openrouter',
            model: result.modelUsed,
            isFailover: false
          });
        }
      } catch (primaryError: any) {
        console.warn(`[Chat Router] Primary provider (${primaryProvider}) failed:`, primaryError.message);

        // 5. Automatic Failover to Alternative Provider if available
        if (allowFailover && ((primaryProvider === 'nim' && hasOpenRouter) || (primaryProvider === 'openrouter' && hasNim))) {
          const fallbackProvider = primaryProvider === 'nim' ? 'openrouter' : 'nim';
          console.log(`[Chat Router] 🔄 Attempting automatic failover to ${fallbackProvider}...`);

          try {
            if (fallbackProvider === 'openrouter') {
              const fallbackResult = await callOpenRouter(messages, model, effectiveOpenRouterKey, temperature, max_tokens, referer);
              return res.json({
                ...(fallbackResult.data as any),
                provider: 'openrouter',
                model: fallbackResult.modelUsed,
                isFailover: true,
                fallbackNotice: `Automatically failed over from NVIDIA NIM`
              });
            } else {
              const fallbackResult = await callNvidiaNim(messages, model, effectiveNimKey, temperature, max_tokens);
              return res.json({
                ...(fallbackResult.data as any),
                provider: 'nim',
                model: fallbackResult.modelUsed,
                isFailover: true,
                fallbackNotice: `Automatically failed over from OpenRouter`
              });
            }
          } catch (failoverError: any) {
            console.warn(`[Chat Router] Failover to ${fallbackProvider} also failed. Serving mill knowledge reply.`, failoverError.message);
            return res.json({
              choices: [{
                message: {
                  role: 'assistant',
                  content: getBackendSmartAssistantReply(userPrompt)
                }
              }],
              provider: 'mill-knowledge-engine',
              model: 'FabricPrint Knowledge Engine',
              isFailover: true
            });
          }
        }

        // No failover available, serve mill knowledge base gracefully
        return res.json({
          choices: [{
            message: {
              role: 'assistant',
              content: getBackendSmartAssistantReply(userPrompt)
            }
          }],
          provider: 'mill-knowledge-engine',
          model: 'FabricPrint Knowledge Engine',
          isFailover: true
        });
      }
    } catch (err: any) {
      console.error('[Chat Router] Unexpected Server Error, serving fallback:', err);
      const userPrompt = (Array.isArray(req.body?.messages) ? [...req.body.messages].reverse().find((m: any) => m.role === 'user')?.content : '') || '';
      return res.json({
        choices: [{
          message: {
            role: 'assistant',
            content: getBackendSmartAssistantReply(userPrompt)
          }
        }],
        provider: 'mill-knowledge-engine',
        model: 'FabricPrint Knowledge Engine',
        isFailover: true
      });
    }
  }

  // Unified Chat Endpoint
  app.post('/api/chat/message', handleChatCompletions);

  // Backwards compatible OpenRouter endpoint
  app.post('/api/chat/openrouter', handleChatCompletions);


  // SMART IMAGE URL & GOOGLE IMAGE EXTRACTOR API
  app.post('/api/extract-image-url', async (req, res) => {
    try {
      const { url } = req.body;
      if (!url || typeof url !== 'string') {
        return res.status(400).json({ error: 'Please provide a valid image URL.' });
      }

      const trimmed = url.trim();
      let extractedUrl = trimmed;
      let title = 'Extracted Motif Artwork';

      // 1. Detect if it is a Google Image Search redirect URL
      if (trimmed.includes('google.com') && (trimmed.includes('imgurl=') || trimmed.includes('imgrefurl='))) {
        try {
          const parsedUrl = new URL(trimmed);
          const imgUrlParam = parsedUrl.searchParams.get('imgurl');
          if (imgUrlParam) {
            extractedUrl = decodeURIComponent(imgUrlParam);
          }
        } catch (e) {
          // Fallback regex match for imgurl
          const match = trimmed.match(/imgurl=([^&]+)/);
          if (match && match[1]) {
            extractedUrl = decodeURIComponent(match[1]);
          }
        }
      }

      // 2. If user pasted a web page URL that isn't a raw image file, attempt to fetch and parse og:image
      const isDirectImage = /\.(jpeg|jpg|png|webp|gif|svg|tiff)($|\?)/i.test(extractedUrl) ||
        extractedUrl.startsWith('data:image/') ||
        extractedUrl.includes('images.unsplash.com') ||
        extractedUrl.includes('i.pinimg.com') ||
        extractedUrl.includes('imgur.com');

      if (!isDirectImage && (extractedUrl.startsWith('http://') || extractedUrl.startsWith('https://'))) {
        try {
          const controller = new AbortController();
          const timeoutId = setTimeout(() => controller.abort(), 6000);
          const response = await fetch(extractedUrl, {
            headers: {
              'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
              'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/*,*/*;q=0.8'
            },
            signal: controller.signal
          });
          clearTimeout(timeoutId);

          const contentType = response.headers.get('content-type') || '';
          if (contentType.startsWith('image/')) {
            // It was actually an image stream
            extractedUrl = response.url;
          } else {
            const html = await response.text();
            // Try extracting og:image
            const ogMatch = html.match(/<meta\s+property=["']og:image["']\s+content=["']([^"']+)["']/i) ||
              html.match(/<meta\s+content=["']([^"']+)["']\s+property=["']og:image["']/i) ||
              html.match(/<meta\s+name=["']twitter:image["']\s+content=["']([^"']+)["']/i);

            if (ogMatch && ogMatch[1]) {
              extractedUrl = ogMatch[1];
            } else {
              // Try finding first prominent img src
              const imgMatch = html.match(/<img[^>]+src=["'](https?:\/\/[^"']+\.(?:png|jpg|jpeg|webp))["']/i);
              if (imgMatch && imgMatch[1]) {
                extractedUrl = imgMatch[1];
              }
            }

            // Extract page title
            const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i);
            if (titleMatch && titleMatch[1]) {
              title = titleMatch[1].trim().slice(0, 50);
            }
          }
        } catch (fetchErr) {
          // If fetch fails, we retain the original URL as image candidate
          console.warn('URL extraction fetch notice:', fetchErr);
        }
      }

      // Generate realistic colorway palette & Pantone matches for digital printing
      const defaultPalettes = [
        ['#1E3A8A', '#F59E0B', '#10B981', '#E11D48', '#F8FAFC'],
        ['#0F766E', '#D97706', '#4F46E5', '#9333EA', '#FFFBEB'],
        ['#9A3412', '#0284C7', '#16A34A', '#E11D48', '#FAFAF9'],
        ['#312E81', '#BE185D', '#047857', '#CA8A04', '#F1F5F9']
      ];
      const randomPalette = defaultPalettes[Math.floor(Math.random() * defaultPalettes.length)];

      const pantoneMatches = [
        { name: 'Royal Cobalt', hex: randomPalette[0], code: 'PANTONE 19-4052 TCX' },
        { name: 'Radiant Gold', hex: randomPalette[1], code: 'PANTONE 14-0848 TCX' },
        { name: 'Forest Emerald', hex: randomPalette[2], code: 'PANTONE 17-5641 TCX' },
        { name: 'Berry Magenta', hex: randomPalette[3], code: 'PANTONE 18-2043 TCX' }
      ];

      res.json({
        success: true,
        originalUrl: trimmed,
        extractedImageUrl: extractedUrl,
        title,
        width: 3200,
        height: 3200,
        format: 'PNG / High-Def Textile Raster',
        fileSizeMb: 4.2,
        palette: randomPalette,
        pantoneMatches,
        extractedAt: new Date().toISOString()
      });
    } catch (err: any) {
      res.status(500).json({ error: err.message || 'Failed to extract image from the provided URL.' });
    }
  });

  // SWATCH BOOKS API
  app.get('/api/swatch-books', (req, res) => {
    res.json(db.getSwatchBooks());
  });

  // PRODUCTS API
  app.get('/api/products', (req, res) => {
    const { category, search, gsmMin, gsmMax, certified } = req.query;
    const prods = db.getProducts({
      category: category as string,
      search: search as string,
      gsmMin: gsmMin ? Number(gsmMin) : undefined,
      gsmMax: gsmMax ? Number(gsmMax) : undefined,
      certified: certified === 'true'
    });
    res.json(prods);
  });

  app.get('/api/products/:id', (req, res) => {
    const product = db.getProductById(req.params.id);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.json(product);
  });

  app.post('/api/products', (req, res) => {
    const authHeader = req.headers['authorization'] || '';
    const token = authHeader.replace(/^Bearer\s+/i, '').trim();
    const isAdmin = token.startsWith('fp-admin-') || token === 'admin-session-active';
    if (!isAdmin) {
      return res.status(403).json({ error: 'Forbidden: Admin access required to add products' });
    }

    const newProduct = db.createProduct(req.body);
    res.status(201).json(newProduct);
  });

  app.put('/api/products/:id', (req, res) => {
    const authHeader = req.headers['authorization'] || '';
    const token = authHeader.replace(/^Bearer\s+/i, '').trim();
    const isAdmin = token.startsWith('fp-admin-') || token === 'admin-session-active';
    if (!isAdmin) {
      return res.status(403).json({ error: 'Forbidden: Admin access required to update products' });
    }

    const updated = db.updateProduct(req.params.id, req.body);
    if (!updated) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.json(updated);
  });

  app.delete('/api/products/:id', (req, res) => {
    const authHeader = req.headers['authorization'] || '';
    const token = authHeader.replace(/^Bearer\s+/i, '').trim();
    const isAdmin = token.startsWith('fp-admin-') || token === 'admin-session-active';
    if (!isAdmin) {
      return res.status(403).json({ error: 'Forbidden: Admin access required to delete products' });
    }

    const deleted = db.deleteProduct(req.params.id);
    if (!deleted) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.json({ message: 'Product deleted', id: req.params.id });
  });

  // CATEGORIES API
  app.get('/api/categories', (req, res) => {
    res.json(db.getCategories());
  });

  app.post('/api/categories', (req, res) => {
    const authHeader = req.headers['authorization'] || '';
    const token = authHeader.replace(/^Bearer\s+/i, '').trim();
    const isAdmin = token.startsWith('fp-admin-') || token === 'admin-session-active';
    if (!isAdmin) {
      return res.status(403).json({ error: 'Forbidden: Admin access required to create categories' });
    }

    const newCategory = db.createCategory(req.body);
    res.status(201).json(newCategory);
  });

  // UPLOAD DESIGN ARTWORK API
  app.post('/api/upload-design', (req, res) => {
    const { fileName, fileData, fileType, fileSizeMb } = req.body;
    if (!fileData) {
      return res.status(400).json({ error: 'No file data provided' });
    }

    // Validate size (max 25MB)
    if (fileSizeMb > 25) {
      return res.status(400).json({ error: 'Design artwork exceeds max allowed size of 25MB' });
    }

    // Return the data URL for instant live rendering
    res.json({
      success: true,
      url: fileData,
      fileName,
      fileType,
      fileSizeMb,
      uploadedAt: new Date().toISOString()
    });
  });

  // CUSTOMIZER SETTINGS & PRELOADED DESIGNS API
  app.get('/api/customizer-settings', (req, res) => {
    res.json(db.getCustomizerSettings());
  });

  app.put('/api/customizer-settings', (req, res) => {
    const authHeader = req.headers['authorization'] || '';
    const token = authHeader.replace(/^Bearer\s+/i, '').trim();
    const isAdmin = token.startsWith('fp-admin-') || token === 'admin-session-active';
    if (!isAdmin) {
      return res.status(403).json({ error: 'Forbidden: Admin access required' });
    }

    const updated = db.updateCustomizerSettings(req.body);
    res.json(updated);
  });

  app.get('/api/preloaded-designs', (req, res) => {
    const settings = db.getCustomizerSettings();
    res.json((settings.preloadedDesigns || []).filter(d => d.active));
  });

  app.post('/api/preloaded-designs', (req, res) => {
    const authHeader = req.headers['authorization'] || '';
    const token = authHeader.replace(/^Bearer\s+/i, '').trim();
    const isAdmin = token.startsWith('fp-admin-') || token === 'admin-session-active';
    if (!isAdmin) {
      return res.status(403).json({ error: 'Forbidden: Admin access required' });
    }

    const settings = db.getCustomizerSettings();
    const newDesign: PreloadedDesign = {
      id: `design-${Date.now()}`,
      name: req.body.name || 'New Design Motif',
      category: req.body.category || 'General',
      imageUrl: req.body.imageUrl || 'https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?auto=format&fit=crop&q=60&w=800',
      widthPx: req.body.widthPx || 3000,
      heightPx: req.body.heightPx || 3000,
      active: true
    };
    const preloadedDesigns = [newDesign, ...(settings.preloadedDesigns || [])];
    db.updateCustomizerSettings({ preloadedDesigns });
    res.status(201).json(newDesign);
  });

  app.delete('/api/preloaded-designs/:id', (req, res) => {
    const authHeader = req.headers['authorization'] || '';
    const token = authHeader.replace(/^Bearer\s+/i, '').trim();
    const isAdmin = token.startsWith('fp-admin-') || token === 'admin-session-active';
    if (!isAdmin) {
      return res.status(403).json({ error: 'Forbidden: Admin access required' });
    }

    const settings = db.getCustomizerSettings();
    const preloadedDesigns = (settings.preloadedDesigns || []).filter(d => d.id !== req.params.id);
    db.updateCustomizerSettings({ preloadedDesigns });
    res.json({ success: true, id: req.params.id });
  });

  // ORDERS API
  app.get('/api/orders', (req, res) => {
    const authHeader = req.headers['authorization'] || '';
    const token = authHeader.replace(/^Bearer\s+/i, '').trim();

    if (!token) {
      return res.status(401).json({ error: 'Unauthorized: Authentication required to view orders' });
    }

    const isAdmin = token.startsWith('fp-admin-') || token === 'admin-session-active';
    const { userId } = req.query;

    if (isAdmin) {
      if (userId) {
        return res.json(db.getOrders(userId as string));
      }
      return res.json(db.getOrders());
    }

    const tokenUserId = token.startsWith('fp-usr-') ? token.replace('fp-usr-', '') : null;
    if (!tokenUserId) {
      return res.status(401).json({ error: 'Unauthorized: Invalid authentication token' });
    }

    if (userId && userId !== tokenUserId) {
      return res.status(403).json({ error: 'Forbidden: You can only access your own orders' });
    }

    res.json(db.getOrders(tokenUserId));
  });

  app.get('/api/orders/:id', (req, res) => {
    const authHeader = req.headers['authorization'] || '';
    const token = authHeader.replace(/^Bearer\s+/i, '').trim();

    if (!token) {
      return res.status(401).json({ error: 'Unauthorized: Authentication required to view order' });
    }

    const order = db.getOrderById(req.params.id);
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    const isAdmin = token.startsWith('fp-admin-') || token === 'admin-session-active';
    const tokenUserId = token.startsWith('fp-usr-') ? token.replace('fp-usr-', '') : null;

    if (!isAdmin && order.userId && order.userId !== tokenUserId) {
      return res.status(403).json({ error: 'Forbidden: You cannot access this order' });
    }

    res.json(order);
  });

  app.post('/api/orders', (req, res) => {
    const newOrder = db.createOrder(req.body);
    res.status(201).json(newOrder);
  });

  app.put('/api/orders/:id/status', (req, res) => {
    const authHeader = req.headers['authorization'] || '';
    const token = authHeader.replace(/^Bearer\s+/i, '').trim();
    const isAdmin = token.startsWith('fp-admin-') || token === 'admin-session-active';
    if (!isAdmin) {
      return res.status(403).json({ error: 'Forbidden: Admin access required' });
    }

    const { orderStatus, trackingNumber } = req.body;
    const updated = db.updateOrderStatus(req.params.id, orderStatus, trackingNumber);
    if (!updated) {
      return res.status(404).json({ error: 'Order not found' });
    }
    res.json(updated);
  });

  // ANALYTICS API (FOR ADMIN DASHBOARD)
  app.get('/api/analytics', (req, res) => {
    const authHeader = req.headers['authorization'] || '';
    const token = authHeader.replace(/^Bearer\s+/i, '').trim();
    const isAdmin = token.startsWith('fp-admin-') || token === 'admin-session-active';
    if (!isAdmin) {
      return res.status(403).json({ error: 'Forbidden: Admin access required' });
    }

    res.json(db.getAnalytics());
  });

  // AUTH API
  app.post('/api/auth/login', (req, res) => {
    const { email, password } = req.body;
    if (!email || !email.trim()) {
      return res.status(400).json({ error: 'Email is required' });
    }
    if (!password || !password.trim()) {
      return res.status(400).json({ error: 'Password is required' });
    }

    const verified = db.verifyUserLogin(email, password);
    if (!verified) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const token = verified.isAdmin ? `fp-admin-${Date.now()}` : `fp-usr-${verified.user.id}`;
    res.json({ user: verified.user, token, isAdmin: verified.isAdmin });
  });

  app.post('/api/auth/register', (req, res) => {
    const { name, email, phone, password } = req.body;
    if (!name || !name.trim()) {
      return res.status(400).json({ error: 'Name is required' });
    }
    if (!email || !email.trim()) {
      return res.status(400).json({ error: 'Email is required' });
    }
    if (!password || password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters' });
    }

    try {
      const user = db.createUser({ name, email, phone, password, role: 'user' });
      const token = `fp-usr-${user.id}`;
      res.status(201).json({ user, token, isAdmin: false });
    } catch (err: any) {
      res.status(400).json({ error: err.message || 'Registration failed' });
    }
  });

  // ==========================================
  // VITE / STATIC SERVING (FOR LOCAL / STANDALONE DEV)
  // ==========================================
  async function startServer() {
    const PORT = process.env.PORT || 3000;
    console.log(`[Server] Starting standalone server setup on port ${PORT}...`);

    app.listen(Number(PORT), '0.0.0.0', () => {
      console.log(`Server running on http://0.0.0.0:${PORT}`);
    });

    if (process.env.NODE_ENV !== 'production') {
      try {
        console.log('[Server] Initializing Vite dev middleware...');
        const { createServer: createViteServer } = await import('vite');
        const vite = await createViteServer({
          server: { middlewareMode: true },
          appType: 'spa',
        });
        app.use(vite.middlewares);
        console.log('[Server] Vite dev middleware attached successfully.');
      } catch (viteErr) {
        console.error('[Server] Warning: Could not initialize Vite dev middleware:', viteErr);
      }
    } else {
      const distPath = path.join(process.cwd(), 'dist');
      app.use(
        express.static(distPath, {
          setHeaders: (res, filePath) => {
            const normalized = filePath.split('\\').join('/');
            if (normalized.includes('/assets/')) {
              res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
            } else {
              res.setHeader('Cache-Control', 'public, max-age=3600');
            }
          },
        })
      );
      app.get('*', (req, res) => {
        res.setHeader('Cache-Control', 'no-cache');
        res.sendFile(path.join(distPath, 'index.html'));
      });
    }
  }

  // Only start standalone server if not executing in Vercel Serverless environment
  if (!process.env.VERCEL) {
    startServer().catch((err) => {
      console.error('Failed to start standalone server:', err);
    });
  }

  export { app };
  export default app;
