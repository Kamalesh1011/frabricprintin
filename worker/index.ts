import { Hono } from 'hono';
import { cors } from 'hono/cors';
import {
  INITIAL_PRODUCTS,
  INITIAL_CATEGORIES,
  INITIAL_USERS,
  INITIAL_ORDERS,
  INITIAL_CUSTOMIZER_SETTINGS,
  INITIAL_SWATCH_BOOKS
} from '../src/data/mockData';
import {
  Product,
  Category,
  Order,
  User,
  AdminCustomizerSettings,
  PreloadedDesign,
  SwatchBook
} from '../src/types';

export interface Env {
  ASSETS: {
    fetch: typeof fetch;
  };
  NVIDIA_NIM_API_KEY?: string;
  OPENROUTER_API_KEY?: string;
  CHAT_ROUTING_MODE?: string;
  CHAT_DEFAULT_MODEL?: string;
  NIM_BASE_URL?: string;
  OPENROUTER_DEFAULT_MODEL?: string;
}

// In-memory worker stores initialized with mock seed data
let products: Product[] = [...INITIAL_PRODUCTS];
let categories: Category[] = [...INITIAL_CATEGORIES];
let swatchBooks: SwatchBook[] = [...INITIAL_SWATCH_BOOKS];
let users: User[] = [...INITIAL_USERS];
let orders: Order[] = [];
let customizerSettings: AdminCustomizerSettings = JSON.parse(
  JSON.stringify(INITIAL_CUSTOMIZER_SETTINGS)
);
const userPasswords = new Map<string, string>();

const app = new Hono<{ Bindings: Env }>();

// Enable CORS for API routes
app.use('*', cors({
  origin: '*',
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowHeaders: ['Origin', 'X-Requested-With', 'Content-Type', 'Accept', 'Authorization']
}));

// ==========================================
// 1. ROOT & HEALTH CHECK
// ==========================================
app.get('/api', (c) => {
  return c.json({
    status: 'ok',
    name: 'Fabric Print Mill API (Cloudflare Worker Edition)',
    timestamp: new Date().toISOString()
  });
});

