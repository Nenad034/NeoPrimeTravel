import React, { useState } from 'react';
import { 
  Building2, Plane, ShoppingBag, Navigation, Map, Anchor, Compass, Zap, Car, 
  MapPin, CalendarDays, Users, Bus, Clock, CheckCircle2 
} from 'lucide-react';
import { motion } from 'framer-motion';
import './SearchModule.css';

// --- Mock Data & Interface ---
export interface Selection { id: string; type: string; name: string; price: number; icon: React.ReactNode; aiSummary?: string; }

export const SEARCH_RESULTS = [
  { id: 'h-1', type: 'Accommodation', name: 'Rixos Premium Magawish', location: 'Hurghada, Egypt', price: 145, rating: 5, tags: ['UAI', 'Luxury'], aiSummary: 'Idealno za porodice.', prediction: 'Only 3 left', icon: <Building2 className="text-bordo" size={24} /> },
  { id: 'h-2', type: 'Accommodation', name: 'Steigenberger ALDAU Beach', location: 'Hurghada, Egypt', price: 125, rating: 5, tags: ['AI', 'Beachfront'], aiSummary: 'Vrhunski spa centar.', prediction: 'High demand', icon: <Building2 className="text-bordo" size={24} /> },
  { id: 'h-4', type: 'Accommodation', name: 'Baron Palace Sahl Hasheesh', location: 'Sahl Hasheesh, Egypt', price: 180, rating: 5, tags: ['UAI', 'Palace'], aiSummary: 'Ultimativni luksuz.', prediction: 'Member Deal', icon: <Building2 className="text-bordo" size={24} /> },
  { id: 'f-1', type: 'Flight', name: 'Air Cairo SM381', location: 'BEG -> HRG', price: 320, rating: 4.5, tags: ['Direct', '7KG Cabin'], aiSummary: 'Najbrži let direktno do Hurgade.', prediction: 'Good price', icon: <Plane className="text-bordo" size={24} /> },
  { id: 'f-2', type: 'Flight', name: 'Turkish Airlines TK1082', location: 'BEG -> IST -> HRG', price: 410, rating: 5, tags: ['1 Stop', '30KG Luggage'], aiSummary: 'Vrhunski komfor.', prediction: 'Premium', icon: <Plane className="text-bordo" size={24} /> },
  { id: 'a-1', type: 'Activity', name: 'Giftun Island Speedboat', location: 'Hurghada Port', price: 65, rating: 5, tags: ['Snorkeling', 'Lunch'], aiSummary: 'Must see!', prediction: 'Popular', icon: <Map className="text-bordo" size={24} /> }
];

interface SearchModuleProps {
  onServiceSelect?: (service: any) => void;
}

