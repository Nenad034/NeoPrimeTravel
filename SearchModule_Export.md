# NeoTravel Search Module - Source Code Export

This document contains the complete, self-contained source code for the **Smart Search & Dynamic Packaging System** as implemented in the NeoTravel platform. It is designed for easy migration to other applications, providing a premium UI and robust business logic.

## 1. CSS Styles (Global or Scoped)
Add these styles to your global CSS file or a dedicated `SearchModule.css`. These styles include the "Glassmorphism" effect and the premium color palette.

```css
/* NeoTravel Search Design System */
:root {
  --bordo: #800020;
  --emerald: #10B981;
  --amber: #F59E0B;
  --border-color: rgba(0, 0, 0, 0.08);
  --bg-app: #F8FAFC;
  --text-main: #0F172A;
  --header-sub: rgba(15, 23, 42, 0.6);
}

.glass-card {
  background: rgba(255, 255, 255, 0.85);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border: 1px solid var(--border-color);
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.03);
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}

.btn-primary {
  background: var(--bordo);
  color: white !important;
  border: none;
  border-radius: 12px;
  padding: 10px 24px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s;
  text-transform: uppercase;
  font-size: 13px;
  letter-spacing: 0.5px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.btn-primary:hover {
  transform: translateY(-2px);
  filter: brightness(1.1);
  box-shadow: 0 8px 20px rgba(128, 0, 32, 0.25);
}

.btn-primary:active {
  transform: translateY(0);
}

/* Search Tabs */
.search-type-tab {
  display: flex;
  align-items: center;
  gap: 32px;
  border-bottom: 1px solid var(--border-color);
  padding-bottom: 4px;
}

.type-tab-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  color: var(--header-sub);
  transition: all 0.2s;
  border-bottom: 3px solid transparent;
  padding: 0 8px 12px 8px;
  margin-bottom: -1px;
  min-width: 90px;
}

.type-tab-item.active {
  color: var(--bordo);
  border-bottom-color: var(--bordo);
}

.type-tab-item span {
  font-size: 11px;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  white-space: nowrap;
}

/* Input Fields */
.search-input-field {
  position: relative;
  display: flex;
  align-items: center;
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.4);
  transition: all 0.2s;
}

.search-input-field:hover {
  background: rgba(255, 255, 255, 0.8);
}

.search-input-field label {
  position: absolute;
  top: 8px;
  left: 48px;
  font-size: 11px;
  font-weight: 700;
  color: var(--header-sub);
  text-transform: capitalize;
  z-index: 10;
  pointer-events: none;
}

.search-input-field input {
  width: 100%;
  padding: 24px 16px 8px 48px;
  border-radius: 12px;
  border: 1px solid transparent;
  background: transparent;
  font-family: inherit;
  font-size: 13px;
  font-weight: 700;
  color: var(--text-main);
  outline: none;
  height: 64px;
  transition: all 0.2s;
}

.search-input-field input:focus {
  background: white;
  border-color: var(--bordo);
  box-shadow: 0 0 0 4px rgba(128, 0, 32, 0.05);
}

/* Popovers (Calendar & Rooms) */
.search-popover {
  position: absolute;
  top: calc(100% + 8px);
  left: 0;
  background: white;
  border-radius: 20px;
  border: 1px solid var(--border-color);
  box-shadow: 0 10px 40px rgba(0,0,0,0.12);
  z-index: 1000;
  padding: 24px;
  animation: slideIn 0.2s ease-out;
}

@keyframes slideIn {
  from { opacity: 0; transform: translateY(-10px); }
  to { opacity: 1; transform: translateY(0); }
}

.calendar-day {
  width: 44px;
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.15s;
}

.calendar-day:hover:not(.start-end) {
  background: rgba(128, 0, 32, 0.05);
  color: var(--bordo);
}

.calendar-day.start-end {
  background: var(--bordo);
  color: white !important;
}

.calendar-day.in-range {
  background: rgba(128, 0, 32, 0.05);
}

/* Results & Stepper */
.ai-summary {
  font-style: italic;
  font-size: 12px;
  color: var(--bordo);
  opacity: 0.8;
  margin-top: 4px;
  padding-left: 12px;
  border-left: 2px solid var(--bordo);
}

.mini-stepper {
  display: flex;
  gap: 12px;
}

.mini-step {
  flex: 1;
  height: 6px;
  border-radius: 3px;
  background: var(--border-color);
  position: relative;
  overflow: hidden;
}

.mini-step.active::after {
  content: '';
  position: absolute;
  top: 0; left: 0; bottom: 0; right: 0;
  background: var(--bordo);
  animation: fillProgress 0.3s ease-out forwards;
}

@keyframes fillProgress {
  from { transform: translateX(-100%); }
  to { transform: translateX(0); }
}
```

