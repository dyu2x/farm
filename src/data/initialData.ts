import {
  FingerlingProduct,
  BlogArticle,
  HeroImage,
  AboutUsSlide,
  WhyChooseUsItem,
  SystemSettings,
  CustomerInquiry,
  MonthlySalesReport,
  VisitorLocation,
  AdminUser,
} from '../types';

export const INITIAL_PRODUCTS: FingerlingProduct[] = [
  {
    id: 'prod-starter-1',
    name: 'Starter Fingerlings',
    scientificName: 'Clarias batrachus',
    sizeCategory: 'Starter Fingerlings',
    sizeInches: '1.5 - 2.0 inches',
    sizeCm: '3.8 - 5.1 cm',
    stockCount: 65000,
    lowStockThreshold: 15000,
    description:
      'Vigorous, nursery-conditioned Clarias batrachus fry weaned onto high-protein micro-crumbles. Screened for uniform size to prevent cannibalism and primed for nursery nursery tanks and hapa nets.',
    nurseryDays: '21 - 25 days post-hatch',
    growthRate: 'Rapid early acclimation, ready for pellet training',
    survivalRate: '96% - 98% with proper nursery aeration',
    recommendedStockingDensity: '150 - 200 pcs / m² (nursery hapa)',
    fishType: 'Hito (Clarias batrachus)',
    isActive: true,
    images: [
      'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1522069169874-c58ec4b76be5?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1535591273668-578e31182c4f?auto=format&fit=crop&w=1000&q=80',
    ],
    pricingTiers: [
      { id: 'tier-1-1', minQty: 500, maxQty: 1999, pricePerPiece: 2.80, label: '500 - 1,999 pcs' },
      { id: 'tier-1-2', minQty: 2000, maxQty: 4999, pricePerPiece: 2.40, label: '2,000 - 4,999 pcs' },
      { id: 'tier-1-3', minQty: 5000, maxQty: 9999, pricePerPiece: 2.10, label: '5,000 - 9,999 pcs' },
      { id: 'tier-1-4', minQty: 10000, maxQty: null, pricePerPiece: 1.85, label: '10,000+ pcs (Commercial Tier)' },
    ],
  },
  {
    id: 'prod-standard-2',
    name: 'Standard Grow-out',
    scientificName: 'Clarias batrachus',
    sizeCategory: 'Standard Grow-out',
    sizeInches: '2.5 - 3.5 inches',
    sizeCm: '6.3 - 8.9 cm',
    stockCount: 42000,
    lowStockThreshold: 12000,
    description:
      'The gold standard for commercial pond and tank growers in the Philippines. Robust juvenile Clarias batrachus with fully developed sensory barbels, already feeding vigorously on floating starter pellets.',
    nurseryDays: '35 - 42 days post-hatch',
    growthRate: 'Reaches harvest size (250g-350g) in 90 - 105 days',
    survivalRate: '98%+ post-transport survival rate',
    recommendedStockingDensity: '80 - 100 pcs / m² (tarpaulin/concrete pond)',
    fishType: 'Hito (Clarias batrachus)',
    isActive: true,
    images: [
      'https://images.unsplash.com/photo-1524704654690-b56c05c78a00?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1516683037151-9a17603a8dc7?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=1000&q=80',
    ],
    pricingTiers: [
      { id: 'tier-2-1', minQty: 500, maxQty: 1999, pricePerPiece: 4.20, label: '500 - 1,999 pcs' },
      { id: 'tier-2-2', minQty: 2000, maxQty: 4999, pricePerPiece: 3.80, label: '2,000 - 4,999 pcs' },
      { id: 'tier-2-3', minQty: 5000, maxQty: 9999, pricePerPiece: 3.40, label: '5,000 - 9,999 pcs' },
      { id: 'tier-2-4', minQty: 10000, maxQty: null, pricePerPiece: 3.10, label: '10,000+ pcs (Wholesale)' },
    ],
  },
  {
    id: 'prod-advance-3',
    name: 'Advance Stocker',
    scientificName: 'Clarias batrachus',
    sizeCategory: 'Advance Stocker',
    sizeInches: '4.0 - 5.0 inches',
    sizeCm: '10.2 - 12.7 cm',
    stockCount: 18500,
    lowStockThreshold: 8000,
    description:
      'Heavyweight stockers engineered for quick harvest turnaround cycles. Resilient against temperature fluctuations and ideal for high-density biofloc or intensive recirculating aquaculture systems.',
    nurseryDays: '50 - 60 days post-hatch',
    growthRate: 'Rapid harvest readiness in 60 - 75 days',
    survivalRate: '99% harvest viability with standard feed management',
    recommendedStockingDensity: '50 - 70 pcs / m² (intensive tank)',
    fishType: 'Hito (Clarias batrachus)',
    isActive: true,
    images: [
      'https://images.unsplash.com/photo-1534043464124-3be32fe000c9?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=1000&q=80',
    ],
    pricingTiers: [
      { id: 'tier-3-1', minQty: 300, maxQty: 999, pricePerPiece: 6.50, label: '300 - 999 pcs' },
      { id: 'tier-3-2', minQty: 1000, maxQty: 2999, pricePerPiece: 5.90, label: '1,000 - 2,999 pcs' },
      { id: 'tier-3-3', minQty: 3000, maxQty: 6999, pricePerPiece: 5.40, label: '3,000 - 6,999 pcs' },
      { id: 'tier-3-4', minQty: 7000, maxQty: null, pricePerPiece: 4.90, label: '7,000+ pcs (Bulk Farm)' },
    ],
  },
  {
    id: 'prod-jumbo-4',
    name: 'Jumbo Stocker',
    scientificName: 'Clarias batrachus',
    sizeCategory: 'Jumbo Stocker',
    sizeInches: '6.0+ inches',
    sizeCm: '15.2+ cm',
    stockCount: 7800,
    lowStockThreshold: 4000,
    description:
      'Extra-large conditioned hito stockers designed for ultra-rapid 45-day fattening cycles or immediate stocking into polyculture tilapia/carp systems. Exceptional disease tolerance and voracious feeding vigor.',
    nurseryDays: '70+ days post-hatch',
    growthRate: 'Harvest within 40 - 50 days (350g - 500g table size)',
    survivalRate: '99.5% survival rate in controlled water conditions',
    recommendedStockingDensity: '30 - 45 pcs / m²',
    fishType: 'Hito (Clarias batrachus)',
    isActive: true,
    images: [
      'https://images.unsplash.com/photo-1524704654690-b56c05c78a00?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1522069169874-c58ec4b76be5?auto=format&fit=crop&w=1000&q=80',
    ],
    pricingTiers: [
      { id: 'tier-4-1', minQty: 200, maxQty: 799, pricePerPiece: 9.50, label: '200 - 799 pcs' },
      { id: 'tier-4-2', minQty: 800, maxQty: 1999, pricePerPiece: 8.80, label: '800 - 1,999 pcs' },
      { id: 'tier-4-3', minQty: 2000, maxQty: 4999, pricePerPiece: 8.10, label: '2,000 - 4,999 pcs' },
      { id: 'tier-4-4', minQty: 5000, maxQty: null, pricePerPiece: 7.50, label: '5,000+ pcs (Commercial)' },
    ],
  },
];