export const SearchModule: React.FC<SearchModuleProps> = ({ onServiceSelect }) => {
  const [searchFilter, setSearchFilter] = useState('Packages');
  const [packageStep, setPackageStep] = useState(0); 
  const [showCalendar, setShowCalendar] = useState(false);

  const tabs = [
    { id: 'Stays', label: 'Smeštaj', icon: <Building2 size={22} />, fields: ['city-hotel', 'dates', 'rooms'] },
    { id: 'Flights', label: 'Letovi', icon: <Plane size={22} />, fields: ['from', 'to', 'dates', 'passengers'] },
    { id: 'Packages', label: 'Dinamika', icon: <ShoppingBag size={22} />, fields: ['from', 'to', 'dates', 'rooms'] },
    { id: 'Transfers', label: 'Transferi', icon: <Navigation size={22} />, fields: ['from-to', 'dates', 'time'] },
    { id: 'Things', label: 'Izleti', icon: <Map size={22} />, fields: ['destination', 'dates'] },
    { id: 'Cruises', label: 'Krstarenja', icon: <Anchor size={22} />, fields: ['destination', 'dates', 'cruise-line'] },
    { id: 'Putovanja', label: 'Putovanja', icon: <Compass size={22} />, fields: ['destination', 'dates'] },
    { id: 'Charteri', label: 'Čarteri', icon: <Zap size={22} />, fields: ['from', 'to', 'dates'] },
    { id: 'Cars', label: 'Cars', icon: <Car size={22} />, fields: ['pickup', 'dates'] }
  ];

  const currentTab = tabs.find(t => t.id === searchFilter) || tabs[0];
  
  const handleServiceSelect = (service: any) => {
    setPackageStep(prev => Math.min(prev + 1, 4));
    if (onServiceSelect) onServiceSelect(service);
  };

  const renderFields = () => {
    return currentTab.fields.map((field, idx) => {
      if (field === 'city-hotel') return <div key={idx} className="search-input-field"><label>City or Hotel</label><MapPin size={18} style={{ position: 'absolute', left: '16px', opacity: 0.6 }} /><input type="text" placeholder="Hurgada, Egypt" style={{ height: '64px', border: 'none', background: 'transparent' }} /></div>;
      if (field === 'from') return <div key={idx} className="search-input-field"><label>Leaving from</label><MapPin size={18} style={{ position: 'absolute', left: '16px', opacity: 0.6 }} /><input type="text" defaultValue="Belgrade (BEG)" style={{ height: '64px', border: 'none', background: 'transparent' }} /></div>;
      if (field === 'to') return <div key={idx} className="search-input-field"><label>Going to</label><MapPin size={18} style={{ position: 'absolute', left: '16px', opacity: 0.6 }} /><input type="text" placeholder="Antalya, Turkey" style={{ height: '64px', border: 'none', background: 'transparent' }} /></div>;
      if (field === 'destination') return <div key={idx} className="search-input-field"><label>Destination</label><MapPin size={18} style={{ position: 'absolute', left: '16px', opacity: 0.6 }} /><input type="text" placeholder="Tuscany, Italy" style={{ height: '64px', border: 'none', background: 'transparent' }} /></div>;
      if (field === 'dates') return <div key={idx} className="search-input-field" onClick={() => setShowCalendar(true)}><label>Dates</label><CalendarDays size={18} style={{ position: 'absolute', left: '16px', opacity: 0.6 }} /><input type="text" readOnly value="18 Mar - 25 Mar" style={{ height: '64px', border: 'none', background: 'transparent' }} /></div>;
      if (field === 'rooms') return <div key={idx} className="search-input-field"><label>Rooms & Travellers</label><Users size={18} style={{ position: 'absolute', left: '16px', opacity: 0.6 }} /><input type="text" readOnly value="1 Room, 2 Adults" style={{ height: '64px', border: 'none', background: 'transparent' }} /></div>;
      if (field === 'passengers') return <div key={idx} className="search-input-field"><label>Travellers</label><Users size={18} style={{ position: 'absolute', left: '16px', opacity: 0.6 }} /><input type="text" readOnly value="2 Adults" style={{ height: '64px', border: 'none', background: 'transparent' }} /></div>;
      if (field === 'from-to') return <div key={idx} className="search-input-field"><label>From - To</label><Bus size={18} style={{ position: 'absolute', left: '16px', opacity: 0.6 }} /><input type="text" placeholder="Airport -> Hotel" style={{ height: '64px', border: 'none', background: 'transparent' }} /></div>;
      if (field === 'pickup') return <div key={idx} className="search-input-field"><label>Pick-up Location</label><MapPin size={18} style={{ position: 'absolute', left: '16px', opacity: 0.6 }} /><input type="text" placeholder="Milan Airport" style={{ height: '64px', border: 'none', background: 'transparent' }} /></div>;
      if (field === 'cruise-line') return <div key={idx} className="search-input-field"><label>Cruise Line</label><Anchor size={18} style={{ position: 'absolute', left: '16px', opacity: 0.6 }} /><input type="text" placeholder="MSC Cruises" style={{ height: '64px', border: 'none', background: 'transparent' }} /></div>;
      if (field === 'time') return <div key={idx} className="search-input-field"><label>Time</label><Clock size={18} style={{ position: 'absolute', left: '16px', opacity: 0.6 }} /><input type="text" placeholder="12:00" style={{ height: '64px', border: 'none', background: 'transparent' }} /></div>;
      return null;
    });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
      <div className="search-type-tab" style={{ justifyContent: 'center', border: 'none', paddingBottom: '0' }}>
         {tabs.map(tab => (
           <div key={tab.id} className={`type-tab-item ${searchFilter === tab.id ? 'active' : ''}`} onClick={() => setSearchFilter(tab.id)}>
              <div style={{ marginBottom: '4px' }}>{tab.icon}</div>
              <span>{tab.label}</span>
           </div>
         ))}
      </div>
      
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: `repeat(${currentTab.fields.length}, 1fr) 180px`, 
        gap: '8px', 
        alignItems: 'center', 
        background: 'rgba(255,255,255,0.8)', 
        padding: '8px', 
        borderRadius: '16px', 
        boxShadow: '0 4px 20px rgba(0,0,0,0.05)' 
      }}>
         {renderFields()}
         <button className="btn-primary" style={{ height: '64px', borderRadius: '12px', fontSize: '14px' }}>PRETRAGA</button>
      </div>

      {/* Results Area */}
      <div style={{ marginTop: '8px' }}>
         <div className="mini-stepper" style={{ marginBottom: '24px' }}>
            {['Izbor 1', 'Izbor 2', 'Izbor 3', 'Kraj'].map((label, idx) => (
               <div key={label} className={`mini-step ${packageStep >= idx ? 'active' : ''}`} />
            ))}
         </div>
         
         <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {packageStep < 4 ? (
               SEARCH_RESULTS.filter(r => {
                  if (searchFilter === 'Stays') return r.type === 'Accommodation';
                  if (searchFilter === 'Flights') return r.type === 'Flight';
                  if (searchFilter === 'Transfers') return r.type === 'Transfer';
                  if (searchFilter === 'Things') return r.type === 'Activity';
                  return true;
               }).map(res => (
                  <motion.div key={res.id} layout className="glass-card service-selection-card" style={{ padding: '12px 24px' }}>
                     <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
                        <div style={{ width: '48px', height: '48px', borderRadius: '10px', background: 'rgba(128,0,32,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{res.icon}</div>
                        <div style={{ flex: 1 }}>
                           <h4 style={{ fontSize: '15px', fontWeight: '800' }}>{res.name}</h4>
                           <div className="ai-summary" style={{ margin: '0', fontSize: '11px', border: 'none', padding: '0', opacity: 0.6 }}>{res.aiSummary}</div>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '32px' }}>
                           <div style={{ fontSize: '20px', fontWeight: '900' }}>€{res.price}</div>
                           <button className="btn-primary" onClick={() => handleServiceSelect(res)} style={{ padding: '8px 24px', fontSize: '11px' }}>IZABERI</button>
                        </div>
                     </div>
                  </motion.div>
               ))
            ) : (
               <div style={{ textAlign: 'center', padding: '60px 0' }}>
                  <CheckCircle2 size={48} color="#10B981" style={{ margin: '0 auto 16px' }} />
                  <h2 style={{ fontSize: '24px' }}>Rezervacija je spremna!</h2>
               </div>
            )}
         </div>
      </div>
    </div>
  );
};
