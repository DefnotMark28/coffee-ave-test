import { Product, VehicleQueueItem, UserNotification } from '../types';

export const PRODUCTS: Product[] = [
  // Best Sellers & Coffee Drinks
  {
    id: 'prod-latte-spanish',
    name: 'Spanish Oat Latte',
    category: 'coffee',
    price: 195,
    description: 'Signature espresso pulled over condensed oat milk and silky textured foam, finished with a dash of Ceylon cinnamon.',
    tag: 'BEST SELLER',
    tagColor: 'gold',
    imageUrl: 'https://images.unsplash.com/photo-1541167760496-1628856ab772?auto=format&fit=crop&w=600&q=80',
    imageFallbackGradient: 'from-[#3b2314] via-[#5c371d] to-[#1c120c]',
    isWashPackage: false,
    options: [
      { label: 'Temperature', choices: ['Iced (Recommended)', 'Hot'] },
      { label: 'Sweetness', choices: ['Standard (100%)', 'Subtle (50%)', 'No Added Sugar'] }
    ]
  },
  {
    id: 'prod-cold-brew',
    name: 'Artisanal Cold Brew',
    category: 'coffee',
    price: 180,
    description: '18-hour slow steeped micro-lot single origin beans from Benguet, presenting chocolate and citrus notes over clear ice sphere.',
    tag: 'FRESH DAILY',
    tagColor: 'emerald',
    imageUrl: 'https://images.unsplash.com/photo-1517701550927-30cf4ba1dba5?auto=format&fit=crop&w=600&q=80',
    imageFallbackGradient: 'from-[#1e130c] via-[#331c10] to-[#120a06]',
    isWashPackage: false,
    options: [
      { label: 'Style', choices: ['Black On The Rocks', 'Sweet Cream Float', 'Tonic Spritz'] }
    ]
  },
  {
    id: 'prod-pistachio-croissant',
    name: 'Pistachio Croissant',
    category: 'bakery',
    price: 185,
    description: 'House-laminated 72-layer butter pastry stuffed with Sicilian pistachio praline cream and toasted crushed emerald nuts.',
    tag: 'BEST SELLER',
    tagColor: 'gold',
    imageUrl: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&w=600&q=80',
    imageFallbackGradient: 'from-[#423318] via-[#2c220f] to-[#171209]',
    isWashPackage: false,
    options: [
      { label: 'Preparation', choices: ['Warmed & Crispy', 'Room Temperature'] }
    ]
  },
  {
    id: 'prod-smoked-salmon-bagel',
    name: 'Smoked Salmon Bagel',
    category: 'bakery',
    price: 290,
    description: 'Toasted seeded sourdough bagel, Norwegian dill-cured lox, whipped scallion cream cheese, capers, and pickled shallots.',
    tag: 'NEW ITEM',
    tagColor: 'crimson',
    imageUrl: 'https://images.unsplash.com/photo-1519869325930-281384150729?auto=format&fit=crop&w=600&q=80',
    imageFallbackGradient: 'from-[#442b1a] via-[#311f13] to-[#1a110a]',
    isWashPackage: false,
  },
  {
    id: 'prod-flat-white',
    name: 'Auto Ave Flat White',
    category: 'coffee',
    price: 175,
    description: 'Double ristretto with microfoam velvety milk, served in an insulated matte stoneware tumbler.',
    imageUrl: 'https://images.unsplash.com/photo-1577968897966-3d4325b36b61?auto=format&fit=crop&w=600&q=80',
    imageFallbackGradient: 'from-[#2a1b12] via-[#482d1c] to-[#19100a]',
    isWashPackage: false,
    options: [
      { label: 'Milk Choice', choices: ['Whole Dairy', 'Barista Oat (+₱30)', 'Almond (+₱30)'] }
    ]
  },
  {
    id: 'prod-affogato',
    name: 'Smoked Vanilla Affogato',
    category: 'features',
    price: 210,
    description: 'Madagascar bourbon vanilla bean gelato drowned in a freshly extracted double shot of dark-roasted blend.',
    tag: 'NEW ITEM',
    tagColor: 'crimson',
    imageUrl: 'https://images.unsplash.com/photo-1594631252845-29fc4cc8cde9?auto=format&fit=crop&w=600&q=80',
    imageFallbackGradient: 'from-[#3c2816] via-[#291a0c] to-[#120b05]',
    isWashPackage: false,
  },

  // Wash Packages
  {
    id: 'wash-premium-spa',
    name: 'Premium Spa Wash',
    category: 'exterior',
    price: 450,
    description: 'Two-bucket hand wash with active pH-neutral snow foam, deep wheel decontamination, tire dressing, and ultra-plush microfiber air dry.',
    tag: 'BEST SELLER',
    tagColor: 'gold',
    imageUrl: 'https://images.unsplash.com/photo-1601362840469-51e4d8d58785?auto=format&fit=crop&w=600&q=80',
    imageFallbackGradient: 'from-[#112437] via-[#0b1824] to-[#071017]',
    isWashPackage: true,
    estimatedTime: '30 mins',
    options: [
      { label: 'Vehicle Class', choices: ['Sedan / Compact', 'Midsize SUV (+₱100)', 'Full Van / Pickup (+₱150)'] }
    ]
  },
  {
    id: 'wash-ultimate-interior',
    name: 'Ultimate Interior Detail',
    category: 'interior',
    price: 850,
    description: 'Deep high-temperature steam sterilization, leather conditioner massage, AC ozone purifier treatment, and triple-filtered HEPA vacuuming.',
    tag: 'BEST SELLER',
    tagColor: 'gold',
    imageUrl: 'https://images.unsplash.com/photo-1520340356584-f9917d1eea6f?auto=format&fit=crop&w=600&q=80',
    imageFallbackGradient: 'from-[#2b1717] via-[#1a0e0e] to-[#0d0707]',
    isWashPackage: true,
    estimatedTime: '45 mins',
    options: [
      { label: 'Vehicle Class', choices: ['Sedan / Compact', 'Midsize SUV (+₱150)', 'Full Van / 7-Seater (+₱250)'] }
    ]
  },
  {
    id: 'wash-ceramic-hydro',
    name: 'Ceramic Hydro Shield Wax',
    category: 'exterior',
    price: 750,
    description: 'Full exterior decontamination wash followed by machine spray coating with SiO2 ceramic sealant for 90-day mirror gloss and extreme hydrophobicity.',
    tag: 'NEW ITEM',
    tagColor: 'crimson',
    imageUrl: 'https://images.unsplash.com/photo-1507136566006-cfc505b114fc?auto=format&fit=crop&w=600&q=80',
    imageFallbackGradient: 'from-[#1c2430] via-[#121921] to-[#090e14]',
    isWashPackage: true,
    estimatedTime: '40 mins',
    options: [
      { label: 'Vehicle Class', choices: ['Sedan / Compact', 'Midsize SUV (+₱120)', 'Full Van / Pickup (+₱180)'] }
    ]
  },
  {
    id: 'wash-complete-combo',
    name: 'The Full Ave Experience (Wash + Interior + Coffee)',
    category: 'features',
    price: 1199,
    description: 'Complete bumper-to-bumper detailing: Premium exterior foam wash, steam interior cleanse, glass sealant, plus any 2 specialty café drinks of your choice.',
    tag: 'BEST SELLER',
    tagColor: 'gold',
    imageUrl: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=600&q=80',
    imageFallbackGradient: 'from-[#381a17] via-[#22100e] to-[#120807]',
    isWashPackage: true,
    estimatedTime: '60 mins',
    options: [
      { label: 'Vehicle Class', choices: ['Sedan / Compact', 'Midsize SUV (+₱200)', 'Full Van / Pickup (+₱300)'] }
    ]
  },
  {
    id: 'wash-engine-bay',
    name: 'Precision Engine Bay Detailing',
    category: 'interior',
    price: 650,
    description: 'Safe dry-steam cleaning of engine bay components, grease degreasing, electrical harness masking, and non-greasy satin rubber conditioning.',
    imageUrl: 'https://images.unsplash.com/photo-1486006920555-c77dce18193b?auto=format&fit=crop&w=600&q=80',
    imageFallbackGradient: 'from-[#2b2b2b] via-[#1a1a1a] to-[#0d0d0d]',
    isWashPackage: true,
    estimatedTime: '35 mins',
  },
  {
    id: 'wash-unli-pass',
    name: 'Auto Ave Unli-Wash Monthly VIP',
    category: 'features',
    price: 2499,
    description: 'Unlimited exterior washes for 30 days, express bay queue access, 15% discount on all coffee and lounge items, and complimentary cupping passes.',
    tag: 'VIP EXCLUSIVE',
    tagColor: 'gold',
    imageUrl: 'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&w=600&q=80',
    imageFallbackGradient: 'from-[#423214] via-[#241a08] to-[#140e03]',
    isWashPackage: true,
    estimatedTime: 'Instant Activation',
  }
];