export const INITIAL_BLOGS: BlogArticle[] = [
  {
    id: 'blog-1',
    title: 'Precision Hatchery Protocols: Hormone Spawning and Incubation in Clarias batrachus',
    slug: 'precision-hatchery-protocols-clarias-batrachus',
    excerpt:
      'A deep dive into controlled broodstock conditioning, synthetic hormone injection (Ovaprim/Ovatide), artificial stripping, and silt-free hatching trays for 90%+ hatch rates.',
    content: `
### Scientific Broodstock Selection & Conditioning

At Mesina Farms, success starts with superior genetic stock. Broodstock catfish (*Clarias batrachus*) are conditioned in aerated earthen ponds with a 38% crude protein diet supplemented with fresh forage. Males must display a distinct elongated, reddish urogenital papilla, while females must present a soft, distended abdomen with greenish-brown ripe ova visible upon gentle cannulation.

### Induced Spawning and Stripping Procedure

1. **Hormonal Administration:** Synthetic GnRH analogue combined with domperidone is administered intramuscularly at 0.5 mL per kilogram body weight for females and 0.25 mL for males.
2. **Latency Period:** At water temperatures of 28°C to 30°C, stripping occurs precisely 10 to 12 hours post-injection.
3. **Milt Extraction and Dry Fertilization:** Sperm suspension is mixed with saline solution and stripped eggs within clean, dry plastic bowls, followed by feather stirring for 60 seconds before clean water activation.
4. **Egg Incubation in Submerged Mesh Trays:** Eggs are distributed in single layers over nylon mesh trays suspended in running, well-oxygenated water at 6.5–7.5 pH.

### Larval Care & First Feeding

Hatching occurs within 24 to 28 hours. Yolk-sac absorption takes 3 to 4 days, after which live Artemia nauplii or Moina are introduced as first feed, ensuring healthy organogenesis and maximum nursery survival.
    `,
    author: 'Jojo Mesina, Master Hatchery Technician',
    category: 'Featured Fish Care & Hatchery Articles',
    tags: ['Hatchery', 'Spawning', 'Clarias batrachus', 'Incubation', 'Broodstock'],
    images: [
      'https://images.unsplash.com/photo-1524704654690-b56c05c78a00?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1535591273668-578e31182c4f?auto=format&fit=crop&w=1200&q=80',
    ],
    youtubeUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    publishedAt: '2026-08-14T09:30:00.000Z',
    publishedYear: 2026,
    status: 'active',
    readingTimeMinutes: 7,
    featured: true,
  },
  {
    id: 'blog-2',
    title: 'Water Quality Management: Keeping Dissolved Oxygen & Ammonia in the Safe Zone',
    slug: 'water-quality-dissolved-oxygen-ammonia-hito',
    excerpt:
      'Catfish can breathe atmospheric air through their arborescent organ, but poor water quality severely hampers growth and feed conversion ratio (FCR). Here is how to keep your tanks pristine.',
    content: `
### The Arborescent Organ Fallacy

While *Clarias batrachus* possesses an auxiliary arborescent breathing organ enabling atmospheric respiration, forcing fish to surface constantly burns vital metabolic calories. Maintaining dissolved oxygen above 4.0 mg/L in your grow-out water ensures efficient feed digestion, rapid conversion, and zero stress-induced gill inflammation.

### Key Chemical Parameters

- **Water Temperature:** 27°C – 32°C optimal. Below 24°C, feeding slows dramatically.
- **pH Range:** 6.5 – 8.0. Sudden shifts greater than 0.5 pH units per day induce mucus shedding.
- **Total Ammonia Nitrogen (TAN):** Keep below 1.0 ppm. Un-ionized ammonia ($NH_3$) must remain under 0.05 ppm.
- **Nitrite ($NO_2^-$):** Toxic to blood hemoglobin. Supplementing coarse sea salt at 1 to 2 kg per 1,000 liters protects against brown blood disease.

### Aeration and Water Exchange Routines

For intensive tarpaulin tanks, run dual venturi aspirators with intermittent bottom drainage every 3 days. A 20% to 30% bottom siphoning removes decaying faecal matter and uneaten pellets without destabilizing the beneficial microbial film.
    `,
    author: 'Engr. D. Santos, Aquaculture Systems Specialist',
    category: 'Water Quality',
    tags: ['Water Quality', 'Dissolved Oxygen', 'Ammonia', 'Biofloc', 'Tank Care'],
    images: [
      'https://images.unsplash.com/photo-1516683037151-9a17603a8dc7?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1522069169874-c58ec4b76be5?auto=format&fit=crop&w=1200&q=80',
    ],
    publishedAt: '2026-07-22T14:15:00.000Z',
    publishedYear: 2026,
    status: 'active',
    readingTimeMinutes: 5,
    featured: false,
  },
  {
    id: 'blog-3',
    title: 'Biosecurity Protocols: Preventing Columnaris and Parasitic Infections in Nursery Tanks',
    slug: 'biosecurity-columnaris-prevention-hito-nursery',
    excerpt:
      'Proven sanitization schedules, potassium permanganate dips, and salt baths to shield your fingerlings from white spot, fin rot, and bacterial gill infections.',
    content: `
### Identifying Common Hito Pathogens

High stocking densities in juvenile catfish nursery tanks require strict biosecurity. The two most prominent threats are *Flavobacterium columnare* (Columnaris / "Cotton Mouth") and ciliated protozoan parasites like *Ichthyophthirius multifiliis* (Ich).

### Mesina Farms Quarantine & Sanitation Protocol

1. **Pre-Stocking Disinfection:** Wash nursery tanks thoroughly with 10% iodophor or calcium hypochlorite, letting surfaces dry under direct sunlight for at least 48 hours.
2. **Prophylactic Salt Baths:** When receiving fresh fingerlings, condition them in a 3‰ (3 grams per liter) non-iodized rock salt solution for 15 minutes before tank introduction.
3. **Gentle Sizing Routine:** Weekly grading using stainless steel fingerling sorters separates faster-growing shooters, completely stopping cannibalistic aggression and skin abrasions where bacteria enter.
4. **Natural Probiotics:** Inoculating tank water with lactic acid bacteria (LAB) competitive exclusion cultures prevents pathogenic Vibrio and Aeromonas colonies from dominating the pond bottom.
    `,
    author: 'Dr. Maria Elena Ramos, DVM Aquatic Health',
    category: 'Biosecurity & Health',
    tags: ['Biosecurity', 'Health', 'Diseases', 'Quarantine', 'Fingerling Care'],
    images: [
      'https://images.unsplash.com/photo-1534043464124-3be32fe000c9?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=1200&q=80',
    ],
    publishedAt: '2025-11-10T11:00:00.000Z',
    publishedYear: 2025,
    status: 'active',
    readingTimeMinutes: 6,
    featured: false,
  },
  {
    id: 'blog-4',
    title: 'Archived Reference: 2024 Philippine Climate Resilient Hito Farming Benchmark',
    slug: 'archived-2024-philippine-climate-resilient-hito-farming',
    excerpt:
      'Historical study and baseline data on rainy season pond runoff mitigation, typhoon pond drainage protocols, and solar backup aeration.',
    content: `
### Archived Technical Report (Year 2024)

This archived guide documents field trials conducted during the 2024 wet season across Central Luzon. Key findings highlighted the protective value of perimeter netting against flash-flood escapees and the critical importance of emergency limestone lime broadcast (50g/m²) following heavy torrential acid rainfalls to buffer pH drops.
    `,
    author: 'Mesina Farms Research Division',
    category: 'Historical Archives',
    tags: ['Archive', 'Research', 'Climate Resilience', 'Pampanga Aquaculture'],
    images: [
      'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=1200&q=80',
    ],
    publishedAt: '2024-09-18T08:00:00.000Z',
    publishedYear: 2024,
    status: 'archived',
    readingTimeMinutes: 4,
    featured: false,
  },
];

