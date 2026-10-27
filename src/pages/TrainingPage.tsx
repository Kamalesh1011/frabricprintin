import React, { useState, useRef } from 'react';
import {
  GraduationCap,
  Sparkles,
  Award,
  Calendar,
  Clock,
  CheckCircle2,
  Users,
  ChevronRight,
  BookOpen,
  ArrowRight,
  ShieldCheck,
  Zap,
  Layers,
  Printer,
  Compass,
  Star,
  Download,
  PhoneCall,
  X
} from 'lucide-react';
import { TrainingInquiryModal } from '../components/TrainingInquiryModal';
import { motion, useScroll, useTransform, useSpring, useReducedMotion, useMotionValueEvent } from 'motion/react';
import { VelocityRibbon } from '../components/VelocityRibbon';
import { Magnetic } from '../components/Magnetic';
import { CountUp } from '../components/CountUp';

export interface TrainingCourse {
  id: string;
  title: string;
  shortTitle: string;
  category: 'artisan' | 'industrial' | 'trending';
  categoryLabel: string;
  badge: string;
  image: string;
  duration: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced' | 'All Levels' | 'Beginner to Pro' | 'Beginner Friendly';
  batchSchedule: string;
  price: number;
  originalPrice: number;
  rating: number;
  reviewsCount: number;
  description: string;
  outcomes: string[];
  toolkitIncluded: string[];
  syllabus: { title: string; desc: string }[];
}

