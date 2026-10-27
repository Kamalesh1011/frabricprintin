import React, { useState, useMemo, useRef } from 'react';
import {
  Trophy,
  ArrowRight,
  ArrowLeft,
  Upload,
  Plus,
  Trash2,
  X,
  Check,
  CheckCircle2,
  Truck,
  ShieldCheck,
  Users,
  ClipboardList,
  ChevronDown,
  ChevronUp,
  RotateCcw,
  ShoppingCart,
  LayoutTemplate,
  Sparkles,
  Search,
  Shirt,
  Palette,
  Printer,
  Star,
  Eye,
  Layers,
  Activity,
  Info,
  MapPin,
  Share2,
  Bookmark,
  ZoomIn,
  Clock,
  Sparkle,
  Ruler,
  Pipette
} from 'lucide-react';
import { motion, AnimatePresence, useScroll, useSpring } from 'motion/react';
import { Magnetic } from '../components/Magnetic';
import { PreloadedDesignModal } from '../components/PreloadedDesignModal';
import {
  CUSTOM_MERCH_PRODUCTS,
  CustomMerchItem,
} from '../data/customMerchData';
import { CustomMerchStudioModal } from '../components/CustomMerchStudioModal';
import { useCart } from '../context/CartContext';
import { Product, CategoryType, JerseyCustomization, JerseyPlayerEntry } from '../types';

interface JerseyPageProps {
  onGoToHome: () => void;
  onGoToCheckout?: () => void;
  onOpenBulkInquiry?: () => void;
}

// Sports catalog kits
const SPORTS_KITS: CustomMerchItem[] = CUSTOM_MERCH_PRODUCTS.filter((p) => p.category === 'SPORTS');

const KIT_SIZES = ['XS', 'S', 'M', 'L', 'XL', '2XL', '3XL'];

const SPORT_TYPES = [
  'Cricket',
  'Football',
  'Basketball',
  'Volleyball',
  'Badminton',
  'Esports',
  'Athletics',
  'Corporate / Campus',
];

const JERSEY_FONTS = [
  { id: 'Impact', label: 'Varsity — Bold Athletic', family: "Impact, 'Arial Black', sans-serif" },
  { id: 'Block', label: 'Block — Heavy Stencil', family: "'Arial Black', 'Inter', sans-serif" },
  { id: 'Inter', label: 'Inter — Clean Modern', family: "'Inter', 'Plus Jakarta Sans', system-ui, sans-serif" },
  { id: 'Serif', label: 'Classic — Heritage', family: "Georgia, 'Playfair Display', serif" },
  { id: 'Mono', label: 'Tech — Precision Mono', family: "'Space Grotesk', monospace" },
];

const NUMBER_COLORS = [
  { name: 'White', hex: '#FFFFFF' },
  { name: 'Black', hex: '#111827' },
  { name: 'Gold', hex: '#E5A824' },
  { name: 'Cyan', hex: '#06B6D4' },
  { name: 'Crimson', hex: '#DC2626' },
  { name: 'Royal', hex: '#2563EB' },
  { name: 'Neon Green', hex: '#84CC16' },
];

const DESIGN_STYLES = [
  { id: 'minimal', name: 'Clean White Canvas', preview: '/mockups/white_mens_jersey.jpg' },
  { id: 'speed', name: 'Speed Streak Graphic', preview: '/mockups/jersey_speed_front.jpg' },
  { id: 'lightning', name: 'Lightning Shards Graphic', preview: '/mockups/jersey_lightning_front.jpg' },
  { id: 'geometric', name: 'Cyber Geometric Graphic', preview: '/mockups/jersey_cyber_front.jpg' },
  { id: 'blackgold', name: 'Black & Gold Fire Graphic', preview: '/mockups/jersey_blackgold_front.jpg' },
];

const COLOR_SWATCHES = [
  { name: 'White', hex: '#FFFFFF' },
  { name: 'Light Blue', hex: '#38BDF8' },
  { name: 'Royal Blue', hex: '#1D4ED8' },
  { name: 'Navy', hex: '#0F172A' },
  { name: 'Red', hex: '#DC2626' },
  { name: 'Gold', hex: '#E5A824' },
  { name: 'Black', hex: '#111827' },
  { name: 'Green', hex: '#16A34A' },
];

const PRESET_CRESTS = [
  { name: 'Thunder', icon: '⚡' },
  { name: 'Lions', icon: '🦁' },
  { name: 'Falcons', icon: '🦅' },
  { name: 'Kings', icon: '👑' },
  { name: 'Warriors', icon: '⚔️' },
  { name: 'Wolves', icon: '🐺' },
];

const SIZE_CHART = [
  { size: 'XS', chest: 34, length: 27 },
  { size: 'S', chest: 36, length: 28 },
  { size: 'M', chest: 38, length: 29 },
  { size: 'L', chest: 40, length: 30 },
  { size: 'XL', chest: 42, length: 31 },
  { size: '2XL', chest: 44, length: 32 },
  { size: '3XL', chest: 46, length: 33 },
];

const FAQS = [
  {
    q: 'What material are the sports jerseys made from?',
    a: 'Our sports jerseys are made from 100% Dry-Fit Polyester (170 GSM micro-poly interlock). It is lightweight, moisture-wicking, highly breathable, and engineered for high-intensity athletic performance in all Indian weather conditions.',
  },
  {
    q: 'What printing method is used for sports jersey customisation?',
    a: 'Customisation uses full 360-degree dye sublimation printing. Unlike screen print or rubber stickers, sublimation bonds the ink permanently into the fabric fibres at high temperature. Prints will never peel, crack, or fade, even after 100+ vigorous washes.',
  },
  {
    q: 'Can I customise both the front and back of the jersey?',
    a: 'Yes. Both front and back are 100% customisable. You can place your club crest, sponsor logo, team name on the front, and custom player name and jersey number on the back at no extra cost.',
  },
  {
    q: 'What is the Teams feature?',
    a: 'The Teams feature allows you to personalize individual player names, numbers, and sizes for your entire squad in a single order, without needing to redesign the jersey from scratch for every player.',
  },
  {
    q: 'What is the minimum order quantity (MOQ)?',
    a: 'You can order from just 1 single piece! Volume discounts automatically apply as your squad size increases (15% off for 6-24 pcs, 25% off for 25-99 pcs, and 35% off for 100+ pcs).',
  },
  {
    q: 'Can I mix different sizes in the same team order?',
    a: 'Yes! You can mix any combination of XS, S, M, L, XL, 2XL, and 3XL in a single order. Each player on your roster carries their own specific size.',
  },
  {
    q: 'What file format should I use for uploading logos?',
    a: 'We accept PNG, JPG, WEBP, PDF, and SVG files up to 10 MB. High-resolution transparent PNG or vector SVG files produce the sharpest sublimation output.',
  },
  {
    q: 'Is Cash on Delivery (COD) and Free Delivery available?',
    a: 'Yes. We offer free standard delivery across all pin codes in India, and Cash on Delivery is available for team kit orders.',
  },
  {
    q: 'How long does production and delivery take?',
    a: 'Sublimation printing takes 2–4 business days. Standard shipping takes 3–5 days across India depending on your location. Fast express courier is also available for tournament deadlines.',
  },
  {
    q: 'What is your return and replacement policy?',
    a: 'We offer an easy 100% satisfaction guarantee. If your order arrives with any printing defect, wrong spelling, or sizing manufacturing issue, we provide an immediate free replacement or full refund.',
  },
];

const scrollToId = (id: string) => {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
};

let playerSeq = 100;

