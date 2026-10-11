import React, { useState } from 'react';
import { Plus, Check, Car, Coffee, Sparkles, Filter, Clock } from 'lucide-react';
import { Product, ProductCategory } from '../types';

interface ShopViewProps {
  products: Product[];
  onAddToCart: (product: Product, selectedOption?: string) => void;
  initialCategory?: ProductCategory;
}

export const ShopView: React.FC<ShopViewProps> = ({
  products,
  onAddToCart,
  initialCategory = 'coffee',
}) => {
  const [selectedCategory, setSelectedCategory] = useState<ProductCategory>(initialCategory);
  const [addedItemEffect, setAddedItemEffect] = useState<string | null>(null);
  const [selectedVariants, setSelectedVariants] = useState<Record<string, string>>({});

  const filterTabs: { id: ProductCategory; label: string }[] = [
    { id: 'coffee', label: 'Coffee Drinks' },
    { id: 'features', label: 'Features' },
    { id: 'exterior', label: 'Exterior Wash' },
    { id: 'interior', label: 'Full Interior Detail' },
    { id: 'bakery', label: 'Bakery & Bites' },
    { id: 'all', label: 'All Items' },
  ];

  const filteredProducts = products.filter((p) => {
    if (selectedCategory === 'all') return true;
    return p.category === selectedCategory;
  });

  const handleAdd = (product: Product) => {
    const chosenOption = selectedVariants[product.id] || (product.options?.[0]?.choices[0]);
    onAddToCart(product, chosenOption);
    setAddedItemEffect(product.id);
    setTimeout(() => {
      setAddedItemEffect(null);
    }, 1200);
  };

  const handleVariantChange = (productId: string, variant: string) => {
    setSelectedVariants(prev => ({ ...prev, [productId]: variant }));
  };

  const getTagColorClass = (tagColor?: string) => {
    switch (tagColor) {
      case 'gold':
        return 'text-[#d4af37] border-[#d4af37]/40 bg-[#171412]/90';
      case 'crimson':
        return 'text-[#ff6b6b] border-[#c0392b]/60 bg-[#171412]/90';
      case 'emerald':
        return 'text-emerald-400 border-emerald-500/40 bg-[#171412]/90';
      default:
        return 'text-[#d4af37] border-[#d4af37]/40 bg-[#171412]/90';
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      
      {/* Page Header */}
      <div className="text-center space-y-3 max-w-3xl mx-auto">
        <span className="text-xs font-semibold uppercase tracking-[0.25em] text-[#d4af37]">
          ORDER ONLINE
        </span>
        <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold text-white tracking-tight">
          Artisanal Menu & Wash Packages
        </h1>
        <p className="text-sm sm:text-base text-[#ede8e3]/70 leading-relaxed font-normal">
          Order signature espresso brews, fresh pastries, and certified automotive detailing packages in one seamless tab. Your coffee is brewed while your vehicle enters our spotless bay.
        </p>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center justify-center overflow-x-auto py-2 no-scrollbar">
        <div className="inline-flex p-1.5 rounded-2xl bg-[#201c19] border border-white/10 gap-1.5 shadow-xl">
          {filterTabs.map((tab) => {
            const isActive = selectedCategory === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setSelectedCategory(tab.id)}
                className={`px-4 sm:px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold whitespace-nowrap transition-all duration-200 cursor-pointer ${
                  isActive
                    ? 'bg-[#c0392b] text-white shadow-md shadow-[#c0392b]/30'
                    : 'text-[#ede8e3]/70 hover:text-white hover:bg-white/5'
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Product Count & Sub-filter bar */}
      <div className="flex items-center justify-between border-b border-white/5 pb-4 text-xs text-[#ede8e3]/60">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-white">{filteredProducts.length} items</span>
          <span>available at Nieves Hills location</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="hidden sm:inline">Unified POS Ticketing</span>
          <span>·</span>
          <span className="text-[#d4af37]">Plate Number Linked</span>
        </div>
      </div>

      {/* Responsive Grid of Product Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
        {filteredProducts.map((product) => {
          const isAdded = addedItemEffect === product.id;
          const currentVariant = selectedVariants[product.id] || (product.options?.[0]?.choices[0]);

          return (
            <div
              key={product.id}
              className="group rounded-2xl bg-[#201c19] border border-white/5 hover:border-white/15 overflow-hidden transition-all duration-300 flex flex-col justify-between hover:-translate-y-1 shadow-xl"
            >
              {/* Photo on Top */}
              <div className="relative aspect-[4/3] overflow-hidden bg-[#171412]">
                <img
                  src={product.imageUrl}
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                  onError={(e) => {
                    (e.target as HTMLElement).style.display = 'none';
                  }}
                />

                {/* Styled CSS Fallback Container */}
                <div className={`absolute inset-0 bg-gradient-to-br ${product.imageFallbackGradient} -z-10 flex items-center justify-center p-6 text-center`}>
                  <div className="space-y-1">
                    {product.isWashPackage ? (
                      <Car className="w-12 h-12 text-[#d4af37] mx-auto opacity-70" />
                    ) : (
                      <Coffee className="w-12 h-12 text-[#d4af37] mx-auto opacity-70" />
                    )}
                    <span className="text-xs font-serif text-white/80 block">{product.name}</span>
                  </div>
                </div>

                {/* Small colored tag top-left (BEST SELLER / FRESH DAILY / NEW ITEM) */}
                {product.tag && (
                  <div className={`absolute top-3 left-3 px-2.5 py-1 rounded border text-[10px] font-bold tracking-wider uppercase backdrop-blur-md ${getTagColorClass(product.tagColor)}`}>
                    {product.tag}
                  </div>
                )}

                {/* Duration or Wash pill */}
                {product.isWashPackage && product.estimatedTime && (
                  <div className="absolute bottom-3 right-3 px-2.5 py-1 rounded bg-black/75 backdrop-blur-md border border-white/10 text-white/90 text-[10px] font-mono flex items-center gap-1.5">
                    <Clock className="w-3 h-3 text-[#d4af37]" />
                    <span>{product.estimatedTime}</span>
                  </div>
                )}
              </div>

              {/* Product Details */}
              <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-[#d4af37] uppercase tracking-wider font-semibold text-[10px]">
                      {product.isWashPackage ? 'Auto Spa Service' : 'Artisanal Café'}
                    </span>
                    <span className="text-xl font-bold text-white font-mono">
                      ₱{product.price.toLocaleString()}
                    </span>
                  </div>

                  <h3 className="font-serif text-xl font-bold text-white group-hover:text-[#d4af37] transition-colors leading-snug">
                    {product.name}
                  </h3>

                  <p className="text-xs text-[#ede8e3]/70 leading-relaxed">
                    {product.description}
                  </p>
                </div>

                {/* Options selector if available (Hot/Iced or Sedan/SUV) */}
                {product.options && product.options.length > 0 && (
                  <div className="pt-2 border-t border-white/5 space-y-1">
                    <label className="text-[10px] text-[#ede8e3]/50 uppercase tracking-wider block">
                      {product.options[0].label}:
                    </label>
                    <select
                      value={currentVariant}
                      onChange={(e) => handleVariantChange(product.id, e.target.value)}
                      className="w-full bg-[#171412] border border-white/10 rounded-lg px-2.5 py-1.5 text-xs text-[#ede8e3] focus:outline-none focus:border-[#d4af37]"
                    >
                      {product.options[0].choices.map((choice) => (
                        <option key={choice} value={choice} className="bg-[#171412] text-white">
                          {choice}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                {/* Bottom Action: Red "Add to Cart" button */}
                <div className="pt-2">
                  <button
                    onClick={() => handleAdd(product)}
                    className={`w-full py-3 px-4 rounded-xl text-xs font-semibold uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md ${
                      isAdded 
                        ? 'bg-emerald-600 text-white' 
                        : 'bg-[#c0392b] hover:bg-[#a93226] text-white shadow-[#c0392b]/25 active:scale-[0.98]'
                    }`}
                  >
                    {isAdded ? (
                      <>
                        <Check className="w-4 h-4" />
                        <span>Added to Cart</span>
                      </>
                    ) : (
                      <>
                        <Plus className="w-4 h-4" />
                        <span>Add to Cart</span>
                      </>
                    )}
                  </button>
                </div>

              </div>
            </div>
          );
        })}
      </div>

      {/* Bottom Cross-Sell Banner */}
      <div className="p-8 rounded-3xl bg-gradient-to-r from-[#281b17] via-[#211a16] to-[#1a1411] border border-[#d4af37]/20 flex flex-col md:flex-row items-center justify-between gap-6 shadow-2xl">
        <div className="space-y-2 text-center md:text-left">
          <span className="text-xs font-bold uppercase tracking-widest text-[#d4af37]">
            UNLI-WASH + UNLIMITED LOUNGE
          </span>
          <h3 className="font-serif text-2xl sm:text-3xl font-bold text-white">
            Drive in anytime. Never pay for water wash again.
          </h3>
          <p className="text-xs sm:text-sm text-[#ede8e3]/70 max-w-xl">
            Join the Auto Ave Unli Car Wash monthly club. Includes express bay priority, member cupping invitations, and 15% off the entire café menu.
          </p>
        </div>
        <button
          onClick={() => setSelectedCategory('features')}
          className="px-6 py-3.5 rounded-xl bg-[#c0392b] hover:bg-[#a93226] text-white text-xs font-bold uppercase tracking-wider whitespace-nowrap transition-all shadow-lg cursor-pointer"
        >
          View VIP Pass Details
        </button>
      </div>

    </div>
  );
};