export const TRAINING_COURSES: TrainingCourse[] = [
  {
    id: 'block-print',
    title: 'Heritage Wooden Block Printing & Resist Dye Masterclass',
    shortTitle: 'Block Print',
    category: 'artisan',
    categoryLabel: 'Artisanal & Heritage',
    badge: 'Traditional Craft',
    image: '/mockups/training_block_print.jpg',
    duration: '3 Days (18 Hours Hands-on)',
    level: 'Beginner to Pro',
    batchSchedule: 'Every Friday - Sunday | 10:00 AM - 4:00 PM',
    price: 4999,
    originalPrice: 7999,
    rating: 4.9,
    reviewsCount: 142,
    description:
      'Immerse in the timeless tradition of Indian wooden block printing. Learn hand carving techniques, natural dye preparation, multi-color registration, and mud-resist Dabu techniques on pure cotton and silk.',
    outcomes: [
      'Master carved block alignment and seamless pattern repeat geometry',
      'Formulate organic natural paste recipes & gum binders',
      'Execute multi-layer pigment and indigo dip resist methods',
      'Print your own 5-meter commercial fabric collection'
    ],
    toolkitIncluded: [
      'Set of 3 hand-carved Sheesham teak wood printing blocks',
      '5 meters premium combed cotton base fabric',
      'Natural pigment formulation starter kit & wooden tray',
      'Professional artisan print apron & Certificate'
    ],
    syllabus: [
      { title: 'Module 1: Block Craft & Carving Fundamentals', desc: 'Understanding wood grain, motif grid design, and relief chisel techniques.' },
      { title: 'Module 2: Natural Pigments & Binder Chemistry', desc: 'Preparing thickeners, alum mordanting, and lightfast testing.' },
      { title: 'Module 3: Registration & Grid Printing on Padded Tables', desc: 'Pin-point registration, continuous yardage stamping, and post-cure fixing.' }
    ]
  },
  {
    id: 'screen-print',
    title: 'Commercial Silk Screen Printing & Carousel Certification',
    shortTitle: 'Screen Print',
    category: 'industrial',
    categoryLabel: 'Industrial Textile Print',
    badge: 'High Production',
    image: 'https://live.staticflickr.com/8226/8377669944_acf4758249_b.jpg',
    duration: '5 Days (30 Hours Hands-on)',
    level: 'Intermediate',
    batchSchedule: 'Mon - Fri Full-time | 9:30 AM - 3:30 PM',
    price: 7499,
    originalPrice: 11999,
    rating: 4.95,
    reviewsCount: 218,
    description:
      'From art separation to squeegee pull dynamics on manual carousels and flatbed tables. Master emulsion coating, mesh tensioning, UV exposure, plastisol vs water-based discharge inks, and flash curing.',
    outcomes: [
      'Color separation in Photoshop & Illustrator for halftones & spot colors',
      'Coating and reclaiming 110-305 mesh count screens with dual-cure emulsion',
      'Multi-color wet-on-wet registration on 6-color rotating carousels',
      'Costing, production throughput optimization & wash fastness ISO testing'
    ],
    toolkitIncluded: [
      '2 Aluminum silk screens (160 mesh & 230 mesh)',
      '1 Professional 70-durometer squeegee blade',
      'Plastisol & water-based CMYK primary ink jars',
      '10 Blank 220 GSM heavyweight t-shirts for live print runs'
    ],
    syllabus: [
      { title: 'Module 1: Darkroom Science & UV Emulsion', desc: 'Screen prep, degreasing, scoop coating, and exposure calculator calibration.' },
      { title: 'Module 2: Squeegee Pressure & Ink Viscosity Dynamics', desc: 'Angle control, flood strokes, plastisol vs water-based discharge nuances.' },
      { title: 'Module 3: Tunnel Dryer Curing & Quality Audit', desc: 'Infrared temperature testing, elasticity pull tests, and wash testing.' }
    ]
  },
  {
    id: 'sublimation-print',
    title: 'Industrial Sublimation Printing & Sportswear Jersey Lab',
    shortTitle: 'Sublimation Print',
    category: 'industrial',
    categoryLabel: 'Digital High-Speed',
    badge: 'Sportswear & Merch',
    image: 'https://upload.wikimedia.org/wikipedia/commons/e/e4/RGB_dye_sublimation_panels.jpg',
    duration: '2 Days (12 Hours Intensive)',
    level: 'All Levels',
    batchSchedule: 'Weekend Batch (Sat & Sun) | 10:00 AM - 4:00 PM',
    price: 5999,
    originalPrice: 8999,
    rating: 4.88,
    reviewsCount: 165,
    description:
      'Master high-speed sublimation dye transfer on poly fabrics, athletic jerseys, flags, and corporate merchandise. Learn RIP software color profiling, rotary calender operation, and anti-ghosting heat press calibration.',
    outcomes: [
      'ICC Color profiling for vivid fluorescents and true sports club blacks',
      'Large format roll-to-roll and flatbed pneumatic heat press operation',
      'All-over panel printing and seamless pattern engineering for jerseys',
      'Troubleshooting banding, moisture cockling, and dye migration'
    ],
    toolkitIncluded: [
      'Sublimation transfer paper roll sample (100 GSM fast dry)',
      'High-temp thermal tape & Teflon protective sheets',
      '5 Cut-panel DRI-FIT athletic jersey blanks',
      'Color swatch lookup ring & RIP software setup guide'
    ],
    syllabus: [
      { title: 'Module 1: Digital RIP & Color Science', desc: 'Managing CMYK+Fluorescent curves and high-definition raster processing.' },
      { title: 'Module 2: Heat Press Mechanics & Temperature Curves', desc: 'Pressure balancing, 200°C gas transfer phase, and dwell time precision.' },
      { title: 'Module 3: Performance Athleticwear Construction', desc: 'Panel cutting, neck tape integration, and moisture wicking properties.' }
    ]
  },
  {
    id: 'dtf-print',
    title: 'DTF (Direct to Film) Advanced Printing & Transfer Workshop',
    shortTitle: 'DTF Print',
    category: 'trending',
    categoryLabel: 'Next-Gen Custom Print',
    badge: 'High Demand Tech',
    image: 'https://live.staticflickr.com/582/21276838561_e5a45ef1e1_b.jpg',
    duration: '2 Days (14 Hours Intensive)',
    level: 'All Levels',
    batchSchedule: 'Batch 1: Tue & Wed | Batch 2: Sat & Sun',
    price: 6499,
    originalPrice: 9999,
    rating: 4.98,
    reviewsCount: 312,
    description:
      'The modern industry gold standard for apparel printing! Learn DTF film coating types, white ink circulation systems, automatic TPU powder shakers, hot vs cold peel techniques, and multi-fabric adhesion.',
    outcomes: [
      'High-precision RIP white underbase configuration & choke management',
      'Automatic powder applicator shaker & tunnel cure temperature tuning',
      'Adhesion secrets for cotton, nylon, polyester, leather, and blended canvas',
      'Commercial DTF cost-per-sheet calculations and profit model building'
    ],
    toolkitIncluded: [
      'Premium double-matte PET DTF film roll sample',
      '1kg Ultra-fine soft-hand TPU adhesive powder',
      'Infrared surface thermometer for press calibration',
      '10 Test transfer sheets and custom press demo substrates'
    ],
    syllabus: [
      { title: 'Module 1: DTF Printer Architecture & White Ink Health', desc: 'Dampers, printhead maintenance, white agitation, and nozzle check recovery.' },
      { title: 'Module 2: TPU Powder Chemistry & Curing Windows', desc: 'Melting orange-peel texture verification and oven curing profiles.' },
      { title: 'Module 3: Multi-Substrate Application & Longevity Testing', desc: 'Pressure settings, second-press matte finishing, and 50-wash durability.' }
    ]
  },
  {
    id: 'dtg-print',
    title: 'DTG (Direct to Garment) Industrial Inkjet Engineering',
    shortTitle: 'DTG Print',
    category: 'industrial',
    categoryLabel: 'Industrial Digital Garment',
    badge: 'Premium Apparel',
    image: 'https://live.staticflickr.com/65535/52549895109_307035ff3f_b.jpg',
    duration: '3 Days (18 Hours Hands-on)',
    level: 'Advanced',
    batchSchedule: 'Thursday - Saturday | 10:00 AM - 4:30 PM',
    price: 8999,
    originalPrice: 13999,
    rating: 4.92,
    reviewsCount: 189,
    description:
      'Learn the pinnacle of luxury custom t-shirt printing. Master automatic pre-treatment spraying, dark garment CMYK+W digital inkjet mechanics, ultra-soft breathable hand feel, and fine-art fidelity reproduction.',
    outcomes: [
      'Automated pre-treatment grammage calibration based on cotton GSM',
      'Industrial printhead alignment, bi-directional calibration & firing voltage',
      'Dark garment dual-pass white underbase highlights & gradient fading',
      'Luxury boutique packaging, heat platen curing & washing resistance standards'
    ],
    toolkitIncluded: [
      'Pre-treatment liquid concentrate sample & spray density gauge',
      'Pre-treatment silicone smoothing sheet',
      '5 Luxury 240 GSM Supima & Combed Organic Cotton Tees',
      'Industrial Maintenance and Nozzle Clean Toolkit'
    ],
    syllabus: [
      { title: 'Module 1: Garment Pre-Treatment Science', desc: 'Fibrillation suppression, spray density grammage, and moisture curing.' },
      { title: 'Module 2: Industrial RIP Software & Spot White Layering', desc: 'Choke values, ink density curves, and photo-real gradient rendering.' },
      { title: 'Module 3: Heat Cure & Finishing for Luxury Boutiques', desc: 'Teflon vs parchment paper, force air curing, and sensory hand feel.' }
    ]
  },
  {
    id: 'natural-dye',
    title: 'Natural Botanical Dyeing, Indigo Vats & Eco-Textiles',
    shortTitle: 'Natural Dye',
    category: 'artisan',
    categoryLabel: 'Eco & Sustainable',
    badge: '100% Organic',
    image: 'https://live.staticflickr.com/16/22147658_ace6be924f_b.jpg',
    duration: '3 Days (18 Hours Hands-on)',
    level: 'Beginner to Pro',
    batchSchedule: 'Friday - Sunday | 10:00 AM - 4:00 PM',
    price: 5499,
    originalPrice: 8499,
    rating: 4.96,
    reviewsCount: 175,
    description:
      'Rediscover the magic of living botanical color. Learn the chemistry of fermented organic indigo reduction vats, madder root ruby reds, marigold sunny yellows, pomegranate greens, and non-toxic alum/tannin mordants.',
    outcomes: [
      'Build and maintain balanced, living fructose & iron organic indigo vats',
      'Fiber scours and bio-mordant recipes for plant (cellulose) and animal (protein) fibers',
      'Shibori resist binding, clamp resists, and botanical bundle steaming',
      'Lightfastness fixing, pH balance testing, and zero-waste wastewater neutralization'
    ],
    toolkitIncluded: [
      'Raw natural dye extracts kit (Natural Indigo, Madder, Marigold, Harda)',
      'Precision pH test strips & natural alum mordant pack',
      'Pure Mulberry silk scarf + Organic cotton yardage blanks',
      'Dyer’s botanical recipe journal & identification cards'
    ],
    syllabus: [
      { title: 'Module 1: Fiber Scouring & Bio-Mordanting', desc: 'Cellulose and protein preparation, tannin baths, and mineral alum bonding.' },
      { title: 'Module 2: The Living Indigo Vat & Shibori Dynamics', desc: 'Hydrosulfite-free reduction, oxygenation dipping cycles, and resist tying.' },
      { title: 'Module 3: Eco-Printing & Botanical Bundle Steaming', desc: 'Leaf tannin transfer, steam chamber extraction, and natural color fixing.' }
    ]
  },
  {
    id: 'tufting',
    title: 'Modern Textile Tufting & Hand-Crafted Fiber Rug Artistry',
    shortTitle: 'Tufting',
    category: 'trending',
    categoryLabel: 'Fiber Arts & Interiors',
    badge: 'Creative Studio',
    image: 'https://upload.wikimedia.org/wikipedia/commons/0/09/Tufting_rug.jpg',
    duration: '2 Days (14 Hours Studio Workshop)',
    level: 'Beginner Friendly',
    batchSchedule: 'Weekend Studio Cohort | 10:30 AM - 5:30 PM',
    price: 6999,
    originalPrice: 10499,
    rating: 4.97,
    reviewsCount: 240,
    description:
      'Step into the hyper-satisfying world of tactile fiber art! Operate electric cut-pile tufting guns, stretch monks cloth on custom easel frames, execute bold geometric designs with wool & acrylic yarn, and sculpt plush relief rugs.',
    outcomes: [
      'Operate cut-pile & loop-pile electric tufting guns safely and smoothly',
      'Frame construction, primary backing tensioning, and projector stencil tracing',
      'Yarn feeder dual-strand blending and gradient color blocking',
      'Latex adhesive carpet backing, secondary twill binding, and 3D electric carving'
    ],
    toolkitIncluded: [
      'Your own custom 60x60 cm completed designer tufted rug to take home',
      'Selection of 10 vibrant acrylic & New Zealand wool yarn cones',
      'Carpet trimmer shearing guide & duckbill scissors set',
      'Certificate of Master Tufting Artistry'
    ],
    syllabus: [
      { title: 'Module 1: Frame Setup & Tufting Gun Mechanics', desc: 'Stretching backing cloth, needle depth adjustment, and speed throttle control.' },
      { title: 'Module 2: Tufting Techniques & Yarn Density', desc: 'Straight line pacing, curved contour fills, and dual-color thread blending.' },
      { title: 'Module 3: Backing Adhesives, Twill Binding & 3D Shearing', desc: 'Flexible carpet latex curing, edge binding, and dimensional pile beveling.' }
    ]
  }
];