export const INITIAL_VEHICLES: VehicleQueueItem[] = [
  {
    id: 'veh-1',
    plateNumber: 'NDE 4821',
    vehicleModel: 'Toyota GR Yaris',
    vehicleColor: 'Pearl White',
    colorHex: '#f3f4f6',
    servicePackage: 'Premium Spa Wash + Hydro Coat',
    startTime: '16:35',
    estimatedDuration: '30 min',
    stage: 2,
    stageName: 'Cleaning & Prep',
    stageProgressPercent: 68,
    bayNumber: 2,
    customerName: 'Marcus T.',
    cafeOrderLinked: '1x Spanish Oat Latte (Table 04)',
    drinkStatus: 'Served at Table',
    tableNumber: 'Table 04'
  },
  {
    id: 'veh-2',
    plateNumber: 'CBD 9024',
    vehicleModel: 'Mazda 3 Hatchback',
    vehicleColor: 'Soul Red Crystal',
    colorHex: '#991b1b',
    servicePackage: 'Ultimate Interior Detail',
    startTime: '16:20',
    estimatedDuration: '45 min',
    stage: 2,
    stageName: 'Cleaning & Prep',
    stageProgressPercent: 85,
    bayNumber: 3,
    customerName: 'Aileen R.',
    cafeOrderLinked: '1x Artisanal Cold Brew, 1x Pistachio Croissant',
    drinkStatus: 'Served at Table',
    tableNumber: 'Lounge Seat B'
  },
  {
    id: 'veh-3',
    plateNumber: 'NEO 7710',
    vehicleModel: 'Honda Civic Type R (FL5)',
    vehicleColor: 'Championship White',
    colorHex: '#f8fafc',
    servicePackage: 'The Full Ave Experience',
    startTime: '16:05',
    estimatedDuration: '55 min',
    stage: 3,
    stageName: 'Ready for Pickup',
    stageProgressPercent: 100,
    bayNumber: 1,
    customerName: 'Kenneth Tan',
    cafeOrderLinked: '2x Auto Ave Flat White',
    drinkStatus: 'Served at Table',
    tableNumber: 'Terrace 01'
  },
  {
    id: 'veh-4',
    plateNumber: 'NBX 3190',
    vehicleModel: 'Ford Everest Titanium',
    vehicleColor: 'Meteor Grey',
    colorHex: '#4b5563',
    servicePackage: 'Premium Spa Wash (SUV)',
    startTime: '16:48',
    estimatedDuration: '35 min',
    stage: 1,
    stageName: 'Preparing',
    stageProgressPercent: 25,
    bayNumber: 4,
    customerName: 'Dave Reyes',
    cafeOrderLinked: '1x Spanish Oat Latte',
    drinkStatus: 'Brewing',
    tableNumber: 'Workstation 08'
  },
  {
    id: 'veh-5',
    plateNumber: 'NBP 5521',
    vehicleModel: 'BMW 330i M-Sport',
    vehicleColor: 'Portimao Blue',
    colorHex: '#1d4ed8',
    servicePackage: 'Ceramic Hydro Shield Wax',
    startTime: '16:52',
    estimatedDuration: '40 min',
    stage: 1,
    stageName: 'Preparing',
    stageProgressPercent: 15,
    bayNumber: 2,
    customerName: 'Patricia G.',
    cafeOrderLinked: '1x Smoked Salmon Bagel',
    drinkStatus: 'Brewing',
    tableNumber: 'Table 06'
  },
  {
    id: 'veh-6',
    plateNumber: 'DAQ 8820',
    vehicleModel: 'Subaru WRX STI',
    vehicleColor: 'World Rally Blue',
    colorHex: '#2563eb',
    servicePackage: 'The Full Ave Experience',
    startTime: '15:50',
    estimatedDuration: '60 min',
    stage: 3,
    stageName: 'Ready for Pickup',
    stageProgressPercent: 100,
    bayNumber: 1,
    customerName: 'Ramon V.',
    cafeOrderLinked: '1x Flat White',
    drinkStatus: 'Served at Table',
    tableNumber: 'Bar Counter 03'
  }
];