export const INITIAL_HERO_IMAGES: HeroImage[] = [
  {
    id: 'hero-1',
    url: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=1920&q=85',
    title: 'Premier Clarias Batrachus Hatchery & Grower',
    subtitle:
      'High-vigor, certified disease-free hito fingerlings with superior growth kinetics, hormone-induced breeding, and dedicated farmer technical advisory.',
    badge: 'Certified Premium Aquaculture Stock',
    ctaText: 'Explore Fingerling Catalog',
    ctaLink: '/catalog',
    isActive: true,
  },
  {
    id: 'hero-2',
    url: 'https://images.unsplash.com/photo-1516683037151-9a17603a8dc7?auto=format&fit=crop&w=1920&q=85',
    title: '98%+ High Survival Rate Fingerlings',
    subtitle:
      'Scientifically conditioned in pure deep-well aerated water with strict size grading to eliminate cannibalism and maximize your harvest yield.',
    badge: 'Zero-Cannibalism Size Grading',
    ctaText: 'Calculate Tank Stocking',
    ctaLink: '#calculator',
    isActive: true,
  },
  {
    id: 'hero-3',
    url: 'https://images.unsplash.com/photo-1524704654690-b56c05c78a00?auto=format&fit=crop&w=1920&q=85',
    title: 'Direct Farm Pickup & Luzon-Wide Delivery',
    subtitle:
      'Oxygenated transport bags and conditioned live-hauling tankers ensuring your fingerlings arrive energetic and ready for immediate pond stocking.',
    badge: 'Reliable Nationwide Logistics',
    ctaText: 'Submit Order Inquiry',
    ctaLink: '/inquiry',
    isActive: true,
  },
];