interface TrainingPageProps {
  onGoToHome: () => void;
  onOpenBulkInquiry?: () => void;
}

export const TrainingPage: React.FC<TrainingPageProps> = ({ onGoToHome, onOpenBulkInquiry }) => {
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'artisan' | 'industrial' | 'trending'>('all');
  const [activeCourseModal, setActiveCourseModal] = useState<TrainingCourse | null>(null);
  const [enrollModalCourse, setEnrollModalCourse] = useState<TrainingCourse | null>(null);
  const [trainingInquiryOpen, setTrainingInquiryOpen] = useState(false);
  const [inquiryProgram, setInquiryProgram] = useState('All 7 Master Modules (Comprehensive Bootcamp)');

  // Enrollment Form State
  const [studentName, setStudentName] = useState('');
  const [studentEmail, setStudentEmail] = useState('');
  const [studentPhone, setStudentPhone] = useState('');
  const [selectedBatchTime, setSelectedBatchTime] = useState('Upcoming Weekend Batch');
  const [enrollSuccess, setEnrollSuccess] = useState(false);

  const filteredCourses =
    selectedCategory === 'all'
      ? TRAINING_COURSES
      : TRAINING_COURSES.filter((c) => c.category === selectedCategory);

  // ---- Awwwards-style scroll-driven motion (transform/opacity only) ----
  const reduceMotion = useReducedMotion();
  // Hero: mandala rotation + content drift tied to scroll
  const heroRef = useRef<HTMLElement>(null);
  const { scrollYProgress: heroProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start'],
  });
  const mandalaRotate = useTransform(heroProgress, [0, 1], [0, 140]);
  const mandalaRotateSmooth = useSpring(mandalaRotate, { stiffness: 55, damping: 18 });
  const heroDriftY = useTransform(heroProgress, [0, 1], [0, 90]);
  const heroFade = useTransform(heroProgress, [0, 0.85], [1, 0]);
  // Course grid: one shared progress value drives every card image parallax (cheap: 1 listener)
  const gridRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress: gridProgress } = useScroll({
    target: gridRef,
    offset: ['start end', 'end start'],
  });
  const cardImgY = useTransform(gridProgress, [0, 1], ['-7%', '7%']);
  // Journey rail: active course dot follows section scroll progress
  const [activeJourneyIdx, setActiveJourneyIdx] = useState(0);
  useMotionValueEvent(gridProgress, 'change', (v) => {
    const n = filteredCourses.length;
    if (!n) return;
    const idx = Math.min(n - 1, Math.max(0, Math.floor(v * n)));
    setActiveJourneyIdx((prev) => (prev === idx ? prev : idx));
  });
  const railFill = useTransform(gridProgress, [0, 1], [0.02, 1]);
  const scrollToCourse = (courseId: string) => {
    document
      .getElementById(`course-row-${courseId}`)
      ?.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'center' });
  };

  const handleEnrollSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setEnrollSuccess(true);
    setTimeout(() => {
      setEnrollSuccess(false);
      setEnrollModalCourse(null);
      setStudentName('');
      setStudentEmail('');
      setStudentPhone('');
    }, 3000);
  };

  return (
    <div className="min-h-screen pb-32 lg:pb-16 bg-[#FDFBF7] dark:bg-[#121412] text-[#0F100F] dark:text-white transition-colors duration-300">
      
      {/* 1. HERITAGE HERO — classical mill-craft proscenium */}
      <section ref={heroRef} className="relative overflow-hidden bg-[#0B0B09] text-white py-14 sm:py-20 border-b border-[#D4AF37]/15">
        {/* Jaali lattice backdrop */}
        <div className="absolute inset-0 jaali-pattern pointer-events-none" />
        {/* Scroll-linked mandala halo (CSS spin fallback for reduced motion) */}
        <motion.div
          style={reduceMotion ? undefined : { rotate: mandalaRotateSmooth }}
          className={`absolute -right-40 -top-40 w-[480px] h-[480px] rounded-full border border-[#D4AF37]/15 pointer-events-none ${reduceMotion ? 'animate-spin-slower' : ''}`}
        >
          <div className="absolute inset-6 rounded-full border border-dashed border-[#D4AF37]/20" />
          <div className="absolute inset-16 rounded-full border border-[#D4AF37]/10" />
          <div className="absolute inset-28 rounded-full bg-[#AC7900]/10 blur-2xl" />
        </motion.div>
        <div className="absolute -left-32 -bottom-40 w-[420px] h-[420px] rounded-full border border-[#D4AF37]/10 pointer-events-none animate-spin-slower" />
        {/* Ambient glows */}
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-[#AC7900]/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-1/2 -right-24 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

        {/* Classical double hairline frame */}
        <div className="absolute inset-3 sm:inset-4 border border-[#D4AF37]/25 rounded-2xl pointer-events-none" />
        <div className="absolute inset-4 sm:inset-5 border border-[#D4AF37]/10 rounded-xl pointer-events-none" />
        {(['top-1 left-4', 'top-1 right-4', 'bottom-1 left-4', 'bottom-1 right-4'] as const).map(pos => (
          <span key={pos} className={`absolute ${pos} text-[#D4AF37]/70 text-sm pointer-events-none select-none`}>❖</span>
        ))}

        <motion.div
          initial={reduceMotion ? false : { opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
          style={reduceMotion ? undefined : { y: heroDriftY, opacity: heroFade }}
          className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-12 relative z-10"
        >
          <div className="max-w-3xl space-y-6">

            <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-[#D4AF37]/10 backdrop-blur-md border border-[#D4AF37]/30 text-xs font-semibold text-[#E9C767]">
              <GraduationCap className="w-4 h-4 text-[#D4AF37]" />
              <span>Textile Printing &amp; Craft Academy · Tirupur Mill Campus</span>
            </div>

            {/* Ornamental divider */}
            <div className="flex items-center gap-3 text-[#D4AF37]/80">
              <span className="h-px w-16 bg-gradient-to-r from-transparent to-[#D4AF37]/70" />
              <span className="text-xs tracking-[0.3em] uppercase font-bold">❖ ❖ ❖</span>
              <span className="h-px w-16 bg-gradient-to-l from-transparent to-[#D4AF37]/70" />
            </div>

            {/* Mask-reveal headline — signature Awwwards typography moment */}
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black font-editorial tracking-tight leading-[1.12]">
              <span className="block overflow-hidden pb-1">
                <motion.span
                  className="block"
                  initial={reduceMotion ? false : { y: '112%' }}
                  animate={{ y: '0%' }}
                  transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
                >
                  Master Professional
                </motion.span>
              </span>
              <span className="block overflow-hidden pb-2">
                <motion.span
                  className="block gold-sheen-text"
                  initial={reduceMotion ? false : { y: '112%' }}
                  animate={{ y: '0%' }}
                  transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1], delay: 0.24 }}
                >
                  Textile &amp; Apparel Printing
                </motion.span>
              </span>
            </h1>

            <p className="text-sm sm:text-base text-gray-300 leading-relaxed font-normal">
              Learn directly on industrial mill machinery and authentic artisan tables. From heritage
              <strong className="text-white"> Wooden Block Printing</strong> &amp; <strong className="text-white">Natural Indigo Vats</strong> to high-tech <strong className="text-white">DTF, DTG, Sublimation &amp; Rug Tufting</strong>. Hands-on training, equipment kits included, and certified master credentials.
            </p>

            {/* Classical stat cartouches */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
              {[
                { num: 7, suffix: '', label: 'Master Tracks', sub: 'Artisanal to Industrial', color: 'text-[#D4AF37]' },
                { num: 100, suffix: '%', label: 'Hands-On', sub: 'Live machinery labs', color: 'text-emerald-400' },
                { title: 'Toolkits Included', sub: 'Take-home gear & fabric', color: 'text-blue-400' },
                { title: 'Certified Badge', sub: 'Industry-recognized', color: 'text-purple-400' },
              ].map((s, i) => (
                <motion.div
                  key={s.label || (s as { title: string }).title}
                  initial={reduceMotion ? false : { opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.15 + i * 0.08 }}
                  className="relative p-3 rounded-2xl bg-white/[0.04] border border-[#D4AF37]/20 backdrop-blur-xs overflow-hidden"
                >
                  <span className="absolute top-0 left-3 right-3 h-px bg-gradient-to-r from-transparent via-[#D4AF37]/60 to-transparent" />
                  <span className={`text-xs font-bold ${s.color} block`}>
                    {'num' in s ? (
                      <>
                        <CountUp to={s.num} suffix={s.suffix} /> {s.label}
                      </>
                    ) : (
                      (s as { title: string }).title
                    )}
                  </span>
                  <span className="text-[11px] text-gray-400">{s.sub}</span>
                </motion.div>
              ))}
            </div>

            {/* Quick Action CTAs */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <Magnetic>
                <button
                  type="button"
                  onClick={() => {
                    const elem = document.getElementById('courses-grid');
                    elem?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="px-6 py-3 rounded-full bg-gradient-to-r from-[#966900] via-[#AC7900] to-[#966900] bg-[length:200%_auto] hover:bg-right text-white font-bold text-xs transition-all duration-500 shadow-[0_8px_30px_rgba(172,121,0,0.35)] flex items-center space-x-2"
                >
                  <span>Explore 7 Workshops</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </Magnetic>
              <Magnetic strength={0.2}>
                <button
                  type="button"
                  onClick={() => {
                    setInquiryProgram('All 7 Master Modules (Comprehensive Bootcamp)');
                    setTrainingInquiryOpen(true);
                  }}
                  className="px-5 py-3 rounded-full bg-white/[0.06] hover:bg-white/[0.12] border border-[#D4AF37]/25 text-white font-semibold text-xs transition flex items-center space-x-2"
                >
                  <Users className="w-3.5 h-3.5 text-[#D4AF37]" />
                  <span>College &amp; Corporate Inquiry</span>
                </button>
              </Magnetic>
            </div>

          </div>
        </motion.div>
      </section>

      {/* 1b. SCROLLING CRAFT RIBBON — velocity-reactive (speeds up as you scroll) */}
      <div className="relative bg-[#0B0B09] border-b border-[#D4AF37]/20 py-2.5">
        <VelocityRibbon
          items={['Wooden Block Printing', 'Natural Indigo Vats', 'DTF Printing', 'DTG Printing', 'Sublimation', 'Rug Tufting', 'Embroidery Arts', 'Screen Printing']}
          className="text-[11px] font-bold uppercase tracking-[0.25em] text-[#D4AF37]/80"
        />
      </div>

      {/* 2. CLASSICAL CATEGORY SELECTOR TABS */}
      <section className="sticky top-14 z-30 bg-[#FDFBF7]/90 dark:bg-[#121412]/90 backdrop-blur-md border-b border-[#AC7900]/20 py-3">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between overflow-x-auto no-scrollbar gap-2">

            <div className="relative flex items-center space-x-1 p-1 bg-[#0F100F] dark:bg-black/60 rounded-full border border-[#D4AF37]/30 shadow-[0_4px_20px_rgba(172,121,0,0.15)] shrink-0">
              {[
                { id: 'all', label: 'All Programs (7)', icon: '❖' },
                { id: 'artisan', label: 'Heritage & Artisanal (2)', icon: '🌿' },
                { id: 'industrial', label: 'Industrial Print (3)', icon: '⚡' },
                { id: 'trending', label: 'Trending Studio (2)', icon: '🔥' },
              ].map(tab => {
                const isActive = selectedCategory === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => {
                      setSelectedCategory(tab.id as typeof selectedCategory);
                      document
                        .getElementById('courses-grid')
                        ?.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' });
                    }}
                    className={`relative px-4 py-1.5 rounded-full text-xs font-bold transition-colors whitespace-nowrap ${
                      isActive ? 'text-black' : 'text-stone-300 hover:text-white'
                    }`}
                  >
                    {isActive && (
                      <motion.span
                        layoutId="training-tab-gold"
                        transition={{ type: 'spring', stiffness: 420, damping: 34 }}
                        className="absolute inset-0 rounded-full bg-gradient-to-r from-[#966900] via-[#E9C767] to-[#966900]"
                      />
                    )}
                    <span className="relative z-10 flex items-center space-x-1.5">
                      <span>{tab.icon}</span>
                      <span>{tab.label}</span>
                    </span>
                  </button>
                );
              })}
            </div>

            <div className="hidden md:flex items-center space-x-3 text-xs text-slate-500">
              <span className="flex items-center space-x-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                <span>Small Batches (Max 8 Students)</span>
              </span>
              <span>•</span>
              <span className="flex items-center space-x-1">
                <Award className="w-3.5 h-3.5 text-[#AC7900]" />
                <span>Master Guild Certificate</span>
              </span>
            </div>

          </div>
        </div>
      </section>

      {/* 3. WORKSHOPS & TRAINING COURSES GRID — wave entrance, one after another */}
      <section id="courses-grid" className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 scroll-mt-28">

        {/* Wave section header */}
        <div className="flex items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-[#AC7900] dark:text-[#D4AF37]">
              <span className="h-px w-10 bg-current" />
              <span className="text-[11px] font-bold uppercase tracking-[0.25em]">❖ Workshops</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black font-editorial mt-1">
              Choose Your Craft
            </h2>
          </div>
          <span className="text-xs font-bold text-slate-400 shrink-0">
            {filteredCourses.length} course{filteredCourses.length === 1 ? '' : 's'}
          </span>
        </div>

        {/* Alternating course journey: image ↔ content swap sides every row */}
        <div className="relative">
          {/* Journey progress rail with clickable course dots (desktop) */}
          <div className="hidden lg:block absolute left-0 top-2 bottom-2 w-14">
            <div className="sticky top-40 h-[44vh] min-h-[300px]">
              <div className="absolute left-1/2 top-1 bottom-1 w-px -translate-x-1/2 bg-black/10 dark:bg-white/10" />
              <div className="absolute left-1/2 top-1 bottom-1 w-px -translate-x-1/2 overflow-hidden">
                <motion.div
                  style={reduceMotion ? undefined : { scaleY: railFill }}
                  className="h-full w-full bg-gradient-to-b from-[#966900] via-[#D4AF37] to-[#966900] origin-top"
                />
              </div>
              <div className="relative h-full flex flex-col items-center justify-between">
                {filteredCourses.map((c, i) => (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => scrollToCourse(c.id)}
                    title={c.shortTitle}
                    className="group flex items-center gap-1.5 py-0.5"
                  >
                    <span className={`font-mono-luxury text-[10px] font-bold transition-colors ${i === activeJourneyIdx ? 'text-[#AC7900] dark:text-[#D4AF37]' : 'text-slate-400/70 group-hover:text-slate-500'}`}>
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <span className={`block rounded-full transition-all duration-300 ${i === activeJourneyIdx ? 'w-3 h-3 bg-[#D4AF37] shadow-[0_0_12px_rgba(212,175,55,0.8)]' : 'w-2 h-2 bg-black/15 dark:bg-white/25 group-hover:bg-[#AC7900] dark:group-hover:bg-[#D4AF37] group-hover:scale-125'}`} />
                  </button>
                ))}
              </div>
            </div>
          </div>
          <div ref={gridRef} className="space-y-14 md:space-y-24 lg:pl-20">
          {filteredCourses.map((course, index) => {
            const flip = index % 2 === 1;
            const num = String(index + 1).padStart(2, '0');
            return (
            <motion.article
              key={`${selectedCategory}-${course.id}`}
              id={`course-row-${course.id}`}
              initial={reduceMotion ? false : { opacity: 0, y: 64, x: flip ? 36 : -36 }}
              whileInView={{ opacity: 1, y: 0, x: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{
                duration: 0.75,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="grid md:grid-cols-2 gap-6 md:gap-12 lg:gap-16 items-center group scroll-mt-32"
            >
              {/* Visual cell */}
              <div
                onClick={() => setActiveCourseModal(course)}
                title="View syllabus & details"
                className={`relative rounded-[28px] overflow-hidden min-h-[270px] md:min-h-[400px] shadow-xl border border-black/5 dark:border-white/10 order-1 ${flip ? 'md:order-2' : 'md:order-1'}`}
              >
                <motion.img
                  src={course.image}
                  alt={course.title}
                  loading="lazy"
                  onError={(e) => {
                    const el = e.currentTarget as HTMLImageElement;
                    if (!el.dataset.fbk) {
                      el.dataset.fbk = '1';
                      el.src = '/mockups/white_fabric_drape_roll.jpg';
                    }
                  }}
                  style={reduceMotion ? undefined : { y: cardImgY }}
                  whileHover={reduceMotion ? undefined : { scale: 1.05 }}
                  transition={{ type: 'spring', stiffness: 200, damping: 24 }}
                  className="absolute inset-0 w-full h-[114%] object-cover -mt-[7%] cursor-zoom-in"
                />
                {/* Bottom scrim for legibility */}
                <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-black/70 to-transparent pointer-events-none" />
                {/* Hover cue */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                  <span className="px-4 py-2 rounded-full bg-black/70 backdrop-blur text-white text-[11px] font-bold flex items-center gap-1.5">
                    <BookOpen className="w-3.5 h-3.5 text-[#D4AF37]" /> View syllabus
                  </span>
                </div>

                <div className="absolute top-4 left-4 flex flex-col gap-1">
                  <span className="bg-[#0F100F]/90 backdrop-blur-md text-white text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">
                    {course.badge}
                  </span>
                </div>

                <div className="absolute top-4 right-4">
                  <span className="bg-white/90 dark:bg-[#1A1C1A]/90 backdrop-blur-md text-black dark:text-white text-[10px] font-bold px-2.5 py-1 rounded-full flex items-center space-x-1 shadow-xs">
                    <Star className="w-3 h-3 text-amber-500 fill-current" />
                    <span>{course.rating}</span>
                    <span className="text-slate-400 font-normal">({course.reviewsCount})</span>
                  </span>
                </div>

                {/* Giant ghost number */}
                <span className="absolute -bottom-4 right-3 font-mono-luxury text-[84px] md:text-[110px] leading-none font-black text-white/25 select-none pointer-events-none">
                  {num}
                </span>

                <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-[11px] text-white bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-xl">
                  <span className="flex items-center space-x-1">
                    <Clock className="w-3 h-3 text-[#D4AF37]" />
                    <span>{course.duration}</span>
                  </span>
                  <span className="text-[#D4AF37] font-semibold">{course.level}</span>
                </div>
              </div>

              {/* Content cell */}
              <div className={`relative order-2 ${flip ? 'md:order-1' : 'md:order-2'}`}>
                <span className="absolute -top-8 -left-1 font-mono-luxury text-[64px] md:text-[80px] leading-none font-black text-[#AC7900]/10 dark:text-[#D4AF37]/10 select-none pointer-events-none">
                  {num}
                </span>
                <div className="flex items-center gap-2 text-[#AC7900] dark:text-[#D4AF37]">
                  <span className="h-px w-8 bg-current" />
                  <span className="text-[10px] font-bold uppercase tracking-[0.25em]">
                    ❖ {course.categoryLabel}
                  </span>
                </div>
                <h3 className="text-xl sm:text-2xl lg:text-[28px] font-black font-editorial text-[#0F100F] dark:text-white leading-tight mt-2 group-hover:text-[#AC7900] dark:group-hover:text-[#D4AF37] transition-colors">
                  {course.title}
                </h3>
                <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 line-clamp-3 leading-relaxed mt-2">
                  {course.description}
                </p>

                <div className="rounded-2xl bg-black/[0.03] dark:bg-white/[0.04] border border-black/5 dark:border-white/10 p-3 space-y-1.5 mt-3">
                  <span className="text-[10px] font-bold uppercase text-slate-400 tracking-wider block">
                    Core Learning Outcomes:
                  </span>
                  {course.outcomes.slice(0, 3).map((item, idx) => (
                    <div key={idx} className="flex items-start space-x-2 text-[11px] sm:text-xs text-slate-700 dark:text-slate-300">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                      <span className="line-clamp-1">{item}</span>
                    </div>
                  ))}
                </div>

                <div className="pt-4 mt-3 border-t border-black/5 dark:border-white/5 flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <div className="flex items-baseline space-x-1.5">
                        <span className="text-2xl font-black font-editorial text-[#0F100F] dark:text-white">
                          ₹{course.price.toLocaleString('en-IN')}
                        </span>
                        <span className="text-xs text-slate-400 line-through">
                          ₹{course.originalPrice.toLocaleString('en-IN')}
                        </span>
                      </div>
                      <span className="text-[10px] font-black text-emerald-700 dark:text-emerald-300 bg-emerald-500/15 border border-emerald-500/25 px-2 py-0.5 rounded-full">
                        {Math.round((1 - course.price / course.originalPrice) * 100)}% OFF
                      </span>
                    </div>
                    <span className="text-[9px] text-emerald-600 dark:text-emerald-400 font-semibold block">
                      All Toolkits &amp; Materials Included
                    </span>
                  </div>

                  <div className="flex items-center space-x-2">
                    <button
                      type="button"
                      onClick={() => setActiveCourseModal(course)}
                      className="p-2.5 rounded-xl border border-black/10 dark:border-white/10 hover:bg-black/5 dark:hover:bg-white/5 transition text-xs font-bold"
                      title="View Syllabus & Details"
                    >
                      <BookOpen className="w-4 h-4 text-slate-600 dark:text-slate-300" />
                    </button>

                    <Magnetic strength={0.18}>
                      <button
                        type="button"
                        onClick={() => setEnrollModalCourse(course)}
                        className="px-5 py-2.5 rounded-xl bg-[#0F100F] dark:bg-white text-white dark:text-[#0F100F] text-xs font-bold hover:opacity-90 transition shadow-sm flex items-center space-x-1.5"
                      >
                        <span>Book Seat</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </Magnetic>
                  </div>
                </div>
              </div>
            </motion.article>
            );
          })}
          </div>
        </div>

        {/* 4. CORPORATE & ACADEMIC INSTITUTION TRAINING BANNER */}
        <motion.div
          initial={{ opacity: 0, y: 48 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="bg-gradient-to-r from-[#1A1C1A] to-[#0D0E0D] rounded-[32px] p-8 sm:p-12 text-white border border-[#D4AF37]/20 shadow-2xl relative overflow-hidden"
        >
          <div className="absolute inset-0 jaali-pattern opacity-60 pointer-events-none" />
          <div className="max-w-3xl space-y-4 relative z-10">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-white/10 text-xs font-bold text-[#D4AF37]">
              <Users className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span>Fashion Colleges, Design Studios &amp; Corporate Batches</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-black font-editorial">
              Custom Industrial Printing Workshops for Teams &amp; Design Institutes
            </h2>
            <p className="text-xs sm:text-sm text-gray-300 leading-relaxed">
              We host dedicated private cohorts for NIFT, NID, fashion university students, and garment manufacturing startups. Custom module combinations (e.g. Block Print + DTF Hybrid Masterclass) with complete machinery access.
            </p>
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => {
                  setInquiryProgram('Custom Industrial Printing Workshop (Corporate / College)');
                  setTrainingInquiryOpen(true);
                }}
                className="px-6 py-3 rounded-full bg-[#AC7900] hover:bg-[#966900] text-white font-bold text-xs transition shadow-lg flex items-center space-x-2"
              >
                <span>Request Corporate / College Syllabus Quote</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
              <a
                href="https://wa.me/919876543210?text=Hi%2C%20I%20am%20interested%20in%20Textile%20Printing%20Training%20Workshops."
                target="_blank"
                rel="noreferrer"
                className="px-5 py-3 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 text-white font-semibold text-xs transition flex items-center space-x-2"
              >
                <PhoneCall className="w-3.5 h-3.5 text-emerald-400" />
                <span>Direct WhatsApp Counselor</span>
              </a>
            </div>
          </div>
        </motion.div>

      </section>

      {/* COURSE DETAILS SYLLABUS MODAL */}
      {activeCourseModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white dark:bg-[#1A1C1A] w-full max-w-2xl max-h-[90vh] rounded-[32px] border border-black/10 dark:border-white/15 shadow-2xl flex flex-col overflow-hidden text-[#0F100F] dark:text-white">
            
            {/* Modal Header */}
            <div className="p-6 border-b border-black/5 dark:border-white/10 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-2xl bg-amber-500/10 flex items-center justify-center text-[#AC7900] dark:text-[#D4AF37]">
                  <GraduationCap className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#AC7900] block">
                    {activeCourseModal.categoryLabel}
                  </span>
                  <h3 className="text-base sm:text-lg font-bold font-editorial line-clamp-1">
                    {activeCourseModal.title}
                  </h3>
                </div>
              </div>

              <button
                onClick={() => setActiveCourseModal(null)}
                className="p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition text-slate-400 hover:text-black dark:hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Content Scrollable */}
            <div className="p-6 overflow-y-auto space-y-6">
              
              <div className="relative aspect-video rounded-2xl overflow-hidden">
                <img
                  src={activeCourseModal.image}
                  alt={activeCourseModal.title}
                  className="w-full h-full object-cover"
                />
              </div>

              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                {activeCourseModal.description}
              </p>

              {/* Batch & Time info */}
              <div className="grid grid-cols-2 gap-3 p-3.5 rounded-2xl bg-[#F9F6ED] dark:bg-[#242624] text-xs">
                <div>
                  <span className="text-slate-400 text-[10px] font-bold uppercase block">Duration</span>
                  <span className="font-bold text-black dark:text-white">{activeCourseModal.duration}</span>
                </div>
                <div>
                  <span className="text-slate-400 text-[10px] font-bold uppercase block">Schedule</span>
                  <span className="font-bold text-black dark:text-white">{activeCourseModal.batchSchedule}</span>
                </div>
              </div>

              {/* Syllabus Breakdown */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#0F100F] dark:text-white">
                  Course Modules &amp; Hands-On Lab:
                </h4>
                <div className="space-y-2.5">
                  {activeCourseModal.syllabus.map((mod, idx) => (
                    <div key={idx} className="p-3.5 rounded-2xl bg-black/[0.02] dark:bg-white/[0.03] border border-black/5 dark:border-white/5 space-y-1">
                      <span className="text-xs font-bold text-[#AC7900] dark:text-[#D4AF37] block">{mod.title}</span>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400">{mod.desc}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Toolkit Included */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#0F100F] dark:text-white">
                  Take-Home Student Gear Box Included:
                </h4>
                <ul className="space-y-1.5">
                  {activeCourseModal.toolkitIncluded.map((item, idx) => (
                    <li key={idx} className="flex items-center space-x-2 text-xs text-slate-600 dark:text-slate-300">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

            </div>

            {/* Modal Footer */}
            <div className="p-6 border-t border-black/5 dark:border-white/10 flex items-center justify-between bg-black/[0.02] dark:bg-white/[0.02] gap-3">
              <div>
                <span className="text-2xl font-black font-editorial text-[#0F100F] dark:text-white">
                  ₹{activeCourseModal.price.toLocaleString('en-IN')}
                </span>
                <span className="text-xs text-slate-400 line-through ml-2">
                  ₹{activeCourseModal.originalPrice.toLocaleString('en-IN')}
                </span>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  type="button"
                  onClick={() => {
                    setInquiryProgram(activeCourseModal.title);
                    setActiveCourseModal(null);
                    setTrainingInquiryOpen(true);
                  }}
                  className="px-4 py-2.5 rounded-xl border border-black/10 dark:border-white/10 hover:bg-black/5 dark:hover:bg-white/5 font-bold text-xs transition text-slate-700 dark:text-slate-200"
                >
                  Group / College Quote
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setEnrollModalCourse(activeCourseModal);
                    setActiveCourseModal(null);
                  }}
                  className="px-5 py-2.5 rounded-xl bg-[#0F100F] dark:bg-white text-white dark:text-[#0F100F] font-bold text-xs hover:opacity-90 transition shadow-md"
                >
                  Enroll in Workshop
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* SEAT RESERVATION / ENROLLMENT MODAL */}
      {enrollModalCourse && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white dark:bg-[#1A1C1A] w-full max-w-lg rounded-[32px] border border-black/10 dark:border-white/15 shadow-2xl p-6 sm:p-8 relative text-[#0F100F] dark:text-white">
            
            <button
              onClick={() => setEnrollModalCourse(null)}
              className="absolute top-6 right-6 p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition text-slate-400"
            >
              <X className="w-5 h-5" />
            </button>

            {enrollSuccess ? (
              <div className="py-8 text-center space-y-3">
                <div className="w-14 h-14 bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold font-editorial">Seat Reserved Successfully!</h3>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  Our academic counselor has sent your batch schedule, campus map, and welcome kit checklist to your phone &amp; email.
                </p>
              </div>
            ) : (
              <form onSubmit={handleEnrollSubmit} className="space-y-4">
                <div className="space-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#AC7900]">
                    Reserve Workshop Seat
                  </span>
                  <h3 className="text-lg font-bold font-editorial line-clamp-1">
                    {enrollModalCourse.title}
                  </h3>
                  <p className="text-xs text-slate-500">
                    Workshop Fee: <strong className="text-black dark:text-white">₹{enrollModalCourse.price.toLocaleString('en-IN')}</strong> (All materials included)
                  </p>
                </div>

                <div className="space-y-3 pt-2">
                  <div>
                    <label className="text-[11px] font-bold block mb-1">Your Full Name *</label>
                    <input
                      type="text"
                      required
                      value={studentName}
                      onChange={(e) => setStudentName(e.target.value)}
                      placeholder="e.g. Aditi Sharma"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-[#242624] border border-black/10 dark:border-white/10 text-xs font-medium focus:ring-2 focus:ring-[#AC7900] outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-[11px] font-bold block mb-1">Email Address *</label>
                      <input
                        type="email"
                        required
                        value={studentEmail}
                        onChange={(e) => setStudentEmail(e.target.value)}
                        placeholder="aditi@example.com"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-[#242624] border border-black/10 dark:border-white/10 text-xs font-medium focus:ring-2 focus:ring-[#AC7900] outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-bold block mb-1">WhatsApp / Phone *</label>
                      <input
                        type="tel"
                        required
                        value={studentPhone}
                        onChange={(e) => setStudentPhone(e.target.value)}
                        placeholder="+91 98765 43210"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-[#242624] border border-black/10 dark:border-white/10 text-xs font-medium focus:ring-2 focus:ring-[#AC7900] outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[11px] font-bold block mb-1">Preferred Batch Timing</label>
                    <select
                      value={selectedBatchTime}
                      onChange={(e) => setSelectedBatchTime(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-[#242624] border border-black/10 dark:border-white/10 text-xs font-bold"
                    >
                      <option value="Upcoming Weekend Batch">Upcoming Weekend Cohort (Sat - Sun)</option>
                      <option value="Weekday Fast-Track Batch">Weekday Intensive Bootcamp (Mon - Wed)</option>
                      <option value="1-on-1 VIP Mill Mentorship">Private 1-on-1 Studio Mentorship</option>
                    </select>
                  </div>
                </div>

                <div className="pt-3 border-t border-black/5 dark:border-white/5 flex items-center justify-between">
                  <div className="text-[10px] text-slate-400">
                    <span>🔒 No upfront cancellation fee</span>
                  </div>

                  <button
                    type="submit"
                    className="px-6 py-2.5 rounded-xl bg-[#AC7900] hover:bg-[#966900] text-white font-bold text-xs transition shadow-md"
                  >
                    Confirm Registration →
                  </button>
                </div>
              </form>
            )}

          </div>
        </div>
      )}

      {/* DEDICATED ACADEMY & CLASS INQUIRY MODAL */}
      <TrainingInquiryModal
        isOpen={trainingInquiryOpen}
        onClose={() => setTrainingInquiryOpen(false)}
        defaultProgram={inquiryProgram}
      />

    </div>
  );
};
