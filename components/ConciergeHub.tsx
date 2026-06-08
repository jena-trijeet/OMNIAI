"use client";
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Utensils,
  MapPin,
  Search,
  Calendar,
  Clock,
  Star,
  ChevronRight,
  History,
  Sparkles,
  Zap,
  Globe,
  Plus,
  X,
  CheckCircle2,
  AlertTriangle,
  Loader2,
  Send,
  SlidersHorizontal,
  DollarSign,
  Compass,
  MessageSquare,
  Trash2,
  Info,
  Volume2,
  VolumeX,
  ShoppingBag,
  ShoppingCart,
  Tag,
  CreditCard,
  Package,
  Hotel,
  CalendarDays,
  Percent,
} from 'lucide-react';
import { cn } from '@/lib/utils';

const SHEET_URL =
  'https://script.google.com/macros/s/AKfycby7QFcZ8O4n65Kp3MaFCT96Q_M_GZ-aKKITgs2GEvcK0yTnRDBvaa3Z0sOnGUGYUul-/exec';

// --- Types ---
interface Restaurant {
  id: string;
  name: string;
  cuisine: string;
  rating: number;
  priceRange: string;
  location: string;
  availability: string;
  accentColor: string; // hex or theme color for neon glows
  distance: string;
  description: string;
  signatureDish: string;
  gradient: string;
  availableTimes: string[];
  image?: string;
  pricePerPerson?: number;
  upiId?: string;
}

interface HotelEntity {
  id: string;
  name: string;
  rating: number;
  priceRange: string; // $$$$
  location: string;
  availability: string;
  accentColor: string;
  distance: string;
  description: string;
  signatureSuite: string;
  gradient: string;
  suites: string[];
  ratePerNight: number;
  image?: string;
  upiId?: string;
}

interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
  accentColor: string;
  deliveryTime: string;
  specs: string[];
  category: string;
  gradient: string;
}

interface CartItem {
  product: Product;
  quantity: number;
}

interface Order {
  id: string;
  items: CartItem[];
  totalPrice: number;
  date: string;
  status: 'processing' | 'synthesizing' | 'dispatched' | 'delivered';
  receiptHash: string;
  paymentMethod?: 'cod' | 'upi';
  upiId?: string;
}

interface Reservation {
  id: string;
  restaurant: string; // or hotel name
  date: string;
  time: string;
  guests: number;
  notes: string;
  status: 'confirmed' | 'pending' | 'cancelled';
  timestamp: string;
  type?: 'restaurant' | 'hotel';
  hotelSuite?: string;
  endDate?: string;
  paymentMethod?: 'coa' | 'cod' | 'upi';
  userName?: string;
  userEmail?: string;
  userPhone?: string;
  price?: number;
  upiId?: string;
}

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

type SyncStatus = 'idle' | 'loading' | 'live' | 'offline';


// --- Mock Datasets ---
const PRESETS_RESTAURANTS: Restaurant[] = [
  {
    id: 'nobu',
    name: 'Nobu Malibu',
    cuisine: 'Japanese Fusion',
    rating: 4.8,
    priceRange: '$$$$',
    location: 'Pacific Coast Hwy, Malibu',
    availability: 'Available Tonight',
    accentColor: 'from-[#a855f7] to-[#ec4899]', // Purple-pink neon
    distance: '1.2 miles',
    description: 'World-renowned Japanese-Peruvian cuisine overlooking the crashing waves of the Pacific Ocean.',
    signatureDish: 'Black Cod with Miso',
    gradient: 'linear-gradient(135deg, rgba(168, 85, 247, 0.15) 0%, rgba(236, 72, 153, 0.05) 100%)',
    availableTimes: ['18:30', '20:30', '21:30'],
    image: '/restaurant_hero.png',
    pricePerPerson: 150
  },
  {
    id: 'ambroisie',
    name: "L'Ambroisie",
    cuisine: 'Modern French',
    rating: 4.9,
    priceRange: '$$$$',
    location: 'Place des Vosges, Paris',
    availability: 'Available Friday',
    accentColor: 'from-[#06b6d4] to-[#3b82f6]', // Cyan-blue neon
    distance: '0.4 miles',
    description: 'Three-star Michelin gastronomy curated inside a historic, candlelit Parisian townhome.',
    signatureDish: 'Wild Sea Bass with Caviar',
    gradient: 'linear-gradient(135deg, rgba(6, 182, 212, 0.15) 0%, rgba(59, 130, 246, 0.05) 100%)',
    availableTimes: ['19:00', '20:00', '21:00'],
    image: 'https://image.pollinations.ai/prompt/lambroisie_paris_french_luxury_restaurant_candlelight?width=600&height=400&nologo=true&seed=99',
    pricePerPerson: 250
  },
  {
    id: 'osteria',
    name: 'Osteria Francescana',
    cuisine: 'Modern Italian',
    rating: 4.9,
    priceRange: '$$$$',
    location: 'Via Stella, Modena',
    availability: 'Limited Tables',
    accentColor: 'from-[#10b981] to-[#059669]', // Emerald neon
    distance: '2.5 miles',
    description: 'An avant-garde exploration of traditional Italian ingredients and culinary history.',
    signatureDish: 'Oops! I Dropped the Lemon Tart',
    gradient: 'linear-gradient(135deg, rgba(16, 185, 129, 0.15) 0%, rgba(5, 150, 105, 0.05) 100%)',
    availableTimes: ['18:00', '19:30', '21:00'],
    image: 'https://image.pollinations.ai/prompt/osteria_francescana_italian_luxury_restaurant?width=600&height=400&nologo=true&seed=101',
    pricePerPerson: 180
  },
  {
    id: 'sublimotion',
    name: 'SubliMotion',
    cuisine: 'Cyber-Sensory',
    rating: 5.0,
    priceRange: '$$$$',
    location: 'Playa d\'en Bossa, Ibiza',
    availability: 'Exclusive Seating',
    accentColor: 'from-[#ec4899] to-[#f43f5e]', // Pink-rose neon
    distance: '4.8 miles',
    description: 'A molecular multi-sensory journey blending digital art, virtual reality, and elite dining.',
    signatureDish: 'Aerosolized Truffle Infusion',
    gradient: 'linear-gradient(135deg, rgba(236, 72, 153, 0.15) 0%, rgba(244, 63, 94, 0.05) 100%)',
    availableTimes: ['20:00', '21:00', '22:00'],
    image: 'https://image.pollinations.ai/prompt/sublimotion_ibiza_cyber_sensory_molecular_dining_hologram?width=600&height=400&nologo=true&seed=42',
    pricePerPerson: 350
  },
  {
    id: 'atomix',
    name: 'Atomix',
    cuisine: 'Progressive Korean',
    rating: 4.8,
    priceRange: '$$$$',
    location: 'E 30th St, New York',
    availability: 'Available Thursday',
    accentColor: 'from-[#f59e0b] to-[#ec4899]', // Orange-pink neon
    distance: '3.1 miles',
    description: 'A multi-course tasting menu exploring the depths of Korean heritage with modern techniques.',
    signatureDish: 'Sea Bream with Nurungji',
    gradient: 'linear-gradient(135deg, rgba(245, 158, 11, 0.15) 0%, rgba(236, 72, 153, 0.05) 100%)',
    availableTimes: ['19:00', '20:30', '22:00'],
    image: 'https://image.pollinations.ai/prompt/atomix_progressive_korean_restaurant?width=600&height=400&nologo=true&seed=55',
    pricePerPerson: 220
  },
  {
    id: 'etxebarri',
    name: 'Asador Etxebarri',
    cuisine: 'Artisanal Wood Fire',
    rating: 4.7,
    priceRange: '$$$',
    location: 'Axpe, Basque Country',
    availability: 'Available Tomorrow',
    accentColor: 'from-[#ef4444] to-[#f59e0b]', // Red-orange neon
    distance: '6.4 miles',
    description: 'Every ingredient is kissed by custom artisanal coals harvested from selected native woods.',
    signatureDish: 'Flame-Grilled Kokotxas',
    gradient: 'linear-gradient(135deg, rgba(239, 68, 68, 0.15) 0%, rgba(245, 158, 11, 0.05) 100%)',
    availableTimes: ['13:00', '14:30', '15:30'],
    image: 'https://image.pollinations.ai/prompt/asador_etxebarri_basque_woodfire_dining_luxury?width=600&height=400&nologo=true&seed=77',
    pricePerPerson: 150
  }
];

const INITIAL_MOCK_RESERVATIONS: Reservation[] = [
  {
    id: 'res-1',
    restaurant: 'Nobu Malibu',
    date: '2026-05-24',
    time: '20:30',
    guests: 2,
    notes: 'Requesting a window seat facing the shoreline.',
    status: 'confirmed',
    timestamp: 'CONFIRMED',
    type: 'restaurant',
    price: 300
  },
  {
    id: 'res-2',
    restaurant: 'SubliMotion',
    date: '2026-06-12',
    time: '21:00',
    guests: 4,
    notes: 'An anniversary celebration. AI instruction set: sensory level high.',
    status: 'pending',
    timestamp: 'PENDING',
    type: 'restaurant',
    price: 1400
  }
];

const PRESETS_HOTELS: HotelEntity[] = [
  {
    id: 'aman-tokyo',
    name: 'Aman Tokyo',
    rating: 4.9,
    priceRange: '$$$$',
    location: 'Chiyoda-ku, Tokyo',
    availability: 'Available Tonight',
    accentColor: 'from-[#00D1FF] to-[#3b82f6]',
    distance: '0.8 miles',
    description: 'An urban sanctuary high above Tokyo, blending traditional Japanese minimalism with premium modern luxury.',
    signatureSuite: 'Aman Suite (Panoramic City View)',
    gradient: 'linear-gradient(135deg, rgba(0, 209, 255, 0.15) 0%, rgba(59, 130, 246, 0.05) 100%)',
    suites: ['Deluxe Room', 'Premier Suite', 'Aman Suite'],
    ratePerNight: 1450,
    image: '/hotel_hero.png'
  },
  {
    id: 'ritz-paris',
    name: 'Ritz Paris',
    rating: 4.9,
    priceRange: '$$$$',
    location: 'Place Vendôme, Paris',
    availability: 'Available Tomorrow',
    accentColor: 'from-[#a855f7] to-[#ec4899]',
    distance: '0.3 miles',
    description: 'The epitome of French elegance and historic grandeur. Experience the legendary service in the heart of Paris.',
    signatureSuite: 'Coco Chanel Suite (Imperial Luxury)',
    gradient: 'linear-gradient(135deg, rgba(168, 85, 247, 0.15) 0%, rgba(236, 72, 153, 0.05) 100%)',
    suites: ['Superior Room', 'Chopin Suite', 'Coco Chanel Suite'],
    ratePerNight: 1800,
    image: 'https://image.pollinations.ai/prompt/ritz_paris_luxury_french_suite_vendome?width=600&height=400&nologo=true&seed=2'
  },
  {
    id: 'burj-al-arab',
    name: 'Burj Al Arab',
    rating: 5.0,
    priceRange: '$$$$',
    location: 'Jumeirah Beach, Dubai',
    availability: 'Exclusive Rooms',
    accentColor: 'from-[#10b981] to-[#059669]',
    distance: '3.6 miles',
    description: 'A global icon of Arabian luxury. Spanned across its own private island with personal butler services.',
    signatureSuite: 'Royal Suite (Gold-Leaf Finishes)',
    gradient: 'linear-gradient(135deg, rgba(16, 185, 129, 0.15) 0%, rgba(5, 150, 105, 0.05) 100%)',
    suites: ['Deluxe Marina Suite', 'Sky One Bedroom Suite', 'Royal Suite'],
    ratePerNight: 2100,
    image: 'https://image.pollinations.ai/prompt/burj_al_arab_dubai_luxury_hotel_suite?width=600&height=400&nologo=true&seed=3'
  },
  {
    id: 'amangiri-utah',
    name: 'Amangiri Utah',
    rating: 4.8,
    priceRange: '$$$$',
    location: 'Canyon Point, Utah',
    availability: 'Available Friday',
    accentColor: 'from-[#f59e0b] to-[#ec4899]',
    distance: '5.2 miles',
    description: 'A starkly beautiful desert sanctuary built around an iconic canyon pool, showcasing nature at its most dramatic.',
    signatureSuite: 'Mesa View Suite (Desert Vista)',
    gradient: 'linear-gradient(135deg, rgba(245, 158, 11, 0.15) 0%, rgba(236, 72, 153, 0.05) 100%)',
    suites: ['Desert Suite', 'Mesa View Suite', 'Girijaala Suite'],
    ratePerNight: 1950,
    image: 'https://image.pollinations.ai/prompt/amangiri_utah_luxury_desert_resort?width=600&height=400&nologo=true&seed=4'
  }
];

const PRESETS_PRODUCTS: Product[] = [
  {
    id: 'omnihud-glasses',
    name: 'OmniHUD Cybernetic Glasses',
    price: 1200,
    description: 'Lightweight AR smart-eyewear providing real-time AI retinal projections, contextual maps, and live speech translation.',
    accentColor: 'from-[#00D1FF] to-[#3b82f6]',
    deliveryTime: '2 Days Delivery',
    specs: ['Micro-LED Retinal Projection', 'Zero-Latency AI Voice Companion', 'Ultralight Titanium Frame'],
    category: 'Wearables',
    gradient: 'linear-gradient(135deg, rgba(0, 209, 255, 0.15) 0%, rgba(59, 130, 246, 0.05) 100%)'
  },
  {
    id: 'aurasound-headset',
    name: 'AuraSound Spatial Headset',
    price: 450,
    description: 'Ultra-frequency spatial audio headset using bone conduction technology and dynamic multi-channel acoustic filters.',
    accentColor: 'from-[#a855f7] to-[#ec4899]',
    deliveryTime: 'Next Day Delivery',
    specs: ['Dual Bone Conduction Transducers', 'Real-Time Neural ANC (99.2%)', 'Bio-Metric Heart & Temp Monitoring'],
    category: 'Audio',
    gradient: 'linear-gradient(135deg, rgba(168, 85, 247, 0.15) 0%, rgba(236, 72, 153, 0.05) 100%)'
  },
  {
    id: 'chronosync-watch',
    name: 'ChronoSync Quantum Wrist Watch',
    price: 3200,
    description: 'The ultimate luxury timepiece syncing automatically to quantum atomic nodes. Features a customizable 3D holographic interface.',
    accentColor: 'from-[#10b981] to-[#059669]',
    deliveryTime: '3 Days Delivery',
    specs: ['Quantum Atomic Node Synchronization', '3D Holographic Dial Projector', 'Hand-Crafted Carbon Fiber Shell'],
    category: 'Watches',
    gradient: 'linear-gradient(135deg, rgba(16, 185, 129, 0.15) 0%, rgba(5, 150, 105, 0.05) 100%)'
  },
  {
    id: 'synapse-ring',
    name: 'Synapse Neural Tracking Ring',
    price: 350,
    description: 'Sleek smart-ring built with aerospace-grade ceramic. Monitors neural fatigue patterns, skin hydration, and micro-movements.',
    accentColor: 'from-[#f59e0b] to-[#ec4899]',
    deliveryTime: 'Next Day Delivery',
    specs: ['Neural Fatigue Monitoring Swarm', 'OmniAI Instant Payment Node', 'Aerospace Hypoallergenic Ceramic'],
    category: 'Health & Fitness',
    gradient: 'linear-gradient(135deg, rgba(245, 158, 11, 0.15) 0%, rgba(236, 72, 153, 0.05) 100%)'
  }
];

const INITIAL_MOCK_ORDERS: Order[] = [
  {
    id: 'order-9481',
    items: [
      { product: PRESETS_PRODUCTS[0], quantity: 1 },
      { product: PRESETS_PRODUCTS[3], quantity: 1 }
    ],
    totalPrice: 1550,
    date: '2026-05-22',
    status: 'synthesizing',
    receiptHash: '0x8f2d5e9c1b6a3f47c8d9e0b1a2c3d4e5f6a7b8c9',
    paymentMethod: 'cod'
  }
];