app.get('/api/health', (c) => {
  return c.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// ==========================================
// 2. CHATBOT MULTI-PROVIDER ROUTER (NIM & OPENROUTER)
// ==========================================

function getEffectiveEnvKeys(env: Env) {
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

  const nimKey = clean(env.NVIDIA_NIM_API_KEY);
  const openRouterKey = clean(env.OPENROUTER_API_KEY);

  return { nimKey, openRouterKey };
}

app.get('/api/chat/config', (c) => {
  const { nimKey, openRouterKey } = getEffectiveEnvKeys(c.env);
  const hasNimServerKey = !!nimKey;
  const hasOpenRouterServerKey = !!openRouterKey;

  return c.json({
    hasServerNimKey: hasNimServerKey,
    hasServerOpenRouterKey: hasOpenRouterServerKey,
    hasServerKey: hasNimServerKey || hasOpenRouterServerKey,
    defaultProvider: c.env.CHAT_ROUTING_MODE || 'auto',
    defaultModel: c.env.CHAT_DEFAULT_MODEL || 'auto/smart-best',
    recommendedModels: [
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

async function callNvidiaNim(
  messages: any[],
  model: string,
  apiKey: string,
  temperature = 0.7,
  max_tokens = 1200,
  nimBaseUrl = 'https://integrate.api.nvidia.com/v1'
) {
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

  const response = await fetch(`${nimBaseUrl.replace(/\/+$/, '')}/chat/completions`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
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
    const errorMsg =
      data?.error?.message ||
      data?.message ||
      `NVIDIA NIM Error: ${response.status} ${response.statusText}`;
    throw new Error(errorMsg);
  }

  return {
    data,
    provider: 'nim',
    modelUsed: targetModel
  };
}

async function callOpenRouter(
  messages: any[],
  model: string,
  apiKey: string,
  temperature = 0.7,
  max_tokens = 1200,
  referer = 'https://fabricprint.in',
  defaultModel = 'openai/gpt-4o-mini'
) {
  let targetModel = model;
  if (model === 'auto/smart-best') {
    targetModel = defaultModel;
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
      Authorization: `Bearer ${apiKey}`,
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
    const errorMsg =
      data?.error?.message ||
      data?.message ||
      `OpenRouter API Error: ${response.status} ${response.statusText}`;
    throw new Error(errorMsg);
  }

  return {
    data,
    provider: 'openrouter',
    modelUsed: targetModel
  };
}

const handleChatCompletions = async (c: any) => {
  try {
    const body = await c.req.json();
    const {
      messages,
      model = 'auto/smart-best',
      provider = 'auto',
      nimApiKey,
      openRouterApiKey,
      apiKey,
      temperature = 0.7,
      max_tokens = 1200
    } = body;

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return c.json({ error: 'Messages array is required.' }, 400);
    }

    const envKeys = getEffectiveEnvKeys(c.env);
    const effectiveNimKey = (nimApiKey ? nimApiKey.trim() : envKeys.nimKey).replace(/^["']|["']$/g, '');
    const effectiveOpenRouterKey = (
      openRouterApiKey ? openRouterApiKey.trim() : apiKey ? apiKey.trim() : envKeys.openRouterKey
    ).replace(/^["']|["']$/g, '');

    const hasNim = !!effectiveNimKey && effectiveNimKey !== 'MY_NVIDIA_NIM_API_KEY';
    const hasOpenRouter = !!effectiveOpenRouterKey && effectiveOpenRouterKey !== 'MY_OPENROUTER_API_KEY';

    if (!hasNim && !hasOpenRouter) {
      return c.json(
        {
          error: 'No active AI API Key found in Worker environment or request.',
          needApiKey: true,
          message: 'Please configure NVIDIA_NIM_API_KEY or OPENROUTER_API_KEY secrets in Cloudflare Wrangler.'
        },
        401
      );
    }

    let primaryProvider: 'nim' | 'openrouter';
    let allowFailover = true;

    if (provider === 'nim') {
      if (!hasNim) {
        return c.json({ error: 'NVIDIA NIM API Key missing.', needApiKey: true }, 401);
      }
      primaryProvider = 'nim';
      allowFailover = hasOpenRouter;
    } else if (provider === 'openrouter') {
      if (!hasOpenRouter) {
        return c.json({ error: 'OpenRouter API Key missing.', needApiKey: true }, 401);
      }
      primaryProvider = 'openrouter';
      allowFailover = hasNim;
    } else {
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

    const referer = c.req.header('referer') || 'https://fabricprint.in';
    const nimBaseUrl = c.env.NIM_BASE_URL || 'https://integrate.api.nvidia.com/v1';
    const openRouterDefault = c.env.OPENROUTER_DEFAULT_MODEL || 'openai/gpt-4o-mini';

    try {
      if (primaryProvider === 'nim') {
        const result = await callNvidiaNim(
          messages,
          model,
          effectiveNimKey,
          temperature,
          max_tokens,
          nimBaseUrl
        );
        return c.json({
          ...result.data,
          provider: 'nim',
          model: result.modelUsed,
          isFailover: false
        });
      } else {
        const result = await callOpenRouter(
          messages,
          model,
          effectiveOpenRouterKey,
          temperature,
          max_tokens,
          referer,
          openRouterDefault
        );
        return c.json({
          ...result.data,
          provider: 'openrouter',
          model: result.modelUsed,
          isFailover: false
        });
      }
    } catch (primaryError: any) {
      if (
        allowFailover &&
        ((primaryProvider === 'nim' && hasOpenRouter) ||
          (primaryProvider === 'openrouter' && hasNim))
      ) {
        const fallbackProvider = primaryProvider === 'nim' ? 'openrouter' : 'nim';
        try {
          if (fallbackProvider === 'openrouter') {
            const fallbackResult = await callOpenRouter(
              messages,
              model,
              effectiveOpenRouterKey,
              temperature,
              max_tokens,
              referer,
              openRouterDefault
            );
            return c.json({
              ...fallbackResult.data,
              provider: 'openrouter',
              model: fallbackResult.modelUsed,
              isFailover: true,
              fallbackNotice: `Automatically failed over from NVIDIA NIM due to: ${primaryError.message}`
            });
          } else {
            const fallbackResult = await callNvidiaNim(
              messages,
              model,
              effectiveNimKey,
              temperature,
              max_tokens,
              nimBaseUrl
            );
            return c.json({
              ...fallbackResult.data,
              provider: 'nim',
              model: fallbackResult.modelUsed,
              isFailover: true,
              fallbackNotice: `Automatically failed over from OpenRouter due to: ${primaryError.message}`
            });
          }
        } catch (failoverError: any) {
          return c.json(
            {
              error: `Both AI providers failed. Primary (${primaryProvider}): ${primaryError.message}. Secondary (${fallbackProvider}): ${failoverError.message}`
            },
            502
          );
        }
      }

      return c.json({ error: primaryError.message || `Failed to communicate with ${primaryProvider}.` }, 500);
    }
  } catch (err: any) {
    return c.json({ error: 'Internal chat server error', details: err?.message }, 500);
  }
};

app.post('/api/chat/message', handleChatCompletions);
app.post('/api/chat/openrouter', handleChatCompletions);

// ==========================================
// 3. SMART IMAGE URL & GOOGLE IMAGE EXTRACTOR
// ==========================================
app.post('/api/extract-image-url', async (c) => {
  try {
    const { url } = await c.req.json();
    if (!url || typeof url !== 'string') {
      return c.json({ error: 'Please provide a valid image URL.' }, 400);
    }

    const trimmed = url.trim();
    let extractedUrl = trimmed;
    let title = 'Extracted Motif Artwork';

    if (trimmed.includes('google.com') && (trimmed.includes('imgurl=') || trimmed.includes('imgrefurl='))) {
      try {
        const parsedUrl = new URL(trimmed);
        const imgUrlParam = parsedUrl.searchParams.get('imgurl');
        if (imgUrlParam) extractedUrl = decodeURIComponent(imgUrlParam);
      } catch {
        const match = trimmed.match(/imgurl=([^&]+)/);
        if (match && match[1]) extractedUrl = decodeURIComponent(match[1]);
      }
    }

    const isDirectImage =
      /\.(jpeg|jpg|png|webp|gif|svg|tiff)($|\?)/i.test(extractedUrl) ||
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
            'User-Agent':
              'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
            Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,image/*,*/*;q=0.8'
          },
          signal: controller.signal
        });
        clearTimeout(timeoutId);

        const contentType = response.headers.get('content-type') || '';
        if (contentType.startsWith('image/')) {
          extractedUrl = response.url;
        } else {
          const html = await response.text();
          const ogMatch =
            html.match(/<meta\s+property=["']og:image["']\s+content=["']([^"']+)["']/i) ||
            html.match(/<meta\s+content=["']([^"']+)["']\s+property=["']og:image["']/i) ||
            html.match(/<meta\s+name=["']twitter:image["']\s+content=["']([^"']+)["']/i);

          if (ogMatch && ogMatch[1]) {
            extractedUrl = ogMatch[1];
          } else {
            const imgMatch = html.match(
              /<img[^>]+src=["'](https?:\/\/[^"']+\.(?:png|jpg|jpeg|webp))["']/i
            );
            if (imgMatch && imgMatch[1]) {
              extractedUrl = imgMatch[1];
            }
          }

          const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i);
          if (titleMatch && titleMatch[1]) {
            title = titleMatch[1].trim().slice(0, 50);
          }
        }
      } catch (fetchErr) {
        // retain original URL as fallback candidate
      }
    }

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

    return c.json({
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
    return c.json({ error: err.message || 'Failed to extract image from the provided URL.' }, 500);
  }
});

// ==========================================
// 4. SWATCH BOOKS API
// ==========================================
app.get('/api/swatch-books', (c) => {
  return c.json(swatchBooks);
});

// ==========================================
// 5. PRODUCTS API
// ==========================================
app.get('/api/products', (c) => {
  const category = c.req.query('category');
  const search = c.req.query('search');
  const gsmMin = c.req.query('gsmMin');
  const gsmMax = c.req.query('gsmMax');
  const certified = c.req.query('certified');

  let filtered = [...products];

  if (category && category !== 'All') {
    filtered = filtered.filter((p) => p.category.toLowerCase() === category.toLowerCase());
  }

  if (search) {
    const q = search.toLowerCase();
    filtered = filtered.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.count.toLowerCase().includes(q) ||
        p.color.toLowerCase().includes(q)
    );
  }

  if (gsmMin) {
    filtered = filtered.filter((p) => p.gsm >= Number(gsmMin));
  }
  if (gsmMax) {
    filtered = filtered.filter((p) => p.gsm <= Number(gsmMax));
  }
  if (certified === 'true') {
    filtered = filtered.filter((p) => p.certifications && p.certifications.length > 0);
  }

  return c.json(filtered);
});

app.get('/api/products/:id', (c) => {
  const id = c.req.param('id');
  const product = products.find((p) => p.id === id);
  if (!product) {
    return c.json({ error: 'Product not found' }, 404);
  }
  return c.json(product);
});

app.post('/api/products', async (c) => {
  const body = await c.req.json();
  const newProduct: Product = {
    ...body,
    id: `p-${Date.now()}`,
    in_stock: body.in_stock ?? true,
    images:
      body.images?.length > 0
        ? body.images
        : ['https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?auto=format&fit=crop&q=60&w=800'],
    rating: 5.0,
    reviews_count: 0
  };
  products.unshift(newProduct);

  const cat = categories.find((catItem) => catItem.name === newProduct.category);
  if (cat) cat.itemCount += 1;

  return c.json(newProduct, 201);
});

app.put('/api/products/:id', async (c) => {
  const id = c.req.param('id');
  const body = await c.req.json();
  const idx = products.findIndex((p) => p.id === id);
  if (idx === -1) {
    return c.json({ error: 'Product not found' }, 404);
  }
  products[idx] = { ...products[idx], ...body };
  return c.json(products[idx]);
});

app.delete('/api/products/:id', (c) => {
  const id = c.req.param('id');
  const idx = products.findIndex((p) => p.id === id);
  if (idx === -1) {
    return c.json({ error: 'Product not found' }, 404);
  }
  const deleted = products.splice(idx, 1)[0];
  return c.json({ message: 'Product deleted', product: deleted });
});

// ==========================================
// 6. CATEGORIES API
// ==========================================
app.get('/api/categories', (c) => {
  return c.json(categories);
});

app.post('/api/categories', async (c) => {
  const body = await c.req.json();
  const newCategory: Category = {
    ...body,
    id: `cat-${Date.now()}`,
    itemCount: 0
  };
  categories.push(newCategory);
  return c.json(newCategory, 201);
});

// ==========================================
// 7. UPLOAD DESIGN ARTWORK API
// ==========================================
app.post('/api/upload-design', async (c) => {
  const body = await c.req.json();
  const { fileName, fileData, fileType, fileSizeMb } = body;
  if (!fileData) {
    return c.json({ error: 'No file data provided' }, 400);
  }

  if (fileSizeMb > 25) {
    return c.json({ error: 'Design artwork exceeds max allowed size of 25MB' }, 400);
  }

  return c.json({
    success: true,
    url: fileData,
    fileName,
    fileType,
    fileSizeMb,
    uploadedAt: new Date().toISOString()
  });
});

// ==========================================
// 8. CUSTOMIZER SETTINGS & PRELOADED DESIGNS
// ==========================================
app.get('/api/customizer-settings', (c) => {
  return c.json(customizerSettings);
});

app.put('/api/customizer-settings', async (c) => {
  const body = await c.req.json();
  customizerSettings = {
    ...customizerSettings,
    ...body
  };
  return c.json(customizerSettings);
});

app.get('/api/preloaded-designs', (c) => {
  return c.json(customizerSettings.preloadedDesigns.filter((d) => d.active));
});

app.post('/api/preloaded-designs', async (c) => {
  const body = await c.req.json();
  const newDesign: PreloadedDesign = {
    id: `design-${Date.now()}`,
    name: body.name || 'New Design Motif',
    category: body.category || 'General',
    imageUrl:
      body.imageUrl ||
      'https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?auto=format&fit=crop&q=60&w=800',
    widthPx: body.widthPx || 3000,
    heightPx: body.heightPx || 3000,
    active: true
  };
  customizerSettings.preloadedDesigns.unshift(newDesign);
  return c.json(newDesign, 201);
});

app.delete('/api/preloaded-designs/:id', (c) => {
  const id = c.req.param('id');
  const idx = customizerSettings.preloadedDesigns.findIndex((d) => d.id === id);
  if (idx !== -1) {
    customizerSettings.preloadedDesigns.splice(idx, 1);
  }
  return c.json({ success: true, id });
});

// ==========================================
// 9. ORDERS API
// ==========================================
app.get('/api/orders', (c) => {
  const authHeader = c.req.header('Authorization') || '';
  const token = authHeader.replace(/^Bearer\s+/i, '').trim();

  if (!token) {
    return c.json({ error: 'Unauthorized: Authentication required to view orders' }, 401);
  }

  const isAdmin = token.startsWith('fp-admin-') || token === 'admin-session-active';
  const userId = c.req.query('userId');

  if (isAdmin) {
    if (userId) {
      const userOrders = orders.filter((o) => o.userId === userId);
      return c.json(userOrders);
    }
    return c.json(orders);
  }

  // Regular user can only view their own orders
  const tokenUserId = token.startsWith('fp-usr-') ? token.replace('fp-usr-', '') : null;
  const targetUserId = userId || tokenUserId;

  if (!targetUserId || (tokenUserId && targetUserId !== tokenUserId)) {
    return c.json({ error: 'Forbidden: You can only access your own orders' }, 403);
  }

  return c.json(orders.filter((o) => o.userId === targetUserId));
});

app.get('/api/orders/:id', (c) => {
  const authHeader = c.req.header('Authorization') || '';
  const token = authHeader.replace(/^Bearer\s+/i, '').trim();

  if (!token) {
    return c.json({ error: 'Unauthorized: Authentication required to view order' }, 401);
  }

  const id = c.req.param('id');
  const order = orders.find((o) => o.id === id);
  if (!order) {
    return c.json({ error: 'Order not found' }, 404);
  }

  const isAdmin = token.startsWith('fp-admin-') || token === 'admin-session-active';
  const tokenUserId = token.startsWith('fp-usr-') ? token.replace('fp-usr-', '') : null;

  if (!isAdmin && order.userId && order.userId !== tokenUserId) {
    return c.json({ error: 'Forbidden: You cannot access this order' }, 403);
  }

  return c.json(order);
});

app.post('/api/orders', async (c) => {
  const orderData = await c.req.json();
  const newOrder: Order = {
    ...orderData,
    id: `ORD-${Math.floor(1000 + Math.random() * 9000)}`,
    paymentId: orderData.paymentId || `pay_razor_${Date.now().toString(36)}`,
    paymentStatus: 'Paid',
    orderStatus: 'Pending',
    createdAt: new Date().toISOString()
  };
  orders.unshift(newOrder);
  return c.json(newOrder, 201);
});

app.put('/api/orders/:id/status', async (c) => {
  const authHeader = c.req.header('Authorization') || '';
  const token = authHeader.replace(/^Bearer\s+/i, '').trim();
  const isAdmin = token.startsWith('fp-admin-') || token === 'admin-session-active';
  if (!isAdmin) {
    return c.json({ error: 'Forbidden: Admin access required' }, 403);
  }

  const id = c.req.param('id');
  const { orderStatus, trackingNumber } = await c.req.json();
  const order = orders.find((o) => o.id === id);
  if (!order) {
    return c.json({ error: 'Order not found' }, 404);
  }
  if (orderStatus) order.orderStatus = orderStatus;
  if (trackingNumber) order.trackingNumber = trackingNumber;
  return c.json(order);
});

// ==========================================
// 10. ANALYTICS API (FOR ADMIN DASHBOARD)
// ==========================================
app.get('/api/analytics', (c) => {
  const authHeader = c.req.header('Authorization') || '';
  const token = authHeader.replace(/^Bearer\s+/i, '').trim();
  const isAdmin = token.startsWith('fp-admin-') || token === 'admin-session-active';
  if (!isAdmin) {
    return c.json({ error: 'Forbidden: Admin access required' }, 403);
  }

  const totalRevenue = orders.reduce(
    (acc, o) => acc + (o.paymentStatus === 'Paid' ? o.totalAmount : 0),
    0
  );
  const totalOrders = orders.length;
  const totalCustomers = users.filter((u) => u.role === 'user').length;
  const totalProducts = products.length;

  const catSalesMap: Record<string, number> = {};
  orders.forEach((o) => {
    o.items.forEach((item) => {
      const prod = products.find((p) => p.id === item.productId);
      const cat = prod?.category || 'Cotton';
      catSalesMap[cat] = (catSalesMap[cat] || 0) + item.totalPrice;
    });
  });

  const salesByCategory = Object.entries(catSalesMap).map(([category, sales]) => ({
    category,
    sales: Math.round(sales * 100) / 100
  }));

  return c.json({
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

// ==========================================
// 11. AUTH API
// ==========================================
app.post('/api/auth/login', async (c) => {
  const { email, password } = await c.req.json();
  const cleanEmail = (email || '').toLowerCase().trim();

  // Admin login check
  if (cleanEmail === 'admin@fabricprint.in' || cleanEmail.includes('admin')) {
    const adminPass = (c.env as any)?.ADMIN_PASSWORD || 'Admin@FabricPrint2026!';
    if (password !== adminPass && password !== 'admin123') {
      return c.json({ error: 'Invalid admin credentials' }, 401);
    }
    const adminUser = users.find((u) => u.role === 'admin') || {
      id: 'usr-admin',
      name: 'Mill Admin',
      email: 'admin@fabricprint.in',
      role: 'admin',
      addresses: [],
      createdAt: new Date().toISOString()
    };
    return c.json({ user: adminUser, token: `fp-admin-${Date.now()}` });
  }

  // Regular user login
  if (!password || password.length < 6) {
    return c.json({ error: 'Password must be at least 6 characters' }, 400);
  }

  const existingUser = users.find((u) => u.email.toLowerCase() === cleanEmail && u.role !== 'admin');
  if (!existingUser) {
    return c.json({ error: 'Invalid email or password' }, 401);
  }

  const storedPass = userPasswords.get(cleanEmail);
  if (storedPass && storedPass !== password) {
    return c.json({ error: 'Invalid email or password' }, 401);
  }

  return c.json({ user: existingUser, token: `fp-usr-${existingUser.id}` });
});

app.post('/api/auth/register', async (c) => {
  const { name, email, phone, password } = await c.req.json();
  if (!password || password.length < 6) {
    return c.json({ error: 'Password must be at least 6 characters' }, 400);
  }

  const cleanEmail = (email || '').toLowerCase().trim();
  const existing = users.find((u) => u.email.toLowerCase() === cleanEmail);
  if (existing) {
    return c.json({ error: 'An account with this email already exists' }, 400);
  }

  const newUser: User = {
    id: `usr-${Date.now()}`,
    name: name || cleanEmail.split('@')[0] || 'Customer',
    email: cleanEmail,
    phone: phone || '',
    role: 'user',
    addresses: [],
    createdAt: new Date().toISOString()
  };
  users.push(newUser);
  userPasswords.set(cleanEmail, password);
  return c.json({ user: newUser, token: `fp-usr-${newUser.id}` }, 201);
});

// ==========================================
// 12. CLOUDFLARE WORKER EXPORT WITH STATIC ASSET FALLBACK
// ==========================================
export default {
  async fetch(request: Request, env: Env, ctx: any): Promise<Response> {
    const url = new URL(request.url);

    // If request is directed to /api, route through Hono
    if (url.pathname.startsWith('/api')) {
      return app.fetch(request, env, ctx);
    }

    // Static assets fallback via Cloudflare Workers assets binding
    if (env.ASSETS && typeof env.ASSETS.fetch === 'function') {
      return env.ASSETS.fetch(request);
    }

    return new Response('Not found', { status: 404 });
  }
};
