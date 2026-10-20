import express from 'express';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { INITIAL_PRODUCTS, INITIAL_CATEGORIES, INITIAL_USERS, INITIAL_ORDERS, INITIAL_CUSTOMIZER_SETTINGS, INITIAL_SWATCH_BOOKS } from './src/data/mockData.js';
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

// Server-side in-memory store initialized with seed data
let products: Product[] = [...INITIAL_PRODUCTS];
let categories: Category[] = [...INITIAL_CATEGORIES];
let swatchBooks: SwatchBook[] = [...INITIAL_SWATCH_BOOKS];
let users: User[] = [...INITIAL_USERS];
let orders: Order[] = [...INITIAL_ORDERS];
let customizerSettings: AdminCustomizerSettings = JSON.parse(JSON.stringify(INITIAL_CUSTOMIZER_SETTINGS));

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
  res.json({ status: 'ok', name: 'TexPrint Fabric Mill API', timestamp: new Date().toISOString() });
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

    const data = await response.json();
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
        'X-Title': 'TexPrint Fabric Mill AI Assistant',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: targetModel,
        messages,
        temperature,
        max_tokens
      })
    });

    const data = await response.json();
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

      // 1. Resolve keys from request or dynamic server environment
      const envKeys = getEffectiveEnvKeys();
      const effectiveNimKey = (nimApiKey ? nimApiKey.trim() : envKeys.nimKey).replace(/^["']|["']$/g, '');
      const effectiveOpenRouterKey = (openRouterApiKey ? openRouterApiKey.trim() : (apiKey ? apiKey.trim() : envKeys.openRouterKey)).replace(/^["']|["']$/g, '');

      const hasNim = !!effectiveNimKey && effectiveNimKey !== 'MY_NVIDIA_NIM_API_KEY';
      const hasOpenRouter = !!effectiveOpenRouterKey && effectiveOpenRouterKey !== 'MY_OPENROUTER_API_KEY';

      if (!hasNim && !hasOpenRouter) {
        return res.status(401).json({
          error: 'No active AI API Key found in .env.',
          needApiKey: true,
          message:
            'Please verify your NVIDIA_NIM_API_KEY or OPENROUTER_API_KEY in the server .env file.'
        });
      }

      // 3. Routing Strategy Determination
      let primaryProvider: 'nim' | 'openrouter';
      let allowFailover = true;

      if (provider === 'nim') {
        if (!hasNim) {
          return res.status(401).json({
            error: 'NVIDIA NIM API Key missing.',
            needApiKey: true,
            message: 'Please provide your NVIDIA NIM API Key in Chatbot Settings or server .env file.'
          });
        }
        primaryProvider = 'nim';
        allowFailover = hasOpenRouter;
      } else if (provider === 'openrouter') {
        if (!hasOpenRouter) {
          return res.status(401).json({
            error: 'OpenRouter API Key missing.',
            needApiKey: true,
            message: 'Please provide your OpenRouter API Key in Chatbot Settings or server .env file.'
          });
        }
        primaryProvider = 'openrouter';
        allowFailover = hasNim;
      } else {
        // Auto routing logic
        if (hasNim && hasOpenRouter) {
          // Both available: Smart routing based on model affinity
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
            ...result.data,
            provider: 'nim',
            model: result.modelUsed,
            isFailover: false
          });
        } else {
          console.log(`[Chat Router] Routing request to OpenRouter (Model: ${model})...`);
          const result = await callOpenRouter(messages, model, effectiveOpenRouterKey, temperature, max_tokens, referer);
          return res.json({
            ...result.data,
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
                ...fallbackResult.data,
                provider: 'openrouter',
                model: fallbackResult.modelUsed,
                isFailover: true,
                fallbackNotice: `Automatically failed over from NVIDIA NIM due to: ${primaryError.message}`
              });
            } else {
              const fallbackResult = await callNvidiaNim(messages, model, effectiveNimKey, temperature, max_tokens);
              return res.json({
                ...fallbackResult.data,
                provider: 'nim',
                model: fallbackResult.modelUsed,
                isFailover: true,
                fallbackNotice: `Automatically failed over from OpenRouter due to: ${primaryError.message}`
              });
            }
          } catch (failoverError: any) {
            console.error(`[Chat Router] Failover to ${fallbackProvider} also failed:`, failoverError.message);
            return res.status(502).json({
              error: `Both AI providers failed. Primary (${primaryProvider}): ${primaryError.message}. Secondary (${fallbackProvider}): ${failoverError.message}`,
              primaryError: primaryError.message,
              failoverError: failoverError.message
            });
          }
        }

        // No failover available, return primary error
        return res.status(500).json({
          error: primaryError.message || `Failed to communicate with ${primaryProvider}.`
        });
      }
    } catch (err: any) {
      console.error('[Chat Router] Unexpected Server Error:', err);
      res.status(500).json({
        error: 'Internal chat server error',
        details: err?.message || 'Unknown error'
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
    res.json(swatchBooks);
  });

  // PRODUCTS API
  app.get('/api/products', (req, res) => {
    const { category, search, gsmMin, gsmMax, certified } = req.query;
    let filtered = [...products];

    if (category && category !== 'All') {
      filtered = filtered.filter(p => p.category.toLowerCase() === (category as string).toLowerCase());
    }

    if (search) {
      const q = (search as string).toLowerCase();
      filtered = filtered.filter(
        p =>
          p.name.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.count.toLowerCase().includes(q) ||
          p.color.toLowerCase().includes(q)
      );
    }

    if (gsmMin) {
      filtered = filtered.filter(p => p.gsm >= Number(gsmMin));
    }
    if (gsmMax) {
      filtered = filtered.filter(p => p.gsm <= Number(gsmMax));
    }
    if (certified === 'true') {
      filtered = filtered.filter(p => p.certifications && p.certifications.length > 0);
    }

    res.json(filtered);
  });

  app.get('/api/products/:id', (req, res) => {
    const product = products.find(p => p.id === req.params.id);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.json(product);
  });

  app.post('/api/products', (req, res) => {
    const newProduct: Product = {
      ...req.body,
      id: `p-${Date.now()}`,
      in_stock: req.body.in_stock ?? true,
      images: req.body.images?.length > 0 ? req.body.images : ['https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?auto=format&fit=crop&q=80&w=1000'],
      rating: 5.0,
      reviews_count: 0
    };
    products.unshift(newProduct);

    // Update category count
    const cat = categories.find(c => c.name === newProduct.category);
    if (cat) {
      cat.itemCount += 1;
    }

    res.status(201).json(newProduct);
  });

  app.put('/api/products/:id', (req, res) => {
    const idx = products.findIndex(p => p.id === req.params.id);
    if (idx === -1) {
      return res.status(404).json({ error: 'Product not found' });
    }
    products[idx] = { ...products[idx], ...req.body };
    res.json(products[idx]);
  });

  app.delete('/api/products/:id', (req, res) => {
    const idx = products.findIndex(p => p.id === req.params.id);
    if (idx === -1) {
      return res.status(404).json({ error: 'Product not found' });
    }
    const deleted = products.splice(idx, 1)[0];
    res.json({ message: 'Product deleted', product: deleted });
  });

  // CATEGORIES API
  app.get('/api/categories', (req, res) => {
    res.json(categories);
  });

  app.post('/api/categories', (req, res) => {
    const newCategory: Category = {
      ...req.body,
      id: `cat-${Date.now()}`,
      itemCount: 0
    };
    categories.push(newCategory);
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
    res.json(customizerSettings);
  });

  app.put('/api/customizer-settings', (req, res) => {
    customizerSettings = {
      ...customizerSettings,
      ...req.body
    };
    res.json(customizerSettings);
  });

  app.get('/api/preloaded-designs', (req, res) => {
    res.json(customizerSettings.preloadedDesigns.filter(d => d.active));
  });

  app.post('/api/preloaded-designs', (req, res) => {
    const newDesign: PreloadedDesign = {
      id: `design-${Date.now()}`,
      name: req.body.name || 'New Design Motif',
      category: req.body.category || 'General',
      imageUrl: req.body.imageUrl || 'https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?auto=format&fit=crop&q=80&w=800',
      widthPx: req.body.widthPx || 3000,
      heightPx: req.body.heightPx || 3000,
      active: true
    };
    customizerSettings.preloadedDesigns.unshift(newDesign);
    res.status(201).json(newDesign);
  });

  app.delete('/api/preloaded-designs/:id', (req, res) => {
    const idx = customizerSettings.preloadedDesigns.findIndex(d => d.id === req.params.id);
    if (idx !== -1) {
      customizerSettings.preloadedDesigns.splice(idx, 1);
    }
    res.json({ success: true, id: req.params.id });
  });

  // ORDERS API
  app.get('/api/orders', (req, res) => {
    const { userId } = req.query;
    if (userId) {
      const userOrders = orders.filter(o => o.userId === userId);
      return res.json(userOrders);
    }
    res.json(orders);
  });

  app.get('/api/orders/:id', (req, res) => {
    const order = orders.find(o => o.id === req.params.id);
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }
    res.json(order);
  });

  app.post('/api/orders', (req, res) => {
    const orderData = req.body;
    const newOrder: Order = {
      ...orderData,
      id: `ORD-${Math.floor(1000 + Math.random() * 9000)}`,
      paymentId: orderData.paymentId || `pay_razor_${Date.now().toString(36)}`,
      paymentStatus: 'Paid',
      orderStatus: 'Pending',
      createdAt: new Date().toISOString()
    };
    orders.unshift(newOrder);
    res.status(201).json(newOrder);
  });

  app.put('/api/orders/:id/status', (req, res) => {
    const { orderStatus, trackingNumber } = req.body;
    const order = orders.find(o => o.id === req.params.id);
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }
    if (orderStatus) order.orderStatus = orderStatus;
    if (trackingNumber) order.trackingNumber = trackingNumber;
    res.json(order);
  });

  // ANALYTICS API (FOR ADMIN DASHBOARD)
  app.get('/api/analytics', (req, res) => {
    const totalRevenue = orders.reduce((acc, o) => acc + (o.paymentStatus === 'Paid' ? o.totalAmount : 0), 0);
    const totalOrders = orders.length;
    const totalCustomers = users.filter(u => u.role === 'user').length;
    const totalProducts = products.length;

    // Sales by category calculation
    const catSalesMap: Record<string, number> = {};
    orders.forEach(o => {
      o.items.forEach(item => {
        const prod = products.find(p => p.id === item.productId);
        const cat = prod?.category || 'Cotton';
        catSalesMap[cat] = (catSalesMap[cat] || 0) + item.totalPrice;
      });
    });

    const salesByCategory = Object.entries(catSalesMap).map(([category, sales]) => ({
      category,
      sales: Math.round(sales * 100) / 100
    }));

    res.json({
      totalRevenue: Math.round(totalRevenue * 100) / 100,
      totalOrders,
      totalCustomers,
      totalProducts,
      recentOrders: orders.slice(0, 5),
      salesByCategory,
      monthlyRevenue: [
        { month: 'Apr', revenue: 42000 },
        { month: 'May', revenue: 58500 },
        { month: 'Jun', revenue: 74000 },
        { month: 'Jul', revenue: 91000 },
        { month: 'Aug', revenue: Math.round(totalRevenue * 100) / 100 }
      ]
    });
  });

  // AUTH API
  app.post('/api/auth/login', (req, res) => {
    const { email, password } = req.body;
    if (email === 'admin@texprint.com') {
      const adminUser = users.find(u => u.role === 'admin') || INITIAL_USERS[1];
      return res.json({ user: adminUser, token: 'demo-admin-token' });
    }

    let existingUser = users.find(u => u.email.toLowerCase() === (email || '').toLowerCase());
    if (!existingUser) {
      existingUser = {
        id: `usr-${Date.now()}`,
        name: email.split('@')[0] || 'Customer',
        email,
        role: 'user',
        addresses: [],
        createdAt: new Date().toISOString()
      };
      users.push(existingUser);
    }

    res.json({ user: existingUser, token: 'demo-user-token' });
  });

  app.post('/api/auth/register', (req, res) => {
    const { name, email, phone } = req.body;
    const newUser: User = {
      id: `usr-${Date.now()}`,
      name: name || 'Customer',
      email,
      phone: phone || '',
      role: 'user',
      addresses: [],
      createdAt: new Date().toISOString()
    };
    users.push(newUser);
    res.status(201).json({ user: newUser, token: 'demo-user-token' });
  });

  // ==========================================
  // VITE / STATIC SERVING (FOR LOCAL / STANDALONE DEV)
  // ==========================================
  async function startServer() {
    const PORT = process.env.PORT || 3000;

    if (process.env.NODE_ENV !== 'production') {
      const { createServer: createViteServer } = await import('vite');
      const vite = await createViteServer({
        server: { middlewareMode: true },
        appType: 'spa',
      });
      app.use(vite.middlewares);
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

    app.listen(Number(PORT), '0.0.0.0', () => {
      console.log(`Server running on http://0.0.0.0:${PORT}`);
    });
  }

  // Only start standalone server if not executing in Vercel Serverless environment
  if (!process.env.VERCEL) {
    startServer().catch((err) => {
      console.error('Failed to start standalone server:', err);
    });
  }

  export { app };
  export default app;