export const INITIAL_ABOUT_SLIDES: AboutUsSlide[] = [
  {
    id: 'about-1',
    url: 'https://images.unsplash.com/photo-1524704654690-b56c05c78a00?auto=format&fit=crop&w=1200&q=80',
    caption: 'State-of-the-art incubation nursery tanks with continuous water recirculation.',
  },
  {
    id: 'about-2',
    url: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=1200&q=80',
    caption: 'Rigorous broodstock genetic selection ensuring fast weight gain and high FCR efficiency.',
  },
  {
    id: 'about-3',
    url: 'https://images.unsplash.com/photo-1516683037151-9a17603a8dc7?auto=format&fit=crop&w=1200&q=80',
    caption: 'Automated size grading arrays eliminating size disparity and mortality.',
  },
  {
    id: 'about-4',
    url: 'https://images.unsplash.com/photo-1535591273668-578e31182c4f?auto=format&fit=crop&w=1200&q=80',
    caption: 'Oxygenated packaging facility preparing healthy stocks for farm deliveries.',
  },
];

export const INITIAL_WHY_CHOOSE_US: WhyChooseUsItem[] = [
  {
    id: 'why-1',
    title: 'Certified Clarias Batrachus Genetics',
    description:
      'We exclusively propagate true Clarias batrachus selected across generations for thick musculature, stress resilience, and rapid commercial grow-out.',
    iconName: 'Fish',
  },
  {
    id: 'why-2',
    title: 'Precision Size Uniformity',
    description:
      'Cannibalism accounts for over 40% of losses in uncalibrated farms. Our mechanical grading process ensures 100% size parity within every delivered batch.',
    iconName: 'Scale',
  },
  {
    id: 'why-3',
    title: 'Hormone-Induced Controlled Hatchery',
    description:
      'Synchronized breeding yields uniform egg batches, healthy fry development, and robust digestive enzyme production ready for commercial crumbles.',
    iconName: 'ShieldCheck',
  },
  {
    id: 'why-4',
    title: 'Direct Farmer Technical Advisory',
    description:
      'Every order includes complimentary consultation on water chemistry, feeding ratios, disease prophylaxis, and stocking density optimization.',
    iconName: 'Headphones',
  },
];