## 2. React UI Module (`SearchModule.tsx`)
This is the complete UI component with interactive calendar, room selection, and "Dynamic Packaging" flow.

```tsx
import React, { useState, useEffect } from 'react';
import { 
  Building2, Plane, ShoppingBag, Navigation, Map, Anchor, Compass, Zap, Car, 
  MapPin, CalendarDays, Users, Bus, Clock, CheckCircle2, ChevronLeft, ChevronRight,
  ArrowRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// --- Types ---
export interface Selection { 
  id: string; 
  type: string; 
  name: string; 
  price: number; 
  icon: React.ReactNode; 
  aiSummary?: string; 
}

// --- Mock Data ---
const MOCK_RESULTS = [
  { id: 'h-1', type: 'Accommodation', name: 'Rixos Premium Magawish', price: 145, aiSummary: 'Idealan za porodice, vrhunski Aqua Park.', icon: <Building2 color="#800020" size={20} /> },
  { id: 'h-2', type: 'Accommodation', name: 'Steigenberger ALDAU Beach', price: 125, aiSummary: 'Vrhunski spa centar i privatna plaža.', icon: <Building2 color="#800020" size={20} /> },
  { id: 'f-1', type: 'Flight', name: 'Air Cairo SM381', price: 320, aiSummary: 'Direktan čarter let, 3.5h trajanje.', icon: <Plane color="#800020" size={20} /> },
  { id: 't-1', type: 'Transfer', name: 'Private VIP Mercedes', price: 45, aiSummary: 'Brz i diskretan prevoz do hotela.', icon: <Car color="#800020" size={20} /> }
];

export const SearchModule: React.FC = () => {
  const [activeTab, setActiveTab] = useState('Packages');
  const [packageStep, setPackageStep] = useState(0); 
  const [showCalendar, setShowCalendar] = useState(false);
  const [showRooms, setShowRooms] = useState(false);
  
  // Selection State
  const [selectedItems, setSelectedItems] = useState<Selection[]>([]);
  
  const tabs = [
    { id: 'Stays', label: 'Smeštaj', icon: <Building2 size={20} />, fields: ['destination', 'dates', 'rooms'] },
    { id: 'Flights', label: 'Letovi', icon: <Plane size={20} />, fields: ['from', 'to', 'dates', 'passengers'] },
    { id: 'Packages', label: 'Dinamika', icon: <ShoppingBag size={20} />, fields: ['from', 'to', 'dates', 'rooms'] },
    { id: 'Cars', label: 'Rent-a-car', icon: <Car size={20} />, fields: ['pickup', 'dates'] }
  ];

  const currentTab = tabs.find(t => t.id === activeTab)!;

  const handleSelect = (item: any) => {
    setSelectedItems([...selectedItems, item]);
    setPackageStep(prev => prev + 1);
  };

  return (
    <div className="search-container" style={{ maxWidth: '1200px', margin: '0 auto', padding: '40px 20px' }}>
      {/* 1. Header Tabs */}
      <div className="search-type-tab" style={{ justifyContent: 'center', marginBottom: '32px' }}>
        {tabs.map(tab => (
          <div key={tab.id} className={`type-tab-item ${activeTab === tab.id ? 'active' : ''}`} onClick={() => setActiveTab(tab.id)}>
            <div style={{ marginBottom: '4px' }}>{tab.icon}</div>
            <span>{tab.label}</span>
          </div>
        ))}
      </div>

      {/* 2. Main Search Bar */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: `repeat(${currentTab.fields.length}, 1fr) 180px`, 
        gap: '8px', 
        alignItems: 'center',
        background: 'rgba(255,255,255,0.8)',
        padding: '12px',
        borderRadius: '20px',
        boxShadow: '0 8px 30px rgba(0,0,0,0.06)'
      }}>
        {currentTab.fields.map((field, i) => (
          <div key={i} className="search-input-field" onClick={() => {
            if (field === 'dates') setShowCalendar(!showCalendar);
            if (field === 'rooms') setShowRooms(!showRooms);
          }}>
            <label style={{ textTransform: 'uppercase', fontSize: '10px', letterSpacing: '1px' }}>{field}</label>
            <div style={{ position: 'absolute', left: '16px', color: 'var(--bordo)', opacity: 0.6 }}>
               {field === 'dates' ? <CalendarDays size={18} /> : field === 'rooms' ? <Users size={18} /> : <MapPin size={18} />}
            </div>
            <input 
              readOnly={field === 'dates' || field === 'rooms'} 
              placeholder={field === 'destination' ? 'Hurgada, Egipat' : '...'} 
              defaultValue={field === 'dates' ? '25 Mar - 01 Apr' : field === 'rooms' ? '1 Room, 2 Adults' : ''}
              style={{ paddingLeft: '48px', fontWeight: '800' }}
            />
          </div>
        ))}
        <button className="btn-primary" style={{ height: '64px', borderRadius: '16px' }}>PRETRAŽI</button>
      </div>

      {/* 3. Dynamic Results Area */}
      <div style={{ marginTop: '48px' }}>
         <div className="mini-stepper" style={{ marginBottom: '32px' }}>
            {['Smeštaj', 'Prevoz', 'Transfer', 'Kraj'].map((label, idx) => (
               <div key={label} style={{ flex: 1 }}>
                  <div className={`mini-step ${packageStep >= idx ? 'active' : ''}`} />
                  <div style={{ fontSize: '11px', fontWeight: '700', marginTop: '8px', opacity: packageStep >= idx ? 1 : 0.4, color: packageStep >= idx ? 'var(--bordo)' : 'inherit' }}>{label}</div>
               </div>
            ))}
         </div>

         <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <AnimatePresence mode="wait">
               {packageStep < 3 ? (
                  <motion.div 
                    key={packageStep}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                    style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}
                  >
                     {MOCK_RESULTS.filter(r => {
                        if (packageStep === 0) return r.type === 'Accommodation';
                        if (packageStep === 1) return r.type === 'Flight';
                        if (packageStep === 2) return r.type === 'Transfer';
                        return true;
                     }).map(res => (
                        <div key={res.id} className="glass-card" style={{ padding: '20px 32px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                           <div style={{ display: 'flex', gap: '24px', alignItems: 'center' }}>
                              <div style={{ width: '56px', height: '56px', borderRadius: '14px', background: 'rgba(128,0,32,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{res.icon}</div>
                              <div>
                                 <h4 style={{ margin: 0, fontSize: '16px', fontWeight: '800' }}>{res.name}</h4>
                                 <div className="ai-summary">{res.aiSummary}</div>
                              </div>
                           </div>
                           <div style={{ display: 'flex', alignItems: 'center', gap: '40px' }}>
                              <div style={{ textAlign: 'right' }}>
                                 <div style={{ fontSize: '11px', fontWeight: '700', color: 'var(--emerald)', textTransform: 'uppercase' }}>Cena po osobi</div>
                                 <div style={{ fontSize: '24px', fontWeight: '900' }}>€{res.price}</div>
                              </div>
                              <button className="btn-primary" onClick={() => handleSelect(res)}>IZABERI <ArrowRight size={16} /></button>
                           </div>
                        </div>
                     ))}
                  </motion.div>
               ) : (
                  <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} style={{ textAlign: 'center', padding: '80px 0' }}>
                     <div style={{ display: 'inline-flex', width: '80px', height: '80px', background: 'rgba(16, 185, 129, 0.1)', borderRadius: '50%', alignItems: 'center', justifyContent: 'center', marginBottom: '24px' }}>
                        <CheckCircle2 size={48} color="#10B981" />
                     </div>
                     <h2 style={{ fontSize: '28px', fontWeight: '900', color: 'var(--text-main)' }}>Sjajan izbor!</h2>
                     <p style={{ opacity: 0.6, maxWidth: '400px', margin: '16px auto' }}>Vaš personalizovani paket je spreman za rezervaciju. Primenili smo 10% Bundle popusta!</p>
                     <button className="btn-primary" style={{ padding: '16px 48px', fontSize: '14px' }}>NASTAVI NA PLAĆANJE</button>
                  </motion.div>
               )}
            </AnimatePresence>
         </div>
      </div>
    </div>
  );
};
```

