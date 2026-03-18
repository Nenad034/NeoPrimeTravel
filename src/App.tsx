import React, { useState, useEffect, useRef } from 'react';
import { BrowserRouter, Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { HotelDetailPage } from './modules/search/HotelDetailPage';
import { 
  Building2, Plane, ShoppingBag, Navigation, Map, Anchor, Compass, Zap, Car, Plug, 
  MapPin, CalendarDays, Users, Bus, Clock, ChevronLeft, ChevronRight,
  TrendingUp, Star, CheckCircle2, Search, Bell, Menu, X, Globe, User, ShieldCheck, Heart, 
  DollarSign, ArrowRight, Home, CreditCard, PieChart, FileText, Settings, HelpCircle, LogOut,
  Dna, Sparkles, Filter, ChevronDown, Check, Info, MoreHorizontal, Download, Share2, Plus, 
  RefreshCcw, Layers, Zap as AIZap, Briefcase, Camera, Coffee, Utensils,
  MoreVertical, Layout, Euro, CheckCircle, Sun, Moon, History, MessageSquare, Activity,
  Calendar as CalendarIcon, Search as SearchIcon, Phone, Mail, TrendingDown, ChevronUp
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Footer from './components/Footer';
import { GeometricBrain } from './components/icons/GeometricBrain';
import { DynamicPackagingEngine } from './modules/booking/DynamicPackagingEngine';
import { BundleRuleService } from './modules/booking/BundleRuleService';
import { OperationalReportsView } from './modules/production/OperationalReportsView';
import { BundleRuleMasterView } from './modules/booking/BundleRuleMasterView';
import { useTravelgateX } from './api/v1/useTravelgateX';
import { logSearchRequest } from './api/v1/supabaseClient';
import { HotelAmenities } from './components/HotelAmenities';
import { PropertyService } from './modules/booking/PropertyService';
import { PartnerHubView } from './modules/integrations/PartnerHubView';
import { useSolvex } from './api/v1/useSolvex';
import { SearchModule } from './modules/search/SearchModule';

// --- Types & Mock Data ---
interface Selection { id: string; type: string; name: string; price: number; icon: React.ReactNode; }

const MOCK_SEARCH_RESULTS = [
  { id: 'h-1', type: 'Accommodation', name: 'Rixos Premium Magawish', location: 'Hurghada, Egypt', price: 145, rating: 5, tags: ['UAI', 'Luxury'], aiSummary: 'Idealno za porodice.', prediction: 'Only 3 left', icon: <Building2 className="text-bordo" size={24} /> },
  { id: 'h-2', type: 'Accommodation', name: 'Steigenberger ALDAU Beach', location: 'Hurghada, Egypt', price: 125, rating: 5, tags: ['AI', 'Beachfront'], aiSummary: 'Vrhunski spa centar.', prediction: 'High demand', icon: <Building2 className="text-bordo" size={24} /> }
];

const MOCK_DOSSIERS = [
  { id: 'D-842', client: 'Petar Petrović', destination: 'Egipat, Hurgada', dates: '12.06 - 22.06.2026', total: '€2,450', status: 'Plaćeno', statusColor: '#10B981', agent: 'Nevena' },
  { id: 'D-843', client: 'Jelena Jović', destination: 'Turska, Antalija', dates: '05.07 - 15.07.2026', total: '€3,120', status: 'Pending', statusColor: '#F59E0B', agent: 'Marko' }
];

const MOCK_ROOMING = [
  { hotel: 'Rixos Premium Magawish', room: 'Superior Suite #204', guest: 'Petar Petrović', checkIn: '12.06', checkOut: '22.06', occupancy: '90%' }
];

const App = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [menuPosition, setMenuPosition] = useState<'vertical' | 'horizontal'>('vertical');
  const [selectedServices, setSelectedServices] = useState<Selection[]>([]);
  const [searchResults, setSearchResults] = useState(MOCK_SEARCH_RESULTS);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', isDarkMode ? 'dark' : 'light');
    BundleRuleService.seedInitialRules();
  }, [isDarkMode]);

  const handleSearch = async () => {
    setLoading(true);
    try {
      const dbProperties = await PropertyService.fetchAllProperties();
      setSearchResults(dbProperties.map(p => ({
        id: p.id, type: 'Accommodation', name: p.name, location: p.location, price: 100, stars: p.star_rating,
        main_image_url: p.main_image_url, image_urls: p.image_urls, icon: <Building2 size={24} />, amenity_ids: p.amenity_ids || []
      })));
    } catch (e) { console.warn(e); }
    setLoading(false);
  };

  const handleServiceSelect = (service: any) => {
    const newS: Selection = { id: service.id, type: service.type, name: service.name, price: service.price, icon: service.icon };
    setSelectedServices(prev => [...prev.filter(s => s.type !== newS.type), newS]);
  };

  const totalPrice = DynamicPackagingEngine.calculateBundlePrice(selectedServices);

  const NavItem = ({ icon, label, active, onClick }: any) => (
    <div 
      onClick={onClick} 
      className={`nav-item ${active ? 'active' : ''}`} 
      style={{ 
        cursor: 'pointer', 
        display: 'flex', 
        alignItems: 'center', 
        gap: '14px', 
        padding: '14px 24px', 
        borderRadius: '16px',
        transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)'
      }}
    >
      {icon}
      <span style={{ fontSize: '14px', fontWeight: '800', letterSpacing: '0.3px' }}>{label}</span>
    </div>
  );

  const NavigationItems = () => (
    <>
      <NavItem icon={<TrendingUp size={20}/>} label="Dashboard" active={activeTab === 'dashboard'} onClick={() => setActiveTab('dashboard')} />
      <NavItem icon={<SearchIcon size={20}/>} label="Pretraga" active={activeTab === 'search'} onClick={() => setActiveTab('search')} />
      <NavItem icon={<FileText size={20}/>} label="Dosijei" active={activeTab === 'dossiers'} onClick={() => setActiveTab('dossiers')} />
      <NavItem icon={<CalendarIcon size={20}/>} label="Kalendar" active={activeTab === 'calendar'} onClick={() => setActiveTab('calendar')} />
      <NavItem icon={<Users size={20}/>} label="Rooming" active={activeTab === 'rooming'} onClick={() => setActiveTab('rooming')} />
      <NavItem icon={<Activity size={20}/>} label="Moduli" active={activeTab === 'modules'} onClick={() => setActiveTab('modules')} />
      <NavItem icon={<Plug size={20}/>} label="Partneri" active={activeTab === 'partners'} onClick={() => setActiveTab('partners')} />
      <NavItem icon={<Settings size={20}/>} label="Podešavanja" active={activeTab === 'settings'} onClick={() => setActiveTab('settings')} />
    </>
  );

  const AppLayout = ({ children }: { children: React.ReactNode }) => {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', width: '100vw', background: 'var(--bg-app)', overflow: 'hidden' }}>
        {/* Header / Top Nav */}
        <header style={{ height: '80px', background: 'var(--sidebar-bg)', borderBottom: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 40px', zIndex: 1100 }}>
           <div style={{ display: 'flex', alignItems: 'center', gap: '32px' }}>
              {menuPosition === 'horizontal' && (
                <div style={{ fontSize: '20px', fontWeight: '900', letterSpacing: '1px' }}>
                  NEO<span style={{ color: 'var(--bordo)' }}>TRAVEL</span>
                </div>
              )}
              <div style={{ position: 'relative' }}>
                 <Search size={18} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', opacity: 0.4 }} />
                 <input type="text" placeholder="Pretraži sisteme..." style={{ padding: '12px 16px 12px 48px', borderRadius: '12px', border: '1px solid var(--border-color)', background: 'var(--bg-app)', fontSize: '13px', width: '320px', outline: 'none' }} />
              </div>
              {menuPosition === 'horizontal' && (
                 <div style={{ display: 'flex', gap: '8px' }}>
                    <NavigationItems />
                 </div>
              )}
           </div>

           <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <button 
                className="glass-card" 
                onClick={() => setMenuPosition(menuPosition === 'vertical' ? 'horizontal' : 'vertical')}
                style={{ width: '40px', height: '40px', border: 'none' }}
                title="Promeni položaj menija"
              >
                 <Layout size={20} />
              </button>
              <button 
                className="glass-card" 
                onClick={() => setIsDarkMode(!isDarkMode)}
                style={{ width: '40px', height: '40px', border: 'none' }}
              >
                 {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
              </button>
              <div style={{ width: '1px', height: '24px', background: 'var(--border-color)', margin: '0 8px' }} />
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }}>
                 <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '13px', fontWeight: '800' }}>Nevena L.</div>
                    <div style={{ fontSize: '10px', opacity: 0.5, fontWeight: '700' }}>ADMIN</div>
                 </div>
                 <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: 'var(--bordo)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
                    <User size={20} />
                 </div>
              </div>
           </div>
        </header>

        <div style={{ flex: 1, display: 'flex', flexDirection: 'row', overflow: 'hidden' }}>
          {/* Vertical Sidebar */}
          {menuPosition === 'vertical' && (
            <div style={{ padding: '20px 0 20px 40px', display: 'flex' }}>
               <div className="floating-sidebar" style={{ width: '280px', height: '100%', padding: '32px 16px' }}>
                  <div style={{ fontSize: '24px', fontWeight: '900', marginBottom: '60px', letterSpacing: '2px', textAlign: 'center', color: 'var(--text-main)' }}>
                    NEO<span style={{ color: 'var(--bordo)' }}>TRAVEL</span>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', flex: 1, padding: '0 8px' }}>
                     <NavigationItems />
                  </div>
                  <div style={{ marginTop: 'auto', padding: '0 8px' }}>
                     <NavItem icon={<LogOut size={20}/>} label="Odjava" onClick={() => console.log('logout')} />
                  </div>
               </div>
            </div>
          )}

          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>
            <main style={{ padding: '40px', flex: 1, overflowY: 'auto' }}>
              <AnimatePresence mode="wait">
                <motion.div key={activeTab} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.2 }}>
                  {children}
                </motion.div>
              </AnimatePresence>
            </main>
          </div>

          {/* Basket Sidebar */}
          {(activeTab === 'search' || activeTab === 'dashboard') && (
            <div style={{ padding: '20px 40px 20px 0', display: 'flex' }}>
               <div className="floating-sidebar" style={{ width: '380px', height: '100%', padding: '32px 24px' }}>
                  <h4 style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '32px', fontSize: '13px', fontWeight: '900', letterSpacing: '1px' }}>
                    <ShoppingBag size={18} color="var(--bordo)" /> REZERVACIJA
                  </h4>
                  <div style={{ flex: 1, overflowY: 'auto' }}>
                     {selectedServices.length === 0 ? (
                        <div style={{ textAlign: 'center', padding: '40px 0', opacity: 0.3 }}>
                           <ShoppingBag size={48} style={{ margin: '0 auto 16px' }} />
                           <div style={{ fontSize: '14px', fontWeight: '700' }}>Korpa je prazna</div>
                        </div>
                     ) : (
                        selectedServices.map(s => (
                           <div key={s.id} className="basket-item">
                              <div className="basket-icon-circle">{s.icon}</div>
                              <div style={{ flex: 1 }}>
                                 <div style={{ fontSize: '13px', fontWeight: '800' }}>{s.name}</div>
                                 <div style={{ fontSize: '11px', opacity: 0.5 }}>{s.type}</div>
                              </div>
                              <div className="basket-price">€{s.price}</div>
                           </div>
                        ))
                     )}
                  </div>
                  {selectedServices.length > 0 && (
                    <div className="total-summary-box">
                       <div style={{ fontSize: '10px', fontWeight: '900', opacity: 0.8, marginBottom: '4px' }}>UKUPNA CENA ARANŽMANA</div>
                       <div style={{ fontSize: '32px', fontWeight: '900' }}>€{totalPrice}</div>
                       <button className="btn-primary" style={{ background: 'white', color: 'var(--bordo)', width: '100%', marginTop: '20px' }}>NASTAVI NA PLAĆANJE</button>
                    </div>
                  )}
               </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  const DashboardView = () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: '28px', fontWeight: '900', marginBottom: '4px' }}>Zdravo, Nevena 👋</h1>
          <p style={{ opacity: 0.6, fontSize: '14px' }}>Spremni za nove rezervacije danas?</p>
        </div>
        <div className="glass-card" style={{ padding: '12px 24px', display: 'flex', alignItems: 'center', gap: '12px', border: '1px solid var(--bordo)' }}>
           <GeometricBrain size={24} color="var(--bordo)" />
           <div>
              <div style={{ fontSize: '10px', fontWeight: '900', opacity: 0.5 }}>AG NEURAL STATUS</div>
              <div style={{ fontSize: '12px', fontWeight: '800', color: 'var(--bordo)' }}>OPTIMIZACIJA U TOKU</div>
           </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '24px' }}>
        {[
          { label: 'Promet Mesec', value: '€184,250', trend: '+18.5%', color: '#10B981', icon: <DollarSign size={20} /> },
          { label: 'Novi Dosijei', value: '1,248', trend: '+14%', color: '#3B82F6', icon: <FileText size={20} /> },
          { label: 'Konverzija', value: '24.2%', trend: '+2.1%', color: '#F59E0B', icon: <Activity size={20} /> },
          { label: 'Zadovoljstvo', value: '4.8/5', trend: 'Optimum', color: '#EC4899', icon: <Star size={20} /> }
        ].map(stat => (
          <div key={stat.label} className="glass-card" style={{ padding: '24px', position: 'relative' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
               <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: `${stat.color}11`, color: stat.color, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{stat.icon}</div>
               <div style={{ fontSize: '12px', fontWeight: '800', color: stat.color }}>{stat.trend}</div>
            </div>
            <div style={{ fontSize: '11px', fontWeight: '900', opacity: 0.5, marginBottom: '4px' }}>{stat.label.toUpperCase()}</div>
            <div style={{ fontSize: '28px', fontWeight: '900' }}>{stat.value}</div>
          </div>
        ))}
      </div>

      <div className="glass-card" style={{ padding: '32px', background: 'rgba(128,0,32,0.02)', border: '1px solid rgba(128,0,32,0.1)' }}>
         <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
            <Zap size={22} color="var(--bordo)" />
            <h3 style={{ fontSize: '18px', fontWeight: '900' }}>AI PRICING INTELLIGENCE</h3>
         </div>
         <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
            <div style={{ background: 'white', padding: '24px', borderRadius: '16px', boxShadow: '0 4px 12px rgba(0,0,0,0.03)' }}>
               <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                  <div style={{ fontSize: '11px', fontWeight: '900', color: 'var(--bordo)' }}>HURGHADA MARKET ALERT</div>
                  <TrendingUp size={16} color="var(--emerald)" />
               </div>
               <p style={{ fontSize: '14px', fontWeight: '600', lineHeight: 1.6 }}>Zabeležen rast potražnje od 40% za polaske u julu. Preporuka: uvećati budget za Baron Palace kampanju.</p>
            </div>
            <div style={{ background: 'white', padding: '24px', borderRadius: '16px', boxShadow: '0 4px 12px rgba(0,0,0,0.03)' }}>
               <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                  <div style={{ fontSize: '11px', fontWeight: '900', color: 'var(--bordo)' }}>OPTIMIZACIJA PAKETA</div>
                  <AIZap size={16} color="var(--amber)" />
               </div>
               <p style={{ fontSize: '14px', fontWeight: '600', lineHeight: 1.6 }}>Klijenti često biraju Hotel + Activity bez Transfera. Predlog: Bundle sa gratis transferom za 5+ noćenja.</p>
            </div>
         </div>
      </div>
    </div>
  );

  const SettingsView = () => (
    <div style={{ maxWidth: '800px' }}>
       <h2 style={{ fontSize: '28px', fontWeight: '900', marginBottom: '32px' }}>Podešavanja Sistema</h2>
       <div className="glass-card" style={{ padding: '32px', display: 'flex', flexDirection: 'column', gap: '32px' }}>
          <div>
             <h4 style={{ fontSize: '16px', fontWeight: '800', marginBottom: '16px' }}>Izgled Interfejsa</h4>
             <div style={{ display: 'flex', gap: '16px' }}>
                <div 
                   onClick={() => setMenuPosition('vertical')}
                   className={`glass-card ${menuPosition === 'vertical' ? 'active' : ''}`}
                   style={{ flex: 1, padding: '20px', cursor: 'pointer', border: menuPosition === 'vertical' ? '2px solid var(--bordo)' : '1px solid var(--border-color)' }}
                >
                   <Layout size={24} style={{ marginBottom: '12px' }} />
                   <div style={{ fontWeight: '800', fontSize: '13px' }}>Vertikalni Meni</div>
                   <div style={{ fontSize: '11px', opacity: 0.5 }}>Standardni bočni panel</div>
                </div>
                <div 
                   onClick={() => setMenuPosition('horizontal')}
                   className={`glass-card ${menuPosition === 'horizontal' ? 'active' : ''}`}
                   style={{ flex: 1, padding: '20px', cursor: 'pointer', border: menuPosition === 'horizontal' ? '2px solid var(--bordo)' : '1px solid var(--border-color)' }}
                >
                   <MoreHorizontal size={24} style={{ marginBottom: '12px' }} />
                   <div style={{ fontWeight: '800', fontSize: '13px' }}>Horizontalni Meni</div>
                   <div style={{ fontSize: '11px', opacity: 0.5 }}>Gornja navigaciona traka</div>
                </div>
             </div>
          </div>

          <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '32px' }}>
             <h4 style={{ fontSize: '16px', fontWeight: '800', marginBottom: '16px' }}>Tema i Personalizacija</h4>
             <button 
                onClick={() => setIsDarkMode(!isDarkMode)}
                className="btn-primary" 
                style={{ background: 'var(--bg-app)', color: 'var(--text-main)', border: '1px solid var(--border-color)' }}
             >
                Prebaci na {isDarkMode ? 'Svetli' : 'Tamni'} režim
             </button>
          </div>
       </div>
    </div>
  );

  return (
    <Routes>
      <Route path="/" element={
        <AppLayout>
          {activeTab === 'dashboard' && <DashboardView />}
          {activeTab === 'search' && <SearchModule results={searchResults} onSearch={handleSearch} onServiceSelect={handleServiceSelect} />}
          {activeTab === 'dossiers' && <DossiersView />}
          {activeTab === 'rooming' && <RoomingView />}
          {activeTab === 'calendar' && <CalendarView />}
          {activeTab === 'modules' && <ModulesView />}
          {activeTab === 'partners' && <PartnerHubView />}
          {activeTab === 'settings' && <SettingsView />}
        </AppLayout>
      } />
      <Route path="/hotel/:id" element={<HotelDetailPage />} />
    </Routes>
  );
};