export const INITIAL_SETTINGS: SystemSettings = {
  companyName: 'Mesina Farms',
  logoUrl: '/round_transparent.png',
  supportEmail: 'support@mesinafarms.com',
  supportPhone: '+63 962 527 9820',
  farmAddress: 'Brgy. Saba, Hermosa, Bataan, Philippines',
  farmCoordinates: {
    lat: 14.8587,
    lng: 120.5112,
  },
  operatingHours: {
    monFri: 'Mon - Fri 8:00 AM - 4:00 PM',
    sat: 'Saturday: By Appointment Only',
    sun: 'Sunday: Closed',
    notes: 'For emergency fingerling loading or large hauler dispatch, please call ahead.',
  },
  smtpConfig: {
    host: 'smtp.mesinafarms.com',
    port: 587,
    user: 'notifications@mesinafarms.com',
    pass: '••••••••••••',
    fromEmail: 'support@mesinafarms.com',
    secure: true,
    isConfigured: true,
  },
  zitadelOidc: {
    issuer: 'https://auth.mesinafarms.com',
    clientId: 'mesina-web-client-2026',
    clientSecret: '••••••••••••',
    redirectUri: 'https://mesinafarms.com/connect/admin/callback',
    scopes: 'openid profile email roles',
    enabled: false,
  },
  cloudflareD1Config: {
    databaseId: 'mesina-farms-hito-d1',
    databaseName: 'mesina_farms_db',
    accountId: 'cf-mesina-aquaculture-2026',
    isConnected: true,
    lastSyncedAt: new Date().toISOString(),
    mode: 'cloudflare-d1',
    tablesCount: 8,
  },
};

