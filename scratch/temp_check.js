
    const PRESETS_RESTAURANTS = [
      {
        id: 'nobu',
        name: 'Nobu Malibu',
        cuisine: 'Japanese Fusion',
        rating: 4.8,
        priceRange: '$$$$',
        location: 'Pacific Coast Hwy, Malibu',
        availability: 'Available Tonight',
        accentColor: 'from-[#a855f7] to-[#ec4899]',
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
        accentColor: 'from-[#06b6d4] to-[#3b82f6]',
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
        accentColor: 'from-[#10b981] to-[#059669]',
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
        accentColor: 'from-[#ec4899] to-[#f43f5e]',
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
        accentColor: 'from-[#f59e0b] to-[#ec4899]',
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
        accentColor: 'from-[#ef4444] to-[#f59e0b]',
        distance: '6.4 miles',
        description: 'Every ingredient is kissed by custom artisanal coals harvested from selected native woods.',
        signatureDish: 'Flame-Grilled Kokotxas',
        gradient: 'linear-gradient(135deg, rgba(239, 68, 68, 0.15) 0%, rgba(245, 158, 11, 0.05) 100%)',
        availableTimes: ['13:00', '14:30', '15:30'],
        image: 'https://image.pollinations.ai/prompt/asador_etxebarri_basque_woodfire_dining_luxury?width=600&height=400&nologo=true&seed=77',
        pricePerPerson: 150
      }
    ];

    const PRESETS_HOTELS = [
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

    const PRESETS_PRODUCTS = [
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
        gradient: 'linear-gradient(135deg, rgba(16, 185, 129, 0.15) 0%, rgba(59, 130, 246, 0.05) 100%)'
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

    const INITIAL_MOCK_RESERVATIONS = [
      {
        id: 'res-1',
        restaurant: 'Nobu Malibu',
        date: '2026-05-24',
        time: '20:30',
        guests: 2,
        notes: 'Requesting a window seat facing the shoreline.',
        status: 'confirmed',
        timestamp: 'CONFIRMED'
      },
      {
        id: 'res-2',
        restaurant: 'SubliMotion',
        date: '2026-06-12',
        time: '21:00',
        guests: 4,
        notes: 'An anniversary celebration. AI instruction set: sensory level high.',
        status: 'pending',
        timestamp: 'PENDING'
      }
    ];

    const INITIAL_MOCK_ORDERS = [
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

    function adminDashboard() {
      return {
        // Core state
        theme: localStorage.getItem('omniai_theme') || 'dark',
        toggleTheme() {
          this.theme = this.theme === 'dark' ? 'light' : 'dark';
          localStorage.setItem('omniai_theme', this.theme);
          setTimeout(() => { if (window.lucide) window.lucide.createIcons(); }, 50);
        },
        role: 'seller', // parsed from URL or switched
        isFileProtocol: window.location.protocol === 'file:',
        activeTab: 'dashboard',
        pipelineFilter: 'all',
        
        // Dynamic logs & diagnostic details
        systemLogs: [],
        simulatedCpu: 42,
        simulatedLatency: 15,
        memoryHistory: [30, 42, 35, 48, 52, 40, 44, 48, 55, 42, 38, 44],
        
        // Database cache datasets synced with localStorage
        restaurants: [],
        hotels: [],
        products: [],
        reservations: [],
        orders: [],
        
        // Seating floor layout state
        tables: [],
        selectedTable: null,
        
        // Toast system
        toasts: [],
        
        // Strategy assistant recommendation state
        aiKeywords: '',
        aiGeneratedText: '',
        
        // Active calendar selected state
        selectedDay: 24,
        
        // Selected Receipt slip for Stripe modals
        selectedReceipt: null,
        
        // Synthesizer new forms state
        newProduct: {
          name: '',
          price: '',
          stock: '',
          category: 'wearables',
          specs: '',
          description: ''
        },

        newHotel: {
          name: '',
          location: '',
          singleRooms: '',
          singlePrice: '',
          doubleRooms: '',
          doublePrice: '',
          description: ''
        },

        newRestaurant: {
          name: '',
          cuisine: '',
          priceRange: '$$$$',
          location: '',
          availability: 'Available Tonight',
          distance: '',
          description: '',
          signatureDish: '',
          pricePerPerson: '',
          availableTimes: '18:30, 20:30, 21:30'
        },

        init() {
          // Check auth session
          const currentUserStr = localStorage.getItem('omniai_current_user');
          if (!currentUserStr) {
            window.location.href = 'index.html';
            return;
          }
          const currentUser = JSON.parse(currentUserStr);

          // Parse url role query
          const params = new URLSearchParams(window.location.search);
          let urlRole = params.get('role');
          if (!urlRole && currentUser && currentUser.role) {
            urlRole = currentUser.role;
          }
          if (urlRole && ['seller', 'hotel', 'restaurant', 'admin'].includes(urlRole)) {
            this.role = urlRole;
          }

          // Initial console logs
          this.addLog('SYSTEM', 'OMNIAI Quantum operating system loaded.');
          this.addLog('SYSTEM', 'Secure handshakes approved with LocalStorage.');
          
          // Seed database cache from localstorage
          this.loadDatabaseSync();

          // Initialize tables matrix
          this.initializeTablesMatrix();

          // Live Telemetry Loop (simulate live updates)
          setInterval(() => {
            this.simulatedCpu = Math.floor(Math.random() * 25) + 30; // 30-55%
            this.simulatedLatency = Math.floor(Math.random() * 8) + 12; // 12-20ms
            
            // shift memory values
            this.memoryHistory.shift();
            this.memoryHistory.push(this.simulatedCpu);
            
            // Randomly log synthetic platform activity
            if (Math.random() < 0.15) {
              const activities = [
                'Uplink heartbeats verified with database replica',
                'Cron node optimized: cached 5 dynamic menus',
                'Securing active transaction buffer',
                'AI decision metrics re-weighting values',
                'Supabase replica storage healthy'
              ];
              this.addLog('SYSTEM', activities[Math.floor(Math.random() * activities.length)]);
            }
          }, 3500);

          // Listen to localStorage changes from NextJS or other tabs
          window.addEventListener('storage', () => {
            this.loadDatabaseSync();
            this.addLog('SYSTEM', 'Supabase cache synchronized with browser-wide storage events.');
          });
          window.addEventListener('omniai_admin_sync', () => {
            this.loadDatabaseSync();
          });
          
          // Refresh icons
          setTimeout(() => {
            if (window.lucide) window.lucide.createIcons();
          }, 500);
        },

        loadDatabaseSync() {
          try {
            // Restaurants
            let savedRes = localStorage.getItem('omniai_sync_restaurants');
            if (!savedRes) {
              localStorage.setItem('omniai_sync_restaurants', JSON.stringify(PRESETS_RESTAURANTS));
              savedRes = localStorage.getItem('omniai_sync_restaurants');
            }
            this.restaurants = JSON.parse(savedRes);
            
            // Hotels
            let savedHotels = localStorage.getItem('omniai_sync_hotels');
            if (!savedHotels) {
              localStorage.setItem('omniai_sync_hotels', JSON.stringify(PRESETS_HOTELS));
              savedHotels = localStorage.getItem('omniai_sync_hotels');
            }
            this.hotels = JSON.parse(savedHotels);

            // Products
            let savedProducts = localStorage.getItem('omniai_sync_products');
            if (!savedProducts) {
              localStorage.setItem('omniai_sync_products', JSON.stringify(PRESETS_PRODUCTS));
              savedProducts = localStorage.getItem('omniai_sync_products');
            }
            this.products = JSON.parse(savedProducts);

            // Reservations
            let savedResv = localStorage.getItem('omniai_sync_reservations');
            if (!savedResv) {
              localStorage.setItem('omniai_sync_reservations', JSON.stringify(INITIAL_MOCK_RESERVATIONS));
              savedResv = localStorage.getItem('omniai_sync_reservations');
            }
            this.reservations = JSON.parse(savedResv);

            // Orders
            let savedOrders = localStorage.getItem('omniai_sync_orders');
            if (!savedOrders) {
              localStorage.setItem('omniai_sync_orders', JSON.stringify(INITIAL_MOCK_ORDERS));
              savedOrders = localStorage.getItem('omniai_sync_orders');
            }
            this.orders = JSON.parse(savedOrders);
            
          } catch (e) {
            this.addLog('SYSTEM', 'Critical sync regression: failed to parse localcache.');
          }
        },

        saveAndSync(key, data) {
          try {
            localStorage.setItem(key, JSON.stringify(data));
            // Trigger cross-window synchronizer in NextJS ConciergeHub
            window.dispatchEvent(new Event('storage'));
            window.dispatchEvent(new CustomEvent('omniai_admin_sync', { detail: { key, data } }));
          } catch (e) {
            this.showToast('SYNC ERROR', 'Failed to commit cache.', 'error');
          }
        },

        switchRole(newRole) {
          this.role = newRole;
          this.addLog('SYSTEM', 'Authorization updated. Upgraded workstation clearance to: ' + newRole);
          this.showToast('Clearance Swapped', 'Clearance level: ' + newRole.toUpperCase(), 'success');
          
          // set search params cleanly without reload
          const params = new URLSearchParams(window.location.search);
          params.set('role', newRole);
          window.history.replaceState({}, '', `${window.location.pathname}?${params.toString()}`);
          
          setTimeout(() => {
            if (window.lucide) window.lucide.createIcons();
          }, 100);
        },

        addLog(source, text) {
          const now = new Date();
          const timeStr = now.toTimeString().split(' ')[0];
          this.systemLogs.unshift({ time: timeStr, source, text });
          
          // Cap logs at 50
          if (this.systemLogs.length > 50) this.systemLogs.pop();
        },

        showToast(title, message, type = 'info') {
          const id = Date.now() + Math.random().toString();
          this.toasts.push({ id, title, message, type });
          
          setTimeout(() => {
            this.removeToast(id);
          }, 4500);

          setTimeout(() => {
            if (window.lucide) window.lucide.createIcons();
          }, 50);
        },

        removeToast(id) {
          this.toasts = this.toasts.filter(t => t.id !== id);
        },

        getRevenueTotal() {
          // Dynamic pricing addition
          let total = 0;
          this.orders.forEach(o => total += o.totalPrice);
          this.reservations.forEach(r => {
            if (r.status === 'confirmed') {
              total += r.guests * 150; // simple calculation
            }
          });
          return total === 0 ? 4850 : total;
        },

        getPendingCount() {
          let count = 0;
          this.reservations.forEach(r => { if (r.status === 'pending') count++; });
          this.orders.forEach(o => { if (o.status === 'processing' || o.status === 'synthesizing') count++; });
          return count;
        },

        // --- PRODUCT ACTIONS ---
        createProduct() {
          if (!this.newProduct.name || !this.newProduct.price) return;
          
          const categoryGradients = {
            wearables: { border: 'from-[#00D1FF] to-[#3b82f6]', bg: 'rgba(0, 209, 255, 0.15)' },
            audio: { border: 'from-[#a855f7] to-[#ec4899]', bg: 'rgba(168, 85, 247, 0.15)' },
            watches: { border: 'from-[#10b981] to-[#059669]', bg: 'rgba(16, 185, 129, 0.15)' },
            gadgets: { border: 'from-[#f59e0b] to-[#d97706]', bg: 'rgba(245, 158, 11, 0.15)' },
            electronics: { border: 'from-[#ef4444] to-[#b91c1c]', bg: 'rgba(239, 68, 68, 0.15)' }
          };

          const selectedGrad = categoryGradients[this.newProduct.category] || categoryGradients.wearables;
          
          const product = {
            id: 'product-' + Math.floor(Math.random() * 9000 + 1000),
            name: this.newProduct.name,
            price: Number(this.newProduct.price),
            stock: Number(this.newProduct.stock) || 10,
            category: this.newProduct.category,
            description: this.newProduct.description,
            accentColor: selectedGrad.border,
            deliveryTime: '2 Days Delivery',
            specs: this.newProduct.specs ? this.newProduct.specs.split(',').map(s => s.trim()) : ['Cybernetic Grade', 'Aesthetic Core'],
            gradient: `linear-gradient(135deg, ${selectedGrad.bg} 0%, rgba(255, 255, 255, 0.02) 100%)`
          };

          this.products.unshift(product);
          this.saveAndSync('omniai_sync_products', this.products);
          
          this.addLog('SELLER', `Synthesized product catalog item: "${product.name}" [${product.id}]`);
          this.showToast('Synthesis Success', `Item committed successfully: ${product.name}`, 'success');

          // Reset form
          this.newProduct = { name: '', price: '', stock: '', category: 'wearables', specs: '', description: '' };
          this.activeTab = 'product-list';
        },

        deleteProduct(id) {
          const removed = this.products.find(p => p.id === id);
          this.products = this.products.filter(p => p.id !== id);
          this.saveAndSync('omniai_sync_products', this.products);
          
          if (removed) {
            this.addLog('SELLER', `Destroyed item: "${removed.name}" [${removed.id}]`);
            this.showToast('Item Extinguished', `Removed from Supabase cache: ${removed.name}`, 'error');
          }
        },

        // --- HOTEL PRICING ACTIONS ---
        registerHotel() {
          if (!this.newHotel.name || !this.newHotel.location) return;

          const hotel = {
            id: 'hotel-' + Math.floor(Math.random() * 9000 + 1000),
            name: this.newHotel.name,
            location: this.newHotel.location,
            singleRooms: Number(this.newHotel.singleRooms) || 0,
            singlePrice: Number(this.newHotel.singlePrice) || 0,
            doubleRooms: Number(this.newHotel.doubleRooms) || 0,
            doublePrice: Number(this.newHotel.doublePrice) || 0,
            description: this.newHotel.description,
            ratePerNight: Math.min(
              this.newHotel.singlePrice ? Number(this.newHotel.singlePrice) : 999,
              this.newHotel.doublePrice ? Number(this.newHotel.doublePrice) : 999
            ) || 199,
            suites: [
              ...(this.newHotel.singleRooms > 0 ? [`Single Room x${this.newHotel.singleRooms}`] : []),
              ...(this.newHotel.doubleRooms > 0 ? [`Double Room x${this.newHotel.doubleRooms}`] : [])
            ]
          };

          this.hotels.unshift(hotel);
          this.saveAndSync('omniai_sync_hotels', this.hotels);
          this.addLog('HOTEL', `Registered new hotel: "${hotel.name}" — ${hotel.singleRooms + hotel.doubleRooms} rooms`);
          this.showToast('Hotel Registered', `"${hotel.name}" is now live on the network.`, 'success');

          // Reset form
          this.newHotel = { name: '', location: '', singleRooms: '', singlePrice: '', doubleRooms: '', doublePrice: '', description: '' };
          this.activeTab = 'hotel-suites';

          setTimeout(() => { if (window.lucide) window.lucide.createIcons(); }, 100);
        },

        deleteHotel(id) {
          const removed = this.hotels.find(h => h.id === id);
          this.hotels = this.hotels.filter(h => h.id !== id);
          this.saveAndSync('omniai_sync_hotels', this.hotels);
          if (removed) {
            this.addLog('HOTEL', `Removed hotel: "${removed.name}" [${removed.id}]`);
            this.showToast('Hotel Removed', `"${removed.name}" has been deregistered.`, 'error');
          }
        },

        adjustNightlyRate(hotelId, amount) {
          const h = this.hotels.find(x => x.id === hotelId);
          if (h) {
            h.ratePerNight = Math.max(100, Number(h.ratePerNight) + amount);
            this.saveAndSync('omniai_sync_hotels', this.hotels);
            this.addLog('HOTEL', `Base schedule rate adjusted for "${h.name}" to $${h.ratePerNight}`);
            this.showToast('Pricing Adjusted', `Base night rate set to $${h.ratePerNight}`, 'success');
          }
        },

        saveHotels() {
          this.saveAndSync('omniai_sync_hotels', this.hotels);
          this.addLog('HOTEL', 'Suite nightly schedules synchronized');
        },

        // --- RESTAURANT PRICING ACTIONS ---
        registerRestaurant() {
          if (!this.newRestaurant.name || !this.newRestaurant.cuisine) return;

          const accentPalettes = [
            { accentColor: 'from-[#00D1FF] to-[#3b82f6]', gradient: 'linear-gradient(135deg, rgba(0, 209, 255, 0.15) 0%, rgba(59, 130, 246, 0.05) 100%)' },
            { accentColor: 'from-[#a855f7] to-[#ec4899]', gradient: 'linear-gradient(135deg, rgba(168, 85, 247, 0.15) 0%, rgba(236, 72, 153, 0.05) 100%)' },
            { accentColor: 'from-[#10b981] to-[#059669]', gradient: 'linear-gradient(135deg, rgba(16, 185, 129, 0.15) 0%, rgba(5, 150, 105, 0.05) 100%)' },
            { accentColor: 'from-[#f59e0b] to-[#ec4899]', gradient: 'linear-gradient(135deg, rgba(245, 158, 11, 0.15) 0%, rgba(236, 72, 153, 0.05) 100%)' },
          ];
          const palette = accentPalettes[Math.floor(Math.random() * accentPalettes.length)];

          const newId = 'restaurant-' + Math.floor(Math.random() * 9000 + 1000);
          const rest = {
            id: newId,
            name: this.newRestaurant.name,
            cuisine: this.newRestaurant.cuisine,
            rating: 4.5,
            priceRange: this.newRestaurant.priceRange || '$$$$',
            location: this.newRestaurant.location || 'Mumbai, India',
            availability: this.newRestaurant.availability || 'Available Tonight',
            accentColor: palette.accentColor,
            distance: this.newRestaurant.distance || '1.0 miles',
            description: this.newRestaurant.description || 'Premium dining node description...',
            signatureDish: this.newRestaurant.signatureDish || 'Chef Special Filet',
            gradient: palette.gradient,
            availableTimes: this.newRestaurant.availableTimes.split(',').map(t => t.trim()).filter(Boolean),
            image: 'https://image.pollinations.ai/prompt/' + encodeURIComponent(this.newRestaurant.name) + '_dining_luxury?width=600&height=400&nologo=true&seed=' + Math.floor(Math.random() * 100),
            pricePerPerson: Number(this.newRestaurant.pricePerPerson) || 120
          };

          this.restaurants.unshift(rest);
          this.saveAndSync('omniai_sync_restaurants', this.restaurants);
          this.addLog('DINE', `Registered new restaurant: "${rest.name}" — ${rest.cuisine}`);
          this.showToast('Restaurant Registered', `"${rest.name}" is now live on the network.`, 'success');

          // Reset form
          this.newRestaurant = {
            name: '',
            cuisine: '',
            priceRange: '$$$$',
            location: '',
            availability: 'Available Tonight',
            distance: '',
            description: '',
            signatureDish: '',
            pricePerPerson: '',
            availableTimes: '18:30, 20:30, 21:30'
          };
          this.activeTab = 'restaurant-menu';

          setTimeout(() => { if (window.lucide) window.lucide.createIcons(); }, 100);
        },

        deleteRestaurant(id) {
          const removed = this.restaurants.find(r => r.id === id);
          this.restaurants = this.restaurants.filter(r => r.id !== id);
          this.saveAndSync('omniai_sync_restaurants', this.restaurants);
          if (removed) {
            this.addLog('DINE', `Removed restaurant: "${removed.name}" [${removed.id}]`);
            this.showToast('Restaurant Extinguished', `Removed from Supabase cache: ${removed.name}`, 'error');
          }
        },

        // --- RESTAURANT SEATING MATRIX GRID ACTIONS ---
        initializeTablesMatrix() {
          // Initialize 12 tables
          const initialTables = [];
          for (let i = 1; i <= 12; i++) {
            initialTables.push({
              id: i,
              guests: i % 2 === 0 ? 4 : 2,
              status: i % 3 === 0 ? 'occupied' : 'free',
              assignedClient: i % 3 === 0 ? 'Diner Party ' + (80 + i) : null
            });
          }
          this.tables = initialTables;
        },

        selectTable(table) {
          this.selectedTable = table;
          setTimeout(() => {
            if (window.lucide) window.lucide.createIcons();
          }, 50);
        },

        getTableClass(table) {
          let classes = '';
          if (this.selectedTable && this.selectedTable.id === table.id) {
            classes = 'bg-[var(--accent-purple)]/20 border-[var(--accent-purple)] text-[var(--accent-purple)] custom-glow-purple scale-[1.03]';
          } else if (table.status === 'occupied') {
            classes = 'bg-red-500/10 border-red-500/20 text-red-400 custom-glow-pink hover:bg-red-500/20';
          } else {
            classes = 'bg-[var(--accent-emerald)]/10 border-[var(--accent-emerald)]/20 text-[var(--accent-emerald)] hover:bg-[var(--accent-emerald)]/20';
          }
          return classes;
        },

        getPendingRestaurantBookings() {
          return this.reservations.filter(r => r.status === 'pending');
        },

        assignTableReservation(tableId, reservation) {
          const tab = this.tables.find(t => t.id === tableId);
          if (tab) {
            tab.status = 'occupied';
            tab.assignedClient = reservation.restaurant + ' Party';
            
            // Confirm booking in DB
            this.updateBookingStatus(reservation.id, 'confirmed');
            
            this.addLog('DINE', `Assigned Reservation ID ${reservation.id} to Dining Table ${tableId}`);
            this.showToast('Seated Success', `Diners assigned to Table ${tableId}`, 'success');
            
            this.selectedTable = tab;
          }
        },

        freeTable(tableId) {
          const tab = this.tables.find(t => t.id === tableId);
          if (tab) {
            tab.status = 'free';
            tab.assignedClient = null;
            this.addLog('DINE', `Dining Table ${tableId} is now unseated/free`);
            this.showToast('Table Extinguished', `Table ${tableId} cleared`, 'info');
            this.selectedTable = tab;
          }
        },

        saveRestaurants() {
          this.saveAndSync('omniai_sync_restaurants', this.restaurants);
          this.addLog('DINE', 'Signature menus and table schedules synchronized');
        },

        // --- ORDER & BOOKING FLOW PIPELINE ACTIONS ---
        updateBookingStatus(id, newStatus) {
          const res = this.reservations.find(r => r.id === id);
          if (res) {
            res.status = newStatus;
            this.saveAndSync('omniai_sync_reservations', this.reservations);
            this.addLog(res.type === 'hotel' ? 'HOTEL' : 'DINE', `Reservation ID "${res.id}" updated status to: ${newStatus.toUpperCase()}`);
            this.showToast('Reservation Updated', `Status confirmed: ${newStatus}`, 'success');
          }
        },

        updateOrderStatus(id, newStatus) {
          const ord = this.orders.find(o => o.id === id);
          if (ord) {
            ord.status = newStatus;
            this.saveAndSync('omniai_sync_orders', this.orders);
            this.addLog('SELLER', `Order ID "${ord.id}" updated process: ${newStatus.toUpperCase()}`);
            this.showToast('Order Flow Synced', `Process status set: ${newStatus}`, 'success');
          }
        },

        deleteOrder(id) {
          const removed = this.orders.find(o => o.id === id);
          this.orders = this.orders.filter(o => o.id !== id);
          this.saveAndSync('omniai_sync_orders', this.orders);
          
          if (removed) {
            this.addLog('SELLER', `Destroyed order: ${removed.id}`);
            this.showToast('Order Extinguished', `Removed from memory pipeline: ${removed.id}`, 'error');
          }
        },

        // --- AI STRATEGY & DYNAMIC RECOMMENDATIONS ---
        generateAiDescription() {
          if (!this.aiKeywords) return;
          this.aiGeneratedText = 'Evaluating parameters...';
          
          let kw = this.aiKeywords.toLowerCase();
          setTimeout(() => {
            this.aiGeneratedText = `Elevate your digital profile with this quantum-grade masterpiece. Crafted featuring ${kw}, custom optimized for zero-latency neural synchronization. Made from premium titanium alloys to balance aesthetics and raw structural security. Engineered for modern high-demand SaaS operations.`;
            this.newProduct.description = this.aiGeneratedText;
            this.showToast('Copy Generated', 'Neural recommendation embedded into form.', 'success');
          }, 1200);
        },

        applyAiPricingRecommendation(hotelId, percentGains) {
          const h = this.hotels.find(x => x.id === hotelId);
          if (h) {
            const original = h.ratePerNight;
            h.ratePerNight = Math.floor(h.ratePerNight * (1 + percentGains / 100));
            this.saveAndSync('omniai_sync_hotels', this.hotels);
            this.addLog('HOTEL', `AI strategy recommendation applied for "${h.name}": base nightly rate increased from $${original} to $${h.ratePerNight}`);
            this.showToast('Pricing Optimized', `Night rate auto increased to $${h.ratePerNight}`, 'success');
          }
        },

        restockItem(productId) {
          const p = this.products.find(x => x.id === productId);
          if (p) {
            p.stock += 15;
            this.saveAndSync('omniai_sync_products', this.products);
            this.addLog('SELLER', `Synthesized stock: added +15 units to "${p.name}"`);
            this.showToast('Catalog Re-fueled', `Stock quantity adjusted: ${p.stock}`, 'success');
          }
        },

        // --- CALENDAR SUITE OCCUPANCY SCHEDULER ---
        selectCalendarDay(day) {
          this.selectedDay = day;
          this.showToast('Calendar Slot', `Inspecting suite timeline allocations for Day ${day}`, 'info');
        },

        getDayBookings(day) {
          // Mocking bookings calendar for specific days inside May 2026 based on booking ID numerical hashes
          return this.reservations.filter(r => {
            // Extract a day between 1 and 31 from the booking date string
            // For mock demo, if date includes '2026-05', parse day, otherwise map using simple hash code
            let dVal = 24;
            if (r.date) {
              const matches = r.date.match(/-(\d+)$/);
              if (matches) dVal = parseInt(matches[1]);
              else dVal = (r.id.charCodeAt(0) || 24) % 30 + 1;
            }
            return dVal === day;
          });
        },

        getCalendarDayClass(day) {
          let classes = '';
          const bookings = this.getDayBookings(day);
          
          if (day === this.selectedDay) {
            classes = 'bg-[var(--accent-purple)]/20 border-[var(--accent-purple)] text-[var(--accent-purple)] custom-glow-purple scale-[1.05]';
          } else if (bookings.length > 0) {
            const confirmed = bookings.some(b => b.status === 'confirmed');
            if (confirmed) {
              classes = 'bg-[var(--accent-emerald)]/10 border-[var(--accent-emerald)]/20 text-[var(--accent-emerald)] hover:bg-[var(--accent-emerald)]/20';
            } else {
              classes = 'bg-[var(--accent-cyan)]/10 border-[var(--accent-cyan)]/20 text-[var(--accent-cyan)] hover:bg-[var(--accent-cyan)]/20';
            }
          } else {
            classes = 'bg-black/40 text-white/50 hover:bg-black/60';
          }
          return classes;
        },

        // --- HOLOGRAPHIC STRIPE SLIP MODALS AND DOWNLOADING ---
         openReceipt(type, entity) {
          // compile selectedReceipt payload
          let data = {};
          if (type === 'booking') {
            const calculatedPrice = entity.price || (entity.type === 'hotel' ? 1450 : entity.guests * 150);
            data = {
              id: entity.id,
              restaurant: entity.restaurant,
              receiptHash: '0x' + Array.from({length: 40}, () => Math.floor(Math.random()*16).toString(16)).join(''),
              date: entity.date,
              totalPrice: calculatedPrice,
              guests: entity.guests
            };
          } else {
            data = {
              id: entity.id,
              restaurant: 'Shopping Purchase',
              receiptHash: entity.receiptHash || '0x4f2e...c18a',
              date: entity.date,
              totalPrice: entity.totalPrice
            };
          }
          this.selectedReceipt = data;
          this.showToast('Slip Loaded', 'Transaction slip compiled with secure validation.', 'success');
        },

        copyReceiptHash() {
          if (!this.selectedReceipt) return;
          navigator.clipboard.writeText(this.selectedReceipt.receiptHash);
          this.showToast('Copied Hash', 'Transaction hash copied to security clipboard.', 'success');
        },

        downloadReceipt() {
          if (!this.selectedReceipt) return;
          
          const { jsPDF } = window.jspdf;
          const doc = new jsPDF({
            orientation: 'portrait',
            unit: 'mm',
            format: 'a6'
          });

          // Custom futuristic styling PDF
          doc.setFillColor(3, 0, 20); // Dark background
          doc.rect(0, 0, 105, 148, 'F');

          doc.setTextColor(0, 209, 255); // Cyan color title
          doc.setFont('Helvetica', 'bold');
          doc.setFontSize(14);
          doc.text('OMNIAI PAY SLIP', 15, 20);

          doc.setTextColor(255, 255, 255);
          doc.setFontSize(8);
          doc.setFont('Courier', 'normal');
          doc.text(`ID: TXID_${this.selectedReceipt.id}`, 15, 30);
          doc.text(`GATEWAY: STRIPE QUANTUM PRO`, 15, 35);
          doc.text(`DATE: ${this.selectedReceipt.date}`, 15, 40);
          doc.text(`TX HASH: ${this.selectedReceipt.receiptHash.slice(0, 22)}...`, 15, 45);

          doc.setDrawColor(255, 255, 255);
          doc.setLineWidth(0.2);
          doc.line(15, 52, 90, 52);

          doc.setFontSize(10);
          doc.setFont('Helvetica', 'bold');
          doc.text(this.selectedReceipt.restaurant.toUpperCase(), 15, 62);
          doc.text(`AMOUNT DUE: $${this.selectedReceipt.totalPrice}`, 15, 72);

          doc.setTextColor(16, 185, 129); // Emerald Green stamp
          doc.setDrawColor(16, 185, 129);
          doc.rect(15, 85, 40, 12);
          doc.text('PAID SECURE', 20, 93);

          doc.save(`receipt-${this.selectedReceipt.id}.pdf`);
          this.showToast('Slip Downloaded', 'PDF compiled and dispatched.', 'success');
        },

        resetToPresets() {
          localStorage.setItem('omniai_sync_restaurants', JSON.stringify(PRESETS_RESTAURANTS));
          localStorage.setItem('omniai_sync_hotels', JSON.stringify(PRESETS_HOTELS));
          localStorage.setItem('omniai_sync_products', JSON.stringify(PRESETS_PRODUCTS));
          localStorage.setItem('omniai_sync_reservations', JSON.stringify(INITIAL_MOCK_RESERVATIONS));
          localStorage.setItem('omniai_sync_orders', JSON.stringify(INITIAL_MOCK_ORDERS));
          
          this.loadDatabaseSync();
          this.addLog('SYSTEM', 'Clean factory parameters restored to LocalStorage cache.');
          this.showToast('Reset Done', 'Database restored to core specifications.', 'error');
        }
      };
    }
  