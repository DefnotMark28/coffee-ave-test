/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState } from 'react';
import { Navbar } from './components/Navbar';
import { CartDrawer } from './components/CartDrawer';
import { Footer } from './components/Footer';
import { BayLiveStreamModal } from './components/BayLiveStreamModal';
import { AuthModal, type AuthMode } from './components/AuthModal';
import { HomeView } from './views/HomeView';
import { ShopView } from './views/ShopView';
import { TrackerView } from './views/TrackerView';
import { CommunityView } from './views/CommunityView';
import { DashboardView } from './views/DashboardView';
import { PRODUCTS, INITIAL_VEHICLES, INITIAL_NOTIFICATIONS } from './data/mockData';
import { api } from './api';
import { Product, CartItem, VehicleQueueItem, UserNotification, Member } from './types';
import { Sparkles, Check, Car, Coffee } from 'lucide-react';

export default function App() {
  const [currentTab, setCurrentTab] = useState<string>('home');
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [savedPlateNumber, setSavedPlateNumber] = useState<string>('NDE 4821');
  // The sample data shows first, then the database replaces it as soon as it replies.
  const [products, setProducts] = useState<Product[]>(PRODUCTS);
  const [vehicles, setVehicles] = useState<VehicleQueueItem[]>(INITIAL_VEHICLES);
  const [notifications, setNotifications] = useState<UserNotification[]>(INITIAL_NOTIFICATIONS);

  useEffect(() => {
    let cancelled = false;
    Promise.allSettled([api.products(), api.vehicles(), api.notifications()]).then(([p, v, n]) => {
      if (cancelled) return;
      if (p.status === 'fulfilled' && p.value.length > 0) setProducts(p.value);
      if (v.status === 'fulfilled' && v.value.length > 0) setVehicles(v.value);
      if (n.status === 'fulfilled' && n.value.length > 0) setNotifications(n.value);
    });
    return () => {
      cancelled = true;
    };
  }, []);
  
  // Signed in member (null when signed out). The server keeps the sign in in a secure cookie.
  const [member, setMember] = useState<Member | null>(null);
  useEffect(() => {
    api.me().then((user) => {
      if (!user) return;
      setMember(user);
      setSavedPlateNumber(user.plateNumber);
    }).catch(() => {
      // Not signed in, or the server is not reachable.
    });
  }, []);

  // Modals
  const [authMode, setAuthMode] = useState<AuthMode>('signup');
  const [isAuthOpen, setIsAuthOpen] = useState<boolean>(false);
  const openAuth = (mode: AuthMode) => {
    setAuthMode(mode);
    setIsAuthOpen(true);
  };
  const [isLiveBayModalOpen, setIsLiveBayModalOpen] = useState<boolean>(false);
  const [selectedVehicleForBay, setSelectedVehicleForBay] = useState<VehicleQueueItem | null>(null);

  // Quick toast state
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 2800);
  };

  // Cart operations
  const handleAddToCart = (product: Product, selectedOption?: string) => {
    const existingIndex = cartItems.findIndex(
      (item) => item.productId === product.id && item.selectedOption === selectedOption
    );

    if (existingIndex > -1) {
      const updated = [...cartItems];
      updated[existingIndex].quantity += 1;
      setCartItems(updated);
    } else {
      const newItem: CartItem = {
        id: `cart-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
        productId: product.id,
        name: product.name,
        price: product.price,
        quantity: 1,
        isWashPackage: product.isWashPackage,
        selectedOption,
        imageUrl: product.imageUrl,
      };
      setCartItems((prev) => [...prev, newItem]);
    }

    showToast(`Added "${product.name}" to cart`);
  };

  const handleUpdateQuantity = (id: string, newQty: number) => {
    if (newQty <= 0) {
      handleRemoveCartItem(id);
      return;
    }
    setCartItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, quantity: newQty } : item))
    );
  };

  const handleRemoveCartItem = (id: string) => {
    setCartItems((prev) => prev.filter((item) => item.id !== id));
  };

  const handleClearCart = () => {
    setCartItems([]);
  };

  // Order Confirmed Handler
  const handleOrderConfirmed = (orderDetails: {
    plateNumber: string;
    tableNumber: string;
    totalAmount: number;
    items: CartItem[];
  }) => {
    const hasWash = orderDetails.items.some((i) => i.isWashPackage);
    const washItem = orderDetails.items.find((i) => i.isWashPackage);
    const cafeItems = orderDetails.items.filter((i) => !i.isWashPackage);

    // If order has wash package, stage the vehicle in the queue
    if (hasWash) {
      const newQueueVehicle: VehicleQueueItem = {
        id: `veh-new-${Date.now()}`,
        plateNumber: orderDetails.plateNumber,
        vehicleModel: 'Customer Vehicle',
        vehicleColor: 'Registered Patron',
        colorHex: '#c0392b',
        servicePackage: washItem ? washItem.name : 'Premium Spa Wash',
        startTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        estimatedDuration: '35 min',
        stage: 1,
        stageName: 'Preparing',
        stageProgressPercent: 20,
        bayNumber: Math.floor(Math.random() * 4) + 1,
        customerName: 'Patron',
        cafeOrderLinked: cafeItems.length > 0 
          ? cafeItems.map((c) => `${c.quantity}x ${c.name}`).join(', ')
          : undefined,
        drinkStatus: cafeItems.length > 0 ? 'Brewing' : 'None',
        tableNumber: orderDetails.tableNumber || 'Table 04',
      };

      setVehicles((prev) => [newQueueVehicle, ...prev]);
    }

    // Add notification
    const newNotif: UserNotification = {
      id: `notif-${Date.now()}`,
      title: 'Order Confirmed & Posted',
      message: `Tab of ₱${orderDetails.totalAmount.toLocaleString()} posted. Plate ${orderDetails.plateNumber} linked to lounge seat ${orderDetails.tableNumber || 'Main Mezzanine'}.`,
      time: 'Just now',
      read: false,
      type: hasWash ? 'wash' : 'cafe',
    };
    setNotifications((prev) => [newNotif, ...prev]);

    showToast(`Order Confirmed! Plate ${orderDetails.plateNumber} staged.`);
  };

  // Advance stage interactive simulator
  const handleAdvanceVehicleStage = (vehicleId: string) => {
    setVehicles((prev) =>
      prev.map((v) => {
        if (v.id !== vehicleId) return v;

        if (v.stage === 1) {
          showToast(`Vehicle ${v.plateNumber} moved to Stage 2: Cleaning & Prep!`);
          return {
            ...v,
            stage: 2,
            stageName: 'Cleaning & Prep',
            stageProgressPercent: 65,
          };
        } else if (v.stage === 2) {
          showToast(`Vehicle ${v.plateNumber} is now Stage 3: Ready for Pickup!`);
          return {
            ...v,
            stage: 3,
            stageName: 'Ready for Pickup',
            stageProgressPercent: 100,
          };
        } else {
          showToast(`Vehicle ${v.plateNumber} already finished detailing.`);
          return v;
        }
      })
    );
  };

  const handleOpenLiveCamera = (vehicle: VehicleQueueItem) => {
    setSelectedVehicleForBay(vehicle);
    setIsLiveBayModalOpen(true);
  };

  const handleSignOut = async () => {
    try {
      await api.signOut();
    } catch {
      // The cookie will expire on its own if the server cannot be reached.
    }
    setMember(null);
    if (currentTab === 'dashboard') setCurrentTab('home');
    showToast('You have been signed out');
  };

  const markNotificationsAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const totalCartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  // 3 Best Sellers for Home Page
  const bestSellers = products.filter((p) => p.tag === 'BEST SELLER').slice(0, 3);

  return (
    <div className="min-h-screen bg-[#171412] text-[#ede8e3] flex flex-col font-sans selection:bg-[#c0392b] selection:text-white">
      
      {/* Global Navigation */}
      <Navbar
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        cartCount={totalCartCount}
        openCart={() => setIsCartOpen(true)}
        notifications={notifications}
        markNotificationsAsRead={markNotificationsAsRead}
        member={member}
        onOpenSignIn={() => openAuth('signin')}
        onSignOut={handleSignOut}
      />

      {/* Main View Router */}
      <main className="flex-1">
        {currentTab === 'home' && (
          <HomeView
            onNavigate={(tab) => setCurrentTab(tab)}
            onAddToCart={handleAddToCart}
            bestSellers={bestSellers}
            onOpenSignUp={() => (member ? setCurrentTab('dashboard') : openAuth('signup'))}
            onOpenBayModal={() => {
              setSelectedVehicleForBay(vehicles[0] || null);
              setIsLiveBayModalOpen(true);
            }}
          />
        )}

        {currentTab === 'cafe' && (
          <ShopView
            products={products}
            onAddToCart={handleAddToCart}
            initialCategory="coffee"
          />
        )}

        {currentTab === 'wash' && (
          <ShopView
            products={products}
            onAddToCart={handleAddToCart}
            initialCategory="exterior"
          />
        )}

        {currentTab === 'tracker' && (
          <TrackerView
            vehicles={vehicles}
            onOpenLiveCamera={handleOpenLiveCamera}
            onAdvanceVehicleStage={handleAdvanceVehicleStage}
            userPlateNumber={savedPlateNumber}
          />
        )}

        {currentTab === 'dashboard' && (
          <DashboardView
            member={member}
            vehicles={vehicles}
            notifications={notifications}
            onMemberUpdated={(updated) => {
              setMember(updated);
              setSavedPlateNumber(updated.plateNumber);
            }}
            onOpenLiveCamera={handleOpenLiveCamera}
            onNavigate={(tab) => setCurrentTab(tab)}
            onOpenSignIn={() => openAuth('signin')}
            onSignOut={handleSignOut}
            showToast={showToast}
          />
        )}

        {currentTab === 'community' && (
          <CommunityView
            onOpenSignUp={() => (member ? setCurrentTab('dashboard') : openAuth('signup'))}
            onNavigate={(tab) => setCurrentTab(tab)}
          />
        )}
      </main>

      {/* Global Footer */}
      <Footer onNavigate={(tab) => setCurrentTab(tab)} />

      {/* Slide-out Cart Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cartItems}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveCartItem}
        onClearCart={handleClearCart}
        onOrderConfirmed={(details) => {
          handleOrderConfirmed(details);
          setCurrentTab('tracker');
        }}
        savedPlateNumber={savedPlateNumber}
        setSavedPlateNumber={setSavedPlateNumber}
      />

      {/* Live Bay Camera Modal */}
      <BayLiveStreamModal
        isOpen={isLiveBayModalOpen}
        onClose={() => setIsLiveBayModalOpen(false)}
        selectedVehicle={selectedVehicleForBay}
      />

      {/* Sign up / sign in modal */}
      <AuthModal
        isOpen={isAuthOpen}
        mode={authMode}
        onModeChange={setAuthMode}
        onClose={() => setIsAuthOpen(false)}
        onSuccess={(user, mode) => {
          setMember(user);
          setSavedPlateNumber(user.plateNumber);
          showToast(mode === 'signup' ? `Welcome ${user.name}! Plate ${user.plateNumber} registered.` : `Welcome back, ${user.name.split(' ')[0]}!`);
          setCurrentTab('dashboard');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#25201c] border border-[#d4af37]/40 text-white px-4 py-3 rounded-xl shadow-2xl flex items-center gap-3 animate-in fade-in slide-in-from-bottom-3 duration-200">
          <div className="w-2 h-2 rounded-full bg-[#c0392b] animate-ping" />
          <span className="text-xs font-semibold">{toastMessage}</span>
        </div>
      )}

    </div>
  );
}