export const INITIAL_INQUIRIES: CustomerInquiry[] = [
  {
    id: 'inq-101',
    fullName: 'Ronaldo Dela Cruz',
    email: 'ronaldo.delacruz@gmail.com',
    phone: '+63 917 554 1289',
    location: 'Bustos, Bulacan',
    productId: 'prod-standard-2',
    productName: 'Standard Grow-out',
    sizePreference: '2.5 - 3.5 inches',
    quantity: 5000,
    estimatedPricePerPiece: 3.40,
    estimatedTotalPhp: 17000,
    preferredDate: '2026-09-15',
    fulfillmentType: 'delivery',
    notes: 'Please pack in 500-pcs per oxygenated transport bag. Tarpaulin ponds prepared.',
    status: 'pending',
    contacted: false,
    createdAt: '2026-09-06T14:20:00.000Z',
  },
  {
    id: 'inq-102',
    fullName: 'Engr. Carmelita Mendoza',
    email: 'c.mendoza.farms@yahoo.com',
    phone: '+63 928 661 9043',
    location: 'Candaba, Pampanga',
    productId: 'prod-advance-3',
    productName: 'Advance Stocker',
    sizePreference: '4.0 - 5.0 inches',
    quantity: 10000,
    estimatedPricePerPiece: 4.90,
    estimatedTotalPhp: 49000,
    preferredDate: '2026-09-12',
    fulfillmentType: 'pickup',
    notes: 'Will bring 2 live fish transport tanks with aerators on pickup truck.',
    status: 'contacted',
    contacted: true,
    contactedBy: 'Jojo Mesina',
    contactedAt: '2026-09-06T16:00:00.000Z',
    createdAt: '2026-09-05T11:15:00.000Z',
  },
  {
    id: 'inq-103',
    fullName: 'Mateo Alcantara',
    email: 'mateo_alcantara@outlook.ph',
    phone: '+63 945 882 1190',
    location: 'Tarlac City, Tarlac',
    productId: 'prod-starter-1',
    productName: 'Starter Fingerlings',
    sizePreference: '1.5 - 2.0 inches',
    quantity: 3000,
    estimatedPricePerPiece: 2.40,
    estimatedTotalPhp: 7200,
    preferredDate: '2026-09-20',
    fulfillmentType: 'delivery',
    notes: 'First time grower, would appreciate water conditioning instructions.',
    status: 'fulfilled',
    contacted: true,
    contactedBy: 'Jojo Mesina',
    contactedAt: '2026-09-04T10:30:00.000Z',
    createdAt: '2026-09-03T15:45:00.000Z',
  },
];