export function ConciergeHub() {
  const [nodeMode, setNodeMode] = useState<'restaurants' | 'hotels' | 'shopping' | 'management'>('restaurants');
  const [activeTab, setActiveTab] = useState<'discover' | 'reservations' | 'admin'>('discover');
  
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [hotels, setHotels] = useState<HotelEntity[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [reservations, setReservations] = useState<Reservation[]>([]);
  
  // Shopping Cart & Order States
  const [cart, setCart] = useState<CartItem[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  
  // Normalize an admin-registered hotel (partial shape) into a full HotelEntity
  const normalizeAdminHotel = (raw: any): HotelEntity => {
    if (!raw || typeof raw !== 'object') {
      raw = {};
    }
    const accentPalettes = [
      { accentColor: 'from-[#00D1FF] to-[#3b82f6]', gradient: 'linear-gradient(135deg, rgba(0, 209, 255, 0.15) 0%, rgba(59, 130, 246, 0.05) 100%)' },
      { accentColor: 'from-[#a855f7] to-[#ec4899]', gradient: 'linear-gradient(135deg, rgba(168, 85, 247, 0.15) 0%, rgba(236, 72, 153, 0.05) 100%)' },
      { accentColor: 'from-[#10b981] to-[#059669]', gradient: 'linear-gradient(135deg, rgba(16, 185, 129, 0.15) 0%, rgba(5, 150, 105, 0.05) 100%)' },
      { accentColor: 'from-[#f59e0b] to-[#ec4899]', gradient: 'linear-gradient(135deg, rgba(245, 158, 11, 0.15) 0%, rgba(236, 72, 153, 0.05) 100%)' },
    ];
    const rawIdStr = String(raw.id || '');
    const charCode = rawIdStr.charCodeAt(6);
    const code = isNaN(charCode) ? 0 : charCode;
    const palette = accentPalettes[Math.abs(code) % accentPalettes.length];

    // Build suite list from room types
    const suites: string[] = [];
    if (raw.singleRooms > 0) suites.push(`Single Room (${raw.singleRooms} available)`);
    if (raw.doubleRooms > 0) suites.push(`Double Room (${raw.doubleRooms} available)`);
    if (suites.length === 0 && raw.suites?.length > 0) suites.push(...raw.suites);
    if (suites.length === 0) suites.push('Standard Room');

    const lowestRate = Math.min(
      raw.singlePrice || raw.ratePerNight || 999,
      raw.doublePrice || raw.ratePerNight || 999
    );

    return {
      id: raw.id || `hotel-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      name: raw.name || 'Unnamed Hotel',
      rating: raw.rating || 4.5,
      priceRange: lowestRate >= 500 ? '$$$$' : lowestRate >= 200 ? '$$$' : '$$',
      location: raw.location || 'India',
      availability: 'Available Now',
      accentColor: raw.accentColor || palette.accentColor,
      distance: raw.distance || 'Nearby',
      description: raw.description || `${raw.name || 'This hotel'} offers comfortable accommodations. Book your stay directly through OMNIAI.`,
      signatureSuite: suites[0],
      gradient: raw.gradient || palette.gradient,
      suites,
      ratePerNight: raw.ratePerNight || lowestRate,
      singleRooms: raw.singleRooms || 0,
      singlePrice: raw.singlePrice || 0,
      doubleRooms: raw.doubleRooms || 0,
      doublePrice: raw.doublePrice || 0,
      image: raw.image,
      upiId: raw.upiId,
    } as HotelEntity & { singleRooms: number; singlePrice: number; doubleRooms: number; doublePrice: number };
  };

  useEffect(() => {
    const handleSyncChange = () => {
      try {
        const savedRes = localStorage.getItem('omniai_sync_restaurants');
        if (savedRes) {
          const parsed = JSON.parse(savedRes);
          if (Array.isArray(parsed)) {
            setRestaurants(parsed.filter((r: any) => r && typeof r === 'object'));
          } else {
            localStorage.setItem('omniai_sync_restaurants', JSON.stringify(PRESETS_RESTAURANTS));
            setRestaurants(PRESETS_RESTAURANTS);
          }
        } else {
          localStorage.setItem('omniai_sync_restaurants', JSON.stringify(PRESETS_RESTAURANTS));
          setRestaurants(PRESETS_RESTAURANTS);
        }
        
        const savedHotels = localStorage.getItem('omniai_sync_hotels');
        if (savedHotels) {
          const rawHotels = JSON.parse(savedHotels);
          if (Array.isArray(rawHotels)) {
            // If the saved list has admin-registered hotels, normalize them all
            const normalized: HotelEntity[] = rawHotels
              .filter((h: any) => h && typeof h === 'object')
              .map((h: any) => {
                // If it already has all HotelEntity fields (preset) keep it, else normalize
                if (h.signatureSuite && h.accentColor && !h.singleRooms && !h.doubleRooms) return h;
                return normalizeAdminHotel(h);
              });
            setHotels(normalized);
          } else {
            localStorage.setItem('omniai_sync_hotels', JSON.stringify(PRESETS_HOTELS));
            setHotels(PRESETS_HOTELS);
          }
        } else {
          localStorage.setItem('omniai_sync_hotels', JSON.stringify(PRESETS_HOTELS));
          setHotels(PRESETS_HOTELS);
        }
        
        const savedProducts = localStorage.getItem('omniai_sync_products');
        if (savedProducts) {
          const parsed = JSON.parse(savedProducts);
          if (Array.isArray(parsed)) {
            setProducts(parsed);
          } else {
            localStorage.setItem('omniai_sync_products', JSON.stringify(PRESETS_PRODUCTS));
            setProducts(PRESETS_PRODUCTS);
          }
        } else {
          localStorage.setItem('omniai_sync_products', JSON.stringify(PRESETS_PRODUCTS));
          setProducts(PRESETS_PRODUCTS);
        }
        
        const savedReservations = localStorage.getItem('omniai_sync_reservations');
        if (savedReservations) {
          const parsed = JSON.parse(savedReservations);
          if (Array.isArray(parsed)) {
            setReservations(parsed.filter(r => r && typeof r === 'object' && r.id));
          } else {
            const base: Reservation[] = [
              ...INITIAL_MOCK_RESERVATIONS,
              {
                id: 'res-hotel-1',
                restaurant: 'Aman Tokyo',
                date: '2026-06-01',
                time: 'Check-in: 15:00',
                guests: 2,
                notes: 'Requesting the signature Aman Suite.',
                status: 'confirmed',
                timestamp: 'CONFIRMED',
                type: 'hotel',
                hotelSuite: 'Aman Suite',
                endDate: '2026-06-05',
                price: 5800
              }
            ];
            localStorage.setItem('omniai_sync_reservations', JSON.stringify(base));
            setReservations(base);
          }
        } else {
          const base: Reservation[] = [
            ...INITIAL_MOCK_RESERVATIONS,
            {
              id: 'res-hotel-1',
              restaurant: 'Aman Tokyo',
              date: '2026-06-01',
              time: 'Check-in: 15:00',
              guests: 2,
              notes: 'Requesting the signature Aman Suite.',
              status: 'confirmed',
              timestamp: 'CONFIRMED',
              type: 'hotel',
              hotelSuite: 'Aman Suite',
              endDate: '2026-06-05',
              price: 5800
            }
          ];
          localStorage.setItem('omniai_sync_reservations', JSON.stringify(base));
          setReservations(base);
        }

        const savedOrders = localStorage.getItem('omniai_sync_orders');
        if (savedOrders) {
          const parsed = JSON.parse(savedOrders);
          if (Array.isArray(parsed)) {
            setOrders(parsed);
          } else {
            localStorage.setItem('omniai_sync_orders', JSON.stringify(INITIAL_MOCK_ORDERS));
            setOrders(INITIAL_MOCK_ORDERS);
          }
        } else {
          localStorage.setItem('omniai_sync_orders', JSON.stringify(INITIAL_MOCK_ORDERS));
          setOrders(INITIAL_MOCK_ORDERS);
        }
      } catch (e) {
        console.error("Failed to sync storage", e);
      }
    };

    handleSyncChange();

    window.addEventListener('storage', handleSyncChange);
    window.addEventListener('omniai_admin_sync', handleSyncChange);

    // Highly resilient fallback polling interval to guarantee cross-window synchronization
    const syncInterval = setInterval(handleSyncChange, 1500);

    return () => {
      window.removeEventListener('storage', handleSyncChange);
      window.removeEventListener('omniai_admin_sync', handleSyncChange);
      clearInterval(syncInterval);
    };
  }, []);

  // Selected admin edit targets & category state
  const [selectedAdminCategory, setSelectedAdminCategory] = useState<'hotel' | 'restaurant' | 'product'>('hotel');
  const [selectedAdminId, setSelectedAdminId] = useState<string | null>(null);

  useEffect(() => {
    if (!selectedAdminId) {
      if (selectedAdminCategory === 'hotel' && hotels.length > 0) {
        setSelectedAdminId(hotels[0].id);
      } else if (selectedAdminCategory === 'restaurant' && restaurants.length > 0) {
        setSelectedAdminId(restaurants[0].id);
      } else if (selectedAdminCategory === 'product' && products.length > 0) {
        setSelectedAdminId(products[0].id);
      }
    } else {
      const exists = selectedAdminCategory === 'hotel' 
        ? hotels.some(h => h.id === selectedAdminId)
        : selectedAdminCategory === 'restaurant'
        ? restaurants.some(r => r.id === selectedAdminId)
        : products.some(p => p.id === selectedAdminId);
      if (!exists) {
        const firstId = selectedAdminCategory === 'hotel' && hotels.length > 0 ? hotels[0].id
                      : selectedAdminCategory === 'restaurant' && restaurants.length > 0 ? restaurants[0].id
                      : selectedAdminCategory === 'product' && products.length > 0 ? products[0].id : null;
        setSelectedAdminId(firstId);
      }
    }
  }, [selectedAdminCategory, hotels, restaurants, products, selectedAdminId]);

  // Auto-save hotels
  const autoSaveHotel = (hotelId: string, field: string, value: any) => {
    const updated = hotels.map(h => {
      if (h.id === hotelId) {
        const next = { ...h, [field]: value };
        // If singleRooms or doubleRooms or singlePrice or doublePrice change, sync suites
        if (field === 'singleRooms' || field === 'doubleRooms' || field === 'singlePrice' || field === 'doublePrice') {
          const suites: string[] = [];
          if (field === 'singleRooms' ? value > 0 : (h as any).singleRooms > 0) {
            suites.push(`Single Room (${field === 'singleRooms' ? value : (h as any).singleRooms} available)`);
          }
          if (field === 'doubleRooms' ? value > 0 : (h as any).doubleRooms > 0) {
            suites.push(`Double Room (${field === 'doubleRooms' ? value : (h as any).doubleRooms} available)`);
          }
          next.suites = suites.length > 0 ? suites : ['Standard Room'];
          next.signatureSuite = next.suites[0];
        }
        return next;
      }
      return h;
    });
    setHotels(updated);
    localStorage.setItem('omniai_sync_hotels', JSON.stringify(updated));
    window.dispatchEvent(new Event('omniai_admin_sync'));
  };

  // Auto-save restaurants
  const autoSaveRestaurant = (restaurantId: string, field: string, value: any) => {
    const updated = restaurants.map(r => {
      if (r.id === restaurantId) {
        return { ...r, [field]: value };
      }
      return r;
    });
    setRestaurants(updated);
    localStorage.setItem('omniai_sync_restaurants', JSON.stringify(updated));
    window.dispatchEvent(new Event('omniai_admin_sync'));
  };

  // Auto-save products
  const autoSaveProduct = (productId: string, field: string, value: any) => {
    const updated = products.map(p => {
      if (p.id === productId) {
        // If specs is being changed, parse it from comma-separated string
        if (field === 'specs') {
          return { ...p, specs: value.split(',').map((s: string) => s.trim()).filter(Boolean) };
        }
        return { ...p, [field]: value };
      }
      return p;
    });
    setProducts(updated);
    localStorage.setItem('omniai_sync_products', JSON.stringify(updated));
    window.dispatchEvent(new Event('omniai_admin_sync'));
  };

  // Add new template item
  const handleAddNewAdminItem = (category: 'hotel' | 'restaurant' | 'product') => {
    const newId = `admin-${category}-${Date.now()}`;
    if (category === 'hotel') {
      const newHotel: HotelEntity = {
        id: newId,
        name: 'New Registered Luxury Hotel',
        rating: 4.5,
        priceRange: '$$$',
        location: 'Mumbai, India',
        availability: 'Available Tonight',
        accentColor: 'from-[#00D1FF] to-[#3b82f6]',
        distance: '1.2 miles',
        description: 'New luxury hotel description...',
        signatureSuite: 'Deluxe Room',
        gradient: 'linear-gradient(135deg, rgba(0, 209, 255, 0.15) 0%, rgba(59, 130, 246, 0.05) 100%)',
        suites: ['Deluxe Room'],
        ratePerNight: 250,
        image: 'https://image.pollinations.ai/prompt/luxury_hotel_modern_mumbai?width=600&height=400&nologo=true'
      };
      const updated = [...hotels, newHotel];
      setHotels(updated);
      localStorage.setItem('omniai_sync_hotels', JSON.stringify(updated));
      setSelectedAdminId(newId);
    } else if (category === 'restaurant') {
      const newRest: Restaurant = {
        id: newId,
        name: 'New High-End Dining Node',
        cuisine: 'Indian Fusion',
        rating: 4.6,
        priceRange: '$$$',
        location: 'Delhi, India',
        availability: 'Open Table',
        accentColor: 'from-[#a855f7] to-[#ec4899]',
        distance: '0.5 miles',
        description: 'Premium culinary architecture with signature dishes.',
        signatureDish: 'Tandoori Truffle Lobster',
        gradient: 'linear-gradient(135deg, rgba(168, 85, 247, 0.15) 0%, rgba(236, 72, 153, 0.05) 100%)',
        availableTimes: ['19:00', '20:00', '21:00'],
        image: 'https://image.pollinations.ai/prompt/luxury_restaurant_mumbai_tasty?width=600&height=400&nologo=true'
      };
      const updated = [...restaurants, newRest];
      setRestaurants(updated);
      localStorage.setItem('omniai_sync_restaurants', JSON.stringify(updated));
      setSelectedAdminId(newId);
    } else {
      const newProd: Product = {
        id: newId,
        name: 'New Cybernetic System',
        price: 999,
        description: 'Premium high-tech luxury computing gear.',
        accentColor: 'from-[#10b981] to-[#059669]',
        deliveryTime: '2 Days Delivery',
        specs: ['Synapse Sync Processor', 'Biometric Lock Array'],
        category: 'Hardware',
        gradient: 'linear-gradient(135deg, rgba(16, 185, 129, 0.15) 0%, rgba(5, 150, 105, 0.05) 100%)'
      };
      const updated = [...products, newProd];
      setProducts(updated);
      localStorage.setItem('omniai_sync_products', JSON.stringify(updated));
      setSelectedAdminId(newId);
    }
    window.dispatchEvent(new Event('omniai_admin_sync'));
  };

  // Delete item
  const handleDeleteAdminItem = (category: 'hotel' | 'restaurant' | 'product', id: string) => {
    if (category === 'hotel') {
      const updated = hotels.filter(h => h.id !== id);
      setHotels(updated);
      localStorage.setItem('omniai_sync_hotels', JSON.stringify(updated));
    } else if (category === 'restaurant') {
      const updated = restaurants.filter(r => r.id !== id);
      setRestaurants(updated);
      localStorage.setItem('omniai_sync_restaurants', JSON.stringify(updated));
    } else {
      const updated = products.filter(p => p.id !== id);
      setProducts(updated);
      localStorage.setItem('omniai_sync_products', JSON.stringify(updated));
    }
    setSelectedAdminId(null);
    window.dispatchEvent(new Event('omniai_admin_sync'));
  };

  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [checkoutForm, setCheckoutForm] = useState({ name: '', address: '', zip: '', paymentMethod: 'cod', upiId: '' });

  // Hotel Booking Modal State
  const [bookingModalHotel, setBookingModalHotel] = useState<HotelEntity | null>(null);
  const [hotelForm, setHotelForm] = useState({
    checkIn: '',
    checkOut: '',
    suite: '',
    guests: 2,
    notes: '',
    paymentMethod: 'coa',
    name: '',
    email: '',
    phone: ''
  });
  
  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCuisine, setSelectedCuisine] = useState('All');
  const [selectedPrice, setSelectedPrice] = useState('All');
  const [selectedRating, setSelectedRating] = useState('All');

  // Premium Console State
  const [searchLocation, setSearchLocation] = useState('');
  const [searchDate, setSearchDate] = useState('');
  const [searchGuests, setSearchGuests] = useState(2);
  const [searchTime, setSearchTime] = useState('20:00');
  const [isScanning, setIsScanning] = useState(false);
  const [isAssistantOpen, setIsAssistantOpen] = useState(true);

  const executeGeospatialSearch = () => {
    setIsScanning(true);
    setTimeout(() => {
      setIsScanning(false);
    }, 1200);
  };

  const findMatchingRestaurant = (text: string): Restaurant | undefined => {
    return restaurants.find(r => text.toLowerCase().includes(r.name.toLowerCase()));
  };

  const findMatchingHotel = (text: string): HotelEntity | undefined => {
    return hotels.find(h => text.toLowerCase().includes(h.name.toLowerCase()));
  };

  const findMatchingProduct = (text: string): Product | undefined => {
    return products.find(p => text.toLowerCase().includes(p.name.toLowerCase()));
  };

  // Sheet Sync State
  const [syncStatus, setSyncStatus] = useState<SyncStatus>('loading');
  const [syncError, setSyncError] = useState('');

  // Booking Modal State
  const [bookingModalRestaurant, setBookingModalRestaurant] = useState<Restaurant | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitSuccessMessage, setSubmitSuccessMessage] = useState('');
  const [bookingForm, setBookingForm] = useState({
    date: '',
    time: '20:00',
    guests: 2,
    notes: '',
    name: '',
    email: '',
    phone: ''
  });

  // Chat State
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content: "Uplink online. I am your AI Booking Concierge. Dictate your dining requests (e.g. 'Book a table for two at Nobu Malibu tonight') or ask for elite recommendations.",
      timestamp: 'Active'
    }
  ]);
  const [chatInput, setChatInput] = useState('');
  const [isChatThinking, setIsChatThinking] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Floating Particle Canvas
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // ── Canvas Particle Engine ──────────────────────────────────────────────
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = canvas.offsetWidth);
    let height = (canvas.height = canvas.offsetHeight);

    const particles: Array<{
      x: number;
      y: number;
      vx: number;
      vy: number;
      size: number;
      color: string;
      alpha: number;
    }> = [];

    const colors = ['rgba(0, 209, 255, 0.4)', 'rgba(123, 97, 255, 0.4)', 'rgba(236, 72, 153, 0.3)'];

    for (let i = 0; i < 40; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        size: Math.random() * 2 + 1,
        color: colors[Math.floor(Math.random() * colors.length)],
        alpha: Math.random() * 0.5 + 0.2
      });
    }

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = canvas.offsetWidth;
      height = canvas.height = canvas.offsetHeight;
    };
    window.addEventListener('resize', handleResize);

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0 || p.x > width) p.vx *= -1;
        if (p.y < 0 || p.y > height) p.vy *= -1;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.shadowBlur = 10;
        ctx.shadowColor = p.color;
        ctx.fill();
        ctx.shadowBlur = 0;
      });

      // Draw spring connections
      ctx.strokeStyle = 'rgba(0, 209, 255, 0.03)';
      ctx.lineWidth = 0.5;
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 100) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // ── Fetch Reservations from Google Sheets on Mount ─────────────────────
  useEffect(() => {
    setSyncStatus('loading');
    fetch(SHEET_URL)
      .then(async (res) => {
        const text = await res.text();
        if (text.includes('Script function not found') || text.includes('doGet') || !res.ok) {
          throw new Error('doGet not configured');
        }
        try {
          const data = JSON.parse(text);
          if (Array.isArray(data) && data.length > 0) {
            const mapped: Reservation[] = data.map((row: any, i: number) => ({
              id: row.id || `sheet-${i}`,
              restaurant: row.item || row.restaurant || 'Unnamed Restaurant',
              date: row.date || new Date().toLocaleDateString(),
              time: row.time || '20:00',
              guests: Number(row.guests) || 2,
              notes: row.notes || '',
              status: (row.status === 'confirmed' || row.status === 'success' || row.status === 'active')
                ? 'confirmed'
                : row.status === 'cancelled'
                ? 'cancelled'
                : 'pending',
              timestamp: row.time || 'PENDING'
            }));
            setReservations(mapped);
            setSyncStatus('live');
          } else {
            throw new Error('Empty dataset');
          }
        } catch {
          throw new Error('Parse error');
        }
      })
      .catch((err) => {
        setSyncStatus('offline');
        setSyncError(
          err.message === 'doGet not configured'
            ? 'Google Script missing doGet(e). Add it to your Apps Script deployment to enable live sync.'
            : 'Could not reach Google Sheet. Showing cached data.',
        );
        // Fallback to local mock data
        setReservations(INITIAL_MOCK_RESERVATIONS);
      });
  }, []);

  // ── Submit Reservation to Google Sheets & State ──────────────────────────
  const handleMakeReservation = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!bookingModalRestaurant) return;

    setIsSubmitting(true);
    const newRes: Reservation = {
      id: `res-${Date.now()}`,
      restaurant: bookingModalRestaurant.name,
      date: bookingForm.date || new Date().toLocaleDateString(),
      time: bookingForm.time,
      guests: bookingForm.guests,
      notes: bookingForm.notes,
      status: 'pending',
      timestamp: 'PENDING',
      userName: bookingForm.name,
      userEmail: bookingForm.email,
      userPhone: bookingForm.phone,
      type: 'restaurant',
      price: bookingForm.guests * (bookingModalRestaurant.pricePerPerson || 150)
    };

    // Optimistically update UI
    setReservations((prev) => {
      const next = [newRes, ...prev];
      try { localStorage.setItem('omniai_sync_reservations', JSON.stringify(next)); } catch(e){}
      return next;
    });

    // Format sheet payload
    const payload = {
      label: 'Restaurant',
      item: bookingModalRestaurant.name,
      restaurant: bookingModalRestaurant.name,
      date: bookingForm.date,
      time: bookingForm.time,
      guests: bookingForm.guests,
      notes: `Name: ${bookingForm.name} | Email: ${bookingForm.email} | Phone: ${bookingForm.phone} | Notes: ${bookingForm.notes}`,
      status: 'pending'
    };

    try {
      await fetch(SHEET_URL, {
        method: 'POST',
        mode: 'no-cors', // standard Apps Script POST
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      // Dispatch Outbound Email Confirmation Protocol
      let emailAlertText = "";
      if (bookingForm.email) {
        try {
          const mailRes = await fetch('/api/send-email', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              type: 'restaurant',
              name: bookingForm.name,
              email: bookingForm.email,
              phone: bookingForm.phone,
              itemName: bookingModalRestaurant.name,
              date: bookingForm.date || new Date().toLocaleDateString(),
              time: bookingForm.time,
              guests: bookingForm.guests,
              notes: bookingForm.notes
            })
          });
          if (mailRes.ok) {
            const mailData = await mailRes.json();
            emailAlertText = mailData.message;
          }
          console.log("Outbound booking confirmation email transmitted.");
        } catch (e) {
          console.warn("Outbound email transmission failed", e);
        }
      }

      // no-cors returns opaque response. assume success and update status to confirmed optimistically!
      setReservations((prev) => {
        const next = prev.map((r) => (r.id === newRes.id ? { ...r, status: 'confirmed' as const, timestamp: 'CONFIRMED' } : r));
        try { localStorage.setItem('omniai_sync_reservations', JSON.stringify(next)); } catch(e){}
        return next;
      });
      setSubmitSuccessMessage(emailAlertText || "Reservation locked in successfully!");
      setSubmitSuccess(true);
      setTimeout(() => {
        setSubmitSuccess(false);
        setSubmitSuccessMessage('');
        setBookingModalRestaurant(null);
      }, 5000);

      // Store in LocalStorage for Memory Vault
      try {
        localStorage.setItem('omniai_last_activity', JSON.stringify({
          label: 'Restaurant Booking Completed',
          content: `Booked a table for ${bookingForm.guests} guests at ${bookingModalRestaurant.name} on ${bookingForm.date || new Date().toLocaleDateString()} at ${bookingForm.time} PM.`,
          type: 'Booking',
          time: 'Just now'
        }));
      } catch (e) {
        console.warn("LocalStorage save failed", e);
      }
    } catch (err) {
      console.warn("Sheets POST offline, persisting reservation locally");
      // Keep optimistically added local reservation as pending
      setBookingModalRestaurant(null);
    }

    setIsSubmitting(false);
    setBookingForm({ date: '', time: '20:00', guests: 2, notes: '', name: '', email: '', phone: '' });
  };

  // Helper to calculate hotel stay nights
  const calculateNights = (inDate: string, outDate: string) => {
    if (!inDate || !outDate) return 1;
    const start = new Date(inDate);
    const end = new Date(outDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays || 1;
  };

  // ── Submit Hotel Booking to Google Sheets & State ────────────────────────
  const handleMakeHotelReservation = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!bookingModalHotel) return;

    setIsSubmitting(true);
    const nights = calculateNights(hotelForm.checkIn, hotelForm.checkOut);
    const newRes: Reservation = {
      id: `res-hotel-${Date.now()}`,
      restaurant: bookingModalHotel.name,
      date: hotelForm.checkIn || new Date().toLocaleDateString(),
      time: `Check-in: 15:00`,
      guests: hotelForm.guests,
      notes: hotelForm.notes,
      status: 'pending',
      timestamp: 'PENDING',
      type: 'hotel',
      hotelSuite: hotelForm.suite || bookingModalHotel.suites[0],
      endDate: hotelForm.checkOut,
      paymentMethod: hotelForm.paymentMethod as 'coa' | 'upi',
      userName: hotelForm.name,
      userEmail: hotelForm.email,
      userPhone: hotelForm.phone,
      price: nights * (bookingModalHotel.ratePerNight || 1450),
      upiId: hotelForm.paymentMethod === 'upi' ? (bookingModalHotel.upiId || '1234567890@upi') : undefined
    };

    // Optimistically update UI
    setReservations((prev) => {
      const next = [newRes, ...prev];
      try { localStorage.setItem('omniai_sync_reservations', JSON.stringify(next)); } catch(e){}
      return next;
    });

    // Format sheet payload
    const payload = {
      label: 'Hotel Booking',
      item: `${bookingModalHotel.name} - ${newRes.hotelSuite}`,
      restaurant: bookingModalHotel.name,
      date: `In: ${hotelForm.checkIn} - Out: ${hotelForm.checkOut}`,
      time: `Suite: ${newRes.hotelSuite}`,
      guests: hotelForm.guests,
      notes: `Name: ${hotelForm.name} | Email: ${hotelForm.email} | Phone: ${hotelForm.phone} | Mode: ${hotelForm.paymentMethod === 'upi' ? `UPI (Sent to ${bookingModalHotel.upiId || '1234567890@upi'})` : 'COA'} | Notes: ${hotelForm.notes}`,
      status: 'pending'
    };

    try {
      await fetch(SHEET_URL, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      // Dispatch Outbound Email Confirmation Protocol
      let emailAlertText = "";
      if (hotelForm.email) {
        try {
          const mailRes = await fetch('/api/send-email', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              type: 'hotel',
              name: hotelForm.name,
              email: hotelForm.email,
              phone: hotelForm.phone,
              itemName: bookingModalHotel.name,
              date: hotelForm.checkIn,
              endDate: hotelForm.checkOut,
              guests: hotelForm.guests,
              notes: hotelForm.notes,
              hotelSuite: hotelForm.suite || bookingModalHotel.suites[0],
              paymentMethod: hotelForm.paymentMethod
            })
          });
          if (mailRes.ok) {
            const mailData = await mailRes.json();
            emailAlertText = mailData.message;
          }
          console.log("Outbound hotel booking confirmation email transmitted.");
        } catch (e) {
          console.warn("Outbound email transmission failed", e);
        }
      }

      setReservations((prev) => {
        const next = prev.map((r) => (r.id === newRes.id ? { ...r, status: 'confirmed' as const, timestamp: 'CONFIRMED' } : r));
        try { localStorage.setItem('omniai_sync_reservations', JSON.stringify(next)); } catch(e){}
        return next;
      });
      setSubmitSuccessMessage(emailAlertText || "Hotel reservation confirmed successfully!");
      setSubmitSuccess(true);
      setTimeout(() => {
        setSubmitSuccess(false);
        setSubmitSuccessMessage('');
        setBookingModalHotel(null);
      }, 5000);

      // Store in LocalStorage for Memory Vault
      try {
        localStorage.setItem('omniai_last_activity', JSON.stringify({
          label: 'Hotel Suite Secured',
          content: `Reserved the ${hotelForm.suite || bookingModalHotel.suites[0]} suite at ${bookingModalHotel.name} (In: ${hotelForm.checkIn} - Out: ${hotelForm.checkOut}) via ${hotelForm.paymentMethod === 'upi' ? 'UPI' : 'Cash on Arrival'}.`,
          type: 'Booking',
          time: 'Just now'
        }));
      } catch (e) {
        console.warn("LocalStorage save failed", e);
      }
    } catch (err) {
      console.warn("Sheets POST offline, persisting hotel booking locally");
      setBookingModalHotel(null);
    }

    setIsSubmitting(false);
    setHotelForm({ checkIn: '', checkOut: '', suite: '', guests: 2, notes: '', paymentMethod: 'coa', name: '', email: '', phone: '' });
  };

  // ── Shopping Cart Handlers ───────────────────────────────────────────────
  const addToCart = (product: Product) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { product, quantity: 1 }];
    });
  };

  const removeFromCart = (productId: string) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.product.id === productId);
      if (existing && existing.quantity > 1) {
        return prev.map((item) =>
          item.product.id === productId ? { ...item, quantity: item.quantity - 1 } : item
        );
      }
      return prev.filter((item) => item.product.id !== productId);
    });
  };

  const executeCheckout = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (cart.length === 0) return;

    setIsSubmitting(true);
    const totalPrice = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
    const newOrder: Order = {
      id: `order-${Math.floor(1000 + Math.random() * 9000)}`,
      items: [...cart],
      totalPrice,
      date: new Date().toISOString().split('T')[0],
      status: 'processing',
      receiptHash: `0x${Array.from({ length: 40 }, () => Math.floor(Math.random() * 16).toString(16)).join('')}`,
      paymentMethod: checkoutForm.paymentMethod as 'cod' | 'upi',
      upiId: checkoutForm.paymentMethod === 'upi' ? '1234567890@upi' : undefined
    };

    // Update locally
    setOrders((prev) => {
      const next = [newOrder, ...prev];
      try { localStorage.setItem('omniai_sync_orders', JSON.stringify(next)); } catch(e){}
      return next;
    });

    // Synchronize to Google Sheets as transaction
    const payload = {
      label: 'E-commerce Order',
      item: cart.map((i) => `${i.product.name} (x${i.quantity})`).join(', '),
      restaurant: 'OmniAI Market',
      date: newOrder.date,
      time: `Order Total: $${totalPrice}`,
      guests: cart.reduce((sum, i) => sum + i.quantity, 0),
      notes: `Mode: ${checkoutForm.paymentMethod === 'upi' ? 'UPI (Sent to 1234567890@upi)' : 'COD'} | Receipt: ${newOrder.receiptHash.substring(0, 10)}...`,
      status: 'success'
    };

    try {
      await fetch(SHEET_URL, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
    } catch {
      // Offline fallback success
    }

    // Store in LocalStorage for Memory Vault
    try {
      localStorage.setItem('omniai_last_activity', JSON.stringify({
        label: 'Gear Order Finalized',
        content: `Purchased ${cart.map(i => `${i.product.name} (x${i.quantity})`).join(', ')} for $${totalPrice} USD via ${checkoutForm.paymentMethod === 'upi' ? 'UPI' : 'Cash on Delivery'}.`,
        type: 'Preference',
        time: 'Just now'
      }));
    } catch (e) {
      console.warn("LocalStorage save failed", e);
    }

    setCart([]);
    setCheckoutOpen(false);
    setSubmitSuccess(true);
    setTimeout(() => setSubmitSuccess(false), 3000);
    setIsSubmitting(false);
    
    // Switch to management tab to let user see their placed order!
    setNodeMode('management');
    setActiveTab('reservations');
  };

  // ── Abort Reservation Protocol ──────────────────────────────────────────
  const handleCancelReservation = async (id: string) => {
    const target = reservations.find((r) => r.id === id);
    if (!target) return;

    // Update locally
    setReservations((prev) => {
      const next = prev.map((r) => (r.id === id ? { ...r, status: 'cancelled' as const, timestamp: 'CANCELLED' } : r));
      try { localStorage.setItem('omniai_sync_reservations', JSON.stringify(next)); } catch(e){}
      return next;
    });

    // POST cancellation payload
    const payload = {
      label: 'Restaurant Cancellation',
      item: target.restaurant,
      restaurant: target.restaurant,
      date: target.date,
      time: target.time,
      guests: target.guests,
      status: 'cancelled'
    };

    try {
      await fetch(SHEET_URL, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
    } catch {
      // Mock cancellation persists offline
    }
  };

  // ── Chat AI Logic ────────────────────────────────────────────────────────
  const scrollToChatBottom = () => chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  useEffect(() => scrollToChatBottom(), [chatMessages]);

  const handleSendChatMessage = async (textToSend: string = chatInput) => {
    if (!textToSend.trim()) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setChatMessages((prev) => [...prev, userMsg]);
    setChatInput('');
    setIsChatThinking(true);

    try {
      const systemPrompt = `You are the OMNIAI Central Concierge & Shopping Assistant. You are helping the user browse, reserve, and buy from our elite networks. Here is our database:

1. RESTAURANTS:
- Nobu Malibu: Japanese Fusion, $150/person, Malibu. Available tonight at 8:30 PM.
- L'Ambroisie: Modern French, $450/person, Paris. Available Friday at 9:00 PM.
- Osteria Francescana: Modern Italian, $300/person, Modena. Fully booked.
- SubliMotion: Cyber-Sensory, $1500/person, Ibiza. 12 seats only.
- Atomix: Progressive Korean, $375/person, New York. Available Thursday at 7:00 PM.
- Asador Etxebarri: Wood Fire Grill, $250/person, Spain. Available tomorrow at 1:30 PM.

2. HOTELS:
- Aman Tokyo: Chiyoda-ku, Tokyo. Luxury suites ($1450/night). Available tonight.
- Ritz Paris: Place Vendôme, Paris. Coco Chanel Suite ($1800/night). Available tomorrow.
- Burj Al Arab: Jumeirah Beach, Dubai. Royal Suite ($2100/night). Exclusive slots.
- Amangiri Utah: Canyon Point, Utah. Desert Suite ($1950/night). Available Friday.

3. E-COMMERCE PRODUCTS:
- OmniHUD Cybernetic Glasses ($1200): Micro-LED Retinal projection, 2 days delivery.
- AuraSound Spatial Headset ($450): Bone conduction transducers, next day delivery.
- ChronoSync Quantum Wrist Watch ($3200): Quantum atomic synchronization, 3 days delivery.
- Synapse Neural Tracking Ring ($350): Fatigue monitoring, aerospace ceramic, next day delivery.

Answer queries concisely and in a helpful, high-end cybernetic voice. Tell them they can book/buy directly by using the Restaurant, Hotel, or E-commerce tabs, or let them know you can initiate reservation or shopping protocols directly for them. Offer helpful suggestions.`;

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [
            { role: 'system', content: systemPrompt },
            ...chatMessages.map((m) => ({ role: m.role, content: m.content })),
            { role: 'user', content: textToSend }
          ]
        })
      });

      const data = await response.json();
      if (data.error) throw new Error(data.error);

      const assistantMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.content,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setChatMessages((prev) => [...prev, assistantMsg]);
    } catch (err: any) {
      const errorMsg: ChatMessage = {
        id: Date.now().toString(),
        role: 'assistant',
        content: `Neural connection disrupted. Fallback protocol engaged. Booking node is fully functional. Please select an elite card below to secure your table manually.`,
        timestamp: 'Offline Fallback'
      };
      setChatMessages((prev) => [...prev, errorMsg]);
    }

    setIsChatThinking(false);
  };

  // Quick Action Handler for recommendation chips
  const handleQuickAction = (text: string) => {
    handleSendChatMessage(text);
  };

  // ── Filter Logics ────────────────────────────────────────────────────────
  const filteredRestaurants = restaurants.filter((r) => {
    const matchesSearch = r.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          r.cuisine.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          r.location.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesLocation = !searchLocation || r.location.toLowerCase().includes(searchLocation.toLowerCase());
    const matchesCuisine = selectedCuisine === 'All' || r.cuisine.toLowerCase().includes(selectedCuisine.toLowerCase());
    const matchesPrice = selectedPrice === 'All' || r.priceRange === selectedPrice;
    const matchesRating = selectedRating === 'All' ||
                          (selectedRating === '4.8+' && r.rating >= 4.8) ||
                          (selectedRating === '4.9+' && r.rating >= 4.9);
    return matchesSearch && matchesLocation && matchesCuisine && matchesPrice && matchesRating;
  });

  return (
    <div className="flex-1 flex flex-col gap-10 select-none text-slate-100 bg-slate-950/40 rounded-[32px] p-6 lg:p-8 border border-white/5 backdrop-blur-3xl shadow-[0_0_80px_rgba(0,0,0,0.5)] overflow-hidden relative">
      
      {/* Dynamic Grid Particles Background Layer */}
      <div className="absolute inset-0 z-0 pointer-events-none rounded-[32px] overflow-hidden">
        <canvas ref={canvasRef} className="absolute inset-0 w-full h-full opacity-65" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-slate-950/20 to-slate-950/80 pointer-events-none" />
      </div>

      {/* ── 1. FUTURISTIC HERO SECTION ─────────────────────────────────────── */}
      <section className="relative z-10 glass-panel border-white/5 rounded-[32px] p-8 md:p-12 overflow-hidden bg-slate-900/10 flex flex-col lg:flex-row justify-between items-center gap-10 shadow-[0_20px_50px_rgba(0,0,0,0.3)]">
        
        {/* Animated ambient backlights */}
        <div className="absolute -top-32 -left-32 w-80 h-80 rounded-full bg-[#00D1FF]/5 blur-[120px] pointer-events-none" />
        <div className="absolute -bottom-32 -right-32 w-80 h-80 rounded-full bg-[#7B61FF]/5 blur-[120px] pointer-events-none" />

        {/* Hero Copy */}
        <div className="flex-1 space-y-6 max-w-xl text-left">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#00D1FF]/20 bg-[#00D1FF]/5 text-[9px] font-black uppercase tracking-[0.2em] text-[#00D1FF]">
            <Zap size={10} className="animate-pulse" /> AI Neural Booking Node Active
          </div>
          
          <h1 className="text-4xl md:text-6xl font-black tracking-tight leading-[0.95] text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-100 to-slate-400">
            OMNIAI <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00D1FF] to-[#7B61FF] shadow-sm">
              Booking Hub.
            </span>
          </h1>
          
          <p className="text-sm md:text-base text-slate-400 font-medium leading-relaxed">
            Book elite restaurants, reserve luxury hotels, and purchase high-tech cybernetic gear instantly using AI. Powered by a direct neural link to the world's premier concierge networks.
          </p>

          <div className="flex flex-wrap gap-4 pt-2">
            <button
              onClick={() => {
                setNodeMode('restaurants');
                setActiveTab('discover');
                setTimeout(() => {
                  const el = document.getElementById('browse-section');
                  el?.scrollIntoView({ behavior: 'smooth' });
                }, 100);
              }}
              className="px-6 py-4 rounded-full text-[9px] font-black uppercase tracking-widest bg-gradient-to-r from-[#00D1FF] to-[#3b82f6] text-black hover:scale-105 active:scale-95 shadow-[0_0_20px_rgba(0,209,255,0.25)] hover:shadow-[0_0_30px_rgba(0,209,255,0.45)] transition-all flex items-center gap-2"
            >
              <Utensils size={12} /> Book Restaurants
            </button>
            <button
              onClick={() => {
                setNodeMode('hotels');
                setTimeout(() => {
                  const el = document.getElementById('hotels-section');
                  el?.scrollIntoView({ behavior: 'smooth' });
                }, 100);
              }}
              className="px-6 py-4 rounded-full text-[9px] font-black uppercase tracking-widest bg-gradient-to-r from-[#7B61FF] to-[#ec4899] text-white hover:scale-105 active:scale-95 shadow-[0_0_20px_rgba(123,97,255,0.25)] hover:shadow-[0_0_30px_rgba(123,97,255,0.45)] transition-all flex items-center gap-2"
            >
              <Hotel size={12} /> Reserve Hotels
            </button>
            <button
              onClick={() => {
                setNodeMode('shopping');
                setTimeout(() => {
                  const el = document.getElementById('shopping-section');
                  el?.scrollIntoView({ behavior: 'smooth' });
                }, 100);
              }}
              className="px-6 py-4 rounded-full text-[9px] font-black uppercase tracking-widest bg-gradient-to-r from-[#ec4899] to-[#f43f5e] text-white hover:scale-105 active:scale-95 shadow-[0_0_20px_rgba(236,72,153,0.25)] hover:shadow-[0_0_30px_rgba(236,72,153,0.45)] transition-all flex items-center gap-2"
            >
              <ShoppingBag size={12} /> Shop Gear
            </button>
          </div>
        </div>

        {/* AI Assistant Core Illustration (Brain/Wave Pulse Matrix) */}
        <div className="w-64 h-64 md:w-80 md:h-80 shrink-0 relative flex items-center justify-center">
          
          {/* Glowing particle ring backdrops */}
          <div className="absolute inset-0 rounded-full border border-white/5 bg-slate-900/40 backdrop-blur-lg flex items-center justify-center">
            
            {/* outer orbital ring */}
            <div className="absolute inset-4 rounded-full border border-dashed border-[#00D1FF]/10 animate-spin-slow" />
            {/* secondary orbital */}
            <div className="absolute inset-10 rounded-full border border-dashed border-[#7B61FF]/10 animate-reverse-spin" />
            
            {/* pulsating core */}
            <motion.div
              animate={{
                scale: [1, 1.08, 1],
                boxShadow: [
                  "0 0 30px rgba(0,209,255,0.15)",
                  "0 0 60px rgba(123,97,255,0.3)",
                  "0 0 30px rgba(0,209,255,0.15)"
                ]
              }}
              transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
              className="w-36 h-36 rounded-full bg-slate-950 border border-white/10 flex items-center justify-center relative overflow-hidden"
            >
              {/* Internal neural mesh */}
              <div className="absolute inset-0 bg-cyber-grid opacity-10" />
              <div className="absolute -inset-1 bg-gradient-to-tr from-[#00D1FF]/20 via-[#7B61FF]/10 to-transparent blur-md opacity-70" />
              
              {/* Floating inner node */}
              <div className="relative z-10 flex flex-col items-center gap-2">
                <Sparkles className="text-[#00D1FF] animate-pulse" size={24} />
                <div className="text-[8px] font-black uppercase tracking-widest text-[#7B61FF]/80">Omni.Core</div>
              </div>

              {/* Glowing breathing waves */}
              <div className="absolute inset-2 rounded-full border border-[#00D1FF]/15 animate-ping opacity-45" />
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── 2. SYSTEM STATUS BAR & HUD NAVIGATION ──────────────────────────── */}
      <section className="relative z-10 flex flex-col xl:flex-row justify-between items-start xl:items-center gap-6 pb-6 border-b border-white/5">
        
        {/* Central Node Switcher Navigation */}
        <div className="flex flex-wrap gap-2.5 p-1.5 glass-panel border-white/5 rounded-2xl bg-slate-900/20">
          <button
            onClick={() => setNodeMode('restaurants')}
            className={cn(
              "px-5 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2",
              nodeMode === 'restaurants'
                ? "bg-white/10 text-[#00D1FF] border border-[#00D1FF]/20 shadow-[0_0_15px_rgba(0,209,255,0.15)]"
                : "text-slate-400 hover:text-white"
            )}
          >
            <Utensils size={12} />
            Restaurant Node
          </button>
          <button
            onClick={() => setNodeMode('hotels')}
            className={cn(
              "px-5 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2",
              nodeMode === 'hotels'
                ? "bg-white/10 text-[#7B61FF] border border-[#7B61FF]/20 shadow-[0_0_15px_rgba(123,97,255,0.15)]"
                : "text-slate-400 hover:text-white"
            )}
          >
            <Hotel size={12} />
            Hotel Node
          </button>
          <button
            onClick={() => setNodeMode('shopping')}
            className={cn(
              "px-5 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2",
              nodeMode === 'shopping'
                ? "bg-white/10 text-pink-400 border border-pink-400/20 shadow-[0_0_15px_rgba(244,63,94,0.15)]"
                : "text-slate-400 hover:text-white"
            )}
          >
            <ShoppingBag size={12} />
            Shopping Node
          </button>
          <button
            onClick={() => {
              setNodeMode('management');
              setActiveTab('discover'); // Default to reservations tab
            }}
            className={cn(
              "px-5 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2 relative",
              nodeMode === 'management'
                ? "bg-white/10 text-amber-400 border border-amber-400/20 shadow-[0_0_15px_rgba(245,158,11,0.15)]"
                : "text-slate-400 hover:text-white"
            )}
          >
            <Package size={12} />
            Management Hub
            {(reservations.filter(r => r && r.status !== 'cancelled').length + orders.length > 0) && (
              <span className="w-4 h-4 rounded-full bg-slate-900/60 border border-white/10 flex items-center justify-center text-[7px] text-white">
                {reservations.filter(r => r && r.status !== 'cancelled').length + orders.length}
              </span>
            )}
          </button>
        </div>

        {/* System Uplink Status Badge */}
        <div className="flex items-center gap-4">
          <div className={cn(
            "flex items-center gap-2.5 px-4 py-2 rounded-full border text-[8px] font-black uppercase tracking-widest bg-slate-900/40 select-none",
            syncStatus === 'live'     ? "border-green-500/20 text-green-400" :
        syncStatus === 'offline'  ? "border-amber-500/20 text-amber-400" :
            "border-white/5 text-slate-500"
          )}>
            {syncStatus === 'loading' && <Loader2 size={10} className="animate-spin text-[#00D1FF]" />}
            {syncStatus === 'live'    && <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse shadow-[0_0_8px_#4ade80]" />}
            {syncStatus === 'offline' && <AlertTriangle size={10} />}
            {syncStatus === 'live'     ? 'Uplink Synchronized' :
             syncStatus === 'offline'  ? 'Offline (Local Sync)' :
             'Aligning Neural Nodes...'}
          </div>

          {syncStatus === 'offline' && syncError && (
            <div className="group relative cursor-pointer">
              <Info size={14} className="text-amber-500/60 hover:text-amber-400" />
              <div className="absolute bottom-full right-0 mb-2 w-64 p-3 rounded-xl bg-slate-950 border border-white/10 text-[9px] text-slate-400 font-medium leading-relaxed pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity z-50 shadow-2xl">
                {syncError}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* ── 3. MAIN WORKSPACE CONTENT GRID ─────────────────────────────────── */}
      <section className="relative z-10 grid grid-cols-1 xl:grid-cols-12 gap-8 items-start flex-1 min-h-0">
        
        {/* LEFT: Dynamic Workspace View based on nodeMode */}
        <div className="xl:col-span-8 space-y-8 min-h-0 flex flex-col justify-start">
          
          <AnimatePresence mode="wait">
            
            {/* 🍽️ RESTAURANT NODE VIEW */}
            {nodeMode === 'restaurants' && (
              <motion.div
                key="restaurants-node"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                className="space-y-8 flex-1"
                id="browse-section"
              >
                {/* ── RESTAURANT SEARCH & FILTER CONSOLE ───────────────────────── */}
                <div className="glass-panel border-white/5 p-6 md:p-8 rounded-[28px] bg-slate-900/10 space-y-6 relative overflow-hidden">
                  
                  {/* Subtle decorative backing grid */}
                  <div className="absolute inset-0 bg-cyber-grid opacity-5 pointer-events-none" />
                  
                  <div className="text-[10px] font-black uppercase tracking-[0.3em] text-[#00D1FF] flex items-center gap-2 relative z-10">
                    <Compass size={14} className="animate-spin-slow" /> Geolocation & Restaurant Search Matrix
                  </div>

                  {/* Grid of futuristic glowing inputs */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 relative z-10">
                    
                    {/* 1. Location Search */}
                    <div className="space-y-2 text-left">
                      <label className="text-[8px] font-black uppercase tracking-widest text-slate-400 block ml-1">Location Search</label>
                      <div className="relative group">
                        <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-[#00D1FF] transition-colors" size={14} />
                        <input
                          type="text"
                          placeholder="MALIBU, PARIS, NY..."
                          value={searchLocation}
                          onChange={(e) => setSearchLocation(e.target.value)}
                          className="w-full bg-slate-950/60 border border-white/5 focus:border-[#00D1FF]/40 rounded-xl pl-10 pr-4 py-3.5 text-xs text-white placeholder:text-slate-600 focus:outline-none transition-all uppercase font-semibold"
                        />
                      </div>
                    </div>

                    {/* 2. Cuisine Select */}
                    <div className="space-y-2 text-left">
                      <label className="text-[8px] font-black uppercase tracking-widest text-slate-400 block ml-1">Cuisine Node</label>
                      <select
                        value={selectedCuisine}
                        onChange={(e) => setSelectedCuisine(e.target.value)}
                        className="w-full bg-slate-950/60 border border-white/5 focus:border-[#00D1FF]/40 rounded-xl px-4 py-3.5 text-xs text-white focus:outline-none transition-all font-semibold"
                      >
                        <option value="All" className="bg-slate-950">ALL CUISINES</option>
                        <option value="Japanese" className="bg-slate-950">JAPANESE FUSION</option>
                        <option value="French" className="bg-slate-950">MODERN FRENCH</option>
                        <option value="Italian" className="bg-slate-950">MODERN ITALIAN</option>
                        <option value="Sensory" className="bg-slate-950">CYBER-SENSORY</option>
                        <option value="Korean" className="bg-slate-950">PROGRESSIVE KOREAN</option>
                        <option value="Wood Fire" className="bg-slate-950">ARTISANAL WOOD FIRE</option>
                      </select>
                    </div>

                    {/* 3. Date Picker */}
                    <div className="space-y-2 text-left">
                      <label className="text-[8px] font-black uppercase tracking-widest text-slate-400 block ml-1">Dine Date</label>
                      <input
                        type="date"
                        value={searchDate}
                        onChange={(e) => setSearchDate(e.target.value)}
                        className="w-full bg-slate-950/60 border border-white/5 focus:border-[#00D1FF]/40 rounded-xl px-4 py-3 text-xs text-white focus:outline-none transition-all uppercase font-semibold"
                      />
                    </div>

                    {/* 4. Guest Selector */}
                    <div className="space-y-2 text-left">
                      <label className="text-[8px] font-black uppercase tracking-widest text-slate-400 block ml-1">Guest Size</label>
                      <select
                        value={searchGuests}
                        onChange={(e) => setSearchGuests(Number(e.target.value))}
                        className="w-full bg-slate-950/60 border border-white/5 focus:border-[#00D1FF]/40 rounded-xl px-4 py-3.5 text-xs text-white focus:outline-none transition-all font-semibold"
                      >
                        {[1, 2, 3, 4, 5, 6, 8, 10, 12].map((num) => (
                          <option key={num} value={num} className="bg-slate-950">{num} GUESTS</option>
                        ))}
                      </select>
                    </div>

                    {/* 5. Time Selector */}
                    <div className="space-y-2 text-left">
                      <label className="text-[8px] font-black uppercase tracking-widest text-slate-400 block ml-1">Target Time</label>
                      <select
                        value={searchTime}
                        onChange={(e) => setSearchTime(e.target.value)}
                        className="w-full bg-slate-950/60 border border-white/5 focus:border-[#00D1FF]/40 rounded-xl px-4 py-3.5 text-xs text-white focus:outline-none transition-all font-semibold"
                      >
                        {["18:00", "18:30", "19:00", "19:30", "20:00", "20:30", "21:00", "21:30", "22:00"].map((t) => (
                          <option key={t} value={t} className="bg-slate-950">{t} PM</option>
                        ))}
                      </select>
                    </div>

                  </div>

                  {/* Execution animated button & keyword search */}
                  <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-4 border-t border-white/5 relative z-10">
                    
                    {/* Keyword search input */}
                    <div className="relative group w-full sm:w-72">
                      <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-[#00D1FF] transition-colors" size={12} />
                      <input
                        type="text"
                        placeholder="Keyword: cod, steak, raw..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full bg-slate-950/40 border border-white/5 focus:border-[#00D1FF]/40 rounded-xl pl-10 pr-4 py-2.5 text-[10px] text-white placeholder:text-slate-600 focus:outline-none transition-all uppercase"
                      />
                    </div>

                    <button
                      onClick={executeGeospatialSearch}
                      disabled={isScanning}
                      className="w-full sm:w-auto px-8 py-3.5 rounded-xl text-[10px] font-black uppercase tracking-widest bg-gradient-to-r from-[#00D1FF] to-[#7B61FF] text-black hover:scale-105 active:scale-95 shadow-[0_0_20px_rgba(0,209,255,0.2)] hover:shadow-[0_0_30px_rgba(123,97,255,0.4)] transition-all flex items-center justify-center gap-2"
                    >
                      {isScanning ? (
                        <>
                          <Loader2 size={12} className="animate-spin" /> SCANNING SATELLITE NODES...
                        </>
                      ) : (
                        <>
                          <Zap size={12} className="animate-pulse" /> INITIATE DINE SEARCH PROTOCOL
                        </>
                      )}
                    </button>
                  </div>

                  {/* AI Recommendations suggestions */}
                  <div className="flex flex-wrap items-center gap-3 select-none text-left relative z-10 pt-2 border-t border-white/5">
                    <span className="text-[8px] font-black uppercase tracking-widest text-[#00D1FF] flex items-center gap-1.5">
                      <Sparkles size={10} /> AI Recommendation Nodes:
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {[
                        { text: "Nobu Malibu tonight", cuisine: "Japanese", location: "Malibu" },
                        { text: "Michelin romantic spot", cuisine: "French", location: "Paris" },
                        { text: "Under $300 woodfire", cuisine: "Wood Fire", location: "Basque Country" }
                      ].map((rec) => (
                        <button
                          key={rec.text}
                          onClick={() => {
                            setSearchLocation(rec.location);
                            setSelectedCuisine(rec.cuisine);
                            setSearchQuery(rec.text);
                            handleSendChatMessage(`Filter nodes: location ${rec.location}, cuisine ${rec.cuisine}`);
                          }}
                          className="px-2.5 py-1 rounded-md text-[8px] font-bold text-slate-400 bg-white/5 hover:bg-[#00D1FF]/10 hover:text-white transition-colors"
                        >
                          &ldquo;{rec.text}&rdquo;
                        </button>
                      ))}
                    </div>
                  </div>

                </div>

                {/* Restaurant Cards Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {filteredRestaurants.map((restaurant) => (
                    <motion.div
                      key={restaurant.id}
                      whileHover={{ y: -6, scale: 1.01 }}
                      className="glass-panel p-4 rounded-[28px] border-white/5 hover:border-[#00D1FF]/30 transition-all hover:shadow-[0_0_35px_rgba(0,209,255,0.15)] flex flex-col justify-between group overflow-hidden relative text-left bg-slate-900/[0.08]"
                    >
                      {/* Vibrant ambient backing glow */}
                      <div className="absolute inset-0 pointer-events-none z-0 rounded-[28px] transition-all opacity-30 group-hover:opacity-80 duration-500" style={{ background: restaurant.gradient }} />
                      
                      <div className="relative z-10 space-y-4">
                        
                        {/* 1. Restaurant Image / High-End Visual Thumbnail */}
                        <div className="h-44 relative rounded-[20px] overflow-hidden border border-white/5 bg-slate-950 flex items-center justify-center select-none shadow-[0_8px_20px_rgba(0,0,0,0.4)] group">
                          {restaurant.image ? (
                            <img 
                              src={restaurant.image} 
                              alt={restaurant.name} 
                              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
                            />
                          ) : (
                            <>
                              <div className="absolute inset-0 bg-cyber-grid opacity-10" />
                              <div className={`absolute inset-0 bg-gradient-to-tr ${restaurant.accentColor} opacity-20 blur-2xl group-hover:scale-110 transition-transform duration-700`} />
                              <div className="absolute inset-10 rounded-full border border-dashed border-white/5 animate-spin-slow opacity-30" />
                              <div className="w-16 h-16 rounded-3xl bg-white/5 border border-white/10 flex items-center justify-center text-white/40 group-hover:text-[#00D1FF] group-hover:border-[#00D1FF]/30 group-hover:shadow-[0_0_20px_rgba(0,209,255,0.2)] transition-all duration-500 scale-100 group-hover:scale-105">
                                <Utensils size={28} strokeWidth={1.5} />
                              </div>
                            </>
                          )}

                          {/* Floating Live Availability Badge */}
                          <div className="absolute top-4 left-4 z-20 flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-950/80 border border-green-500/20 text-[7px] text-green-400 font-black uppercase tracking-widest animate-pulse shadow-md">
                            <div className="w-1 h-1 rounded-full bg-green-400 shadow-[0_0_6px_#4ade80]" /> {restaurant.availability}
                          </div>

                          {/* Floating Distance Badge */}
                          <div className="absolute bottom-4 right-4 z-20 px-3 py-1 rounded-full bg-slate-950/80 border border-white/5 text-[7px] text-slate-400 font-black uppercase tracking-widest shadow-md">
                            {restaurant.distance}
                          </div>
                        </div>

                        {/* Card Info Content */}
                        <div className="space-y-3">
                          {/* Card Header (Cuisine & Rating) */}
                          <div className="flex justify-between items-center">
                            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/5 border border-white/5">
                              <span className="text-[8px] font-black uppercase tracking-widest text-[#00D1FF]">{restaurant.cuisine}</span>
                            </div>
                            
                            <div className="flex items-center gap-1 text-amber-400 px-2 py-0.5 rounded-lg bg-slate-950/40 border border-white/5 text-[9px] font-black">
                              <Star size={10} fill="currentColor" />
                              <span>{Number(restaurant.rating || 4.5).toFixed(1)}</span>
                            </div>
                          </div>

                          {/* Card Title & Desc */}
                          <div>
                            <h3 className="text-lg font-black tracking-tight text-white group-hover:text-[#00D1FF] transition-colors">
                              {restaurant.name}
                            </h3>
                            <div className="text-[9px] text-slate-500 font-bold uppercase tracking-wider flex items-center gap-1 mt-0.5">
                              <MapPin size={10} className="text-[#7B61FF]" /> {restaurant.location}
                            </div>
                          </div>
                          
                          <p className="text-[11px] text-slate-400 font-medium leading-relaxed line-clamp-2 min-h-[32px]">
                            {restaurant.description}
                          </p>

                          {/* Available Timing Badges */}
                          <div className="space-y-1.5">
                            <div className="text-[7px] font-black uppercase tracking-widest text-slate-500">Available Time Slots</div>
                            <div className="flex flex-wrap gap-2">
                              {restaurant.availableTimes.map((timeStr) => (
                                <button
                                  key={timeStr}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setBookingForm((prev) => ({
                                      ...prev,
                                      time: timeStr,
                                      date: prev.date || new Date(Date.now() + 86400000).toISOString().split('T')[0] // default to tomorrow if blank
                                    }));
                                    setBookingModalRestaurant(restaurant);
                                  }}
                                  className="px-2.5 py-1.5 rounded-lg border border-white/5 hover:border-[#00D1FF]/40 bg-slate-950/60 hover:bg-[#00D1FF]/10 text-[9px] font-bold text-slate-400 hover:text-white transition-all shadow-sm active:scale-95"
                                >
                                  {timeStr} PM
                                </button>
                              ))}
                            </div>
                          </div>

                        </div>
                      </div>

                      {/* Footer Actions */}
                      <div className="relative z-10 flex justify-between items-center pt-3 mt-4 border-t border-white/5">
                        <div className="space-y-0.5">
                          <div className="text-[7px] font-black uppercase tracking-widest text-slate-500">Signature dish</div>
                          <div className="text-[10px] font-black text-slate-200 truncate max-w-[120px]">
                            {restaurant.signatureDish}
                          </div>
                        </div>

                        <button
                          onClick={() => setBookingModalRestaurant(restaurant)}
                          className="px-5 py-2.5 rounded-full text-[9px] font-black uppercase tracking-widest bg-white hover:bg-[#00D1FF] text-black hover:scale-105 active:scale-95 shadow-sm group-hover:shadow-[0_0_20px_rgba(0,209,255,0.2)] transition-all flex items-center gap-1.5"
                        >
                          Book Now <ChevronRight size={10} />
                        </button>
                      </div>
                    </motion.div>
                  ))}

                  {filteredRestaurants.length === 0 && (
                    <div className="col-span-full glass-panel p-16 rounded-[28px] border-white/5 text-center space-y-4">
                      <div className="w-16 h-16 rounded-full bg-slate-900 border border-white/10 flex items-center justify-center text-slate-500 mx-auto">
                        <Info size={28} />
                      </div>
                      <h4 className="text-base font-black uppercase tracking-widest text-slate-300">No Restaurants Found</h4>
                      <p className="text-xs text-slate-500 max-w-sm mx-auto leading-relaxed">
                        No restaurant matching your criteria discovered in this coordinate system. Try refining your filters or queries.
                      </p>
                    </div>
                  )}
                </div>
              </motion.div>
            )}

            {/* 🏨 HOTEL NODE VIEW */}
            {nodeMode === 'hotels' && (
              <motion.div
                key="hotels-node"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                className="space-y-8 flex-1"
                id="hotels-section"
              >
                {/* ── HOTEL SEARCH & FILTER CONSOLE ───────────────────────── */}
                <div className="glass-panel border-white/5 p-6 md:p-8 rounded-[28px] bg-slate-900/10 space-y-6 relative overflow-hidden">
                  <div className="absolute inset-0 bg-cyber-grid opacity-5 pointer-events-none" />
                  
                  <div className="text-[10px] font-black uppercase tracking-[0.3em] text-[#7B61FF] flex items-center gap-2 relative z-10">
                    <Compass size={14} className="animate-spin-slow" /> Geolocation & Hotel Search Matrix
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 relative z-10">
                    {/* 1. Destination Search */}
                    <div className="space-y-2 text-left">
                      <label className="text-[8px] font-black uppercase tracking-widest text-slate-400 block ml-1">Destination Search</label>
                      <div className="relative group">
                        <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-[#7B61FF] transition-colors" size={14} />
                        <input
                          type="text"
                          placeholder="TOKYO, PARIS, NY..."
                          value={searchLocation}
                          onChange={(e) => setSearchLocation(e.target.value)}
                          className="w-full bg-slate-950/60 border border-white/5 focus:border-[#7B61FF]/40 rounded-xl pl-10 pr-4 py-3.5 text-xs text-white placeholder:text-slate-600 focus:outline-none transition-all uppercase font-semibold"
                        />
                      </div>
                    </div>

                    {/* 2. Suite Category Filter */}
                    <div className="space-y-2 text-left">
                      <label className="text-[8px] font-black uppercase tracking-widest text-slate-400 block ml-1">Suite Class</label>
                      <select
                        value={selectedCuisine}
                        onChange={(e) => setSelectedCuisine(e.target.value)}
                        className="w-full bg-slate-950/60 border border-white/5 focus:border-[#7B61FF]/40 rounded-xl px-4 py-3.5 text-xs text-white focus:outline-none transition-all font-semibold"
                      >
                        <option value="All" className="bg-slate-950">ALL SUITES</option>
                        <option value="Deluxe" className="bg-slate-950">DELUXE ROOMS</option>
                        <option value="Aman" className="bg-slate-950">AMAN SUITES</option>
                        <option value="Chanel" className="bg-slate-950">COCO CHANEL SUITES</option>
                        <option value="Royal" className="bg-slate-950">ROYAL SUITES</option>
                        <option value="Mesa" className="bg-slate-950">MESA VIEW SUITES</option>
                      </select>
                    </div>

                    {/* 3. Check-In Date */}
                    <div className="space-y-2 text-left">
                      <label className="text-[8px] font-black uppercase tracking-widest text-slate-400 block ml-1">Check-in</label>
                      <input
                        type="date"
                        value={hotelForm.checkIn}
                        onChange={(e) => setHotelForm(prev => ({ ...prev, checkIn: e.target.value }))}
                        className="w-full bg-slate-950/60 border border-white/5 focus:border-[#7B61FF]/40 rounded-xl px-4 py-3 text-xs text-white focus:outline-none transition-all font-semibold uppercase"
                      />
                    </div>

                    {/* 4. Check-Out Date */}
                    <div className="space-y-2 text-left">
                      <label className="text-[8px] font-black uppercase tracking-widest text-slate-400 block ml-1">Check-out</label>
                      <input
                        type="date"
                        value={hotelForm.checkOut}
                        onChange={(e) => setHotelForm(prev => ({ ...prev, checkOut: e.target.value }))}
                        className="w-full bg-slate-950/60 border border-white/5 focus:border-[#7B61FF]/40 rounded-xl px-4 py-3 text-xs text-white focus:outline-none transition-all font-semibold uppercase"
                      />
                    </div>

                    {/* 5. Guests Selector */}
                    <div className="space-y-2 text-left">
                      <label className="text-[8px] font-black uppercase tracking-widest text-slate-400 block ml-1">Guests</label>
                      <select
                        value={hotelForm.guests}
                        onChange={(e) => setHotelForm(prev => ({ ...prev, guests: Number(e.target.value) }))}
                        className="w-full bg-slate-950/60 border border-white/5 focus:border-[#7B61FF]/40 rounded-xl px-4 py-3.5 text-xs text-white focus:outline-none transition-all font-semibold"
                      >
                        {[1, 2, 3, 4, 6, 8].map((num) => (
                          <option key={num} value={num} className="bg-slate-950">{num} GUESTS</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-4 border-t border-white/5 relative z-10">
                    <div className="relative group w-full sm:w-72">
                      <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-[#7B61FF] transition-colors" size={12} />
                      <input
                        type="text"
                        placeholder="Keyword: Tokyo, Ritz, Pool..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full bg-slate-950/40 border border-white/5 focus:border-[#7B61FF]/40 rounded-xl pl-10 pr-4 py-2.5 text-[10px] text-white placeholder:text-slate-600 focus:outline-none transition-all uppercase"
                      />
                    </div>

                    <button
                      onClick={executeGeospatialSearch}
                      disabled={isScanning}
                      className="w-full sm:w-auto px-8 py-3.5 rounded-xl text-[10px] font-black uppercase tracking-widest bg-gradient-to-r from-[#7B61FF] to-[#00D1FF] text-white hover:scale-105 active:scale-95 shadow-[0_0_20px_rgba(123,97,255,0.2)] transition-all flex items-center justify-center gap-2"
                    >
                      {isScanning ? (
                        <>
                          <Loader2 size={12} className="animate-spin" /> SCANNING ORBITAL HOTELS...
                        </>
                      ) : (
                        <>
                          <Zap size={12} className="animate-pulse" /> INITIATE HOTEL SEARCH PROTOCOL
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {/* Hotel Cards Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {hotels
                    .filter((h) => {
                      const matchesSearch = h.name.toLowerCase().includes(searchQuery.toLowerCase()) || h.location.toLowerCase().includes(searchQuery.toLowerCase());
                      const matchesLocation = !searchLocation || h.location.toLowerCase().includes(searchLocation.toLowerCase());
                      return matchesSearch && matchesLocation;
                    })
                    .map((hotel) => (
                      <motion.div
                        key={hotel.id}
                        whileHover={{ y: -6, scale: 1.01 }}
                        className="glass-panel p-4 rounded-[28px] border-white/5 hover:border-[#7B61FF]/30 transition-all hover:shadow-[0_0_35px_rgba(123,97,255,0.15)] flex flex-col justify-between group overflow-hidden relative text-left bg-slate-900/[0.08]"
                      >
                        <div className="absolute inset-0 pointer-events-none z-0 rounded-[28px] transition-all opacity-30 group-hover:opacity-80 duration-500" style={{ background: hotel.gradient }} />
                        
                        <div className="relative z-10 space-y-4">
                          <div className="h-44 relative rounded-[20px] overflow-hidden border border-white/5 bg-slate-950 flex items-center justify-center select-none shadow-[0_8px_20px_rgba(0,0,0,0.4)] group">
                            {hotel.image ? (
                              <img 
                                src={hotel.image} 
                                alt={hotel.name} 
                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
                              />
                            ) : (
                              <>
                                <div className="absolute inset-0 bg-cyber-grid opacity-10" />
                                <div className={`absolute inset-0 bg-gradient-to-tr ${hotel.accentColor} opacity-20 blur-2xl group-hover:scale-110 transition-transform duration-700`} />
                                <div className="absolute inset-10 rounded-full border border-dashed border-white/5 animate-spin-slow opacity-30" />
                                <div className="w-16 h-16 rounded-3xl bg-white/5 border border-white/10 flex items-center justify-center text-white/40 group-hover:text-[#7B61FF] group-hover:border-[#7B61FF]/30 group-hover:shadow-[0_0_20px_rgba(123,97,255,0.2)] transition-all duration-500 scale-100 group-hover:scale-105">
                                  <Hotel size={28} strokeWidth={1.5} />
                                </div>
                              </>
                            )}

                            {/* Floating Availability & Distance Badges */}
                            <div className="absolute top-4 left-4 z-20 flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-950/80 border border-green-500/20 text-[7px] text-green-400 font-black uppercase tracking-widest animate-pulse shadow-md">
                              <div className="w-1 h-1 rounded-full bg-green-400 shadow-[0_0_6px_#4ade80]" /> {hotel.availability}
                            </div>

                            <div className="absolute bottom-4 right-4 z-20 px-3 py-1 rounded-full bg-slate-950/80 border border-white/5 text-[7px] text-slate-400 font-black uppercase tracking-widest shadow-md">
                              {hotel.distance}
                            </div>
                          </div>

                          <div className="space-y-3">
                            <div className="flex justify-between items-center">
                              <span className="text-[8px] font-black uppercase tracking-widest text-[#7B61FF] bg-white/5 border border-white/5 px-2.5 py-1 rounded-lg">Luxury Lodging</span>
                              <div className="flex items-center gap-1 text-amber-400 px-2 py-0.5 rounded-lg bg-slate-950/40 border border-white/5 text-[9px] font-black">
                                <Star size={10} fill="currentColor" />
                                <span>{Number(hotel.rating || 4.5).toFixed(1)}</span>
                              </div>
                            </div>

                            <div>
                              <h3 className="text-lg font-black tracking-tight text-white group-hover:text-[#7B61FF] transition-colors">{hotel.name}</h3>
                              <div className="text-[9px] text-slate-500 font-bold uppercase tracking-wider flex items-center gap-1 mt-0.5">
                                <MapPin size={10} className="text-[#00D1FF]" /> {hotel.location}
                              </div>
                            </div>
                            
                            <p className="text-[11px] text-slate-400 font-medium leading-relaxed line-clamp-2 min-h-[32px]">{hotel.description}</p>

                            <div className="space-y-1.5">
                              <div className="text-[7px] font-black uppercase tracking-widest text-slate-500">Room Types & Availability</div>
                              {/* Show room type cards if it's an admin hotel (has singleRooms/doubleRooms) */}
                              {((hotel as any).singleRooms > 0 || (hotel as any).doubleRooms > 0) ? (
                                <div className="grid grid-cols-2 gap-2">
                                  {(hotel as any).singleRooms > 0 && (
                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        setHotelForm((prev) => ({
                                          ...prev,
                                          suite: `Single Room (${(hotel as any).singleRooms} available)`,
                                          checkIn: prev.checkIn || new Date(Date.now() + 86400000).toISOString().split('T')[0],
                                          checkOut: prev.checkOut || new Date(Date.now() + 86400000 * 3).toISOString().split('T')[0]
                                        }));
                                        setBookingModalHotel(hotel);
                                      }}
                                      className="p-2 rounded-xl border border-[#00D1FF]/20 bg-[#00D1FF]/5 hover:bg-[#00D1FF]/10 text-left transition-all active:scale-95 group/room"
                                    >
                                      <div className="text-[8px] font-black text-[#00D1FF] uppercase">Single Room</div>
                                      <div className="text-[7px] text-slate-500 mt-0.5">{(hotel as any).singleRooms} available</div>
                                      <div className="text-[9px] font-black text-white mt-1">${(hotel as any).singlePrice}<span className="text-[7px] text-slate-500">/night</span></div>
                                    </button>
                                  )}
                                  {(hotel as any).doubleRooms > 0 && (
                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        setHotelForm((prev) => ({
                                          ...prev,
                                          suite: `Double Room (${(hotel as any).doubleRooms} available)`,
                                          checkIn: prev.checkIn || new Date(Date.now() + 86400000).toISOString().split('T')[0],
                                          checkOut: prev.checkOut || new Date(Date.now() + 86400000 * 3).toISOString().split('T')[0]
                                        }));
                                        setBookingModalHotel(hotel);
                                      }}
                                      className="p-2 rounded-xl border border-[#7B61FF]/20 bg-[#7B61FF]/5 hover:bg-[#7B61FF]/10 text-left transition-all active:scale-95 group/room"
                                    >
                                      <div className="text-[8px] font-black text-[#7B61FF] uppercase">Double Room</div>
                                      <div className="text-[7px] text-slate-500 mt-0.5">{(hotel as any).doubleRooms} available</div>
                                      <div className="text-[9px] font-black text-white mt-1">${(hotel as any).doublePrice}<span className="text-[7px] text-slate-500">/night</span></div>
                                    </button>
                                  )}
                                </div>
                              ) : (
                                <div className="flex flex-wrap gap-2">
                                  {hotel.suites.map((suiteName) => (
                                    <button
                                      key={suiteName}
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        setHotelForm((prev) => ({
                                          ...prev,
                                          suite: suiteName,
                                          checkIn: prev.checkIn || new Date(Date.now() + 86400000).toISOString().split('T')[0],
                                          checkOut: prev.checkOut || new Date(Date.now() + 86400000 * 3).toISOString().split('T')[0]
                                        }));
                                        setBookingModalHotel(hotel);
                                      }}
                                      className="px-2.5 py-1.5 rounded-lg border border-white/5 hover:border-[#7B61FF]/40 bg-slate-950/60 hover:bg-[#7B61FF]/10 text-[9px] font-bold text-slate-400 hover:text-white transition-all shadow-sm active:scale-95"
                                    >
                                      {suiteName}
                                    </button>
                                  ))}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>

                        <div className="relative z-10 flex justify-between items-center pt-3 mt-4 border-t border-white/5">
                          <div className="space-y-0.5">
                            <div className="text-[7px] font-black uppercase tracking-widest text-slate-500">
                              {((hotel as any).singleRooms > 0 || (hotel as any).doubleRooms > 0) ? 'Starting From' : 'Suite Rate / Night'}
                            </div>
                            <div className="text-[10px] font-black text-[#7B61FF]">
                              ${((hotel as any).singlePrice && (hotel as any).doublePrice)
                                ? Math.min((hotel as any).singlePrice, (hotel as any).doublePrice)
                                : (hotel as any).singlePrice || (hotel as any).doublePrice || hotel.ratePerNight} USD / night
                            </div>
                          </div>

                          <button
                            onClick={() => {
                              setHotelForm(prev => ({
                                ...prev,
                                suite: hotel.suites[0],
                                checkIn: prev.checkIn || new Date(Date.now() + 86400000).toISOString().split('T')[0],
                                checkOut: prev.checkOut || new Date(Date.now() + 86400000 * 3).toISOString().split('T')[0]
                              }));
                              setBookingModalHotel(hotel);
                            }}
                            className="px-5 py-2.5 rounded-full text-[9px] font-black uppercase tracking-widest bg-white hover:bg-[#7B61FF] text-black hover:scale-105 active:scale-95 shadow-sm transition-all flex items-center gap-1.5"
                          >
                            Reserve Room <ChevronRight size={10} />
                          </button>
                        </div>
                      </motion.div>
                    ))}
                </div>
              </motion.div>
            )}

            {/* 🛍️ E-COMMERCE SHOPPING NODE VIEW */}
            {nodeMode === 'shopping' && (
              <motion.div
                key="shopping-node"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                className="space-y-8 flex-1"
                id="shopping-section"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {products.map((product) => (
                    <motion.div
                      key={product.id}
                      whileHover={{ y: -6, scale: 1.01 }}
                      className="glass-panel p-4 rounded-[28px] border-white/5 hover:border-pink-500/30 transition-all hover:shadow-[0_0_35px_rgba(236,72,153,0.15)] flex flex-col justify-between group overflow-hidden relative text-left bg-slate-900/[0.08]"
                    >
                      <div className="absolute inset-0 pointer-events-none z-0 rounded-[28px] transition-all opacity-30 group-hover:opacity-80 duration-500" style={{ background: product.gradient }} />
                      
                      <div className="relative z-10 space-y-4">
                        <div className="h-44 relative rounded-[20px] overflow-hidden border border-white/5 bg-slate-950 flex items-center justify-center select-none shadow-[0_8px_20px_rgba(0,0,0,0.4)]">
                          <div className="absolute inset-0 bg-cyber-grid opacity-10" />
                          <div className={`absolute inset-0 bg-gradient-to-tr ${product.accentColor} opacity-20 blur-2xl group-hover:scale-110 transition-transform duration-700`} />
                          
                          <div className="absolute inset-10 rounded-full border border-dashed border-white/5 animate-spin-slow opacity-30" />
                          <div className="w-16 h-16 rounded-3xl bg-white/5 border border-white/10 flex items-center justify-center text-white/40 group-hover:text-pink-400 group-hover:border-pink-500/30 group-hover:shadow-[0_0_20px_rgba(236,72,153,0.2)] transition-all duration-500 scale-100 group-hover:scale-105">
                            <ShoppingBag size={28} strokeWidth={1.5} />
                          </div>

                          <div className="absolute top-4 left-4 z-20 flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-950/80 border border-pink-500/20 text-[7px] text-pink-400 font-black uppercase tracking-widest shadow-md">
                            <Tag size={8} /> {product.category}
                          </div>

                          <div className="absolute bottom-4 right-4 z-20 px-3 py-1 rounded-full bg-slate-950/80 border border-white/5 text-[7px] text-slate-400 font-black uppercase tracking-widest shadow-md">
                            {product.deliveryTime}
                          </div>
                        </div>

                        <div className="space-y-3">
                          <div className="flex justify-between items-center">
                            <span className="text-[8px] font-black uppercase tracking-widest text-pink-400 bg-white/5 border border-white/5 px-2.5 py-1 rounded-lg">High-Tech Gear</span>
                            <div className="text-[10px] text-pink-400 font-extrabold uppercase tracking-widest">
                              ${product.price} USD
                            </div>
                          </div>

                          <div>
                            <h3 className="text-lg font-black tracking-tight text-white group-hover:text-pink-400 transition-colors">{product.name}</h3>
                          </div>
                          
                          <p className="text-[11px] text-slate-400 font-medium leading-relaxed line-clamp-2 min-h-[32px]">{product.description}</p>

                          <div className="space-y-1.5">
                            <div className="text-[7px] font-black uppercase tracking-widest text-slate-500">Core Architecture Specs</div>
                            <div className="space-y-1">
                              {product.specs.map((spec) => (
                                <div key={spec} className="flex items-center gap-1.5 text-[9px] text-slate-400 font-medium leading-none">
                                  <div className="w-1.5 h-1.5 rounded-full bg-pink-500" />
                                  <span>{spec}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="relative z-10 pt-3 mt-4 border-t border-white/5 flex justify-end">
                        <button
                          onClick={() => addToCart(product)}
                          className="px-5 py-2.5 rounded-full text-[9px] font-black uppercase tracking-widest bg-white hover:bg-pink-500 text-black hover:scale-105 active:scale-95 shadow-sm transition-all flex items-center gap-1.5"
                        >
                          <ShoppingCart size={10} /> Add to Neural Cart
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </div>

                {/* ── LIVE SHOPPING CART HUD ─────────────────────────────────────── */}
                <div className="glass-panel border-white/5 p-6 rounded-[28px] bg-slate-900/20 text-left space-y-6 relative overflow-hidden select-none mt-8 border border-pink-500/10">
                  <div className="absolute inset-0 bg-cyber-grid opacity-5 pointer-events-none" />
                  
                  <div className="flex justify-between items-center pb-3 border-b border-white/5">
                    <div className="flex items-center gap-2">
                      <ShoppingCart size={16} className="text-pink-400" />
                      <h4 className="text-xs font-black uppercase tracking-wider">Neural Cart Matrix HUD</h4>
                    </div>
                    <span className="text-[8px] font-mono px-2 py-0.5 rounded-md bg-white/5 text-slate-400">CREDIT SYNC ACTIVE</span>
                  </div>

                  <div className="space-y-4">
                    {cart.map((item) => (
                      <div key={item.product.id} className="p-3.5 rounded-2xl bg-slate-950/40 border border-white/5 flex justify-between items-center gap-4">
                        <div className="space-y-1 truncate">
                          <div className="text-[11px] font-extrabold text-white truncate">{item.product.name}</div>
                          <div className="text-[7.5px] font-bold text-slate-500 uppercase tracking-wider">
                            ${item.product.price} USD • Qty: {item.quantity}
                          </div>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          <button
                            onClick={() => removeFromCart(item.product.id)}
                            className="w-6 h-6 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center text-slate-300 hover:text-white transition-colors"
                          >
                            -
                          </button>
                          <button
                            onClick={() => addToCart(item.product)}
                            className="w-6 h-6 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center text-slate-300 hover:text-white transition-colors"
                          >
                            +
                          </button>
                        </div>
                      </div>
                    ))}

                    {cart.length === 0 && (
                      <div className="py-8 text-center text-slate-500 text-[10px] font-bold uppercase tracking-wider space-y-2">
                        <div className="text-slate-600">Shopping Cart Swarm Dormant</div>
                        <p className="text-[8px] text-slate-600 font-medium max-w-xs mx-auto leading-relaxed">Add high-tech luxury tech devices above to initiate checkout transactions.</p>
                      </div>
                    )}
                  </div>

                  {cart.length > 0 && (
                    <div className="pt-4 border-t border-white/5 space-y-4">
                      <div className="flex justify-between items-center text-slate-200">
                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Cart Total Price</span>
                        <span className="text-sm font-black text-pink-400">
                          ${cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0)} USD
                        </span>
                      </div>
                      
                      <button
                        onClick={() => {
                          setCheckoutForm({ name: '', address: '', zip: '', paymentMethod: 'cod', upiId: '' });
                          setCheckoutOpen(true);
                        }}
                        className="w-full py-4 rounded-xl bg-pink-500 hover:bg-pink-400 text-black text-[9px] font-black uppercase tracking-widest transition-all active:scale-95 flex items-center justify-center gap-1.5 shadow-[0_0_20px_rgba(236,72,153,0.25)]"
                      >
                        <CreditCard size={12} /> INITIATE CHECKOUT PROTOCOL
                      </button>
                    </div>
                  )}
                </div>
              </motion.div>
            )}

            {/* 🗂️ MANAGEMENT NODE VIEW */}
            {nodeMode === 'management' && (
              <motion.div
                key="management-node"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                className="space-y-6 flex-1 text-left"
              >
                <div className="flex gap-2.5 p-1 glass-panel border-white/5 rounded-xl bg-slate-900/20 w-fit mb-4">
                  <button
                    onClick={() => setActiveTab('discover')}
                    className={cn(
                      "px-4 py-2.5 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all flex items-center gap-2",
                      activeTab === 'discover'
                        ? "bg-white/10 text-amber-400 border border-amber-400/20"
                        : "text-slate-400 hover:text-white"
                    )}
                  >
                    <CalendarDays size={11} />
                    Active Bookings Ledger
                  </button>
                  <button
                    onClick={() => setActiveTab('reservations')}
                    className={cn(
                      "px-4 py-2.5 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all flex items-center gap-2",
                      activeTab === 'reservations'
                        ? "bg-white/10 text-pink-400 border border-pink-400/20"
                        : "text-slate-400 hover:text-white"
                    )}
                  >
                    <Package size={11} />
                    Shopping Orders Ledger
                  </button>
                  <button
                    onClick={() => setActiveTab('admin')}
                    className={cn(
                      "px-4 py-2.5 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all flex items-center gap-2",
                      activeTab === 'admin'
                        ? "bg-white/10 text-[#00D1FF] border border-[#00D1FF]/20"
                        : "text-slate-400 hover:text-white"
                    )}
                  >
                    <SlidersHorizontal size={11} />
                    Admin Configurator
                  </button>
                </div>

                {activeTab === 'discover' && (
                  <div className="space-y-6">
                    <div className="flex items-center gap-3 mb-2">
                      <History size={16} className="text-amber-400" />
                      <h3 className="text-sm font-black uppercase tracking-widest">Active Reservation Timeline</h3>
                    </div>

                    <div className="space-y-4">
                      {reservations.filter(r => r && r.id).map((res) => (
                        <div
                          key={res.id}
                          className={cn(
                            "glass-panel p-6 rounded-[24px] border transition-all flex flex-col md:flex-row justify-between items-start md:items-center gap-6 relative overflow-hidden bg-slate-900/[0.04]",
                            res.status === 'confirmed' ? 'border-green-500/10 hover:border-green-500/30' :
                            res.status === 'cancelled' ? 'border-red-500/5 hover:border-red-500/20 opacity-40' :
                            'border-white/5 hover:border-amber-400/30'
                          )}
                        >
                          {res.status === 'confirmed' && <div className="absolute -inset-1 bg-green-500/5 blur-xl pointer-events-none" />}

                          <div className="relative z-10 flex gap-4 items-start">
                            <div className={cn(
                              "w-12 h-12 rounded-xl flex items-center justify-center shrink-0 border",
                              res.status === 'confirmed' ? 'bg-green-500/10 border-green-500/20 text-green-400' :
                              res.status === 'cancelled' ? 'bg-red-500/10 border-red-500/20 text-red-400' :
                              'bg-slate-900 border-white/5 text-amber-400'
                            )}>
                              {res.type === 'hotel' ? <Hotel size={20} /> : <Utensils size={20} />}
                            </div>

                            <div className="space-y-2 text-left">
                              <h4 className="text-lg font-black text-white">
                                {res.restaurant} {res.type === 'hotel' && <span className="text-[10px] text-slate-500 font-bold uppercase">({res.hotelSuite})</span>}
                              </h4>
                              
                              <div className="flex flex-wrap gap-4 text-[10px] text-slate-400 font-bold uppercase tracking-wider items-center">
                                <div className="flex items-center gap-1">
                                  <Calendar size={12} className="text-[#00D1FF]" />
                                  <span>{res.date}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <Clock size={12} className="text-[#7B61FF]" />
                                  <span>{res.time}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <Utensils size={12} className="text-slate-500" />
                                  <span>{res.guests} {res.type === 'hotel' ? 'Adults' : 'Guests'}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <DollarSign size={12} className="text-emerald-400" />
                                  <span className="text-emerald-400 font-black">${res.price || (res.type === 'hotel' ? 1450 : 150 * res.guests)} USD</span>
                                </div>
                                {res.type === 'hotel' && res.paymentMethod && (
                                  <span className={cn(
                                    "text-[8px] font-black uppercase tracking-widest px-2 py-0.5 rounded border",
                                    res.paymentMethod === 'upi' ? "bg-[#00D1FF]/5 border-[#00D1FF]/20 text-[#00D1FF]" : "bg-green-500/5 border-green-500/20 text-green-400"
                                  )}>
                                    Mode: {res.paymentMethod === 'upi' ? 'UPI' : 'COA'}
                                  </span>
                                )}
                              </div>

                              {res.notes && (
                                <p className="text-[11px] text-slate-500 leading-relaxed italic max-w-lg">
                                  &ldquo;{res.notes}&rdquo;
                                </p>
                              )}
                            </div>
                          </div>

                          <div className="relative z-10 flex flex-row md:flex-col items-end gap-3 shrink-0 w-full md:w-auto justify-between border-t md:border-t-0 pt-4 md:pt-0 border-white/5">
                            <div className={cn(
                              "px-3 py-1.5 rounded-lg text-[8px] font-black uppercase tracking-widest border",
                              res.status === 'confirmed' ? 'bg-green-500/5 border-green-500/20 text-green-400' :
                              res.status === 'cancelled' ? 'bg-red-500/5 border-red-500/20 text-red-400' :
                              'bg-slate-900/60 border-white/5 text-amber-400'
                            )}>
                              {res.status === 'confirmed' ? 'Confirmed · Synchronized' :
                               res.status === 'cancelled' ? 'Aborted Reservation' :
                               'Transmitting Node...'}
                            </div>

                            {res.status !== 'cancelled' && (
                              <button
                                onClick={() => handleCancelReservation(res.id)}
                                className="px-4 py-2 rounded-lg text-[8px] font-black uppercase tracking-widest border border-red-500/20 hover:bg-red-500/10 text-red-400 transition-all active:scale-95 flex items-center gap-1.5"
                              >
                                Abort Booking
                              </button>
                            )}
                          </div>
                        </div>
                      ))}

                      {reservations.length === 0 && (
                        <div className="glass-panel p-16 rounded-[28px] border-white/5 text-center space-y-4">
                          <div className="w-16 h-16 rounded-full bg-slate-900 border border-white/10 flex items-center justify-center text-slate-500 mx-auto">
                            <Calendar size={28} />
                          </div>
                          <h4 className="text-base font-black uppercase tracking-widest text-slate-300">No Reservations Found</h4>
                          <p className="text-xs text-slate-500 max-w-sm mx-auto leading-relaxed">
                            No active restaurant or hotel bookings synchronized inside this profile node. Use the discovery grid or speak to the AI assistant to establish one.
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {activeTab === 'reservations' && (
                  <div className="space-y-6">
                    <div className="flex items-center gap-3 mb-2">
                      <Package size={16} className="text-pink-400" />
                      <h3 className="text-sm font-black uppercase tracking-widest">Active E-commerce Order Tracking</h3>
                    </div>

                    <div className="space-y-4">
                      {orders.map((order) => (
                        <div
                          key={order.id}
                          className="glass-panel p-6 rounded-[24px] border border-white/5 hover:border-pink-500/20 transition-all space-y-6 relative overflow-hidden bg-slate-900/[0.04]"
                        >
                          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-4 border-b border-white/5">
                            <div className="space-y-1">
                              <h4 className="text-sm font-black text-white uppercase tracking-widest flex items-center gap-2">
                                <Package size={14} className="text-pink-400" /> Order ID: #{order.id.substring(6) || order.id}
                              </h4>
                              <div className="text-[8px] font-mono text-slate-500 tracking-wider">
                                TRANSACTION: {order.receiptHash}
                              </div>
                            </div>
                            <div className="flex items-center gap-3">
                              <span className="text-[8px] font-black uppercase tracking-widest text-slate-400 bg-white/5 border border-white/5 px-2.5 py-1 rounded-lg">
                                Placed: {order.date}
                              </span>
                              {order.paymentMethod && (
                                <span className={cn(
                                  "text-[8px] font-black uppercase tracking-widest px-2.5 py-1 rounded-lg border",
                                  order.paymentMethod === 'upi' ? "bg-[#00D1FF]/5 border-[#00D1FF]/20 text-[#00D1FF]" : "bg-green-500/5 border-green-500/20 text-green-400"
                                )}>
                                  Mode: {order.paymentMethod === 'upi' ? 'UPI' : 'COD'}
                                </span>
                              )}
                              <span className="text-xs font-black text-pink-400">${order.totalPrice} USD</span>
                            </div>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                            <div className="space-y-2 text-left">
                              <div className="text-[7px] font-black uppercase tracking-widest text-slate-500">Ordered Items</div>
                              <div className="space-y-1">
                                {order.items.map((item) => (
                                  <div key={item.product.id} className="text-[10px] text-slate-300 font-bold uppercase tracking-wider flex items-center gap-2">
                                    <div className="w-1.5 h-1.5 rounded-full bg-pink-500" />
                                    <span>{item.product.name} (x{item.quantity})</span>
                                  </div>
                                ))}
                              </div>
                            </div>

                            <div className="space-y-3 text-left">
                              <div className="text-[7px] font-black uppercase tracking-widest text-slate-500">Shipment Node Status</div>
                              <div className="relative">
                                <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-0.5 bg-white/5 rounded-full z-0" />
                                <div
                                  className="absolute left-0 top-1/2 -translate-y-1/2 h-0.5 bg-pink-500 rounded-full z-0 transition-all duration-1000"
                                  style={{
                                    width: order.status === 'processing' ? '15%' :
                                           order.status === 'synthesizing' ? '50%' :
                                           order.status === 'dispatched' ? '85%' : '100%'
                                  }}
                                />

                                <div className="relative z-10 flex justify-between">
                                  {[
                                    { label: 'Proc', val: 'processing' },
                                    { label: 'Synth', val: 'synthesizing' },
                                    { label: 'Disp', val: 'dispatched' },
                                    { label: 'Deliv', val: 'delivered' }
                                  ].map((node) => {
                                    const stages = ['processing', 'synthesizing', 'dispatched', 'delivered'];
                                    const activeIndex = stages.indexOf(order.status);
                                    const nodeIndex = stages.indexOf(node.val);
                                    const isReached = nodeIndex <= activeIndex;
                                    const isActive = nodeIndex === activeIndex;

                                    return (
                                      <div key={node.val} className="flex flex-col items-center gap-1.5">
                                        <div
                                          className={cn(
                                            "w-3.5 h-3.5 rounded-full border flex items-center justify-center transition-all duration-700 shadow-sm",
                                            isActive ? "bg-pink-500 border-pink-400 scale-125 shadow-[0_0_10px_rgba(236,72,153,0.8)]" :
                                            isReached ? "bg-pink-500/20 border-pink-500/40 text-pink-400" :
                                            "bg-slate-950 border-white/5 text-slate-600"
                                          )}
                                        >
                                          {isReached && <CheckCircle2 size={7} className={isActive ? "text-black" : "text-pink-400"} />}
                                        </div>
                                        <span className={cn(
                                          "text-[7px] font-black uppercase tracking-wider",
                                          isActive ? "text-pink-400" : "text-slate-500"
                                        )}>
                                          {node.label}
                                        </span>
                                      </div>
                                    );
                                  })}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}

                      {orders.length === 0 && (
                        <div className="glass-panel p-16 rounded-[28px] border-white/5 text-center space-y-4">
                          <div className="w-16 h-16 rounded-full bg-slate-900 border border-white/10 flex items-center justify-center text-slate-500 mx-auto">
                            <Package size={28} />
                          </div>
                          <h4 className="text-base font-black uppercase tracking-widest text-slate-300">No Orders Found</h4>
                          <p className="text-xs text-slate-500 max-w-sm mx-auto leading-relaxed">
                            No tech purchases registered. Head over to the Shopping Node to choose and checkout your cybernetic systems.
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {activeTab === 'admin' && (
                  <div className="space-y-6">
                    <div className="flex items-center gap-3 mb-2">
                      <SlidersHorizontal size={16} className="text-[#00D1FF]" />
                      <h3 className="text-sm font-black uppercase tracking-widest text-white">Cybernetic Registry Admin Center</h3>
                    </div>

                    <div className="flex flex-wrap gap-3 mb-6">
                      {[
                        { id: 'hotel', label: 'Hotel Registry', color: '#00D1FF', hoverColor: 'hover:border-[#00D1FF]/40 hover:bg-[#00D1FF]/5', activeColor: 'bg-[#00D1FF]/10 text-[#00D1FF] border-[#00D1FF]/30' },
                        { id: 'restaurant', label: 'Restaurant Registry', color: '#ec4899', hoverColor: 'hover:border-pink-500/40 hover:bg-pink-500/5', activeColor: 'bg-pink-500/10 text-pink-400 border-pink-500/30' },
                        { id: 'product', label: 'Product Registry', color: '#10b981', hoverColor: 'hover:border-green-500/40 hover:bg-green-500/5', activeColor: 'bg-green-500/10 text-green-400 border-green-500/30' }
                      ].map((cat) => (
                        <button
                          key={cat.id}
                          onClick={() => {
                            setSelectedAdminCategory(cat.id as any);
                            setSelectedAdminId(null);
                          }}
                          className={cn(
                            "px-4 py-2.5 rounded-xl text-[9px] font-black uppercase tracking-wider transition-all border border-white/5",
                            selectedAdminCategory === cat.id ? cat.activeColor : `text-slate-400 ${cat.hoverColor}`
                          )}
                        >
                          {cat.label}
                        </button>
                      ))}
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                      {/* Left: Registry List Directory (4 cols) */}
                      <div className="lg:col-span-4 space-y-4">
                        <div className="flex justify-between items-center pb-2 border-b border-white/5">
                          <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Registered Nodes</span>
                          <span className="text-[8px] font-mono text-slate-500 uppercase font-black">
                            Total: {selectedAdminCategory === 'hotel' ? hotels.length : selectedAdminCategory === 'restaurant' ? restaurants.length : products.length}
                          </span>
                        </div>

                        {/* Add new button */}
                        <button
                          onClick={() => handleAddNewAdminItem(selectedAdminCategory)}
                          className={cn(
                            "w-full py-3.5 rounded-xl border border-dashed flex items-center justify-center gap-1.5 text-[8.5px] font-black uppercase tracking-widest transition-all hover:scale-[1.02] active:scale-95",
                            selectedAdminCategory === 'hotel' ? 'border-[#00D1FF]/40 text-[#00D1FF] hover:bg-[#00D1FF]/5' :
                            selectedAdminCategory === 'restaurant' ? 'border-pink-500/40 text-pink-400 hover:bg-pink-500/5' :
                            'border-green-500/40 text-green-400 hover:bg-green-500/5'
                          )}
                        >
                          <Plus size={11} /> Register New {selectedAdminCategory === 'hotel' ? 'Hotel' : selectedAdminCategory === 'restaurant' ? 'Restaurant' : 'Product'}
                        </button>

                        {/* Node List */}
                        <div className="space-y-2 max-h-[460px] overflow-y-auto no-scrollbar pr-1">
                          {(selectedAdminCategory === 'hotel' ? hotels : selectedAdminCategory === 'restaurant' ? restaurants : products).map((item) => {
                            const isActive = selectedAdminId === item.id;
                            return (
                              <div
                                key={item.id}
                                onClick={() => setSelectedAdminId(item.id)}
                                className={cn(
                                  "p-4 rounded-xl border text-left transition-all cursor-pointer flex justify-between items-center gap-3 group relative overflow-hidden",
                                  isActive
                                    ? selectedAdminCategory === 'hotel' ? 'bg-[#00D1FF]/10 border-[#00D1FF]/30 text-white' :
                                      selectedAdminCategory === 'restaurant' ? 'bg-pink-500/10 border-pink-500/30 text-white' :
                                      'bg-green-500/10 border-green-500/30 text-white'
                                    : 'bg-slate-950/40 border-white/5 text-slate-400 hover:bg-white/5 hover:text-white'
                                )}
                              >
                                <div className="truncate space-y-1">
                                  <div className="text-[11px] font-extrabold truncate">{item.name}</div>
                                  <div className="text-[7.5px] font-mono text-slate-500 uppercase tracking-widest flex items-center gap-1.5">
                                    <span>ID: {item.id.substring(0, 12)}...</span>
                                    {selectedAdminCategory === 'hotel' && <span>• ${(item as any).ratePerNight || 0}/N</span>}
                                    {selectedAdminCategory === 'restaurant' && <span>• {(item as any).cuisine}</span>}
                                    {selectedAdminCategory === 'product' && <span>• ${(item as any).price} USD</span>}
                                  </div>
                                </div>

                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleDeleteAdminItem(selectedAdminCategory, item.id);
                                  }}
                                  className="w-7 h-7 rounded-lg bg-white/5 hover:bg-red-500/20 text-slate-500 hover:text-red-400 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all shrink-0"
                                >
                                  <Trash2 size={11} />
                                </button>
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      {/* Right: Live Configurator Form (8 cols) */}
                      <div className="lg:col-span-8">
                        {(() => {
                          const currentItem = selectedAdminCategory === 'hotel'
                            ? hotels.find(h => h.id === selectedAdminId)
                            : selectedAdminCategory === 'restaurant'
                            ? restaurants.find(r => r.id === selectedAdminId)
                            : products.find(p => p.id === selectedAdminId);

                          if (!currentItem) {
                            return (
                              <div className="glass-panel p-16 rounded-[28px] border-white/5 text-center space-y-4 h-full flex flex-col justify-center items-center">
                                <div className={cn(
                                  "w-14 h-14 rounded-full border flex items-center justify-center text-slate-500",
                                  selectedAdminCategory === 'hotel' ? 'border-[#00D1FF]/20 text-[#00D1FF]/60' :
                                  selectedAdminCategory === 'restaurant' ? 'border-pink-500/20 text-pink-500/60' :
                                  'border-green-500/20 text-green-500/60'
                                )}>
                                  <SlidersHorizontal size={24} />
                                </div>
                                <h4 className="text-xs font-black uppercase tracking-widest text-slate-300">Live Registry Sync Dormant</h4>
                                <p className="text-[10px] text-slate-500 max-w-xs leading-relaxed">
                                  Select an existing registry node from the directory or register a new one to initialize real-time keystroke auto-syncing.
                                </p>
                              </div>
                            );
                          }

                          const hotelItem = currentItem as HotelEntity;
                          const restItem = currentItem as Restaurant;
                          const prodItem = currentItem as Product;

                          return (
                            <div className={cn(
                              "glass-panel p-6 md:p-8 rounded-[28px] bg-slate-900/10 space-y-6 relative overflow-hidden border text-left",
                              selectedAdminCategory === 'hotel' ? 'border-[#00D1FF]/10' :
                              selectedAdminCategory === 'restaurant' ? 'border-pink-500/10' :
                              'border-green-500/10'
                            )}>
                              <div className="absolute inset-0 bg-cyber-grid opacity-5 pointer-events-none" />

                              <div className="flex justify-between items-center pb-4 border-b border-white/5 relative z-10">
                                <div className="space-y-1">
                                  <div className="flex items-center gap-2">
                                    <span className={cn(
                                      "w-2 h-2 rounded-full animate-pulse shadow-[0_0_8px_currentColor]",
                                      selectedAdminCategory === 'hotel' ? 'bg-[#00D1FF] text-[#00D1FF]' :
                                      selectedAdminCategory === 'restaurant' ? 'bg-pink-500 text-pink-500' :
                                      'bg-green-500 text-green-500'
                                    )} />
                                    <h4 className="text-xs font-black uppercase tracking-wider text-white">Live Configurator HUD</h4>
                                  </div>
                                  <div className="text-[7.5px] font-mono text-slate-500 uppercase tracking-widest font-black">
                                    Node Ref: {currentItem.id}
                                  </div>
                                </div>

                                <div className="flex items-center gap-1.5 px-3 py-1 rounded-full border border-green-500/10 bg-green-500/5 text-green-400 text-[7px] font-black uppercase tracking-widest">
                                  <CheckCircle2 size={8} /> REAL-TIME AUTO-SAVING
                                </div>
                              </div>

                              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 relative z-10">
                                {/* Name Input */}
                                <div className="space-y-2">
                                  <label className="text-[7.5px] font-black uppercase tracking-widest text-slate-400 block ml-1">Registry Node Name</label>
                                  <input
                                    type="text"
                                    value={currentItem.name}
                                    onChange={(e) => {
                                      if (selectedAdminCategory === 'hotel') autoSaveHotel(currentItem.id, 'name', e.target.value);
                                      else if (selectedAdminCategory === 'restaurant') autoSaveRestaurant(currentItem.id, 'name', e.target.value);
                                      else autoSaveProduct(currentItem.id, 'name', e.target.value);
                                    }}
                                    className="w-full bg-slate-950/60 border border-white/5 focus:border-white/20 rounded-xl px-4 py-3 text-xs text-white placeholder:text-slate-600 focus:outline-none transition-all"
                                    placeholder="Enter node name..."
                                  />
                                </div>

                                {selectedAdminCategory === 'hotel' && (
                                  <>
                                    {/* Price / Rate Per Night */}
                                    <div className="space-y-2">
                                      <label className="text-[7.5px] font-black uppercase tracking-widest text-slate-400 block ml-1">Rate Per Night ($)</label>
                                      <input
                                        type="number"
                                        value={hotelItem.ratePerNight || ''}
                                        onChange={(e) => autoSaveHotel(currentItem.id, 'ratePerNight', parseFloat(e.target.value) || 0)}
                                        className="w-full bg-slate-950/60 border border-white/5 focus:border-white/20 rounded-xl px-4 py-3 text-xs text-white placeholder:text-slate-600 focus:outline-none transition-all"
                                        placeholder="1200"
                                      />
                                    </div>

                                    {/* Rating */}
                                    <div className="space-y-2">
                                      <label className="text-[7.5px] font-black uppercase tracking-widest text-slate-400 block ml-1">Rating Coefficient (1.0 - 5.0)</label>
                                      <input
                                        type="number"
                                        step="0.1"
                                        min="1"
                                        max="5"
                                        value={hotelItem.rating || ''}
                                        onChange={(e) => autoSaveHotel(currentItem.id, 'rating', parseFloat(e.target.value) || 0)}
                                        className="w-full bg-slate-950/60 border border-white/5 focus:border-white/20 rounded-xl px-4 py-3 text-xs text-white placeholder:text-slate-600 focus:outline-none transition-all"
                                        placeholder="4.8"
                                      />
                                    </div>

                                    {/* Price Range */}
                                    <div className="space-y-2">
                                      <label className="text-[7.5px] font-black uppercase tracking-widest text-slate-400 block ml-1">Price Range</label>
                                      <select
                                        value={hotelItem.priceRange}
                                        onChange={(e) => autoSaveHotel(currentItem.id, 'priceRange', e.target.value)}
                                        className="w-full bg-slate-950/60 border border-white/5 focus:border-white/20 rounded-xl px-4 py-3 text-xs text-slate-300 focus:outline-none transition-all"
                                      >
                                        <option value="$$">$$ (Standard)</option>
                                        <option value="$$$">$$$ (Premium)</option>
                                        <option value="$$$$">$$$$ (Ultra Luxury)</option>
                                      </select>
                                    </div>

                                    {/* Location */}
                                    <div className="space-y-2">
                                      <label className="text-[7.5px] font-black uppercase tracking-widest text-slate-400 block ml-1">Geographic Coordinates / Location</label>
                                      <input
                                        type="text"
                                        value={hotelItem.location}
                                        onChange={(e) => autoSaveHotel(currentItem.id, 'location', e.target.value)}
                                        className="w-full bg-slate-950/60 border border-white/5 focus:border-white/20 rounded-xl px-4 py-3 text-xs text-white placeholder:text-slate-600 focus:outline-none transition-all"
                                        placeholder="e.g. Chiyoda-ku, Tokyo"
                                      />
                                    </div>

                                    {/* Distance */}
                                    <div className="space-y-2">
                                      <label className="text-[7.5px] font-black uppercase tracking-widest text-slate-400 block ml-1">LIDAR Distance Offset</label>
                                      <input
                                        type="text"
                                        value={hotelItem.distance}
                                        onChange={(e) => autoSaveHotel(currentItem.id, 'distance', e.target.value)}
                                        className="w-full bg-slate-950/60 border border-white/5 focus:border-white/20 rounded-xl px-4 py-3 text-xs text-white placeholder:text-slate-600 focus:outline-none transition-all"
                                        placeholder="e.g. 0.8 miles"
                                      />
                                    </div>

                                    {/* Single Rooms Available */}
                                    <div className="space-y-2">
                                      <label className="text-[7.5px] font-black uppercase tracking-widest text-slate-400 block ml-1">Single Rooms Available</label>
                                      <input
                                        type="number"
                                        value={(hotelItem as any).singleRooms || ''}
                                        onChange={(e) => autoSaveHotel(currentItem.id, 'singleRooms', parseInt(e.target.value) || 0)}
                                        className="w-full bg-slate-950/60 border border-white/5 focus:border-white/20 rounded-xl px-4 py-3 text-xs text-white placeholder:text-slate-600 focus:outline-none transition-all"
                                        placeholder="0"
                                      />
                                    </div>

                                    {/* Single Room Price */}
                                    <div className="space-y-2">
                                      <label className="text-[7.5px] font-black uppercase tracking-widest text-slate-400 block ml-1">Single Room Price ($)</label>
                                      <input
                                        type="number"
                                        value={(hotelItem as any).singlePrice || ''}
                                        onChange={(e) => autoSaveHotel(currentItem.id, 'singlePrice', parseFloat(e.target.value) || 0)}
                                        className="w-full bg-slate-950/60 border border-white/5 focus:border-white/20 rounded-xl px-4 py-3 text-xs text-white placeholder:text-slate-600 focus:outline-none transition-all"
                                        placeholder="0"
                                      />
                                    </div>

                                    {/* Double Rooms Available */}
                                    <div className="space-y-2">
                                      <label className="text-[7.5px] font-black uppercase tracking-widest text-slate-400 block ml-1">Double Rooms Available</label>
                                      <input
                                        type="number"
                                        value={(hotelItem as any).doubleRooms || ''}
                                        onChange={(e) => autoSaveHotel(currentItem.id, 'doubleRooms', parseInt(e.target.value) || 0)}
                                        className="w-full bg-slate-950/60 border border-white/5 focus:border-white/20 rounded-xl px-4 py-3 text-xs text-white placeholder:text-slate-600 focus:outline-none transition-all"
                                        placeholder="0"
                                      />
                                    </div>

                                    {/* Double Room Price */}
                                    <div className="space-y-2">
                                      <label className="text-[7.5px] font-black uppercase tracking-widest text-slate-400 block ml-1">Double Room Price ($)</label>
                                      <input
                                        type="number"
                                        value={(hotelItem as any).doublePrice || ''}
                                        onChange={(e) => autoSaveHotel(currentItem.id, 'doublePrice', parseFloat(e.target.value) || 0)}
                                        className="w-full bg-slate-950/60 border border-white/5 focus:border-white/20 rounded-xl px-4 py-3 text-xs text-white placeholder:text-slate-600 focus:outline-none transition-all"
                                        placeholder="0"
                                      />
                                    </div>

                                    {/* Signature Suite */}
                                    <div className="space-y-2">
                                      <label className="text-[7.5px] font-black uppercase tracking-widest text-slate-400 block ml-1">Signature Suite Name</label>
                                      <input
                                        type="text"
                                        value={hotelItem.signatureSuite || ''}
                                        onChange={(e) => autoSaveHotel(currentItem.id, 'signatureSuite', e.target.value)}
                                        className="w-full bg-slate-950/60 border border-white/5 focus:border-white/20 rounded-xl px-4 py-3 text-xs text-white placeholder:text-slate-600 focus:outline-none transition-all"
                                        placeholder="e.g. Aman Suite"
                                      />
                                    </div>
                                  </>
                                )}

                                {selectedAdminCategory === 'restaurant' && (
                                  <>
                                    {/* Cuisine */}
                                    <div className="space-y-2">
                                      <label className="text-[7.5px] font-black uppercase tracking-widest text-slate-400 block ml-1">Cuisine Style</label>
                                      <input
                                        type="text"
                                        value={restItem.cuisine}
                                        onChange={(e) => autoSaveRestaurant(currentItem.id, 'cuisine', e.target.value)}
                                        className="w-full bg-slate-950/60 border border-white/5 focus:border-white/20 rounded-xl px-4 py-3 text-xs text-white placeholder:text-slate-600 focus:outline-none transition-all"
                                        placeholder="e.g. Japanese Fusion"
                                      />
                                    </div>

                                    {/* Rating */}
                                    <div className="space-y-2">
                                      <label className="text-[7.5px] font-black uppercase tracking-widest text-slate-400 block ml-1">Rating Coefficient (1.0 - 5.0)</label>
                                      <input
                                        type="number"
                                        step="0.1"
                                        min="1"
                                        max="5"
                                        value={restItem.rating || ''}
                                        onChange={(e) => autoSaveRestaurant(currentItem.id, 'rating', parseFloat(e.target.value) || 0)}
                                        className="w-full bg-slate-950/60 border border-white/5 focus:border-white/20 rounded-xl px-4 py-3 text-xs text-white placeholder:text-slate-600 focus:outline-none transition-all"
                                        placeholder="4.8"
                                      />
                                    </div>

                                    {/* Price Range */}
                                    <div className="space-y-2">
                                      <label className="text-[7.5px] font-black uppercase tracking-widest text-slate-400 block ml-1">Price Range</label>
                                      <select
                                        value={restItem.priceRange}
                                        onChange={(e) => autoSaveRestaurant(currentItem.id, 'priceRange', e.target.value)}
                                        className="w-full bg-slate-950/60 border border-white/5 focus:border-white/20 rounded-xl px-4 py-3 text-xs text-slate-300 focus:outline-none transition-all"
                                      >
                                        <option value="$$">$$ (Moderate)</option>
                                        <option value="$$$">$$$ (Fine)</option>
                                        <option value="$$$$">$$$$ (Elite Gastronomy)</option>
                                      </select>
                                    </div>

                                    {/* Location */}
                                    <div className="space-y-2">
                                      <label className="text-[7.5px] font-black uppercase tracking-widest text-slate-400 block ml-1">Geographic Location</label>
                                      <input
                                        type="text"
                                        value={restItem.location}
                                        onChange={(e) => autoSaveRestaurant(currentItem.id, 'location', e.target.value)}
                                        className="w-full bg-slate-950/60 border border-white/5 focus:border-white/20 rounded-xl px-4 py-3 text-xs text-white placeholder:text-slate-600 focus:outline-none transition-all"
                                        placeholder="e.g. Place des Vosges, Paris"
                                      />
                                    </div>

                                    {/* Distance */}
                                    <div className="space-y-2">
                                      <label className="text-[7.5px] font-black uppercase tracking-widest text-slate-400 block ml-1">LIDAR Distance Offset</label>
                                      <input
                                        type="text"
                                        value={restItem.distance}
                                        onChange={(e) => autoSaveRestaurant(currentItem.id, 'distance', e.target.value)}
                                        className="w-full bg-slate-950/60 border border-white/5 focus:border-white/20 rounded-xl px-4 py-3 text-xs text-white placeholder:text-slate-600 focus:outline-none transition-all"
                                        placeholder="e.g. 0.4 miles"
                                      />
                                    </div>

                                    {/* Signature Dish */}
                                    <div className="space-y-2">
                                      <label className="text-[7.5px] font-black uppercase tracking-widest text-slate-400 block ml-1">Signature Dish</label>
                                      <input
                                        type="text"
                                        value={restItem.signatureDish || ''}
                                        onChange={(e) => autoSaveRestaurant(currentItem.id, 'signatureDish', e.target.value)}
                                        className="w-full bg-slate-950/60 border border-white/5 focus:border-white/20 rounded-xl px-4 py-3 text-xs text-white placeholder:text-slate-600 focus:outline-none transition-all"
                                        placeholder="e.g. Wild Sea Bass with Caviar"
                                      />
                                    </div>
                                  </>
                                )}

                                {selectedAdminCategory === 'product' && (
                                  <>
                                    {/* Product Category */}
                                    <div className="space-y-2">
                                      <label className="text-[7.5px] font-black uppercase tracking-widest text-slate-400 block ml-1">Product Category</label>
                                      <input
                                        type="text"
                                        value={prodItem.category}
                                        onChange={(e) => autoSaveProduct(currentItem.id, 'category', e.target.value)}
                                        className="w-full bg-slate-950/60 border border-white/5 focus:border-white/20 rounded-xl px-4 py-3 text-xs text-white placeholder:text-slate-600 focus:outline-none transition-all"
                                        placeholder="e.g. Wearables"
                                      />
                                    </div>

                                    {/* Product Price */}
                                    <div className="space-y-2">
                                      <label className="text-[7.5px] font-black uppercase tracking-widest text-slate-400 block ml-1">Retail Price ($ USD)</label>
                                      <input
                                        type="number"
                                        value={prodItem.price || ''}
                                        onChange={(e) => autoSaveProduct(currentItem.id, 'price', parseFloat(e.target.value) || 0)}
                                        className="w-full bg-slate-950/60 border border-white/5 focus:border-white/20 rounded-xl px-4 py-3 text-xs text-white placeholder:text-slate-600 focus:outline-none transition-all"
                                        placeholder="1200"
                                      />
                                    </div>

                                    {/* Delivery Time */}
                                    <div className="space-y-2">
                                      <label className="text-[7.5px] font-black uppercase tracking-widest text-slate-400 block ml-1">Logistics / Delivery Time</label>
                                      <input
                                        type="text"
                                        value={prodItem.deliveryTime}
                                        onChange={(e) => autoSaveProduct(currentItem.id, 'deliveryTime', e.target.value)}
                                        className="w-full bg-slate-950/60 border border-white/5 focus:border-white/20 rounded-xl px-4 py-3 text-xs text-white placeholder:text-slate-600 focus:outline-none transition-all"
                                        placeholder="e.g. Next Day Delivery"
                                      />
                                    </div>

                                    {/* Product Specs */}
                                    <div className="space-y-2">
                                      <label className="text-[7.5px] font-black uppercase tracking-widest text-slate-400 block ml-1">Cybernetic Specifications (Comma-separated)</label>
                                      <input
                                        type="text"
                                        value={prodItem.specs ? prodItem.specs.join(', ') : ''}
                                        onChange={(e) => autoSaveProduct(currentItem.id, 'specs', e.target.value)}
                                        className="w-full bg-slate-950/60 border border-white/5 focus:border-white/20 rounded-xl px-4 py-3 text-xs text-white placeholder:text-slate-600 focus:outline-none transition-all"
                                        placeholder="e.g. High-Hz Retinal Projector, Biosensor Array"
                                      />
                                    </div>
                                  </>
                                )}

                                {/* Image URL for Restaurants or Hotels */}
                                {(selectedAdminCategory === 'hotel' || selectedAdminCategory === 'restaurant') && (
                                  <div className="space-y-2 md:col-span-2">
                                    <label className="text-[7.5px] font-black uppercase tracking-widest text-slate-400 block ml-1">Retinal Image Uplink (URL)</label>
                                    <input
                                      type="text"
                                      value={(selectedAdminCategory === 'hotel' ? hotelItem.image : restItem.image) || ''}
                                      onChange={(e) => {
                                        if (selectedAdminCategory === 'hotel') autoSaveHotel(currentItem.id, 'image', e.target.value);
                                        else autoSaveRestaurant(currentItem.id, 'image', e.target.value);
                                      }}
                                      className="w-full bg-slate-950/60 border border-white/5 focus:border-white/20 rounded-xl px-4 py-3 text-xs text-white placeholder:text-slate-600 focus:outline-none transition-all"
                                      placeholder="https://image.pollinations.ai/prompt/..."
                                    />
                                  </div>
                                )}

                                {/* Description Textarea */}
                                <div className="space-y-2 md:col-span-2">
                                  <label className="text-[7.5px] font-black uppercase tracking-widest text-slate-400 block ml-1">Neural Node Description</label>
                                  <textarea
                                    rows={4}
                                    value={currentItem.description}
                                    onChange={(e) => {
                                      if (selectedAdminCategory === 'hotel') autoSaveHotel(currentItem.id, 'description', e.target.value);
                                      else if (selectedAdminCategory === 'restaurant') autoSaveRestaurant(currentItem.id, 'description', e.target.value);
                                      else autoSaveProduct(currentItem.id, 'description', e.target.value);
                                    }}
                                    className="w-full bg-slate-950/60 border border-white/5 focus:border-white/20 rounded-xl px-4 py-3 text-xs text-white placeholder:text-slate-600 focus:outline-none transition-all resize-none"
                                    placeholder="Enter premium description and cyber-sensory credentials..."
                                  />
                                </div>
                              </div>
                            </div>
                          );
                        })()}
                      </div>
                    </div>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>

        </div>

        {/* RIGHT: Active Reservation Timeline Summary HUD */}
        <div className="xl:col-span-4 h-full xl:sticky xl:top-6 flex flex-col justify-start gap-6">
          
          {/* Timeline Summary Box */}
          <div className="glass-panel border-white/5 p-6 rounded-[28px] bg-slate-900/10 space-y-6 relative overflow-hidden select-none">
            {/* Backlight glow */}
            <div className="absolute top-0 right-0 w-32 h-32 rounded-full bg-[#7B61FF]/5 blur-[50px] pointer-events-none" />

            <div className="flex justify-between items-center pb-3 border-b border-white/5 text-left">
              <div className="flex items-center gap-2">
                <History size={16} className="text-[#7B61FF]" />
                <h4 className="text-xs font-black uppercase tracking-wider">Active Bookings HUD</h4>
              </div>
              <span className="text-[8px] font-mono px-2 py-0.5 rounded-md bg-white/5 text-slate-400">SYNC: AUTO</span>
            </div>

            {/* List of active reservations */}
            <div className="space-y-4 max-h-[360px] overflow-y-auto no-scrollbar pr-1">
              {reservations.filter(r => r && r.status !== 'cancelled').slice(0, 4).map((res) => (
                <div key={res.id} className="p-3.5 rounded-2xl bg-slate-950/40 border border-white/5 flex justify-between items-center gap-4 text-left">
                  <div className="space-y-1 truncate">
                    <div className="text-[11px] font-extrabold text-white truncate">{res.restaurant}</div>
                    <div className="flex flex-wrap gap-2 text-[7.5px] font-bold text-slate-500 uppercase tracking-wider items-center">
                      <span>{res.date}</span>
                      <span>•</span>
                      <span>{res.time}</span>
                      <span>•</span>
                      <span>{res.guests}p</span>
                      <span>•</span>
                      <span className="text-emerald-400 font-extrabold">${res.price || (res.type === 'hotel' ? 1450 : 150 * res.guests)}</span>
                    </div>
                  </div>
                  <div className="px-2 py-1 rounded-md bg-green-500/10 border border-green-500/20 text-green-400 text-[6.5px] font-black uppercase tracking-widest">
                    Active
                  </div>
                </div>
              ))}

              {reservations.filter(r => r && r.status !== 'cancelled').length === 0 && (
                <div className="py-8 text-center text-slate-500 text-[10px] font-bold uppercase tracking-wider space-y-2">
                  <div className="text-slate-600">No Active Bookings</div>
                  <button 
                    onClick={() => {
                      const el = document.getElementById('browse-section');
                      el?.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="text-[#00D1FF] hover:underline hover:scale-105 transition-all text-[8px] font-black"
                  >
                    DISCOVER NOW
                  </button>
                </div>
              )}
            </div>

            {/* Direct button to reservations tab */}
            <button
              onClick={() => setActiveTab('reservations')}
              className="w-full py-3 rounded-xl border border-[#7B61FF]/30 hover:bg-[#7B61FF]/5 text-white hover:text-[#7B61FF] text-[8.5px] font-black uppercase tracking-widest transition-all active:scale-95 flex items-center justify-center gap-1.5"
            >
              <Calendar size={12} /> Manage Full Timeline
            </button>
          </div>

          {/* Quick HUD Metrics */}
          <div className="glass-panel border-white/5 p-6 rounded-[28px] bg-slate-900/10 grid grid-cols-2 gap-4 relative overflow-hidden select-none text-left">
            <div className="space-y-1">
              <div className="text-[7px] font-black uppercase tracking-widest text-slate-500">Live Satellite Nodes</div>
              <div className="text-2xl font-black text-white">06 <span className="text-[10px] font-bold text-green-400">• ON</span></div>
            </div>
            <div className="space-y-1">
              <div className="text-[7px] font-black uppercase tracking-widest text-slate-500">Persisted Files</div>
              <div className="text-2xl font-black text-white">
                {reservations.length} <span className="text-[10px] font-bold text-[#00D1FF]">• CLOUD</span>
              </div>
            </div>
          </div>

        </div>

        {/* ── 3.5. FLOATING OMNIAI ASSISTANT CHAT PANEL ──────────────────────── */}
        <div className="fixed bottom-8 right-8 z-[200]">
          <AnimatePresence>
            {isAssistantOpen ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 30 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 30 }}
                transition={{ type: 'spring', stiffness: 350, damping: 25 }}
                className="w-96 h-[520px] rounded-[28px] border border-white/10 glass-panel shadow-[0_20px_60px_rgba(0,0,0,0.85)] flex flex-col justify-between overflow-hidden relative bg-slate-950/85 backdrop-blur-2xl p-5"
              >
                {/* Backlight highlight */}
                <div className="absolute top-0 right-0 w-44 h-44 rounded-full bg-[#00D1FF]/5 blur-[60px] pointer-events-none" />

                {/* Panel Header */}
                <div className="flex items-center justify-between pb-3.5 border-b border-white/5 shrink-0 select-none text-left relative z-10">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-slate-900 border border-white/5 flex items-center justify-center text-[#00D1FF]">
                      <MessageSquare size={16} />
                    </div>
                    <div>
                      <h4 className="text-[11px] font-black uppercase tracking-wider">OMNIAI Booking Assistant</h4>
                      <div className="flex items-center gap-1 text-[7px] text-[#00D1FF] font-black uppercase tracking-widest">
                        <div className="w-1 h-1 rounded-full bg-[#00D1FF] animate-pulse" /> Direct Neural Link
                      </div>
                    </div>
                  </div>

                  {/* Collapse Button */}
                  <button
                    onClick={() => setIsAssistantOpen(false)}
                    className="w-7 h-7 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white flex items-center justify-center transition-all active:scale-90"
                  >
                    <X size={14} />
                  </button>
                </div>

                {/* Quick actions chips container */}
                <div className="pt-3.5 flex flex-col gap-2 shrink-0 select-none text-left relative z-10">
                  <div className="text-[7px] font-black uppercase tracking-widest text-slate-500">Quick Concierge Queries</div>
                  <div className="flex flex-wrap gap-2">
                    {[
                      "Nobu Malibu table for 2 tonight",
                      "Book Aman Tokyo tonight",
                      "Order cybernetic glasses"
                    ].map((action) => (
                      <button
                        key={action}
                        onClick={() => handleQuickAction(action)}
                        className="px-2.5 py-1.5 rounded-lg border border-white/5 hover:border-[#7B61FF]/30 bg-slate-900/20 hover:bg-[#7B61FF]/5 text-slate-300 hover:text-[#00D1FF] text-[8px] font-black uppercase tracking-wider transition-all truncate max-w-full"
                      >
                        {action}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Messages Scroll Area */}
                <div className="flex-1 overflow-y-auto no-scrollbar py-4 space-y-4 my-2 pr-1 relative z-10">
                  {chatMessages.map((msg) => {
                    const matchedRest = findMatchingRestaurant(msg.content);
                    const matchedHotel = findMatchingHotel(msg.content);
                    const matchedProduct = findMatchingProduct(msg.content);

                    return (
                      <div
                        key={msg.id}
                        className={cn(
                          "flex w-full",
                          msg.role === 'user' ? 'justify-end' : 'justify-start'
                        )}
                      >
                        <div
                          className={cn(
                            "max-w-[85%] px-4 py-3 rounded-2xl text-[11px] leading-relaxed text-left relative group",
                            msg.role === 'user'
                              ? 'bg-white text-black font-semibold rounded-tr-none'
                              : 'glass-panel border-white/5 text-slate-200 backdrop-blur-md rounded-tl-none'
                          )}
                        >
                          <div>{msg.content}</div>

                          {/* Dynamic Agentic Quick Restaurant Book Button */}
                          {msg.role === 'assistant' && matchedRest && (
                            <button
                              onClick={() => {
                                setBookingForm((prev) => ({
                                  ...prev,
                                  date: prev.date || new Date(Date.now() + 86400000).toISOString().split('T')[0], // tomorrow
                                  time: '20:00',
                                  guests: 2
                                }));
                                setBookingModalRestaurant(matchedRest);
                              }}
                              className="mt-3.5 w-full py-2 rounded-xl bg-[#00D1FF]/10 hover:bg-[#00D1FF]/20 border border-[#00D1FF]/30 text-[#00D1FF] text-[8.5px] font-black uppercase tracking-widest transition-all active:scale-95 flex items-center justify-center gap-1.5 shadow-md font-mono"
                            >
                              <Utensils size={10} /> Quick Book: {matchedRest.name}
                            </button>
                          )}

                          {/* Dynamic Agentic Quick Hotel Book Button */}
                          {msg.role === 'assistant' && matchedHotel && (
                            <button
                              onClick={() => {
                                setHotelForm((prev) => ({
                                  ...prev,
                                  suite: matchedHotel.suites[0],
                                  checkIn: prev.checkIn || new Date(Date.now() + 86400000).toISOString().split('T')[0],
                                  checkOut: prev.checkOut || new Date(Date.now() + 86400000 * 3).toISOString().split('T')[0]
                                }));
                                setBookingModalHotel(matchedHotel);
                              }}
                              className="mt-3.5 w-full py-2 rounded-xl bg-[#7B61FF]/10 hover:bg-[#7B61FF]/20 border border-[#7B61FF]/30 text-[#7B61FF] text-[8.5px] font-black uppercase tracking-widest transition-all active:scale-95 flex items-center justify-center gap-1.5 shadow-md font-mono"
                            >
                              <Hotel size={10} /> Quick Book Room: {matchedHotel.name}
                            </button>
                          )}

                          {/* Dynamic Agentic Quick Product Buy Button */}
                          {msg.role === 'assistant' && matchedProduct && (
                            <button
                              onClick={() => {
                                addToCart(matchedProduct);
                                setNodeMode('shopping');
                                // Scroll to cart
                                setTimeout(() => {
                                  const el = document.getElementById('shopping-section');
                                  el?.scrollIntoView({ behavior: 'smooth' });
                                }, 300);
                              }}
                              className="mt-3.5 w-full py-2 rounded-xl bg-pink-500/10 hover:bg-pink-500/20 border border-pink-500/30 text-pink-400 text-[8.5px] font-black uppercase tracking-widest transition-all active:scale-95 flex items-center justify-center gap-1.5 shadow-md font-mono"
                            >
                              <ShoppingBag size={10} /> Quick Add: {matchedProduct.name}
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}

                  {isChatThinking && (
                    <div className="flex justify-start">
                      <div className="glass-panel border-white/5 px-4 py-3 rounded-2xl rounded-tl-none flex items-center gap-1.5">
                        {[0, 1, 2].map((i) => (
                          <motion.div
                            key={i}
                            animate={{ height: [4, 10, 4], opacity: [0.3, 1, 0.3] }}
                            transition={{ duration: 0.8, repeat: Infinity, delay: i * 0.15 }}
                            className="w-1 bg-[#00D1FF] rounded-full shadow-[0_0_8px_#00d1ff]"
                          />
                        ))}
                      </div>
                    </div>
                  )}
                  <div ref={chatEndRef} />
                </div>

                {/* Input Area Form */}
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleSendChatMessage();
                  }}
                  className="relative shrink-0 z-10"
                >
                  <input
                    type="text"
                    placeholder="Book rooftop for 2 tonight..."
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    className="w-full bg-slate-905/60 border border-white/5 focus:border-[#00D1FF]/30 rounded-2xl pl-4 pr-12 py-3.5 text-[11px] text-white placeholder:text-slate-600 focus:outline-none transition-all uppercase tracking-wider font-semibold"
                  />
                  <button
                    type="submit"
                    disabled={!chatInput.trim()}
                    className={cn(
                      "absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-xl flex items-center justify-center transition-all",
                      chatInput.trim()
                        ? "bg-[#00D1FF] text-black shadow-[0_0_12px_rgba(0,209,255,0.4)] hover:scale-105 active:scale-95"
                        : "bg-white/5 text-slate-500 cursor-not-allowed"
                    )}
                  >
                    <Send size={12} />
                  </button>
                </form>

              </motion.div>
            ) : (
              /* Pulse circular floating assistant orb */
              <motion.button
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsAssistantOpen(true)}
                className="w-16 h-16 rounded-full border border-[#00D1FF]/30 bg-slate-950 flex items-center justify-center text-[#00D1FF] shadow-[0_0_30px_rgba(0,209,255,0.35)] relative overflow-hidden group cursor-pointer"
              >
                {/* Concentric rotating border rings inside orb */}
                <div className="absolute inset-1.5 rounded-full border border-dashed border-[#7B61FF]/30 animate-spin-slow" />
                <div className="absolute inset-3 rounded-full border border-dashed border-[#00D1FF]/20 animate-reverse-spin" />
                
                {/* Floating inner Sparkles */}
                <Sparkles size={22} className="relative z-10 group-hover:rotate-12 transition-transform duration-500" />
                
                {/* Notification indicator dot */}
                <div className="absolute top-1.5 right-1.5 w-3 h-3 rounded-full bg-red-500 border-2 border-slate-950 animate-pulse shadow-md z-20" />
              </motion.button>
            )}
          </AnimatePresence>
        </div>

      </section>

      {/* ── 4. TABLE RESERVATION MODAL (BACKDROP-BLUR OVERLAY) ──────────────── */}
      <AnimatePresence>
        {bookingModalRestaurant && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[1000] bg-slate-950/80 backdrop-blur-xl flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              className="glass-panel border-white/10 p-8 rounded-[36px] bg-slate-900/90 max-w-xl w-full space-y-6 shadow-[0_30px_70px_rgba(0,0,0,0.8)] relative text-left"
            >
              {/* Backlight highlight */}
              <div className="absolute top-0 right-0 w-64 h-64 rounded-full bg-[#00D1FF]/5 blur-[70px] pointer-events-none" />

              {/* Close Button */}
              <button
                onClick={() => setBookingModalRestaurant(null)}
                className="absolute top-6 right-6 w-9 h-9 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 hover:border-white/20 text-slate-400 hover:text-white flex items-center justify-center transition-all"
              >
                <X size={16} />
              </button>

              {/* Modal Header */}
              <div className="space-y-2">
                <div className="text-[8px] font-black uppercase tracking-[0.3em] text-[#00D1FF] flex items-center gap-1.5">
                  <Zap size={10} /> Table Reservation Protocol
                </div>
                <h3 className="text-2xl font-black text-white">
                  {bookingModalRestaurant.name}
                </h3>
                <p className="text-xs text-slate-400 font-medium leading-relaxed">
                  Fill in the coordinate data below to lock in your table. Synchronization is performed with the main Google Sheets nodes.
                </p>
              </div>

              {/* Booking Form */}
              <form onSubmit={handleMakeReservation} className="space-y-6">

                {/* User Credentials */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="space-y-2 text-left">
                    <label className="text-[7px] font-black uppercase tracking-widest text-slate-400 block ml-1 font-bold">Full Name</label>
                    <input
                      type="text"
                      required
                      placeholder="Enter Full Name"
                      value={bookingForm.name}
                      onChange={(e) => setBookingForm(prev => ({ ...prev, name: e.target.value }))}
                      className="w-full bg-slate-950/60 border border-white/5 focus:border-[#00D1FF]/30 rounded-xl px-4 py-3 text-xs text-white placeholder-slate-600 focus:outline-none transition-all font-semibold"
                    />
                  </div>
                  <div className="space-y-2 text-left">
                    <label className="text-[7px] font-black uppercase tracking-widest text-slate-400 block ml-1 font-bold">Email Address</label>
                    <input
                      type="email"
                      required
                      placeholder="Enter Email"
                      value={bookingForm.email}
                      onChange={(e) => setBookingForm(prev => ({ ...prev, email: e.target.value }))}
                      className="w-full bg-slate-950/60 border border-white/5 focus:border-[#00D1FF]/30 rounded-xl px-4 py-3 text-xs text-white placeholder-slate-600 focus:outline-none transition-all font-semibold"
                    />
                  </div>
                  <div className="space-y-2 text-left">
                    <label className="text-[7px] font-black uppercase tracking-widest text-slate-400 block ml-1 font-bold">Phone Number</label>
                    <input
                      type="tel"
                      required
                      placeholder="Enter Phone"
                      value={bookingForm.phone}
                      onChange={(e) => setBookingForm(prev => ({ ...prev, phone: e.target.value }))}
                      className="w-full bg-slate-950/60 border border-white/5 focus:border-[#00D1FF]/30 rounded-xl px-4 py-3 text-xs text-white placeholder-slate-600 focus:outline-none transition-all font-semibold"
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Date Picker */}
                  <div className="space-y-2 text-left">
                    <label className="text-[7px] font-black uppercase tracking-widest text-slate-400 block ml-1">Reservation Date</label>
                    <input
                      type="date"
                      required
                      value={bookingForm.date}
                      onChange={(e) => setBookingForm(prev => ({ ...prev, date: e.target.value }))}
                      className="w-full bg-slate-950/60 border border-white/5 focus:border-[#00D1FF]/30 rounded-xl px-4 py-3 text-xs text-white focus:outline-none transition-all uppercase font-semibold"
                    />
                  </div>

                  {/* Time picker list */}
                  <div className="space-y-2 text-left">
                    <label className="text-[7px] font-black uppercase tracking-widest text-slate-400 block ml-1">Target Time Slot</label>
                    <select
                      value={bookingForm.time}
                      onChange={(e) => setBookingForm(prev => ({ ...prev, time: e.target.value }))}
                      className="w-full bg-slate-950/60 border border-white/5 focus:border-[#00D1FF]/30 rounded-xl px-4 py-3 text-xs text-white focus:outline-none transition-all font-semibold"
                    >
                      {["18:00", "18:30", "19:00", "19:30", "20:00", "20:30", "21:00", "21:30", "22:00"].map((t) => (
                        <option key={t} value={t} className="bg-slate-950 text-white font-semibold">{t} PM</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Party Size count selector */}
                <div className="space-y-2 text-left">
                  <div className="flex justify-between items-center px-1">
                    <label className="text-[7px] font-black uppercase tracking-widest text-slate-400 block">Party Size / Guests</label>
                    <span className="text-[10px] text-[#00D1FF] font-black">{bookingForm.guests} Guests</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="12"
                    value={bookingForm.guests}
                    onChange={(e) => setBookingForm(prev => ({ ...prev, guests: Number(e.target.value) }))}
                    className="w-full accent-[#00D1FF] bg-slate-950 rounded-lg cursor-pointer h-2"
                  />
                </div>

                {/* Dining Fare Summary Box */}
                <div className="p-4 rounded-xl border border-white/5 bg-slate-950/40 space-y-2 select-none text-left animate-in fade-in duration-300">
                  <div className="text-[8px] font-black uppercase tracking-widest text-slate-500">Dining Fare Summary</div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-400">Average Rate:</span>
                    <span className="text-white font-mono">${bookingModalRestaurant.pricePerPerson || 100} / person</span>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-400">Guests:</span>
                    <span className="text-white font-mono">{bookingForm.guests} guests</span>
                  </div>
                  <div className="h-px bg-white/5 my-1" />
                  <div className="flex justify-between items-center text-xs font-bold">
                    <span className="text-cyan-400 uppercase tracking-wider text-[9px]">Total Est. Price:</span>
                    <span className="text-[#00D1FF] font-mono">${bookingForm.guests * (bookingModalRestaurant.pricePerPerson || 100)} USD</span>
                  </div>
                </div>

                {/* Special Requests / AI prompts */}
                <div className="space-y-2 text-left">
                  <label className="text-[7px] font-black uppercase tracking-widest text-slate-400 block ml-1">AI Special Request Instructions</label>
                  <textarea
                    placeholder="Dietary rules, sensory preferences, room selection, or special celebrations..."
                    value={bookingForm.notes}
                    onChange={(e) => setBookingForm(prev => ({ ...prev, notes: e.target.value }))}
                    rows={3}
                    className="w-full bg-slate-950/60 border border-white/5 focus:border-[#00D1FF]/30 rounded-xl px-4 py-3 text-xs text-white focus:outline-none transition-all font-medium leading-relaxed"
                  />
                </div>

                {/* Submit actions */}
                <div className="flex flex-col gap-4 pt-2">
                  <button
                    type="submit"
                    disabled={isSubmitting || !bookingForm.date}
                    className={cn(
                      "w-full flex items-center justify-center gap-3 py-4 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all",
                      isSubmitting || !bookingForm.date
                        ? "bg-slate-900 text-slate-500 border border-white/5 cursor-not-allowed"
                        : "bg-white hover:bg-[#00D1FF] text-black shadow-[0_0_30px_rgba(255,255,255,0.15)] active:scale-95"
                    )}
                  >
                    {isSubmitting ? <Loader2 className="animate-spin" size={14} /> : <CheckCircle2 size={14} />}
                    {isSubmitting ? 'Transmitting Data Core...' : 'Initiate Reservation Protocol'}
                  </button>

                  {submitSuccess && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-[9px] text-green-400 font-bold uppercase tracking-wider text-center bg-green-500/10 border border-green-500/20 p-3.5 rounded-xl max-w-md mx-auto leading-relaxed"
                    >
                      {submitSuccessMessage}
                    </motion.div>
                  )}
                </div>

              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── 5. HOTEL RESERVATION MODAL (BACKDROP-BLUR OVERLAY) ──────────────── */}
      <AnimatePresence>
        {bookingModalHotel && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[1000] bg-slate-950/80 backdrop-blur-xl flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              className="glass-panel border-white/10 p-8 rounded-[36px] bg-slate-900/90 max-w-xl w-full space-y-6 shadow-[0_30px_70px_rgba(0,0,0,0.8)] relative text-left"
            >
              <div className="absolute top-0 right-0 w-64 h-64 rounded-full bg-[#7B61FF]/5 blur-[70px] pointer-events-none" />

              <button
                onClick={() => setBookingModalHotel(null)}
                className="absolute top-6 right-6 w-9 h-9 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 hover:border-white/20 text-slate-400 hover:text-white flex items-center justify-center transition-all"
              >
                <X size={16} />
              </button>

              <div className="space-y-2">
                <div className="text-[8px] font-black uppercase tracking-[0.3em] text-[#7B61FF] flex items-center gap-1.5">
                  <Zap size={10} /> Hotel Lodging Protocol
                </div>
                <h3 className="text-2xl font-black text-white">
                  {bookingModalHotel.name}
                </h3>
                <p className="text-xs text-slate-400 font-medium leading-relaxed">
                  Fill in your check-in dates and suite selection below. Uplink is synchronized to our central Google Sheets network.
                </p>
              </div>

              <form onSubmit={handleMakeHotelReservation} className="space-y-6">

                {/* User Credentials */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="space-y-2 text-left">
                    <label className="text-[7px] font-black uppercase tracking-widest text-slate-400 block ml-1 font-bold">Full Name</label>
                    <input
                      type="text"
                      required
                      placeholder="Enter Full Name"
                      value={hotelForm.name}
                      onChange={(e) => setHotelForm(prev => ({ ...prev, name: e.target.value }))}
                      className="w-full bg-slate-950/60 border border-white/5 focus:border-[#7B61FF]/30 rounded-xl px-4 py-3 text-xs text-white placeholder-slate-600 focus:outline-none transition-all font-semibold"
                    />
                  </div>
                  <div className="space-y-2 text-left">
                    <label className="text-[7px] font-black uppercase tracking-widest text-slate-400 block ml-1 font-bold">Email Address</label>
                    <input
                      type="email"
                      required
                      placeholder="Enter Email"
                      value={hotelForm.email}
                      onChange={(e) => setHotelForm(prev => ({ ...prev, email: e.target.value }))}
                      className="w-full bg-slate-950/60 border border-white/5 focus:border-[#7B61FF]/30 rounded-xl px-4 py-3 text-xs text-white placeholder-slate-600 focus:outline-none transition-all font-semibold"
                    />
                  </div>
                  <div className="space-y-2 text-left">
                    <label className="text-[7px] font-black uppercase tracking-widest text-slate-400 block ml-1 font-bold">Phone Number</label>
                    <input
                      type="tel"
                      required
                      placeholder="Enter Phone"
                      value={hotelForm.phone}
                      onChange={(e) => setHotelForm(prev => ({ ...prev, phone: e.target.value }))}
                      className="w-full bg-slate-950/60 border border-white/5 focus:border-[#7B61FF]/30 rounded-xl px-4 py-3 text-xs text-white placeholder-slate-600 focus:outline-none transition-all font-semibold"
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Suite Selector */}
                  <div className="space-y-2 text-left sm:col-span-2">
                    <label className="text-[7px] font-black uppercase tracking-widest text-slate-400 block ml-1 font-extrabold">Selected Luxury Suite</label>
                    <select
                      value={hotelForm.suite}
                      onChange={(e) => setHotelForm(prev => ({ ...prev, suite: e.target.value }))}
                      className="w-full bg-slate-950/60 border border-white/5 focus:border-[#7B61FF]/30 rounded-xl px-4 py-3.5 text-xs text-white focus:outline-none transition-all font-semibold"
                    >
                      {bookingModalHotel.suites.map((s) => (
                        <option key={s} value={s} className="bg-slate-950 text-white font-semibold">{s}</option>
                      ))}
                    </select>
                  </div>

                  {/* Check-In Date */}
                  <div className="space-y-2 text-left">
                    <label className="text-[7px] font-black uppercase tracking-widest text-slate-400 block ml-1">Check-in Date</label>
                    <input
                      type="date"
                      required
                      value={hotelForm.checkIn}
                      onChange={(e) => setHotelForm(prev => ({ ...prev, checkIn: e.target.value }))}
                      className="w-full bg-slate-950/60 border border-white/5 focus:border-[#7B61FF]/30 rounded-xl px-4 py-3 text-xs text-white focus:outline-none transition-all uppercase font-semibold"
                    />
                  </div>

                  {/* Check-Out Date */}
                  <div className="space-y-2 text-left">
                    <label className="text-[7px] font-black uppercase tracking-widest text-slate-400 block ml-1">Check-out Date</label>
                    <input
                      type="date"
                      required
                      value={hotelForm.checkOut}
                      onChange={(e) => setHotelForm(prev => ({ ...prev, checkOut: e.target.value }))}
                      className="w-full bg-slate-950/60 border border-white/5 focus:border-[#7B61FF]/30 rounded-xl px-4 py-3 text-xs text-white focus:outline-none transition-all uppercase font-semibold"
                    />
                  </div>
                </div>

                {/* Party Size */}
                <div className="space-y-2 text-left">
                  <div className="flex justify-between items-center px-1">
                    <label className="text-[7px] font-black uppercase tracking-widest text-slate-400 block">Adult Guests</label>
                    <span className="text-[10px] text-[#7B61FF] font-black">{hotelForm.guests} Guests</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="8"
                    value={hotelForm.guests}
                    onChange={(e) => setHotelForm(prev => ({ ...prev, guests: Number(e.target.value) }))}
                    className="w-full accent-[#7B61FF] bg-slate-950 rounded-lg cursor-pointer h-2"
                  />
                </div>

                {/* Lodging Fare Summary Box */}
                {hotelForm.checkIn && hotelForm.checkOut && (
                  <div className="p-4 rounded-xl border border-white/5 bg-slate-950/40 space-y-2 select-none text-left animate-in fade-in duration-300">
                    <div className="text-[8px] font-black uppercase tracking-widest text-slate-500">Lodging Fare Summary</div>
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-slate-400">Suite Rate:</span>
                      <span className="text-white font-mono">${bookingModalHotel.ratePerNight} / night</span>
                    </div>
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-slate-400">Nights:</span>
                      <span className="text-white font-mono">{calculateNights(hotelForm.checkIn, hotelForm.checkOut)} nights</span>
                    </div>
                    <div className="h-px bg-white/5 my-1" />
                    <div className="flex justify-between items-center text-xs font-bold">
                      <span className="text-purple-400 uppercase tracking-wider text-[9px]">Total Stay Cost:</span>
                      <span className="text-[#7B61FF] font-mono">${calculateNights(hotelForm.checkIn, hotelForm.checkOut) * bookingModalHotel.ratePerNight} USD</span>
                    </div>
                  </div>
                )}

                {/* Mode of Payment Selector */}
                <div className="space-y-3">
                  <label className="text-[7px] font-black uppercase tracking-widest text-slate-400 block ml-1 font-bold">Select Payment Mode</label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setHotelForm(prev => ({ ...prev, paymentMethod: 'coa' }))}
                      className={cn(
                        "py-3.5 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all border text-center flex items-center justify-center gap-2",
                        hotelForm.paymentMethod === 'coa'
                          ? "bg-green-500/10 text-green-400 border-green-500/30 shadow-[0_0_15px_rgba(34,197,94,0.15)]"
                          : "bg-slate-950/60 text-slate-400 border-white/5 hover:text-white"
                      )}
                    >
                      Cash On Arrival
                    </button>
                    <button
                      type="button"
                      onClick={() => setHotelForm(prev => ({ ...prev, paymentMethod: 'upi' }))}
                      className={cn(
                        "py-3.5 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all border text-center flex items-center justify-center gap-2",
                        hotelForm.paymentMethod === 'upi'
                          ? "bg-[#00D1FF]/10 text-[#00D1FF] border-[#00D1FF]/30 shadow-[0_0_15px_rgba(0,209,255,0.15)]"
                          : "bg-slate-950/60 text-slate-400 border-white/5 hover:text-white"
                      )}
                    >
                      UPI Payment
                    </button>
                  </div>
                </div>

                {/* Conditional Payment Method Details */}
                {hotelForm.paymentMethod === 'upi' ? (
                  <div className="p-4 rounded-xl border border-[#00D1FF]/10 bg-[#00D1FF]/5 select-none text-left animate-in fade-in slide-in-from-top-2 duration-300 space-y-3">
                    <div className="text-[9px] text-[#00D1FF] font-extrabold uppercase tracking-widest flex items-center gap-1.5">
                      <Zap size={10} className="animate-pulse" /> Direct UPI Transfer Node
                    </div>
                    <p className="text-[10px] text-slate-300 font-medium leading-relaxed">
                      Please pay the total reservation rate of <span className="text-[#7B61FF] font-bold">${calculateNights(hotelForm.checkIn, hotelForm.checkOut) * bookingModalHotel.ratePerNight} USD</span> (${bookingModalHotel.ratePerNight}/night for {calculateNights(hotelForm.checkIn, hotelForm.checkOut)} nights) directly to the central UPI ID below:
                    </p>
                    <div className="p-3.5 rounded-lg bg-slate-950/80 border border-white/5 flex justify-between items-center select-all">
                      <span className="text-xs font-mono font-bold text-white tracking-wider">{bookingModalHotel.upiId || '1234567890@upi'}</span>
                      <span className="text-[7px] font-black uppercase tracking-widest text-[#00D1FF] bg-[#00D1FF]/10 border border-[#00D1FF]/20 px-2 py-1 rounded">COPY ADDRESS</span>
                    </div>
                    <p className="text-[8.5px] text-slate-500 font-medium leading-relaxed">
                      Open any UPI app, complete the transaction to the VPA above, and click confirm below to synchronize reservation parameters.
                    </p>
                  </div>
                ) : (
                  <div className="p-4 rounded-xl border border-green-500/10 bg-green-500/5 select-none text-left animate-in fade-in slide-in-from-top-2 duration-300">
                    <div className="text-[9px] text-green-400 font-extrabold uppercase tracking-widest mb-1">Cash on Arrival Authorized</div>
                    <p className="text-[8px] text-slate-300 font-medium leading-relaxed">
                      Pay physically at the hotel front desk via cash or standard local POS card scanning upon checking in at the physical site.
                    </p>
                  </div>
                )}

                {/* Notes */}
                <div className="space-y-2 text-left">
                  <label className="text-[7px] font-black uppercase tracking-widest text-slate-400 block ml-1 font-bold">AI Special Request Instructions</label>
                  <textarea
                    placeholder="Celebrations, pickup services, room views, or diet demands..."
                    value={hotelForm.notes}
                    onChange={(e) => setHotelForm(prev => ({ ...prev, notes: e.target.value }))}
                    rows={3}
                    className="w-full bg-slate-950/60 border border-white/5 focus:border-[#7B61FF]/30 rounded-xl px-4 py-3 text-xs text-white focus:outline-none transition-all font-medium leading-relaxed"
                  />
                </div>

                {/* Actions */}
                <div className="flex flex-col gap-4 pt-2">
                  <button
                    type="submit"
                    disabled={isSubmitting || !hotelForm.checkIn || !hotelForm.checkOut}
                    className={cn(
                      "w-full flex items-center justify-center gap-3 py-4 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all",
                      isSubmitting || !hotelForm.checkIn || !hotelForm.checkOut
                        ? "bg-slate-900 text-slate-500 border border-white/5 cursor-not-allowed"
                        : "bg-white hover:bg-[#7B61FF] text-black shadow-[0_0_30px_rgba(255,255,255,0.15)] active:scale-95"
                    )}
                  >
                    {isSubmitting ? <Loader2 className="animate-spin" size={14} /> : <CheckCircle2 size={14} />}
                    {isSubmitting ? 'Transmitting Data Core...' : 'Lock In Room Coordinates'}
                  </button>

                  {submitSuccess && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-[9px] text-green-400 font-bold uppercase tracking-wider text-center bg-green-500/10 border border-green-500/20 p-3.5 rounded-xl max-w-md mx-auto leading-relaxed"
                    >
                      {submitSuccessMessage}
                    </motion.div>
                  )}
                </div>

              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── 6. E-COMMERCE CHECKOUT CONFIRMATION MODAL ─────────────────────────── */}
      <AnimatePresence>
        {checkoutOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[1000] bg-slate-950/80 backdrop-blur-xl flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              className="glass-panel border-white/10 p-8 rounded-[36px] bg-slate-900/90 max-w-xl w-full space-y-6 shadow-[0_30px_70px_rgba(0,0,0,0.8)] relative text-left"
            >
              <div className="absolute top-0 right-0 w-64 h-64 rounded-full bg-pink-500/5 blur-[70px] pointer-events-none" />

              <button
                onClick={() => setCheckoutOpen(false)}
                className="absolute top-6 right-6 w-9 h-9 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 hover:border-white/20 text-slate-400 hover:text-white flex items-center justify-center transition-all"
              >
                <X size={16} />
              </button>

              <div className="space-y-2">
                <div className="text-[8px] font-black uppercase tracking-[0.3em] text-pink-400 flex items-center gap-1.5">
                  <CreditCard size={10} /> E-commerce Checkout Protocol
                </div>
                <h3 className="text-2xl font-black text-white">
                  Confirm Transaction
                </h3>
                <p className="text-xs text-slate-400 font-medium leading-relaxed">
                  Enter your shipping credentials below and select your payment method (Cash on Delivery or UPI) to finalize the transaction.
                </p>
              </div>

              <form onSubmit={executeCheckout} className="space-y-6">
                
                <div className="space-y-4">
                  {/* Name */}
                  <div className="space-y-2 text-left">
                    <label className="text-[7px] font-black uppercase tracking-widest text-slate-400 block ml-1 font-bold">Recipient Full Name</label>
                    <input
                      type="text"
                      required
                      placeholder="SARAH CONNER"
                      value={checkoutForm.name}
                      onChange={(e) => setCheckoutForm(prev => ({ ...prev, name: e.target.value }))}
                      className="w-full bg-slate-950/60 border border-white/5 focus:border-pink-500/30 rounded-xl px-4 py-3 text-xs text-white focus:outline-none transition-all uppercase font-semibold"
                    />
                  </div>

                  {/* Address */}
                  <div className="space-y-2 text-left">
                    <label className="text-[7px] font-black uppercase tracking-widest text-slate-400 block ml-1 font-bold">Delivery Coordinates Address</label>
                    <input
                      type="text"
                      required
                      placeholder="100 CYBERNETIC BOULEVARD, SILICON VALLEY"
                      value={checkoutForm.address}
                      onChange={(e) => setCheckoutForm(prev => ({ ...prev, address: e.target.value }))}
                      className="w-full bg-slate-950/60 border border-white/5 focus:border-pink-500/30 rounded-xl px-4 py-3 text-xs text-white focus:outline-none transition-all uppercase font-semibold"
                    />
                  </div>

                  {/* Zip Code */}
                  <div className="space-y-2 text-left">
                    <label className="text-[7px] font-black uppercase tracking-widest text-slate-400 block ml-1 font-bold">Postal Zip Code</label>
                    <input
                      type="text"
                      required
                      placeholder="94025"
                      value={checkoutForm.zip}
                      onChange={(e) => setCheckoutForm(prev => ({ ...prev, zip: e.target.value }))}
                      className="w-full bg-slate-950/60 border border-white/5 focus:border-pink-500/30 rounded-xl px-4 py-3 text-xs text-white focus:outline-none transition-all uppercase font-semibold"
                    />
                  </div>

                  {/* Mode of Payment Selector */}
                  <div className="space-y-3">
                    <label className="text-[7px] font-black uppercase tracking-widest text-slate-400 block ml-1 font-bold">Select Payment Mode</label>
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        type="button"
                        onClick={() => setCheckoutForm(prev => ({ ...prev, paymentMethod: 'cod' }))}
                        className={cn(
                          "py-3.5 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all border text-center flex items-center justify-center gap-2",
                          checkoutForm.paymentMethod === 'cod'
                            ? "bg-green-500/10 text-green-400 border-green-500/30 shadow-[0_0_15px_rgba(34,197,94,0.15)]"
                            : "bg-slate-950/60 text-slate-400 border-white/5 hover:text-white"
                        )}
                      >
                        Cash On Delivery
                      </button>
                      <button
                        type="button"
                        onClick={() => setCheckoutForm(prev => ({ ...prev, paymentMethod: 'upi' }))}
                        className={cn(
                          "py-3.5 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all border text-center flex items-center justify-center gap-2",
                          checkoutForm.paymentMethod === 'upi'
                            ? "bg-[#00D1FF]/10 text-[#00D1FF] border-[#00D1FF]/30 shadow-[0_0_15px_rgba(0,209,255,0.15)]"
                            : "bg-slate-950/60 text-slate-400 border-white/5 hover:text-white"
                        )}
                      >
                        UPI Payment
                      </button>
                    </div>
                  </div>

                  {/* Conditional Payment Method Details */}
                  {checkoutForm.paymentMethod === 'upi' ? (
                    <div className="p-4 rounded-xl border border-[#00D1FF]/10 bg-[#00D1FF]/5 select-none text-left animate-in fade-in slide-in-from-top-2 duration-300 space-y-3">
                      <div className="text-[9px] text-[#00D1FF] font-extrabold uppercase tracking-widest flex items-center gap-1.5">
                        <Zap size={10} className="animate-pulse" /> Direct UPI Transfer Node
                      </div>
                      <p className="text-[10px] text-slate-300 font-medium leading-relaxed">
                        Please pay the total order amount of <span className="text-pink-400 font-bold">${cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0)} USD</span> directly to the central UPI ID below:
                      </p>
                      <div className="p-3.5 rounded-lg bg-slate-950/80 border border-white/5 flex justify-between items-center select-all">
                        <span className="text-xs font-mono font-bold text-white tracking-wider">1234567890@upi</span>
                        <span className="text-[7px] font-black uppercase tracking-widest text-[#00D1FF] bg-[#00D1FF]/10 border border-[#00D1FF]/20 px-2 py-1 rounded">COPY ADDRESS</span>
                      </div>
                      <p className="text-[8.5px] text-slate-500 font-medium leading-relaxed">
                        Open any UPI application (GPay, PhonePe, Paytm), input the address above, complete the payment, and click confirm below to authorize transaction tracking.
                      </p>
                    </div>
                  ) : (
                    <div className="p-4 rounded-xl border border-green-500/10 bg-green-500/5 select-none text-left animate-in fade-in slide-in-from-top-2 duration-300">
                      <div className="text-[9px] text-green-400 font-extrabold uppercase tracking-widest mb-1">Cash on Delivery Authorized</div>
                      <p className="text-[8px] text-slate-300 font-medium leading-relaxed">
                        Authorize physical cash collection or instant local QR scanning upon product drop-off at your specified coordinates.
                      </p>
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="flex flex-col gap-4 pt-2">
                  <button
                    type="submit"
                    disabled={
                      isSubmitting || 
                      !checkoutForm.name || 
                      !checkoutForm.address || 
                      !checkoutForm.zip
                    }
                    className={cn(
                      "w-full flex items-center justify-center gap-3 py-4 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all",
                      isSubmitting || 
                      !checkoutForm.name || 
                      !checkoutForm.address || 
                      !checkoutForm.zip
                        ? "bg-slate-900 text-slate-500 border border-white/5 cursor-not-allowed"
                        : "bg-white hover:bg-pink-500 text-black shadow-[0_0_30px_rgba(255,255,255,0.15)] active:scale-95"
                    )}
                  >
                    {isSubmitting ? <Loader2 className="animate-spin" size={14} /> : <CheckCircle2 size={14} />}
                    {isSubmitting ? 'Finalizing Swarm Transaction...' : 'Confirm Swarm Purchase'}
                  </button>

                  {submitSuccess && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-[10px] text-green-400 font-black uppercase tracking-widest text-center"
                    >
                      Purchase authorized and tracking initiated!
                    </motion.div>
                  )}
                </div>

              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