export const JerseyPage: React.FC<JerseyPageProps> = ({
  onGoToHome,
  onGoToCheckout,
  onOpenBulkInquiry,
}) => {
  const { addToCart, setIsCartOpen } = useCart();

  // Studio modal (per-product deep customizer)
  const [studioProduct, setStudioProduct] = useState<CustomMerchItem | null>(null);
  const [isStudioOpen, setIsStudioOpen] = useState(false);

  // Studio Accordion step state (1 to 5)
  const [activeStep, setActiveStep] = useState<number>(1);

  // Angle / View in Studio
  const [side, setSide] = useState<'front' | 'back'>('front');
  const [selectedAngle, setSelectedAngle] = useState<number>(0);
  const [isZoomOpen, setIsZoomOpen] = useState(false);

  // Customization configuration
  const [activeKitId, setActiveKitId] = useState<string>(SPORTS_KITS[0]?.id || 'sports-sub-mens-01');
  const [sportType, setSportType] = useState('Cricket');
  const [neckline, setNeckline] = useState<'Round Neck' | 'Polo Collar'>('Round Neck');
  const [sleeveType, setSleeveType] = useState<'Half Sleeve' | 'Full Sleeve'>('Half Sleeve');
  const [teamName, setTeamName] = useState('TEAM');
  const [fontStyle, setFontStyle] = useState('Impact');
  const [numberColor, setNumberColor] = useState('#111827');
  const [textColor, setTextColor] = useState('#111827');
  const [selectedColorHex, setSelectedColorHex] = useState('#FFFFFF');
  const [selectedStyleId, setSelectedStyleId] = useState('minimal');
  const [sponsorLogo, setSponsorLogo] = useState<string | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [activePlayerIdx, setActivePlayerIdx] = useState<number>(0);
  const [sizeUnit, setSizeUnit] = useState<'in' | 'cm'>('in');

  // UI state
  const [addedToast, setAddedToast] = useState(false);
  const [saveToast, setSaveToast] = useState(false);
  const [shareToast, setShareToast] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [isArtworkOpen, setIsArtworkOpen] = useState(false);
  const [showPaste, setShowPaste] = useState(false);
  const [pasteText, setPasteText] = useState('');
  const [pincode, setPincode] = useState('');
  const [pincodeResult, setPincodeResult] = useState<string | null>(null);

  const logoInputRef = useRef<HTMLInputElement>(null);
  const { scrollYProgress } = useScroll();
  const progressBar = useSpring(scrollYProgress, { stiffness: 140, damping: 26, mass: 0.4 });

  // Squad roster initialized with 4 players matching mockup (4 PIECES, ₹1,396)
  const [players, setPlayers] = useState<JerseyPlayerEntry[]>([
    { id: 'p-1', name: 'Arjun', number: '07', size: 'M' },
    { id: 'p-2', name: 'Vikram', number: '10', size: 'M' },
    { id: 'p-3', name: 'Rohit', number: '18', size: 'L' },
    { id: 'p-4', name: 'Kunal', number: '45', size: 'L' },
  ]);

  const activeKit = useMemo(
    () => SPORTS_KITS.find((k) => k.id === activeKitId) || SPORTS_KITS[0],
    [activeKitId]
  );

  const quantity = players.length;

  // Wholesale pricing tier
  const activeTier = useMemo(() => {
    if (!activeKit) return null;
    return (
      [...activeKit.wholesaleTiers].reverse().find((t) => quantity >= t.minQty) ||
      activeKit.wholesaleTiers[0]
    );
  }, [activeKit, quantity]);

  const unitPrice = activeTier ? activeTier.unitPrice : activeKit?.basePrice || 349;
  const totalPrice = unitPrice * quantity;
  const mrpTotal = (activeKit?.basePrice || 349) * quantity;

  // Size distribution breakdown
  const sizeBreakdown = useMemo(() => {
    const map: Record<string, number> = {};
    players.forEach((p) => {
      map[p.size] = (map[p.size] || 0) + 1;
    });
    return map;
  }, [players]);

  const activePlayer = players[activePlayerIdx] || players[0] || { name: 'YOUR NAME', number: '07' };
  const previewName = activePlayer.name.trim() || 'YOUR NAME';
  const previewNumber = activePlayer.number.trim() || '07';

  const fontFamily = JERSEY_FONTS.find((f) => f.id === fontStyle)?.family || JERSEY_FONTS[0].family;

  // Helper to determine if current background is dark
  const isDarkBg = useMemo(() => {
    if (['blackgold', 'speed', 'lightning', 'geometric'].includes(selectedStyleId)) return true;
    const darkColors = ['#111827', '#0F172A', '#1D4ED8', '#DC2626'];
    return darkColors.includes(selectedColorHex.toUpperCase());
  }, [selectedStyleId, selectedColorHex]);

  // Dynamic preview image calculated based on active kit, angle, side, and style
  const currentPreviewImage = useMemo(() => {
    if (selectedAngle === 2) return '/mockups/jersey_fabric_macro.jpg';
    if (selectedAngle === 3) return '/mockups/jersey_color_lineup.jpg';

    if (side === 'back') {
      if (selectedStyleId === 'blackgold') return '/mockups/jersey_blackgold_back.jpg';
      if (selectedStyleId === 'speed') return '/mockups/jersey_speed_back.jpg';
      if (selectedStyleId === 'lightning') return '/mockups/jersey_lightning_back.jpg';
      if (selectedStyleId === 'geometric') return '/mockups/jersey_cyber_back.jpg';
      return '/mockups/white_jersey_back.jpg';
    }

    // Front view
    if (selectedStyleId === 'blackgold') return '/mockups/jersey_blackgold_front.jpg';
    if (selectedStyleId === 'speed') return '/mockups/jersey_speed_front.jpg';
    if (selectedStyleId === 'lightning') return '/mockups/jersey_lightning_front.jpg';
    if (selectedStyleId === 'geometric') return '/mockups/jersey_cyber_front.jpg';

    // Default clean white base for customization
    if (activeKitId === 'sports-sub-womens-02') return '/mockups/white_womens_jersey.jpg';
    if (activeKitId === 'sports-sub-boys-03') return '/mockups/white_boys_jersey.jpg';
    if (activeKitId === 'sports-sub-girls-04') return '/mockups/white_girls_jersey.jpg';
    return '/mockups/white_mens_jersey.jpg';
  }, [selectedAngle, side, activeKitId, selectedStyleId]);

  // Studio angle thumbnails reacting to selected kit & style
  const studioAngles = useMemo(() => {
    let frontImg = '/mockups/white_mens_jersey.jpg';
    let backImg = '/mockups/white_jersey_back.jpg';

    if (selectedStyleId === 'blackgold') {
      frontImg = '/mockups/jersey_blackgold_front.jpg';
      backImg = '/mockups/jersey_blackgold_back.jpg';
    } else if (selectedStyleId === 'speed') {
      frontImg = '/mockups/jersey_speed_front.jpg';
      backImg = '/mockups/jersey_speed_back.jpg';
    } else if (selectedStyleId === 'lightning') {
      frontImg = '/mockups/jersey_lightning_front.jpg';
      backImg = '/mockups/jersey_lightning_back.jpg';
    } else if (selectedStyleId === 'geometric') {
      frontImg = '/mockups/jersey_cyber_front.jpg';
      backImg = '/mockups/jersey_cyber_back.jpg';
    } else {
      if (activeKitId === 'sports-sub-womens-02') frontImg = '/mockups/white_womens_jersey.jpg';
      else if (activeKitId === 'sports-sub-boys-03') frontImg = '/mockups/white_boys_jersey.jpg';
      else if (activeKitId === 'sports-sub-girls-04') frontImg = '/mockups/white_girls_jersey.jpg';
      else frontImg = '/mockups/white_mens_jersey.jpg';
      backImg = '/mockups/white_jersey_back.jpg';
    }

    return [
      { label: 'Front View', image: frontImg, side: 'front' as const },
      { label: 'Back View', image: backImg, side: 'back' as const },
      { label: 'Fabric Detail', image: '/mockups/jersey_fabric_macro.jpg', side: 'front' as const },
      { label: 'Squad Lineup', image: '/mockups/jersey_color_lineup.jpg', side: 'front' as const },
    ];
  }, [activeKitId, selectedStyleId]);

  const handleAngleSelect = (idx: number) => {
    setSelectedAngle(idx);
    if (idx === 1) {
      setSide('back');
    } else {
      setSide('front');
    }
  };

  const handleStyleSelect = (styleId: string) => {
    setSelectedStyleId(styleId);
    setSelectedAngle(0);
    setSide('front');

    // Auto-contrast text and numbers so they never look dark on dark or light on light
    if (styleId === 'blackgold') {
      if (textColor === '#111827') setTextColor('#FFFFFF');
      if (numberColor === '#111827') setNumberColor('#E5A824');
      setSelectedColorHex('#E5A824');
    } else if (styleId === 'speed') {
      if (textColor === '#111827') setTextColor('#FFFFFF');
      if (numberColor === '#111827') setNumberColor('#06B6D4');
      setSelectedColorHex('#06B6D4');
    } else if (styleId === 'lightning') {
      if (textColor === '#111827') setTextColor('#FFFFFF');
      if (numberColor === '#111827') setNumberColor('#FFFFFF');
      setSelectedColorHex('#2563EB');
    } else if (styleId === 'geometric') {
      if (textColor === '#111827') setTextColor('#FFFFFF');
      if (numberColor === '#111827') setNumberColor('#FFFFFF');
      setSelectedColorHex('#DC2626');
    } else if (styleId === 'minimal') {
      if (textColor === '#FFFFFF') setTextColor('#111827');
      if (numberColor === '#FFFFFF') setNumberColor('#111827');
      setSelectedColorHex('#111827');
    }
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadError(null);
    const validTypes = ['image/png', 'image/jpeg', 'image/webp', 'image/svg+xml'];
    if (!validTypes.includes(file.type)) {
      setUploadError('Please upload a PNG, JPG, WEBP or SVG image.');
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      setUploadError('Logo must be under 10 MB.');
      return;
    }
    setSponsorLogo(URL.createObjectURL(file));
  };

  const updatePlayer = (id: string, patch: Partial<JerseyPlayerEntry>) => {
    setPlayers((prev) => prev.map((p) => (p.id === id ? { ...p, ...patch } : p)));
  };

  const addPlayer = () => {
    playerSeq += 1;
    const newP: JerseyPlayerEntry = { id: `p-${playerSeq}`, name: '', number: '', size: 'M' };
    setPlayers((prev) => [...prev, newP]);
    setActivePlayerIdx(players.length);
  };

  const removePlayer = (id: string) => {
    if (players.length <= 1) return;
    setPlayers((prev) => prev.filter((p) => p.id !== id));
    setActivePlayerIdx(0);
  };

  const loadSquadPreset = (type: 'cricket11' | 'football7' | 'four') => {
    if (type === 'cricket11') {
      const c11: JerseyPlayerEntry[] = [
        { id: 'p-1', name: 'Rohit (C)', number: '45', size: 'L' },
        { id: 'p-2', name: 'Virat', number: '18', size: 'M' },
        { id: 'p-3', name: 'Gill', number: '77', size: 'M' },
        { id: 'p-4', name: 'Surya', number: '63', size: 'L' },
        { id: 'p-5', name: 'Pant (WK)', number: '17', size: 'M' },
        { id: 'p-6', name: 'Hardik', number: '33', size: 'L' },
        { id: 'p-7', name: 'Jadeja', number: '08', size: 'M' },
        { id: 'p-8', name: 'Axar', number: '20', size: 'L' },
        { id: 'p-9', name: 'Kuldeep', number: '23', size: 'M' },
        { id: 'p-10', name: 'Bumrah', number: '93', size: 'XL' },
        { id: 'p-11', name: 'Siraj', number: '13', size: 'L' },
      ];
      setPlayers(c11);
      setActivePlayerIdx(0);
    } else if (type === 'football7') {
      const f7: JerseyPlayerEntry[] = [
        { id: 'p-1', name: 'Arjun', number: '01', size: 'L' },
        { id: 'p-2', name: 'Rohan', number: '04', size: 'L' },
        { id: 'p-3', name: 'Kabir', number: '05', size: 'M' },
        { id: 'p-4', name: 'Aditya', number: '07', size: 'M' },
        { id: 'p-5', name: 'Sameer', number: '08', size: 'M' },
        { id: 'p-6', name: 'Dev', number: '10', size: 'M' },
        { id: 'p-7', name: 'Zaid', number: '09', size: 'L' },
      ];
      setPlayers(f7);
      setActivePlayerIdx(0);
    } else {
      const f4: JerseyPlayerEntry[] = [
        { id: 'p-1', name: 'Arjun', number: '07', size: 'M' },
        { id: 'p-2', name: 'Vikram', number: '10', size: 'M' },
        { id: 'p-3', name: 'Rohit', number: '18', size: 'L' },
        { id: 'p-4', name: 'Kunal', number: '45', size: 'L' },
      ];
      setPlayers(f4);
      setActivePlayerIdx(0);
    }
  };

  const importPasted = () => {
    const lines = pasteText.split('\n').map((l) => l.trim()).filter(Boolean);
    if (!lines.length) return;
    const rows: JerseyPlayerEntry[] = lines.map((line) => {
      const [name = '', number = '', size = 'M'] = line.split(',').map((s) => s.trim());
      playerSeq += 1;
      const cleanSize = KIT_SIZES.includes(size.toUpperCase()) ? size.toUpperCase() : 'M';
      return { id: `p-${playerSeq}`, name, number, size: cleanSize };
    });
    setPlayers(rows);
    setPasteText('');
    setShowPaste(false);
    setActivePlayerIdx(0);
  };

  const checkPincode = () => {
    const pin = pincode.trim();
    if (pin.length === 6 && /^\d+$/.test(pin)) {
      const cities: Record<string, string> = {
        '641602': 'Tirupur, Tamil Nadu (Same-Day Direct Mill Dispatch)',
        '641601': 'Tirupur, Tamil Nadu (Same-Day Direct Mill Dispatch)',
        '600001': 'Chennai, Tamil Nadu (Next-Day Delivery)',
        '560001': 'Bengaluru, Karnataka (Express 2-Day Delivery)',
        '110001': 'New Delhi, NCR (3-Day Delivery)',
        '400001': 'Mumbai, Maharashtra (2-3 Day Delivery)',
        '700001': 'Kolkata, West Bengal (3-Day Delivery)',
        '500001': 'Hyderabad, Telangana (2-3 Day Delivery)',
        '395001': 'Surat, Gujarat (3-Day Delivery)',
        '380001': 'Ahmedabad, Gujarat (3-Day Delivery)',
        '411001': 'Pune, Maharashtra (2-3 Day Delivery)',
      };
      const city = cities[pin] || `PIN ${pin} (Free Standard Pan-India Delivery in 3-5 days)`;
      setPincodeResult(`Delivery to ${city} · Cash on Delivery & Free Doorstep Shipping Available`);
    } else {
      setPincodeResult('Please enter a valid 6-digit Indian postal code');
    }
  };

  const handleAddTeamKit = () => {
    if (!activeKit) return;
    const numbered = players.map((p, i) => ({
      ...p,
      name: p.name.trim() || `Player ${i + 1}`,
      number: p.number.trim() || String(i + 1).padStart(2, '0'),
    }));
    const jersey: JerseyCustomization = {
      sportType,
      teamName: teamName.trim() || 'Custom Team',
      fontStyle,
      numberColor,
      textColor,
      sponsorLogoUrl: sponsorLogo || undefined,
      playerList: numbered,
    };
    const mockProduct: Product = {
      id: activeKit.id,
      name: `Team Kit · ${jersey.teamName} · ${activeKit.name}`,
      category: 'Cotton' as CategoryType,
      images: [sponsorLogo && sponsorLogo.startsWith('blob:') ? sponsorLogo : currentPreviewImage],
      count: 'Team Sublimation Kit',
      color: activeKit.colors[0]?.name || 'Custom Team Colors',
      weave_type: 'SUBLIMATION',
      price_per_meter: unitPrice,
      swatch_test_price: activeKit.samplePrice,
      swatch_big_price: unitPrice,
      print_surcharge_per_meter: 0,
      description: `${activeKit.description} · Sport: ${sportType} · Neck: ${neckline} · Sleeve: ${sleeveType} · Team: ${jersey.teamName} · Squad Size: ${numbered.length}`,
      featured: true,
      in_stock: true,
      gsm: 170,
      width: '100% Dry Fit Micro-Poly Interlock',
      composition: '100% Dry-Fit Polyester 170 GSM',
    };
    addToCart(
      mockProduct,
      'apparel',
      quantity,
      {
        requiresPrint: true,
        designUrl: sponsorLogo && sponsorLogo.startsWith('blob:') ? sponsorLogo : currentPreviewImage,
        inkType: 'reactive_digital',
        dpi: 300,
        repeatType: 'straight',
        notes: `Team Kit · ${sportType} (${neckline}, ${sleeveType}) · Team: ${jersey.teamName} · Font: ${fontStyle} · Squad: ${numbered.map((p) => `${p.name} #${p.number} (${p.size})`).join(', ')}`,
      },
      undefined,
      activeKit.name,
      {
        sizeBreakdown,
        customPreviewUrl: currentPreviewImage,
        jerseyCustomization: jersey,
      }
    );
    setAddedToast(true);
    setIsCartOpen(true);
    setTimeout(() => setAddedToast(false), 3500);
  };

  const handleSaveDesign = () => {
    try {
      const designPayload = {
        activeKitId,
        sportType,
        neckline,
        sleeveType,
        teamName,
        fontStyle,
        numberColor,
        textColor,
        selectedColorHex,
        selectedStyleId,
        players,
        savedAt: new Date().toISOString(),
      };
      localStorage.setItem('saved_jersey_design', JSON.stringify(designPayload));
    } catch (e) {
      console.warn('Could not save design to localStorage:', e);
    }
    setSaveToast(true);
    setTimeout(() => setSaveToast(false), 2500);
  };

  const handleShare = () => {
    try {
      if (navigator.clipboard) {
        navigator.clipboard.writeText(window.location.href);
      }
    } catch (e) {
      console.warn('Clipboard write failed:', e);
    }
    setShareToast(true);
    setTimeout(() => setShareToast(false), 3000);
  };

  return (
    <div className="w-full bg-[#FAF8F5] dark:bg-[#0D0E0D] text-[#0F100F] dark:text-white transition-colors duration-300 min-h-screen pb-32 lg:pb-12 font-sans selection:bg-[#E5A824] selection:text-black">
      {/* Scroll progress bar */}
      <motion.div
        style={{ scaleX: progressBar }}
        className="fixed top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-[#AC7900] via-[#E5A824] to-[#AC7900] origin-left z-[70] pointer-events-none"
      />

      {/* Top Breadcrumbs & Section Jump Links */}
      <div className="border-b border-black/[0.06] dark:border-white/[0.08] bg-white/95 dark:bg-[#121312]/95 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between gap-4">
          <nav aria-label="Breadcrumb" className="flex items-center space-x-2 text-xs text-slate-500 font-medium min-w-0">
            <button onClick={onGoToHome} className="hover:text-black dark:hover:text-white transition font-bold">
              Home
            </button>
            <span className="text-slate-400">/</span>
            <span className="text-black dark:text-white font-bold truncate">Sports Sublimation</span>
            <span className="text-slate-400">/</span>
            <span className="text-[#AC7900] dark:text-[#E5A824] font-bold truncate">Jersey Studio</span>
          </nav>
          <div className="hidden sm:flex items-center gap-1.5 shrink-0 text-[11px] font-bold">
            <button
              onClick={() => scrollToId('featured-kits')}
              className="px-3 py-1.5 rounded-full text-slate-500 hover:text-black dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/5 transition"
            >
              Featured Kits
            </button>
            <button
              onClick={() => scrollToId('how-it-works')}
              className="px-3 py-1.5 rounded-full text-slate-500 hover:text-black dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/5 transition"
            >
              How It Works
            </button>
            <button
              onClick={() => scrollToId('jersey-studio')}
              className="px-3.5 py-1.5 rounded-full bg-black text-white dark:bg-white dark:text-black transition"
            >
              Jersey Studio
            </button>
            <button
              onClick={() => scrollToId('size-chart')}
              className="px-3 py-1.5 rounded-full text-slate-500 hover:text-black dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/5 transition"
            >
              Size Chart
            </button>
            <button
              onClick={() => scrollToId('jersey-faq')}
              className="px-3 py-1.5 rounded-full text-slate-500 hover:text-black dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/5 transition"
            >
              FAQ
            </button>
          </div>
        </div>
      </div>

      {/* ============================================================== */}
      {/* 1. HERO SECTION (MATCHING LEFT SCREEN OF USER'S REFERENCE)     */}
      {/* ============================================================== */}
      <section className="relative overflow-hidden bg-[#0A0D0B] text-white pt-8 pb-14 sm:py-16 lg:py-20">
        {/* Ambient golden glow & ray effects */}
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-gradient-to-bl from-[#E5A824]/20 via-[#AC7900]/10 to-transparent rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -left-20 bottom-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 grid lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Left Text Column */}
          <div className="lg:col-span-6 space-y-6">
            <div className="flex items-center gap-2 text-[#E5A824]">
              <span className="h-0.5 w-6 bg-[#E5A824]" />
              <span className="text-xs font-black tracking-[0.2em] uppercase">SPORTS SUBLIMATION</span>
            </div>

            <h1 className="text-4xl sm:text-6xl lg:text-[64px] font-black tracking-tight leading-[1.05]">
              Your Team.<br />
              Your Colours.<br />
              <span className="text-[#E5A824] bg-gradient-to-r from-[#E5A824] via-[#FBBF24] to-[#E5A824] bg-clip-text text-transparent">
                Your Jersey.
              </span>
            </h1>

            <p className="text-gray-300 text-sm sm:text-base leading-relaxed max-w-xl">
              Premium sublimation jerseys, fully customizable with your team name, numbers and logos.
              Built for teams, clubs, academies and businesses.
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <Magnetic>
                <button
                  onClick={() => scrollToId('jersey-studio')}
                  className="px-7 py-3.5 rounded-full bg-gradient-to-r from-[#D97706] via-[#E5A824] to-[#D97706] hover:brightness-110 text-black font-black text-sm tracking-wide transition-all shadow-[0_8px_25px_rgba(229,168,36,0.35)] flex items-center space-x-2"
                >
                  <span>Design Your Jersey</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </Magnetic>

              <button
                onClick={() => scrollToId('featured-kits')}
                className="px-6 py-3.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/20 text-white font-bold text-sm transition"
              >
                Explore Kits
              </button>
            </div>

            {/* 3 Value Pillars at Bottom */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-white/10 text-xs text-gray-300">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-full bg-white/10 flex items-center justify-center text-[#E5A824] shrink-0">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <span className="font-semibold">All-over sublimation print</span>
              </div>
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-full bg-white/10 flex items-center justify-center text-[#E5A824] shrink-0">
                  <Palette className="w-4 h-4" />
                </div>
                <span className="font-semibold">Names & numbers included</span>
              </div>
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-full bg-white/10 flex items-center justify-center text-[#E5A824] shrink-0">
                  <Users className="w-4 h-4" />
                </div>
                <span className="font-semibold">Every size mixable</span>
              </div>
            </div>
          </div>

          {/* Right Visual Column (Hero Pair of Black & Gold Jerseys) */}
          <div className="lg:col-span-6 relative">
            <div className="relative rounded-3xl overflow-hidden shadow-2xl bg-black/60 group">
              <img
                src="/mockups/jersey_hero_pair.jpg"
                alt="Your Team, Your Colours, Your Jersey"
                className="w-full h-auto aspect-[16/9] object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />
              <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
                <span className="px-3.5 py-1.5 rounded-full bg-black/75 backdrop-blur-md border border-white/15 text-xs font-bold text-white">
                  360° All-Over Dye Sublimation
                </span>
                <span className="px-3.5 py-1.5 rounded-full bg-[#E5A824] text-black text-xs font-black">
                  Starting at ₹249 / pc
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================== */}
      {/* 2. FEATURED KITS (SUBLIMATION JERSEY KITS - 4 CARDS GRID)      */}
      {/* ============================================================== */}
      <section id="featured-kits" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 scroll-mt-20">
        <div className="flex items-end justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2 text-[#AC7900] dark:text-[#E5A824]">
              <span className="h-0.5 w-6 bg-current" />
              <span className="text-xs font-black tracking-[0.2em] uppercase">FEATURED KITS</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-black tracking-tight mt-1">Sublimation Jersey Kits</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              Choose from our popular kits or create your own design.
            </p>
          </div>
          <button
            onClick={() => scrollToId('jersey-studio')}
            className="text-xs font-black text-[#AC7900] dark:text-[#E5A824] hover:underline flex items-center gap-1 shrink-0"
          >
            <span>View all kits</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* 4 Cards Grid matching user mockup */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* 1. Men's Kit */}
          <div className="rounded-3xl border border-black/10 dark:border-white/10 bg-white dark:bg-[#141514] overflow-hidden p-3.5 hover:shadow-xl hover:-translate-y-1 transition duration-300 flex flex-col">
            <div className="relative aspect-square rounded-2xl overflow-hidden bg-slate-50 dark:bg-stone-900 mb-3.5">
              <span className="absolute top-2.5 left-2.5 z-10 px-2.5 py-1 rounded-md bg-black text-white text-[10px] font-black uppercase tracking-wider">
                MEN'S KIT
              </span>
              <img
                src="/mockups/jersey_kit_mens.jpg"
                alt="Men's Performance Sublimation Jersey"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="px-1 flex-1 flex flex-col justify-between">
              <div>
                <h3 className="text-sm font-black leading-snug">Men's Performance Sublimation Jersey</h3>
                <div className="text-base font-black text-black dark:text-white mt-1">
                  ₹349 <span className="text-xs font-normal text-slate-400">/ pc</span>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">
                  Breathable, lightweight, ideal for all sports.
                </p>
                <div className="flex items-center gap-1.5 mt-2.5">
                  <span className="w-3 h-3 rounded-full bg-blue-600 border border-white shadow-sm" />
                  <span className="w-3 h-3 rounded-full bg-amber-500 border border-white shadow-sm" />
                  <span className="w-3 h-3 rounded-full bg-slate-900 border border-white shadow-sm" />
                </div>
              </div>
              <button
                onClick={() => {
                  setActiveKitId('sports-sub-mens-01');
                  setSelectedStyleId('minimal');
                  setSelectedAngle(0);
                  setSide('front');
                  scrollToId('jersey-studio');
                }}
                className="mt-4 w-full py-2.5 rounded-full bg-black text-white dark:bg-white dark:text-black text-xs font-black hover:opacity-90 transition flex items-center justify-center gap-1.5"
              >
                <span>Customize</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* 2. Women's Kit */}
          <div className="rounded-3xl border border-black/10 dark:border-white/10 bg-white dark:bg-[#141514] overflow-hidden p-3.5 hover:shadow-xl hover:-translate-y-1 transition duration-300 flex flex-col">
            <div className="relative aspect-square rounded-2xl overflow-hidden bg-slate-50 dark:bg-stone-900 mb-3.5">
              <span className="absolute top-2.5 left-2.5 z-10 px-2.5 py-1 rounded-md bg-black text-white text-[10px] font-black uppercase tracking-wider">
                WOMEN'S KIT
              </span>
              <img
                src="/mockups/jersey_kit_womens.jpg"
                alt="Women's Athletic Sublimation Jersey"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="px-1 flex-1 flex flex-col justify-between">
              <div>
                <h3 className="text-sm font-black leading-snug">Women's Athletic Sublimation Jersey</h3>
                <div className="text-base font-black text-black dark:text-white mt-1">
                  ₹349 <span className="text-xs font-normal text-slate-400">/ pc</span>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">
                  Comfort fit with modern designs.
                </p>
                <div className="flex items-center gap-1.5 mt-2.5">
                  <span className="w-3 h-3 rounded-full bg-pink-600 border border-white shadow-sm" />
                  <span className="w-3 h-3 rounded-full bg-purple-500 border border-white shadow-sm" />
                  <span className="w-3 h-3 rounded-full bg-rose-400 border border-white shadow-sm" />
                </div>
              </div>
              <button
                onClick={() => {
                  setActiveKitId('sports-sub-womens-02');
                  setSelectedStyleId('minimal');
                  setSelectedAngle(0);
                  setSide('front');
                  scrollToId('jersey-studio');
                }}
                className="mt-4 w-full py-2.5 rounded-full bg-black text-white dark:bg-white dark:text-black text-xs font-black hover:opacity-90 transition flex items-center justify-center gap-1.5"
              >
                <span>Customize</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* 3. Boys' Kit */}
          <div className="rounded-3xl border border-black/10 dark:border-white/10 bg-white dark:bg-[#141514] overflow-hidden p-3.5 hover:shadow-xl hover:-translate-y-1 transition duration-300 flex flex-col">
            <div className="relative aspect-square rounded-2xl overflow-hidden bg-slate-50 dark:bg-stone-900 mb-3.5">
              <span className="absolute top-2.5 left-2.5 z-10 px-2.5 py-1 rounded-md bg-black text-white text-[10px] font-black uppercase tracking-wider">
                BOYS' KIT
              </span>
              <img
                src="/mockups/jersey_kit_boys.jpg"
                alt="Boys Active Sublimation Jersey"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="px-1 flex-1 flex flex-col justify-between">
              <div>
                <h3 className="text-sm font-black leading-snug">Boys Active Sublimation Jersey</h3>
                <div className="text-base font-black text-black dark:text-white mt-1">
                  ₹249 <span className="text-xs font-normal text-slate-400">/ pc</span>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">
                  Durable and comfortable for young athletes.
                </p>
                <div className="flex items-center gap-1.5 mt-2.5">
                  <span className="w-3 h-3 rounded-full bg-cyan-500 border border-white shadow-sm" />
                  <span className="w-3 h-3 rounded-full bg-blue-800 border border-white shadow-sm" />
                  <span className="w-3 h-3 rounded-full bg-emerald-500 border border-white shadow-sm" />
                </div>
              </div>
              <button
                onClick={() => {
                  setActiveKitId('sports-sub-boys-03');
                  setSelectedStyleId('minimal');
                  setSelectedAngle(0);
                  setSide('front');
                  scrollToId('jersey-studio');
                }}
                className="mt-4 w-full py-2.5 rounded-full bg-black text-white dark:bg-white dark:text-black text-xs font-black hover:opacity-90 transition flex items-center justify-center gap-1.5"
              >
                <span>Customize</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* 4. Girls' Kit */}
          <div className="rounded-3xl border border-black/10 dark:border-white/10 bg-white dark:bg-[#141514] overflow-hidden p-3.5 hover:shadow-xl hover:-translate-y-1 transition duration-300 flex flex-col">
            <div className="relative aspect-square rounded-2xl overflow-hidden bg-slate-50 dark:bg-stone-900 mb-3.5">
              <span className="absolute top-2.5 left-2.5 z-10 px-2.5 py-1 rounded-md bg-black text-white text-[10px] font-black uppercase tracking-wider">
                GIRLS' KIT
              </span>
              <img
                src="/mockups/jersey_kit_girls.jpg"
                alt="Girls Active Sublimation Jersey"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="px-1 flex-1 flex flex-col justify-between">
              <div>
                <h3 className="text-sm font-black leading-snug">Girls Active Sublimation Jersey</h3>
                <div className="text-base font-black text-black dark:text-white mt-1">
                  ₹249 <span className="text-xs font-normal text-slate-400">/ pc</span>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">
                  Stylish and breathable designs.
                </p>
                <div className="flex items-center gap-1.5 mt-2.5">
                  <span className="w-3 h-3 rounded-full bg-purple-400 border border-white shadow-sm" />
                  <span className="w-3 h-3 rounded-full bg-pink-400 border border-white shadow-sm" />
                  <span className="w-3 h-3 rounded-full bg-indigo-500 border border-white shadow-sm" />
                </div>
              </div>
              <button
                onClick={() => {
                  setActiveKitId('sports-sub-girls-04');
                  setSelectedStyleId('minimal');
                  setSelectedAngle(0);
                  setSide('front');
                  scrollToId('jersey-studio');
                }}
                className="mt-4 w-full py-2.5 rounded-full bg-black text-white dark:bg-white dark:text-black text-xs font-black hover:opacity-90 transition flex items-center justify-center gap-1.5"
              >
                <span>Customize</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================== */}
      {/* 3. HOW IT WORKS (4 SIMPLE STEPS PIPELINE)                     */}
      {/* ============================================================== */}
      <section id="how-it-works" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 scroll-mt-20">
        <div className="rounded-3xl bg-white dark:bg-[#141514] border border-black/10 dark:border-white/10 p-6 sm:p-10 shadow-sm">
          <div className="mb-8">
            <div className="text-[11px] font-black uppercase tracking-[0.2em] text-[#AC7900] dark:text-[#E5A824]">
              HOW IT WORKS
            </div>
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight mt-1">
              Get Your Team Jerseys in 4 Simple Steps
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 relative">
            {/* Step 1 */}
            <div className="flex items-start gap-3.5">
              <div className="w-9 h-9 rounded-full bg-[#E5A824] text-black font-black text-sm flex items-center justify-center shrink-0 shadow-md">
                1
              </div>
              <div>
                <h4 className="text-sm font-black">Choose a kit</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  Select your sport and jersey style
                </p>
              </div>
            </div>

            {/* Step 2 */}
            <div className="flex items-start gap-3.5">
              <div className="w-9 h-9 rounded-full bg-[#E5A824] text-black font-black text-sm flex items-center justify-center shrink-0 shadow-md">
                2
              </div>
              <div>
                <h4 className="text-sm font-black">Customize design</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  Set colours, add logo, name and number
                </p>
              </div>
            </div>

            {/* Step 3 */}
            <div className="flex items-start gap-3.5">
              <div className="w-9 h-9 rounded-full bg-[#E5A824] text-black font-black text-sm flex items-center justify-center shrink-0 shadow-md">
                3
              </div>
              <div>
                <h4 className="text-sm font-black">Add team details</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  Enter player names, numbers and sizes
                </p>
              </div>
            </div>

            {/* Step 4 */}
            <div className="flex items-start gap-3.5">
              <div className="w-9 h-9 rounded-full bg-[#E5A824] text-black font-black text-sm flex items-center justify-center shrink-0 shadow-md">
                4
              </div>
              <div>
                <h4 className="text-sm font-black">Place your order</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  Review and confirm your team kit
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================== */}
      {/* 4. JERSEY STUDIO (MATCHING TOP-RIGHT SCREEN OF USER'S MOCKUP)  */}
      {/* ============================================================== */}
      <section id="jersey-studio" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 scroll-mt-16">
        {/* Studio Title Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <div>
            <div className="text-xs text-slate-500 dark:text-slate-400 font-medium mb-1">
              Home &nbsp;/&nbsp; Sports Sublimation &nbsp;/&nbsp; <strong className="text-black dark:text-white">Jersey Studio</strong>
            </div>
            <h2 className="text-3xl sm:text-4xl font-black tracking-tight">Jersey Studio</h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
              Design your custom jersey with live preview. Every detail, your way.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleSaveDesign}
              className="px-4 py-2 rounded-full border border-black/15 dark:border-white/15 bg-white dark:bg-[#1a1b1a] text-xs font-bold hover:bg-black/5 dark:hover:bg-white/5 transition flex items-center gap-1.5"
            >
              <Bookmark className="w-3.5 h-3.5" />
              <span>Save Design</span>
            </button>
            <button
              onClick={handleShare}
              className="px-4 py-2 rounded-full bg-black text-white dark:bg-white dark:text-black text-xs font-black hover:opacity-90 transition flex items-center gap-1.5"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>Share</span>
            </button>
          </div>
        </div>

        {/* Studio Workspace Grid: Left Preview Canvas | Right Configurator Tabs */}
        <div className="grid lg:grid-cols-12 gap-6 items-start">
          {/* Left: Studio Live Preview Canvas with Angle Thumbnails (Sticky on desktop) */}
          <div className="lg:col-span-7 lg:sticky lg:top-24 bg-white dark:bg-[#141514] rounded-3xl border border-black/10 dark:border-white/10 p-3.5 sm:p-5 shadow-sm">
            <div className="flex flex-col-reverse sm:flex-row gap-3 sm:gap-4 items-center">
              {/* Thumbnail Strip: Horizontal row on mobile (swipeable), vertical column on sm+ */}
              <div className="flex sm:flex-col gap-2 w-full sm:w-20 overflow-x-auto sm:overflow-visible pb-1 sm:pb-0 justify-center sm:justify-start shrink-0 no-scrollbar">
                {studioAngles.map((ang, idx) => (
                  <button
                    key={ang.label}
                    onClick={() => handleAngleSelect(idx)}
                    title={ang.label}
                    className={`relative rounded-xl overflow-hidden border-2 transition w-14 h-14 sm:w-full sm:h-auto aspect-square shrink-0 ${
                      selectedAngle === idx
                        ? 'border-[#E5A824] shadow-md ring-2 ring-[#E5A824]/30'
                        : 'border-black/10 dark:border-white/10 hover:border-black/30'
                    }`}
                  >
                    <img src={ang.image} alt={ang.label} className="w-full h-full object-cover" />
                    <span className="absolute bottom-0 inset-x-0 bg-black/75 text-[8px] text-white font-bold py-0.5 text-center truncate px-0.5">
                      {ang.label.replace(' View', '')}
                    </span>
                  </button>
                ))}
              </div>

              {/* Main Preview Screen */}
              <div className="w-full flex-1 relative rounded-2xl overflow-hidden bg-slate-100 dark:bg-stone-900/60 aspect-square max-h-[480px] flex items-center justify-center">
                {/* Dynamic Studio Backlight matching team color */}
                <div
                  className="absolute inset-0 pointer-events-none rounded-2xl transition-all duration-700"
                  style={{
                    background: `radial-gradient(circle at 50% 50%, ${selectedColorHex}28 0%, transparent 70%)`,
                  }}
                />

                {/* 3D Jersey Base Image */}
                <img
                  src={currentPreviewImage}
                  alt="Custom Sublimation Jersey Preview"
                  className="w-full h-full object-contain p-2 transition-all duration-300 relative z-0"
                />

                {/* Live Text/Logo Overlay: Front (only shown on front angles) */}
                {selectedAngle !== 2 && selectedAngle !== 3 && side === 'front' && (
                  <>
                    {/* Team Name Overlay */}
                    {teamName.trim() && (
                      <div
                        className="absolute inset-x-0 text-center font-black tracking-wider px-6 pointer-events-none"
                        style={{
                          top: '32%',
                          color: textColor,
                          fontFamily,
                          fontSize: 'clamp(18px, 4vw, 32px)',
                          textShadow:
                            textColor.toUpperCase() === '#FFFFFF' || textColor.toUpperCase() === '#FFF'
                              ? '0 2px 10px rgba(0,0,0,0.85), 0 0 2px rgba(0,0,0,0.95)'
                              : isDarkBg
                              ? '0 0 8px rgba(255,255,255,0.8), 0 1px 3px rgba(0,0,0,0.9)'
                              : '0 2px 4px rgba(0,0,0,0.2), 0 1px 2px rgba(0,0,0,0.15)',
                        }}
                      >
                        {teamName.toUpperCase()}
                      </div>
                    )}
                    {/* Front Number Overlay */}
                    <div
                      className="absolute inset-x-0 text-center font-black pointer-events-none"
                      style={{
                        top: '42%',
                        color: numberColor,
                        fontFamily,
                        fontSize: 'clamp(36px, 8vw, 68px)',
                        textShadow:
                          numberColor.toUpperCase() === '#FFFFFF' || numberColor.toUpperCase() === '#FFF'
                            ? '0 3px 14px rgba(0,0,0,0.9), 0 0 3px rgba(0,0,0,0.95)'
                            : isDarkBg
                            ? '0 0 10px rgba(255,255,255,0.8), 0 2px 4px rgba(0,0,0,0.9)'
                            : '0 2px 6px rgba(0,0,0,0.22), 0 1px 2px rgba(0,0,0,0.15)',
                      }}
                    >
                      {previewNumber}
                    </div>
                    {/* Uploaded Sponsor Logo or Preset Crest */}
                    {sponsorLogo && (
                      <div
                        className="absolute left-1/2 -translate-x-1/2 flex items-center justify-center pointer-events-none"
                        style={{ top: '64%' }}
                      >
                        {sponsorLogo.startsWith('blob:') || sponsorLogo.startsWith('http') || sponsorLogo.startsWith('/') ? (
                          <img
                            src={sponsorLogo}
                            alt="Crest"
                            className="max-h-12 max-w-28 object-contain drop-shadow"
                          />
                        ) : (
                          <span className="text-3xl filter drop-shadow">{sponsorLogo}</span>
                        )}
                      </div>
                    )}
                  </>
                )}

                {/* Live Text Overlay: Back (only shown on back angle) */}
                {selectedAngle !== 2 && selectedAngle !== 3 && side === 'back' && (
                  <>
                    {/* Player Name Overlay */}
                    <div
                      className="absolute inset-x-0 text-center font-black tracking-[0.2em] px-6 pointer-events-none"
                      style={{
                        top: '22%',
                        color: textColor,
                        fontFamily,
                        fontSize: 'clamp(16px, 3.5vw, 26px)',
                        textShadow:
                          textColor.toUpperCase() === '#FFFFFF' || textColor.toUpperCase() === '#FFF'
                            ? '0 2px 10px rgba(0,0,0,0.85), 0 0 2px rgba(0,0,0,0.95)'
                            : isDarkBg
                            ? '0 0 8px rgba(255,255,255,0.8), 0 1px 3px rgba(0,0,0,0.9)'
                            : '0 2px 4px rgba(0,0,0,0.2), 0 1px 2px rgba(0,0,0,0.15)',
                      }}
                    >
                      {previewName.toUpperCase()}
                    </div>
                    {/* Player Back Number Overlay */}
                    <div
                      className="absolute inset-x-0 text-center font-black pointer-events-none"
                      style={{
                        top: '34%',
                        color: numberColor,
                        fontFamily,
                        fontSize: 'clamp(64px, 14vw, 110px)',
                        lineHeight: 1,
                        textShadow:
                          numberColor.toUpperCase() === '#FFFFFF' || numberColor.toUpperCase() === '#FFF'
                            ? '0 3px 14px rgba(0,0,0,0.92), 0 0 4px rgba(0,0,0,0.95)'
                            : isDarkBg
                            ? '0 0 12px rgba(255,255,255,0.8), 0 2px 4px rgba(0,0,0,0.9)'
                            : '0 2px 8px rgba(0,0,0,0.25), 0 1px 2px rgba(0,0,0,0.15)',
                      }}
                    >
                      {previewNumber}
                    </div>
                  </>
                )}

                {/* Floating Bottom Pill: Front / Back toggle & Zoom button */}
                <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-1.5 p-1 rounded-full bg-white/90 dark:bg-black/90 backdrop-blur-md shadow-lg border border-black/10 dark:border-white/10 text-xs font-black">
                  <button
                    onClick={() => {
                      setSide('front');
                      setSelectedAngle(0);
                    }}
                    className={`px-3.5 py-1.5 rounded-full transition ${
                      side === 'front' && selectedAngle !== 2 && selectedAngle !== 3
                        ? 'bg-black text-white dark:bg-white dark:text-black'
                        : 'text-slate-600 dark:text-slate-300 hover:text-black'
                    }`}
                  >
                    Front
                  </button>
                  <button
                    onClick={() => {
                      setSide('back');
                      setSelectedAngle(1);
                    }}
                    className={`px-3.5 py-1.5 rounded-full transition ${
                      side === 'back'
                        ? 'bg-black text-white dark:bg-white dark:text-black'
                        : 'text-slate-600 dark:text-slate-300 hover:text-black'
                    }`}
                  >
                    Back
                  </button>
                  <button
                    onClick={() => setIsZoomOpen(true)}
                    className="px-3 py-1.5 rounded-full text-slate-500 hover:text-black dark:hover:text-white flex items-center gap-1 border-l border-black/10 dark:border-white/10 ml-0.5"
                  >
                    <ZoomIn className="w-3.5 h-3.5" />
                    <span>Zoom</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Quick Player Switcher row below canvas */}
            <div className="mt-4 pt-3.5 border-t border-black/5 dark:border-white/5 flex items-center justify-between text-xs">
              <span className="font-bold text-slate-500">
                Previewing Player {activePlayerIdx + 1} of {players.length}:{' '}
                <strong className="text-black dark:text-white">{previewName} #{previewNumber}</strong>
              </span>
              <div className="flex gap-1">
                {players.map((p, i) => (
                  <button
                    key={p.id}
                    onClick={() => {
                      setActivePlayerIdx(i);
                      if (selectedAngle === 2 || selectedAngle === 3) {
                        setSelectedAngle(1);
                        setSide('back');
                      }
                    }}
                    className={`w-7 h-7 rounded-lg text-[11px] font-black transition ${
                      activePlayerIdx === i
                        ? 'bg-[#E5A824] text-black shadow'
                        : 'bg-black/5 dark:bg-white/5 text-slate-600 dark:text-slate-300 hover:bg-black/10'
                    }`}
                  >
                    {p.number || i + 1}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Right: Modern Responsive Studio Configurator Tabs */}
          <div className="lg:col-span-5 space-y-4">
            {/* Top Horizontal Tabs Navigation Bar */}
            <div className="bg-white dark:bg-[#141514] rounded-2xl border border-black/10 dark:border-white/10 p-1.5 shadow-sm">
              <div className="flex items-center gap-1 sm:gap-1.5 overflow-x-auto no-scrollbar scroll-smooth">
                {[
                  { id: 1, step: '1', label: 'Sport & Fit', shortLabel: 'Fit', icon: Shirt },
                  { id: 2, step: '2', label: 'Colours', shortLabel: 'Colours', icon: Palette },
                  { id: 3, step: '3', label: 'Identity', shortLabel: 'Identity', icon: Sparkles },
                  { id: 4, step: '4', label: 'Roster', shortLabel: 'Roster', icon: Users, badge: players.length },
                  { id: 5, step: '5', label: 'Review', shortLabel: 'Review', icon: ShoppingCart },
                ].map((tab) => {
                  const Icon = tab.icon;
                  const isActive = activeStep === tab.id;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => {
                        setActiveStep(tab.id);
                        if (tab.id === 3) {
                          setSide('front');
                          setSelectedAngle(0);
                        } else if (tab.id === 4) {
                          setSide('back');
                          setSelectedAngle(1);
                        }
                      }}
                      className={`flex-1 min-h-[44px] py-2 px-2 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-1 sm:gap-1.5 whitespace-nowrap shrink-0 sm:shrink ${
                        isActive
                          ? 'bg-[#E5A824] text-black shadow-md'
                          : 'text-slate-600 dark:text-slate-300 hover:bg-black/5 dark:hover:bg-white/5'
                      }`}
                    >
                      <span
                        className={`w-4 h-4 rounded-full text-[10px] flex items-center justify-center font-black ${
                          isActive ? 'bg-black text-white' : 'bg-black/10 dark:bg-white/10 text-slate-500'
                        }`}
                      >
                        {tab.step}
                      </span>
                      <Icon className="w-3.5 h-3.5 shrink-0 hidden xs:inline" />
                      <span className="hidden sm:inline">{tab.label}</span>
                      <span className="sm:hidden text-xs">{tab.shortLabel}</span>
                      {tab.badge !== undefined && (
                        <span
                          className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                            isActive ? 'bg-black/20 text-black' : 'bg-black/10 dark:bg-white/10 text-slate-500'
                          }`}
                        >
                          {tab.badge}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Active Tab Card Container */}
            <div className="rounded-3xl border border-black/10 dark:border-white/10 bg-white dark:bg-[#141514] p-4 sm:p-6 shadow-sm">
              {/* ============================================================== */}
              {/* TAB 1: SPORT & FIT                                             */}
              {/* ============================================================== */}
              {activeStep === 1 && (
                <div className="space-y-4">
                  <div>
                    <h3 className="text-base font-black text-black dark:text-white">Choose Sport &amp; Kit Silhouette</h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                      Select your sport discipline, fit cut, collar, and base template.
                    </p>
                  </div>

                  {/* Sport Discipline Chips */}
                  <div>
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
                      Sport Discipline
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {[
                        { name: 'Cricket', emoji: '🏏' },
                        { name: 'Football', emoji: '⚽' },
                        { name: 'Basketball', emoji: '🏀' },
                        { name: 'Volleyball', emoji: '🏐' },
                        { name: 'Badminton', emoji: '🏸' },
                        { name: 'Esports', emoji: '🎮' },
                        { name: 'Athletics', emoji: '🏃' },
                        { name: 'Corporate', emoji: '🏢' },
                      ].map((item) => (
                        <button
                          key={item.name}
                          onClick={() => setSportType(item.name)}
                          className={`px-3 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                            sportType === item.name || (item.name === 'Corporate' && sportType.startsWith('Corporate'))
                              ? 'bg-black text-white dark:bg-white dark:text-black shadow-sm ring-1 ring-black dark:ring-white'
                              : 'bg-black/5 dark:bg-white/5 text-slate-600 dark:text-slate-300 hover:bg-black/10'
                          }`}
                        >
                          <span>{item.emoji}</span>
                          <span>{item.name}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Fit / Silhouette Selection Cards */}
                  <div>
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
                      Fit / Kit Cut
                    </span>
                    <div className="grid grid-cols-2 gap-2.5">
                      {SPORTS_KITS.map((k) => (
                        <button
                          key={k.id}
                          onClick={() => {
                            setActiveKitId(k.id);
                            setSelectedStyleId('minimal');
                            setSelectedAngle(0);
                            setSide('front');
                          }}
                          className={`p-3 rounded-2xl border text-left transition ${
                            activeKitId === k.id
                              ? 'border-[#E5A824] bg-[#E5A824]/10 ring-2 ring-[#E5A824]/40'
                              : 'border-black/10 dark:border-white/10 hover:border-black/25'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">
                              {k.id.includes('mens')
                                ? "Men's Fit"
                                : k.id.includes('womens')
                                ? "Women's Fit"
                                : k.id.includes('boys')
                                ? "Boys Youth"
                                : "Girls Youth"}
                            </span>
                            {activeKitId === k.id && (
                              <Check className="w-3.5 h-3.5 text-[#E5A824]" />
                            )}
                          </div>
                          <div className="font-black text-xs text-black dark:text-white truncate mt-1">
                            {k.name.replace(' Sublimation Jersey Kit', '')}
                          </div>
                          <div className="text-xs text-[#AC7900] dark:text-[#E5A824] font-black mt-1">
                            ₹{k.basePrice} <span className="text-[10px] font-normal text-slate-400">/ pc</span>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Neckline & Sleeve Segmented Controls */}
                  <div className="grid grid-cols-2 gap-3 pt-1">
                    <div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase block mb-1.5">Neck Style</span>
                      <div className="flex gap-1.5 bg-black/5 dark:bg-white/5 p-1 rounded-xl">
                        {(['Round Neck', 'Polo Collar'] as const).map((n) => (
                          <button
                            key={n}
                            onClick={() => setNeckline(n)}
                            className={`flex-1 py-2 rounded-lg text-xs font-bold transition ${
                              neckline === n
                                ? 'bg-white dark:bg-stone-900 text-black dark:text-white shadow-sm'
                                : 'text-slate-500 hover:text-black dark:hover:text-white'
                            }`}
                          >
                            {n.split(' ')[0]}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase block mb-1.5">Sleeve</span>
                      <div className="flex gap-1.5 bg-black/5 dark:bg-white/5 p-1 rounded-xl">
                        {(['Half Sleeve', 'Full Sleeve'] as const).map((s) => (
                          <button
                            key={s}
                            onClick={() => setSleeveType(s)}
                            className={`flex-1 py-2 rounded-lg text-xs font-bold transition ${
                              sleeveType === s
                                ? 'bg-white dark:bg-stone-900 text-black dark:text-white shadow-sm'
                                : 'text-slate-500 hover:text-black dark:hover:text-white'
                            }`}
                          >
                            {s.split(' ')[0]}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Template Selector with Clean White Canvas First */}
                  <div className="pt-1">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                        Jersey Base Canvas
                      </span>
                      <span className="text-[10px] font-bold text-emerald-600 bg-emerald-500/10 px-2 py-0.5 rounded-full">
                        Clean White Studio Default
                      </span>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                      {DESIGN_STYLES.map((sty) => (
                        <button
                          key={sty.id}
                          onClick={() => handleStyleSelect(sty.id)}
                          className={`p-2 rounded-xl border text-left text-xs font-bold transition flex items-center gap-2 ${
                            selectedStyleId === sty.id
                              ? 'border-[#E5A824] bg-[#E5A824]/10 ring-2 ring-[#E5A824]/30'
                              : 'border-black/10 dark:border-white/10 hover:border-black/20'
                          }`}
                        >
                          <img src={sty.preview} alt="" className="w-8 h-8 rounded-lg object-cover shrink-0" />
                          <div className="min-w-0">
                            <span className="truncate text-[11px] block">{sty.name}</span>
                            {sty.id === 'minimal' && (
                              <span className="text-[9px] text-[#AC7900] dark:text-[#E5A824] font-black">★ Recommended</span>
                            )}
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Bottom Navigation */}
                  <div className="pt-2">
                    <button
                      onClick={() => setActiveStep(2)}
                      className="w-full py-3 rounded-2xl bg-black text-white dark:bg-white dark:text-black font-black text-xs flex items-center justify-center gap-2 hover:opacity-90 transition shadow-md min-h-[44px]"
                    >
                      <span>Next: Colours &amp; Style</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

              {/* ============================================================== */}
              {/* TAB 2: COLOURS & STYLE                                         */}
              {/* ============================================================== */}
              {activeStep === 2 && (
                <div className="space-y-4">
                  <div>
                    <h3 className="text-base font-black text-black dark:text-white">Team Colours &amp; Shading</h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                      Select your primary team colour palette and graphic pattern style.
                    </p>
                  </div>

                  {/* Team Colour Swatches + Pipette Color Picker */}
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                        Primary Team Colour
                      </span>
                      <div className="flex items-center gap-1.5 text-xs font-bold text-slate-500">
                        <span>Active:</span>
                        <span
                          className="w-3.5 h-3.5 rounded-full inline-block border border-black/20"
                          style={{ backgroundColor: selectedColorHex }}
                        />
                        <span className="font-mono text-black dark:text-white text-[11px]">{selectedColorHex.toUpperCase()}</span>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-2.5">
                      {COLOR_SWATCHES.map((swatch) => (
                        <button
                          key={swatch.name}
                          onClick={() => {
                            setSelectedColorHex(swatch.hex);
                            if (swatch.name === 'White' || swatch.name === 'Gold') {
                              setTextColor('#111827');
                              setNumberColor('#111827');
                            } else {
                              setTextColor(swatch.hex);
                              setNumberColor(swatch.hex);
                            }
                          }}
                          title={swatch.name}
                          className={`w-10 h-10 rounded-full border-2 transition shadow-sm flex items-center justify-center ${
                            selectedColorHex.toLowerCase() === swatch.hex.toLowerCase()
                              ? 'border-[#E5A824] scale-110 ring-2 ring-[#E5A824]/40'
                              : 'border-white dark:border-stone-800 hover:scale-105'
                          }`}
                          style={{ backgroundColor: swatch.hex }}
                        >
                          {selectedColorHex.toLowerCase() === swatch.hex.toLowerCase() && (
                            <Check
                              className={`w-4 h-4 ${
                                swatch.name === 'White' || swatch.name === 'Gold' ? 'text-black' : 'text-white'
                              }`}
                            />
                          )}
                        </button>
                      ))}

                      {/* Custom Color Pipette Picker */}
                      <label
                        className="relative w-10 h-10 rounded-full border-2 border-dashed border-black/30 dark:border-white/30 hover:border-[#E5A824] flex items-center justify-center cursor-pointer transition shadow-sm bg-black/5 dark:bg-white/5"
                        title="Pick Custom Hex Color"
                      >
                        <Pipette className="w-4 h-4 text-slate-500" />
                        <input
                          type="color"
                          value={selectedColorHex}
                          onChange={(e) => {
                            setSelectedColorHex(e.target.value);
                            setTextColor(e.target.value);
                            setNumberColor(e.target.value);
                          }}
                          className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                        />
                      </label>
                    </div>
                  </div>

                  {/* Graphic Pattern Styles */}
                  <div>
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
                      Graphic Shading Styles
                    </span>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                      {DESIGN_STYLES.map((ds) => (
                        <button
                          key={ds.id}
                          onClick={() => handleStyleSelect(ds.id)}
                          className={`p-2.5 rounded-xl border text-left text-xs font-bold transition flex items-center gap-2 ${
                            selectedStyleId === ds.id
                              ? 'border-[#E5A824] bg-[#E5A824]/10 ring-2 ring-[#E5A824]/30'
                              : 'border-black/10 dark:border-white/10 hover:border-black/20'
                          }`}
                        >
                          <img src={ds.preview} alt="" className="w-7 h-7 rounded-lg object-cover shrink-0" />
                          <span className="truncate text-[11px]">{ds.name}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Bottom Navigation */}
                  <div className="flex gap-2.5 pt-2">
                    <button
                      onClick={() => setActiveStep(1)}
                      className="px-4 py-3 rounded-2xl border border-black/15 dark:border-white/15 text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-black/5 flex items-center gap-1.5 min-h-[44px]"
                    >
                      <ArrowLeft className="w-3.5 h-3.5" />
                      <span>Back</span>
                    </button>
                    <button
                      onClick={() => {
                        setActiveStep(3);
                        setSide('front');
                        setSelectedAngle(0);
                      }}
                      className="flex-1 py-3 rounded-2xl bg-black text-white dark:bg-white dark:text-black font-black text-xs flex items-center justify-center gap-2 hover:opacity-90 transition shadow-md min-h-[44px]"
                    >
                      <span>Next: Team Identity</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

              {/* ============================================================== */}
              {/* TAB 3: TEAM IDENTITY                                           */}
              {/* ============================================================== */}
              {activeStep === 3 && (
                <div className="space-y-4">
                  <div>
                    <h3 className="text-base font-black text-black dark:text-white">Team Name, Crest &amp; Numbers</h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                      Personalize your team branding printed cleanly on the front jersey chest.
                    </p>
                  </div>

                  {/* Team Name Input */}
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                        Team Name (Printed Front)
                      </label>
                      <span className="text-[10px] text-slate-400 font-bold">{teamName.length}/18</span>
                    </div>
                    <div className="relative">
                      <input
                        type="text"
                        value={teamName}
                        onChange={(e) => setTeamName(e.target.value.toUpperCase())}
                        placeholder="e.g. KINGS, SUPERSTARS, STORM"
                        maxLength={18}
                        className="w-full px-4 py-3 rounded-2xl border border-black/15 dark:border-white/15 bg-white dark:bg-stone-900 text-sm font-black tracking-wider uppercase focus:outline-none focus:ring-2 focus:ring-[#E5A824]"
                      />
                      {teamName && (
                        <button
                          onClick={() => setTeamName('')}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-black dark:hover:text-white p-1"
                          title="Clear name"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Club Crest: Upload + Preset Badges */}
                  <div>
                    <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">
                      Sponsor / Club Crest Logo
                    </label>
                    <input
                      ref={logoInputRef}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleLogoUpload}
                    />

                    {!sponsorLogo ? (
                      <div className="space-y-2">
                        <button
                          onClick={() => logoInputRef.current?.click()}
                          className="w-full px-4 py-3 rounded-2xl border-2 border-dashed border-black/20 dark:border-white/20 hover:border-[#E5A824] text-xs font-bold text-slate-600 dark:text-slate-300 flex items-center justify-center gap-2 transition min-h-[44px]"
                        >
                          <Upload className="w-4 h-4 text-[#E5A824]" />
                          <span>Upload Crest or Sponsor Logo (PNG, SVG, JPG)</span>
                        </button>
                        <button
                          onClick={() => setIsArtworkOpen(true)}
                          className="w-full px-4 py-3 rounded-2xl border border-black/15 dark:border-white/15 hover:border-[#E5A824] text-xs font-bold text-slate-600 dark:text-slate-300 flex items-center justify-center gap-2 transition min-h-[44px]"
                        >
                          <LayoutTemplate className="w-4 h-4 text-[#E5A824]" />
                          <span>Browse Artwork Library (Curated Prints)</span>
                        </button>
                        {/* Preset Crests */}
                        <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
                          <span className="text-[10px] font-bold text-slate-400 uppercase">Or preset crest:</span>
                          {PRESET_CRESTS.map((crest) => (
                            <button
                              key={crest.name}
                              onClick={() => {
                                setSponsorLogo(crest.icon);
                                setSide('front');
                                setSelectedAngle(0);
                              }}
                              className="px-2.5 py-1.5 rounded-xl border border-black/10 dark:border-white/10 hover:border-[#E5A824] text-xs font-bold flex items-center gap-1 transition"
                            >
                              <span>{crest.icon}</span>
                              <span>{crest.name}</span>
                            </button>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 dark:bg-stone-900 border border-black/10 dark:border-white/10">
                          <div className="flex items-center gap-2.5">
                            {sponsorLogo.startsWith('blob:') || sponsorLogo.startsWith('http') || sponsorLogo.startsWith('/') ? (
                              <img src={sponsorLogo} alt="Logo" className="w-8 h-8 rounded object-contain bg-white" />
                            ) : (
                              <span className="text-2xl">{sponsorLogo}</span>
                            )}
                            <span className="text-xs font-bold text-emerald-600">Logo active on jersey</span>
                          </div>
                          <button
                            onClick={() => setSponsorLogo(null)}
                            title="Remove Logo"
                            className="p-1 rounded-full text-slate-400 hover:text-rose-500 hover:bg-black/5"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                        {/* Quick switch between preset crests */}
                        <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
                          <span className="text-[10px] font-bold text-slate-400 uppercase">Change crest:</span>
                          {PRESET_CRESTS.map((crest) => (
                            <button
                              key={crest.name}
                              onClick={() => {
                                setSponsorLogo(crest.icon);
                                setSide('front');
                                setSelectedAngle(0);
                              }}
                              className={`px-2 py-1 rounded-lg border text-[11px] font-bold flex items-center gap-1 transition ${
                                sponsorLogo === crest.icon
                                  ? 'border-[#E5A824] bg-[#E5A824]/10 text-black dark:text-white'
                                  : 'border-black/10 dark:border-white/10 hover:border-[#E5A824]'
                              }`}
                            >
                              <span>{crest.icon}</span>
                              <span>{crest.name}</span>
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Athletic Font Style */}
                  <div>
                    <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">
                      Athletic Font Style
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      {JERSEY_FONTS.map((f) => (
                        <button
                          key={f.id}
                          onClick={() => setFontStyle(f.id)}
                          className={`p-2.5 rounded-xl border text-xs text-left transition ${
                            fontStyle === f.id
                              ? 'border-black dark:border-white bg-black/5 dark:bg-white/10 font-black ring-1 ring-black dark:ring-white'
                              : 'border-black/10 dark:border-white/10 text-slate-600 dark:text-slate-400 hover:border-black/20'
                          }`}
                          style={{ fontFamily: f.family }}
                        >
                          <div className="text-[13px] font-black tracking-wider text-black dark:text-white">
                            TEAM 07
                          </div>
                          <div className="text-[10px] text-slate-400 font-sans mt-0.5">
                            {f.label}
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Number & Text Colors */}
                  <div className="grid grid-cols-2 gap-3 pt-1">
                    <div>
                      <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1.5">
                        Number Colour
                      </label>
                      <div className="flex gap-1.5 flex-wrap">
                        {NUMBER_COLORS.slice(0, 5).map((c) => (
                          <button
                            key={c.hex}
                            onClick={() => setNumberColor(c.hex)}
                            title={c.name}
                            className={`w-7 h-7 rounded-full border-2 transition ${
                              numberColor.toLowerCase() === c.hex.toLowerCase()
                                ? 'border-[#E5A824] scale-110 ring-2 ring-[#E5A824]/40'
                                : 'border-black/10'
                            }`}
                            style={{ backgroundColor: c.hex }}
                          />
                        ))}
                      </div>
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1.5">
                        Text Colour
                      </label>
                      <div className="flex gap-1.5 flex-wrap">
                        {NUMBER_COLORS.slice(0, 5).map((c) => (
                          <button
                            key={c.hex}
                            onClick={() => setTextColor(c.hex)}
                            title={c.name}
                            className={`w-7 h-7 rounded-full border-2 transition ${
                              textColor.toLowerCase() === c.hex.toLowerCase()
                                ? 'border-[#E5A824] scale-110 ring-2 ring-[#E5A824]/40'
                                : 'border-black/10'
                            }`}
                            style={{ backgroundColor: c.hex }}
                          />
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Bottom Navigation */}
                  <div className="flex gap-2.5 pt-2">
                    <button
                      onClick={() => setActiveStep(2)}
                      className="px-4 py-3 rounded-2xl border border-black/15 dark:border-white/15 text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-black/5 flex items-center gap-1.5 min-h-[44px]"
                    >
                      <ArrowLeft className="w-3.5 h-3.5" />
                      <span>Back</span>
                    </button>
                    <button
                      onClick={() => {
                        setActiveStep(4);
                        setSide('back');
                        setSelectedAngle(1);
                      }}
                      className="flex-1 py-3 rounded-2xl bg-black text-white dark:bg-white dark:text-black font-black text-xs flex items-center justify-center gap-2 hover:opacity-90 transition shadow-md min-h-[44px]"
                    >
                      <span>Next: Squad Roster ({players.length})</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

              {/* ============================================================== */}
              {/* TAB 4: SQUAD ROSTER & SIZES                                    */}
              {/* ============================================================== */}
              {activeStep === 4 && (
                <div className="space-y-4">
                  <div>
                    <h3 className="text-base font-black text-black dark:text-white">
                      Squad Roster &amp; Sizes ({players.length} Players)
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                      Each player gets their custom name and number printed on the back.
                    </p>
                  </div>

                  {/* Quick Preset Buttons */}
                  <div className="flex flex-wrap items-center justify-between gap-1.5 pb-1">
                    <span className="text-[10px] font-bold text-slate-400 uppercase">Quick Roster:</span>
                    <div className="flex gap-1.5 flex-wrap">
                      <button
                        onClick={() => loadSquadPreset('cricket11')}
                        className="px-2.5 py-1.5 rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400 font-bold text-[11px] hover:bg-blue-500/20"
                      >
                        🏏 Cricket 11
                      </button>
                      <button
                        onClick={() => loadSquadPreset('football7')}
                        className="px-2.5 py-1.5 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold text-[11px] hover:bg-emerald-500/20"
                      >
                        ⚽ Football 7
                      </button>
                      <button
                        onClick={() => loadSquadPreset('four')}
                        className="px-2.5 py-1.5 rounded-lg bg-black/5 dark:bg-white/5 text-slate-600 dark:text-slate-300 font-bold text-[11px]"
                      >
                        👥 Default 4
                      </button>
                    </div>
                  </div>

                  {/* Actions: Paste List & Add Player */}
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-slate-500">Player List</span>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setShowPaste(!showPaste)}
                        className="px-3 py-1.5 rounded-xl bg-black/5 dark:bg-white/5 hover:bg-black/10 font-bold flex items-center gap-1.5 transition text-xs"
                      >
                        <ClipboardList className="w-3.5 h-3.5" />
                        <span>Paste List</span>
                      </button>
                      <button
                        onClick={addPlayer}
                        className="px-3.5 py-1.5 rounded-xl bg-black text-white dark:bg-white dark:text-black font-black flex items-center gap-1.5 transition text-xs shadow-sm"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Add Player</span>
                      </button>
                    </div>
                  </div>

                  {/* Paste List Drawer */}
                  {showPaste && (
                    <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-stone-900 border border-black/10 dark:border-white/10 space-y-2">
                      <p className="text-[11px] text-slate-500">
                        Format: <strong className="text-black dark:text-white">Player Name, Number, Size</strong> (one per line)
                      </p>
                      <textarea
                        value={pasteText}
                        onChange={(e) => setPasteText(e.target.value)}
                        placeholder="Arjun, 07, M&#10;Vikram, 10, L&#10;Rohit, 18, XL"
                        rows={3}
                        className="w-full p-2.5 rounded-xl border border-black/15 dark:border-white/15 bg-white dark:bg-stone-950 text-xs font-mono"
                      />
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => setShowPaste(false)}
                          className="px-3 py-1.5 rounded-lg text-xs text-slate-500"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={importPasted}
                          className="px-3.5 py-1.5 rounded-xl bg-[#E5A824] text-black font-black text-xs"
                        >
                          Import Roster
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Players list: Clean, responsive rows */}
                  <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
                    {players.map((p, i) => (
                      <div
                        key={p.id}
                        className={`flex items-center gap-1.5 sm:gap-2 p-2 rounded-2xl border transition ${
                          activePlayerIdx === i
                            ? 'border-[#E5A824] bg-[#E5A824]/5 ring-1 ring-[#E5A824]/40'
                            : 'border-black/10 dark:border-white/10'
                        }`}
                      >
                        <button
                          onClick={() => {
                            setActivePlayerIdx(i);
                            setSide('back');
                            setSelectedAngle(1);
                          }}
                          title="Click to preview player on 3D jersey"
                          className={`w-7 h-7 rounded-lg text-xs font-black transition flex items-center justify-center shrink-0 ${
                            activePlayerIdx === i ? 'bg-[#E5A824] text-black' : 'text-slate-400 hover:text-black dark:hover:text-white'
                          }`}
                        >
                          {i + 1}
                        </button>
                        <input
                          type="text"
                          value={p.name}
                          onChange={(e) => updatePlayer(p.id, { name: e.target.value.toUpperCase() })}
                          onFocus={() => {
                            setActivePlayerIdx(i);
                            setSide('back');
                            setSelectedAngle(1);
                          }}
                          placeholder={`Player ${i + 1}`}
                          className="flex-1 min-w-[75px] px-2.5 sm:px-3 py-2 rounded-xl border border-black/10 dark:border-white/10 bg-white dark:bg-stone-900 text-xs font-bold uppercase focus:outline-none focus:ring-1 focus:ring-[#E5A824]"
                        />
                        <input
                          type="text"
                          value={p.number}
                          onChange={(e) => updatePlayer(p.id, { number: e.target.value.slice(0, 2) })}
                          onFocus={() => {
                            setActivePlayerIdx(i);
                            setSide('back');
                            setSelectedAngle(1);
                          }}
                          placeholder="00"
                          className="w-11 sm:w-12 px-1.5 sm:px-2 py-2 rounded-xl border border-black/10 dark:border-white/10 bg-white dark:bg-stone-900 text-xs font-black text-center focus:outline-none focus:ring-1 focus:ring-[#E5A824]"
                        />
                        <select
                          value={p.size}
                          onChange={(e) => updatePlayer(p.id, { size: e.target.value })}
                          className="w-14 sm:w-16 px-1 py-2 rounded-xl border border-black/10 dark:border-white/10 bg-white dark:bg-stone-900 text-xs font-bold focus:outline-none"
                        >
                          {KIT_SIZES.map((sz) => (
                            <option key={sz} value={sz}>{sz}</option>
                          ))}
                        </select>
                        <button
                          onClick={() => removePlayer(p.id)}
                          disabled={players.length <= 1}
                          className="p-1.5 text-slate-400 hover:text-rose-500 disabled:opacity-20 transition shrink-0"
                          title="Remove Player"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>

                  <div className="text-[11px] text-slate-400 font-semibold pt-1">
                    Sizes in squad: {Object.entries(sizeBreakdown).map(([sz, count]) => `${sz}×${count}`).join(' · ')}
                  </div>

                  {/* Bottom Navigation */}
                  <div className="flex gap-2.5 pt-2">
                    <button
                      onClick={() => setActiveStep(3)}
                      className="px-4 py-3 rounded-2xl border border-black/15 dark:border-white/15 text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-black/5 flex items-center gap-1.5 min-h-[44px]"
                    >
                      <ArrowLeft className="w-3.5 h-3.5" />
                      <span>Back</span>
                    </button>
                    <button
                      onClick={() => setActiveStep(5)}
                      className="flex-1 py-3 rounded-2xl bg-black text-white dark:bg-white dark:text-black font-black text-xs flex items-center justify-center gap-2 hover:opacity-90 transition shadow-md min-h-[44px]"
                    >
                      <span>Next: Review &amp; Order</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

              {/* ============================================================== */}
              {/* TAB 5: REVIEW & ORDER                                          */}
              {/* ============================================================== */}
              {activeStep === 5 && (
                <div className="space-y-4">
                  <div>
                    <h3 className="text-base font-black text-black dark:text-white">Review &amp; Place Order</h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                      Verify your custom specifications before adding your team kit to the cart.
                    </p>
                  </div>

                  <div className="space-y-2 p-3.5 rounded-2xl bg-slate-50 dark:bg-stone-900 border border-black/10 dark:border-white/10 text-xs">
                    <div className="flex justify-between text-slate-600 dark:text-slate-400">
                      <span>Kit Model:</span>
                      <strong className="text-black dark:text-white">{activeKit.name}</strong>
                    </div>
                    <div className="flex justify-between text-slate-600 dark:text-slate-400">
                      <span>Sport &amp; Style:</span>
                      <strong className="text-black dark:text-white">{sportType} ({neckline}, {sleeveType})</strong>
                    </div>
                    <div className="flex justify-between text-slate-600 dark:text-slate-400">
                      <span>Team Name:</span>
                      <strong className="text-black dark:text-white">{teamName}</strong>
                    </div>
                    <div className="flex justify-between text-slate-600 dark:text-slate-400">
                      <span>Squad Count:</span>
                      <strong className="text-black dark:text-white">{quantity} jerseys</strong>
                    </div>
                    <div className="flex justify-between text-slate-600 dark:text-slate-400">
                      <span>Unit Price:</span>
                      <strong className="text-black dark:text-white">₹{unitPrice} / pc</strong>
                    </div>
                  </div>

                  {/* Volume Tier Pill */}
                  {activeTier && activeTier.discountPercent > 0 && (
                    <div className="p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 font-bold text-xs text-center">
                      ✓ {activeTier.discountPercent}% Bulk Team Discount Applied
                    </div>
                  )}

                  <button
                    onClick={handleAddTeamKit}
                    className="w-full py-3.5 rounded-2xl bg-[#E5A824] hover:bg-[#d99b1a] text-black font-black text-sm flex items-center justify-center gap-2 transition shadow-lg min-h-[48px]"
                  >
                    <ShoppingCart className="w-4 h-4" />
                    <span>Add Complete Squad Kit to Cart (₹{totalPrice.toLocaleString('en-IN')})</span>
                  </button>

                  <div className="pt-1">
                    <button
                      onClick={() => setActiveStep(4)}
                      className="w-full py-2.5 rounded-xl border border-black/10 dark:border-white/10 text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-black/5 flex items-center justify-center gap-1.5"
                    >
                      <ArrowLeft className="w-3.5 h-3.5" />
                      <span>Back to Squad Roster</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Bottom Checkout & Price Card matching User Mockup (Sticky on mobile) */}
            <div className="sticky bottom-3 z-30 sm:relative sm:bottom-0 rounded-2xl bg-black dark:bg-[#1c1d1c] text-white p-3.5 sm:p-4 flex items-center justify-between gap-3 shadow-2xl border border-white/10 backdrop-blur-md">
              <div>
                <div className="text-[10px] font-black uppercase tracking-wider text-slate-400">
                  {quantity} PIECES
                </div>
                <div className="text-xl sm:text-2xl font-black text-white">
                  ₹{totalPrice.toLocaleString('en-IN')}
                </div>
                <div className="text-[10px] text-slate-400">
                  ₹{unitPrice} / piece
                </div>
              </div>
              <button
                onClick={() => {
                  if (activeStep < 4) {
                    setActiveStep(activeStep + 1);
                    if (activeStep === 3) {
                      setSide('back');
                      setSelectedAngle(1);
                    }
                  } else if (activeStep === 4) {
                    setActiveStep(5);
                  } else {
                    handleAddTeamKit();
                  }
                }}
                className="px-5 sm:px-6 py-3 sm:py-3.5 rounded-full bg-[#E5A824] hover:bg-[#d99b1a] text-black font-black text-xs tracking-wide transition shadow-lg flex items-center gap-2 shrink-0 min-h-[44px]"
              >
                <span>
                  {activeStep === 1
                    ? 'Next: Colours'
                    : activeStep === 2
                    ? 'Next: Identity'
                    : activeStep === 3
                    ? 'Next: Squad Roster'
                    : activeStep === 4
                    ? 'Review & Order'
                    : 'Add Squad Kit to Cart'}
                </span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================== */}
      {/* 5. TEAM KIT SIZE CHART (MATCHING BOTTOM-RIGHT OF USER MOCKUP)  */}
      {/* ============================================================== */}
      <section id="size-chart" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 scroll-mt-20">
        <div className="bg-white dark:bg-[#141514] rounded-3xl border border-black/10 dark:border-white/10 p-6 sm:p-8 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
            <div>
              <div className="text-xs text-slate-400 font-medium mb-1">
                Home &nbsp;/&nbsp; Sports Sublimation &nbsp;/&nbsp; <strong className="text-black dark:text-white">Team Kit Size Chart</strong>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black tracking-tight">Team Kit Size Chart</h2>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
                Garment measurements in {sizeUnit === 'in' ? 'inches (flat, ±1")' : 'centimeters (flat, ±2.5 cm)'}. Sizes are mixable across every row of your roster.
              </p>
            </div>
            <div className="flex items-center gap-3">
              {/* Unit Toggle Button */}
              <div className="flex items-center bg-black/5 dark:bg-white/5 p-1 rounded-full text-xs font-bold">
                <button
                  onClick={() => setSizeUnit('in')}
                  className={`px-3 py-1 rounded-full transition ${
                    sizeUnit === 'in' ? 'bg-black text-white dark:bg-white dark:text-black shadow-sm' : 'text-slate-500'
                  }`}
                >
                  Inches (in)
                </button>
                <button
                  onClick={() => setSizeUnit('cm')}
                  className={`px-3 py-1 rounded-full transition ${
                    sizeUnit === 'cm' ? 'bg-black text-white dark:bg-white dark:text-black shadow-sm' : 'text-slate-500'
                  }`}
                >
                  CM (cm)
                </button>
              </div>

              <button
                onClick={() => {
                  setActiveStep(4);
                  scrollToId('jersey-studio');
                }}
                className="px-5 py-2.5 rounded-full bg-black text-white dark:bg-white dark:text-black text-xs font-black hover:opacity-90 transition shrink-0"
              >
                Set my sizes →
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs min-w-[500px]">
              <thead>
                <tr className="border-b border-black/10 dark:border-white/10 text-[11px] font-black uppercase tracking-wider text-slate-400">
                  <th className="py-3 px-4">SIZE</th>
                  <th className="py-3 px-4">CHEST ({sizeUnit.toUpperCase()})</th>
                  <th className="py-3 px-4">LENGTH ({sizeUnit.toUpperCase()})</th>
                  <th className="py-3 px-4">IN YOUR ROSTER</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-black/5 dark:divide-white/5 font-medium">
                {SIZE_CHART.map((row) => {
                  const count = sizeBreakdown[row.size] || 0;
                  const displayChest = sizeUnit === 'in' ? row.chest : Math.round(row.chest * 2.54);
                  const displayLength = sizeUnit === 'in' ? row.length : Math.round(row.length * 2.54);

                  return (
                    <tr
                      key={row.size}
                      className={count > 0 ? 'bg-emerald-500/5 dark:bg-emerald-500/10 font-bold' : ''}
                    >
                      <td className="py-3 px-4 font-black text-black dark:text-white">{row.size}</td>
                      <td className="py-3 px-4 text-slate-600 dark:text-slate-300">{displayChest}</td>
                      <td className="py-3 px-4 text-slate-600 dark:text-slate-300">{displayLength}</td>
                      <td className="py-3 px-4">
                        {count > 0 ? (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 text-xs font-bold">
                            <Check className="w-3.5 h-3.5" />
                            <span>{count} selected</span>
                          </span>
                        ) : (
                          <span className="text-slate-300 dark:text-slate-600">—</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="mt-5 pt-4 border-t border-black/5 dark:border-white/5 flex flex-wrap gap-6 text-xs text-slate-500 dark:text-slate-400">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#AC7900] dark:text-[#E5A824]" />
              <span>Regular athletic fit — size up for a looser cut</span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-[#AC7900] dark:text-[#E5A824]" />
              <span>Junior sizes available on boys &amp; girls kits</span>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================== */}
      {/* 6. VISTAPRINT PRODUCT SPECIFICATIONS & PINCODE DELIVERY        */}
      {/* ============================================================== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid lg:grid-cols-12 gap-8 items-start">
          {/* Specifications Table */}
          <div className="lg:col-span-7 bg-white dark:bg-[#141514] rounded-3xl border border-black/10 dark:border-white/10 p-6 sm:p-8">
            <h3 className="text-xl font-black mb-4">Product Specifications</h3>
            <div className="divide-y divide-black/5 dark:divide-white/5 text-xs">
              <div className="py-2.5 flex justify-between">
                <span className="text-slate-500">Fabric Composition</span>
                <span className="font-bold">170 GSM 100% Dry Fit Polyester Micro-Interlock</span>
              </div>
              <div className="py-2.5 flex justify-between">
                <span className="text-slate-500">Customisation Technology</span>
                <span className="font-bold">Full 360° All-Over Dye Sublimation</span>
              </div>
              <div className="py-2.5 flex justify-between">
                <span className="text-slate-500">Collar / Neck Style</span>
                <span className="font-bold">Athletic Round Neck (Stretch Ribbed) / Polo Collar</span>
              </div>
              <div className="py-2.5 flex justify-between">
                <span className="text-slate-500">Gender / Fit</span>
                <span className="font-bold">Unisex Men's, Contoured Women's, Junior Boys & Girls</span>
              </div>
              <div className="py-2.5 flex justify-between">
                <span className="text-slate-500">Minimum Order</span>
                <span className="font-bold">From 1 piece with tiered team pricing</span>
              </div>
              <div className="py-2.5 flex justify-between">
                <span className="text-slate-500">Item Weight</span>
                <span className="font-bold">120 - 180 grams per jersey</span>
              </div>
              <div className="py-2.5 flex justify-between">
                <span className="text-slate-500">Country of Origin</span>
                <span className="font-bold">India (Tirupur Mill Direct)</span>
              </div>
            </div>
          </div>

          {/* Pincode & Delivery Box */}
          <div className="lg:col-span-5 bg-white dark:bg-[#141514] rounded-3xl border border-black/10 dark:border-white/10 p-6 sm:p-8 space-y-4">
            <h3 className="text-xl font-black">Delivery & Pincode Checker</h3>
            <p className="text-xs text-slate-500">
              Check delivery speed and shipping options for your sports team address.
            </p>
            <div className="flex gap-2">
              <input
                type="text"
                value={pincode}
                onChange={(e) => setPincode(e.target.value.slice(0, 6))}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') checkPincode();
                }}
                placeholder="Enter 6-digit Pincode (e.g. 560001)"
                className="flex-1 px-4 py-2.5 rounded-xl border border-black/15 dark:border-white/15 bg-white dark:bg-stone-900 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-[#E5A824]"
              />
              <button
                onClick={checkPincode}
                className="px-5 py-2.5 rounded-xl bg-black text-white dark:bg-white dark:text-black text-xs font-black hover:opacity-90 transition"
              >
                Check
              </button>
            </div>
            {pincodeResult && (
              <div className="p-3 rounded-xl bg-[#E5A824]/10 border border-[#E5A824]/30 text-xs font-bold text-black dark:text-white flex items-center gap-2">
                <MapPin className="w-4 h-4 text-[#E5A824] shrink-0" />
                <span>{pincodeResult}</span>
              </div>
            )}
            <div className="pt-2 border-t border-black/5 dark:border-white/5 space-y-2 text-xs text-slate-500">
              <div className="flex items-center gap-2">
                <Truck className="w-4 h-4 text-emerald-500" />
                <span>Free Doorstep Delivery Pan-India</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-500" />
                <span>Easy Returns: Free Replacement or Full Refund</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================== */}
      {/* 7. FREQUENTLY ASKED QUESTIONS (ACCORDION)                      */}
      {/* ============================================================== */}
      <section id="jersey-faq" className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 scroll-mt-20">
        <div className="text-center mb-8">
          <div className="text-xs font-black uppercase tracking-[0.2em] text-[#AC7900] dark:text-[#E5A824]">
            GOT QUESTIONS?
          </div>
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight mt-1">Frequently Asked Questions</h2>
        </div>

        <div className="space-y-3">
          {FAQS.map((faq, idx) => {
            const isOpen = openFaq === idx;
            return (
              <div
                key={faq.q}
                className="rounded-2xl border border-black/10 dark:border-white/10 bg-white dark:bg-[#141514] overflow-hidden"
              >
                <button
                  onClick={() => setOpenFaq(isOpen ? null : idx)}
                  className="w-full p-4 sm:p-5 flex items-center justify-between text-left font-black text-sm"
                >
                  <span>{faq.q}</span>
                  <ChevronDown
                    className={`w-4 h-4 transition-transform duration-300 ${isOpen ? 'rotate-180 text-[#E5A824]' : 'text-slate-400'}`}
                  />
                </button>
                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25 }}
                    >
                      <div className="p-4 sm:p-5 pt-0 text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed border-t border-black/5 dark:border-white/5">
                        {faq.a}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </section>

      {/* ============================================================== */}
      {/* ZOOM LIGHTBOX MODAL                                            */}
      {/* ============================================================== */}
      <AnimatePresence>
        {isZoomOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsZoomOpen(false)}
            className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4"
          >
            <div
              onClick={(e) => e.stopPropagation()}
              className="relative max-w-3xl w-full bg-white dark:bg-[#141514] rounded-3xl overflow-hidden p-6 shadow-2xl"
            >
              <button
                onClick={() => setIsZoomOpen(false)}
                className="absolute top-4 right-4 p-2 rounded-full bg-black/10 dark:bg-white/10 hover:bg-black/20 text-black dark:text-white"
              >
                <X className="w-5 h-5" />
              </button>
              <h3 className="text-lg font-black mb-4">
                360° Studio Detail Inspection — {side.toUpperCase()} VIEW
              </h3>
              <div className="aspect-square max-h-[550px] w-full bg-slate-50 dark:bg-stone-900 rounded-2xl overflow-hidden flex items-center justify-center relative">
                <img
                  src={currentPreviewImage}
                  alt="High Resolution Zoom"
                  className="w-full h-full object-contain"
                />
              </div>
              <div className="flex justify-between items-center mt-4">
                <div className="text-xs text-slate-500 font-bold">
                  170 GSM Poly Interlock · Full Sublimation · {previewName} #{previewNumber}
                </div>
                <button
                  onClick={() => setIsZoomOpen(false)}
                  className="px-5 py-2 rounded-full bg-black text-white dark:bg-white dark:text-black text-xs font-black hover:opacity-90 transition"
                >
                  Close Inspection
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ============================================================== */}
      {/* ARTWORK LIBRARY MODAL (curated prints as crest artwork)        */}
      {/* ============================================================== */}
      <PreloadedDesignModal
        isOpen={isArtworkOpen}
        onClose={() => setIsArtworkOpen(false)}
        onSelectDesign={(d) => {
          setSponsorLogo(d.url);
          setSide('front');
          setSelectedAngle(0);
        }}
      />

      {/* Mobile Floating Bottom Bar for Quick Action */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-[#121312]/95 backdrop-blur-md border-t border-black/10 dark:border-white/10 p-3 px-4 flex items-center justify-between shadow-2xl">
        <div>
          <div className="text-[10px] font-black uppercase text-slate-500">
            {quantity} Jerseys · {activeKit.name.split(' ')[0]}
          </div>
          <div className="text-lg font-black text-black dark:text-white leading-none mt-0.5">
            ₹{totalPrice.toLocaleString('en-IN')}{' '}
            <span className="text-[10px] font-normal text-slate-400">(@ ₹{unitPrice})</span>
          </div>
        </div>
        <button
          onClick={() => {
            if (activeStep < 4) {
              setActiveStep(4);
              setSide('back');
              setSelectedAngle(1);
              scrollToId('jersey-studio');
            } else if (activeStep === 4) {
              setActiveStep(5);
              scrollToId('jersey-studio');
            } else {
              handleAddTeamKit();
            }
          }}
          className="px-5 py-2.5 rounded-full bg-[#E5A824] text-black text-xs font-black shadow-md flex items-center gap-1.5"
        >
          <span>{activeStep < 4 ? 'Squad Details' : activeStep === 4 ? 'Review' : 'Add to Cart'}</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Toast notifications */}
      <AnimatePresence>
        {addedToast && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 30 }}
            className="fixed bottom-20 lg:bottom-6 right-6 z-50 px-5 py-3.5 rounded-2xl bg-emerald-600 text-white font-black text-xs shadow-2xl flex items-center gap-2"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Team kit successfully added to cart ({quantity} jerseys)!</span>
          </motion.div>
        )}
        {saveToast && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 30 }}
            className="fixed bottom-20 lg:bottom-6 right-6 z-50 px-5 py-3.5 rounded-2xl bg-black text-white dark:bg-white dark:text-black font-black text-xs shadow-2xl flex items-center gap-2"
          >
            <Bookmark className="w-4 h-4" />
            <span>Custom jersey configuration saved to session!</span>
          </motion.div>
        )}
        {shareToast && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 30 }}
            className="fixed bottom-20 lg:bottom-6 right-6 z-50 px-5 py-3.5 rounded-2xl bg-[#E5A824] text-black font-black text-xs shadow-2xl flex items-center gap-2"
          >
            <Share2 className="w-4 h-4" />
            <span>Jersey Studio link copied to clipboard!</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