export const INITIAL_NOTIFICATIONS: UserNotification[] = [
  {
    id: 'notif-1',
    title: 'Vehicle Status Update',
    message: 'Your vehicle (NDE 4821) has entered Stage 2: High-Pressure Snow Foam & Underchassis Rinse.',
    time: '2 mins ago',
    read: false,
    type: 'wash'
  },
  {
    id: 'notif-2',
    title: 'Café Order Ready',
    message: 'Spanish Oat Latte has been delivered to Table 04 by Barista Team.',
    time: '8 mins ago',
    read: false,
    type: 'cafe'
  },
  {
    id: 'notif-3',
    title: 'Unli-Wash Privilege',
    message: 'Welcome back to Coffee Ave, Nieves Hills! Double loyalty points active today.',
    time: '1 hour ago',
    read: true,
    type: 'promo'
  }
];

export const TESTIMONIALS = [
  {
    quote: "Waiting for a detailing session used to mean sitting on a plastic bench breathing exhaust fumes. At Coffee Ave, I get work done with single-origin pour-overs while watching my GR Yaris get pampered on the live bay stream.",
    name: "Kenneth Tan",
    subtitle: "Rizal Auto Enthusiast Club / Daily Patron",
    vehicle: "Toyota GR Yaris"
  },
  {
    quote: "The unified ordering is genius. I punch in my plate number, order an iced Spanish latte and a pistachio croissant, and the barista brings it straight to my lounge table while my SUV gets a spotless hand wash.",
    name: "Maria Santos",
    subtitle: "Angono Resident & Architecture Studio Lead",
    vehicle: "Mazda CX-5"
  },
  {
    quote: "The unli-wash subscription at Nieves Hills is worth every peso. Their DI water wash ensures zero water spots, and the master detailers treat every car like their own. Plus, the coffee easily beats commercial chains.",
    name: "Engr. Dave Reyes",
    subtitle: "Civic Type R Owner / VIP Member",
    vehicle: "Honda Civic Type R"
  }
];