export const INITIAL_MONTHLY_SALES: MonthlySalesReport[] = [
  { month: 'Apr', year: 2026, fingerlingsSold: 125000, inquiryCount: 42, estimatedRevenuePhp: 437500, topProduct: 'Standard Grow-out' },
  { month: 'May', year: 2026, fingerlingsSold: 148000, inquiryCount: 56, estimatedRevenuePhp: 518000, topProduct: 'Standard Grow-out' },
  { month: 'Jun', year: 2026, fingerlingsSold: 165000, inquiryCount: 61, estimatedRevenuePhp: 577500, topProduct: 'Starter Fingerlings' },
  { month: 'Jul', year: 2026, fingerlingsSold: 190000, inquiryCount: 74, estimatedRevenuePhp: 665000, topProduct: 'Standard Grow-out' },
  { month: 'Aug', year: 2026, fingerlingsSold: 215000, inquiryCount: 88, estimatedRevenuePhp: 752500, topProduct: 'Advance Stocker' },
  { month: 'Sep', year: 2026, fingerlingsSold: 132000, inquiryCount: 49, estimatedRevenuePhp: 462000, topProduct: 'Standard Grow-out' },
];

export const INITIAL_VISITOR_LOCATIONS: VisitorLocation[] = [
  { region: 'Central Luzon (Pampanga, Bulacan, Nueva Ecija)', country: 'Philippines', count: 4820, percentage: 48.2 },
  { region: 'CALABARZON (Laguna, Batangas, Quezon)', country: 'Philippines', count: 2310, percentage: 23.1 },
  { region: 'Metro Manila (NCR)', country: 'Philippines', count: 1450, percentage: 14.5 },
  { region: 'Ilocos Region & Pangasinan', country: 'Philippines', count: 820, percentage: 8.2 },
  { region: 'Western Visayas (Iloilo, Negros)', country: 'Philippines', count: 410, percentage: 4.1 },
  { region: 'Overseas & Other Inquiries', country: 'Global / OFW', count: 190, percentage: 1.9 },
];

export const INITIAL_ADMIN_USERS: AdminUser[] = [
  {
    id: 'admin-super-1',
    username: 'super',
    email: 'super@mesinafarms.com',
    fullName: 'Super Administrator',
    role: 'super_admin',
    permissions: {
      canManageInventory: true,
      canManageCatalog: true,
      canManageInquiries: true,
      canManageBlogs: true,
      canManageHomepage: true,
      canManageLocationHours: true,
      canManageSystemSettings: true,
    },
    createdAt: '2026-01-01T00:00:00.000Z',
  },
  {
    id: 'admin-jojo-2',
    username: 'jojomesina',
    email: 'jojomesina@icloud.com',
    fullName: 'Jojo Mesina',
    role: 'super_admin',
    permissions: {
      canManageInventory: true,
      canManageCatalog: true,
      canManageInquiries: true,
      canManageBlogs: true,
      canManageHomepage: true,
      canManageLocationHours: true,
      canManageSystemSettings: true,
    },
    createdAt: '2026-01-02T00:00:00.000Z',
  },
  {
    id: 'admin-mod-3',
    username: 'moderator1',
    email: 'moderator@mesinafarms.com',
    fullName: 'Farm Operations Moderator',
    role: 'moderator',
    permissions: {
      canManageInventory: true,
      canManageCatalog: false,
      canManageInquiries: true,
      canManageBlogs: true,
      canManageHomepage: false,
      canManageLocationHours: false,
      canManageSystemSettings: false,
    },
    createdAt: '2026-03-15T00:00:00.000Z',
  },
];