## 3. Core Engine & Intelligence (`SearchEngine.ts`)
This class handles natural language parsing, package validation, and bundle pricing.

```typescript
/**
 * NeoTravel Intelligence Engine
 * Handles AI Query Parsing, Bundle Logic and Dynamic Pricing
 */

export interface SearchCriteria {
  destinationCode: string;
  startDate: Date;
  endDate: Date;
  passengers: number;
  aiPrompt?: string;
}

export class SearchEngine {
  /**
   * AI Parser: Converts natural language text to structured criteria.
   * Example: "Family trip to Egypt in July for 4 people"
   */
  public static parseNaturalQuery(query: string): SearchCriteria {
    const q = query.toLowerCase();
    
    // Simple heuristic-based parsing (can be replaced by LLM call)
    let destination = 'UNKNOWN';
    if (q.includes('egipat') || q.includes('hurgada')) destination = 'EG';
    if (q.includes('turska') || q.includes('antalija')) destination = 'TR';

    return {
      destinationCode: destination,
      startDate: new Date(2026, 6, 1),
      endDate: new Date(2026, 6, 8),
      passengers: q.includes('family') ? 4 : 2,
      aiPrompt: query
    };
  }

  /**
   * Bundle Pricing: Applies discounts based on item combination.
   * Rules:
   * - Hotel + Flight + Transfer = 10% Discount
   * - Hotel + Flight = 5% Discount
   */
  public static calculateBundlePrices(items: { type: string, price: number }[]): number {
    const basePrice = items.reduce((sum, item) => sum + item.price, 0);
    const types = items.map(i => i.type.toUpperCase());

    let discount = 0;
    const hasHotel = types.includes('HOTEL') || types.includes('ACCOMMODATION');
    const hasFlight = types.includes('FLIGHT');
    const hasTransfer = types.includes('TRANSFER');

    if (hasHotel && hasFlight && hasTransfer) {
      discount = 0.10; // 10% Zlatni Standard
    } else if (hasHotel && hasFlight) {
      discount = 0.05; // 5% Basic Bundle
    }

    return basePrice * (1 - discount);
  }

  /**
   * Package Validation: Ensures the bundle is logical.
   */
  public static validatePackage(items: { type: string }[]): string[] {
    const warnings: string[] = [];
    const types = items.map(i => i.type.toUpperCase());

    const hasHotel = types.includes('HOTEL') || types.includes('ACCOMMODATION');
    const hasFlight = types.includes('FLIGHT');
    const hasTransfer = types.includes('TRANSFER');

    if (hasHotel && hasFlight && !hasTransfer) {
      warnings.push("Preporuka: Dodajte privatni aerodromski transfer za maksimalan komfor.");
    }

    return warnings;
  }
}
```

## Setup Instructions

1. **Install Dependencies**:
   ```bash
   npm install lucide-react framer-motion
   ```
2. **Setup Component**: Import `SearchModule` and place it in your main view. Ensure the CSS is loaded globally or via CSS Modules.
3. **Connect the Engine**: Use `SearchEngine.calculateBundlePrices()` in your selection handler to update the total price in real-time.