// Re-defining components outside main App to keep cleaner
const DossiersView = () => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
     <h2 style={{ fontSize: '24px', fontWeight: '900' }}>Centralni Dosijei</h2>
     <div className="glass-card" style={{ overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
           <thead style={{ background: 'rgba(0,0,0,0.02)' }}>
              <tr>{['ID', 'Klijent', 'Destinacija', 'Status'].map(h => <th key={h} style={{ textAlign: 'left', padding: '16px 24px', fontSize: '11px', fontWeight: '900', opacity: 0.5 }}>{h}</th>)}</tr>
           </thead>
           <tbody>
              {MOCK_DOSSIERS.map((d, i) => (
                 <tr key={i} style={{ borderBottom: '1px solid rgba(0,0,0,0.05)' }}>
                    <td style={{ padding: '16px 24px', fontWeight: '900', color: 'var(--bordo)' }}>{d.id}</td>
                    <td style={{ padding: '16px 24px' }}>{d.client}</td>
                    <td style={{ padding: '16px 24px' }}>{d.destination}</td>
                    <td style={{ padding: '16px 24px' }}><span style={{ padding: '4px 12px', borderRadius: '30px', fontSize: '10px', fontWeight: '900', background: `${d.statusColor}22`, color: d.statusColor }}>{d.status}</span></td>
                 </tr>
              ))}
           </tbody>
        </table>
     </div>
  </div>
);

const RoomingView = () => (
   <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <h2 style={{ fontSize: '24px', fontWeight: '900' }}>Rooming Kontrola</h2>
      <div className="glass-card" style={{ padding: '32px', textAlign: 'center', opacity: 0.5 }}>
         Prikaz rooming liste u pripremi...
      </div>
   </div>
);

const CalendarView = () => (
   <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <h2 style={{ fontSize: '24px', fontWeight: '900' }}>Globalni Kalendar Operacija</h2>
      <div className="glass-card" style={{ padding: '32px', textAlign: 'center', opacity: 0.5 }}>
         Inicijalizacija kalendara...
      </div>
   </div>
);

const ModulesView = () => (
   <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <h2 style={{ fontSize: '24px', fontWeight: '900' }}>Sistemski Moduli</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '20px' }}>
         {['Booking Engine', 'Price Intelligence', 'Neural Core'].map(m => (
            <div key={m} className="glass-card" style={{ padding: '24px' }}>
               <div style={{ fontWeight: '800', marginBottom: '8px' }}>{m}</div>
               <div style={{ fontSize: '10px', color: '#10B981', fontWeight: '900' }}>AKTIVNO</div>
            </div>
         ))}
      </div>
   </div>
);

export default App;
