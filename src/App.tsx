import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Calendar, 
  FileText, 
  Search as SearchIcon, 
  CheckCircle2,
  TrendingUp,
  Sun,
  Moon,
  Building2,
  Plane,
  MapPin,
  Star,
  CalendarDays,
  ShoppingBag,
  Bus,
  Map,
  Layout,
  Menu,
  Navigation,
  Activity,
  DollarSign,
  Zap,
  Filter,
  Download,
  MoreVertical,
  CheckCircle,
  AlertCircle,
  PieChart,
  MessageSquare,
  Ship,
  Compass,
  Car,
  Euro,
  ArrowLeftRight,
  ChevronRight,
  Anchor,
  Clock
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Footer from './components/Footer';
import { GeometricBrain } from './components/icons/GeometricBrain';

// --- Types & Mock Data ---
interface Room { id: number; adults: number; childrenAges: number[]; }
interface SelectedService { id: string; type: 'Hotel' | 'Flight' | 'Transfer' | 'Activity'; name: string; price: number; icon: React.ReactNode; }

const SEARCH_RESULTS = [
  { id: 'h-1', type: 'Accommodation', name: 'Rixos Premium Magawish', location: 'Hurghada, Egypt', price: 145, rating: 5, tags: ['UAI', 'Luxury'], aiSummary: 'Idealno za porodice.', prediction: 'Only 3 left', icon: <Building2 className="text-bordo" size={24} /> },
  { id: 'f-1', type: 'Flight', name: 'Air Cairo SM381', location: 'BEG -> HRG', price: 320, rating: 4.5, tags: ['Direct', '7KG Cabin'], aiSummary: 'Najbrži let direktno do Hurgade.', prediction: 'Good price', icon: <Plane className="text-bordo" size={24} /> },
  { id: 't-1', type: 'Transfer', name: 'Private VIP Transfer', location: 'Airport -> Hotel', price: 45, rating: 5, tags: ['Mercedes V-Class'], aiSummary: 'Brzo i udobno.', prediction: 'Recommended', icon: <Bus className="text-bordo" size={24} /> },
  { id: 'a-1', type: 'Activity', name: 'Giftun Island Speedboat', location: 'Hurghada Port', price: 65, rating: 5, tags: ['Snorkeling', 'Lunch'], aiSummary: 'Must see!', prediction: 'Popular', icon: <Map className="text-bordo" size={24} /> }
];

const MOCK_DOSSIERS = [
  { id: 'D-842', client: 'Petar Petrović', destination: 'Egipat, Hurgada', dates: '12.06 - 22.06.2026', total: '€2,450', status: 'Plaćeno', statusColor: '#10B981' },
  { id: 'D-843', client: 'Jelena Jović', destination: 'Turska, Antalija', dates: '05.07 - 15.07.2026', total: '€3,120', status: 'Pending', statusColor: '#F59E0B' },
  { id: 'D-844', client: 'Marko Marković', destination: 'Grčka, Krit', dates: '18.08 - 28.08.2026', total: '€1,890', status: 'Plaćeno', statusColor: '#10B981' },
  { id: 'D-845', client: 'Ana Antić', destination: 'Egipat, Šarm el Šeik', dates: '10.09 - 20.09.2026', total: '€2,700', status: 'Otkazano', statusColor: '#EF4444' }
];

const App = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [menuPosition, setMenuPosition] = useState<'vertical' | 'horizontal'>('vertical');
  const [searchFilter, setSearchFilter] = useState('Packages');
  const [showCalendar, setShowCalendar] = useState(false);
  const [packageStep, setPackageStep] = useState(0); 
  const [selectedServices, setSelectedServices] = useState<SelectedService[]>([]);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', isDarkMode ? 'dark' : 'light');
  }, [isDarkMode]);

  const handleServiceSelect = (service: any) => {
    const newService: SelectedService = {
      id: service.id,
      type: service.type === 'Accommodation' ? 'Hotel' : service.type,
      name: service.name,
      price: service.price,
      icon: service.icon
    };
    const filtered = selectedServices.filter(s => s.type !== newService.type);
    setSelectedServices([...filtered, newService].sort((a,b) => {
        const order = { 'Hotel': 0, 'Flight': 1, 'Transfer': 2, 'Activity': 3 };
        return (order as any)[a.type] - (order as any)[b.type];
    }));
    setPackageStep(packageStep + 1);
  };

  const totalPrice = selectedServices.reduce((acc, s) => acc + s.price, 0);

  // --- View Components ---

  const DashboardView = () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: '28px', fontWeight: '900', marginBottom: '4px' }}>Zdravo, Nevena 👋</h1>
          <p style={{ opacity: 0.6, fontSize: '14px' }}>Dobrodošli u vaš sutrašnji travel ekosistem.</p>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <div className="glass-card" style={{ padding: '10px 20px', display: 'flex', alignItems: 'center', gap: '10px', border: '1px solid var(--bordo)' }}>
             <GeometricBrain size={20} color="var(--bordo)" />
             <div style={{ lineHeight: 1 }}>
                <div style={{ fontSize: '9px', fontWeight: '900', opacity: 0.5 }}>AG NEURAL AGENT</div>
                <div style={{ fontSize: '11px', fontWeight: '800', color: 'var(--bordo)' }}>SINKRONIZOVAN</div>
             </div>
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px' }}>
        {[
          { label: 'Ukupan Promet', value: '€42,850', trend: '+12%', icon: <DollarSign size={20} />, color: '#10B981' },
          { label: 'Aktivni Dossieri', value: '48', trend: '+3', icon: <FileText size={20} />, color: '#3B82F6' },
          { label: 'Nerealizovani Upiti', value: '12', trend: '-1', icon: <MessageSquare size={20} />, color: '#F59E0B' },
          { label: 'Kapacitet Flote', value: '82%', trend: 'Optimum', icon: <PieChart size={20} />, color: '#EC4899' }
        ].map(stat => (
          <motion.div key={stat.label} className="glass-card" style={{ padding: '20px', position: 'relative', overflow: 'hidden' }}>
            <div style={{ fontSize: '11px', fontWeight: '800', opacity: 0.5, marginBottom: '8px' }}>{stat.label.toUpperCase()}</div>
            <div style={{ fontSize: '24px', fontWeight: '900' }}>{stat.value}</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '12px' }}>
               <span style={{ fontSize: '10px', fontWeight: '900', color: stat.color }}>{stat.trend}</span>
               <div style={{ flex: 1, height: '2px', background: 'rgba(0,0,0,0.05)', borderRadius: '2px' }}>
                  <div style={{ width: '70%', height: '100%', background: stat.color, borderRadius: '2px' }} />
               </div>
            </div>
          </motion.div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.8fr 1.2fr', gap: '24px' }}>
        <div className="glass-card" style={{ padding: '24px' }}>
           <h3 style={{ fontSize: '16px', fontWeight: '900', marginBottom: '24px' }}>ANALITIKA PRODAJE</h3>
           <div style={{ height: '200px', display: 'flex', alignItems: 'flex-end', gap: '12px', paddingBottom: '20px' }}>
              {[60, 40, 80, 50, 90, 70, 100].map((h, i) => (
                <div key={i} style={{ flex: 1, position: 'relative' }}>
                   <motion.div initial={{ height: 0 }} animate={{ height: `${h}%` }} style={{ width: '100%', background: i === 6 ? 'var(--bordo)' : 'rgba(128,0,32,0.1)', borderRadius: '4px' }} />
                   <div style={{ position: 'absolute', bottom: '-20px', left: '0', right: '0', textAlign: 'center', fontSize: '9px', fontWeight: '800', opacity: 0.4 }}>DAN {i+1}</div>
                </div>
              ))}
           </div>
        </div>
        <div className="glass-card" style={{ padding: '24px', background: 'rgba(59,130,246,0.05)' }}>
           <h3 style={{ fontSize: '16px', fontWeight: '900', marginBottom: '16px' }}>NOTIFIKACIJE</h3>
           <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {[
                { icon: <AlertCircle size={14} color="#F59E0B" />, text: 'Dossier D-843 zahteva proveru uplate.', time: 'Pre 10m' },
                { icon: <CheckCircle size={14} color="#10B981" />, text: 'Rixos Premium potvrdio rezervaciju.', time: 'Pre 45m' },
                { icon: <Zap size={14} color="var(--bordo)" />, text: 'Nova preporuka AI agenta za Kipar.', time: 'Pre 2h' }
              ].map((n, i) => (
                <div key={i} style={{ display: 'flex', gap: '12px', padding: '12px', background: 'rgba(255,255,255,0.5)', borderRadius: '10px', fontSize: '12px' }}>
                   <div style={{ marginTop: '2px' }}>{n.icon}</div>
                   <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: '600' }}>{n.text}</div>
                      <div style={{ fontSize: '10px', opacity: 0.5, marginTop: '2px' }}>{n.time}</div>
                   </div>
                </div>
              ))}
           </div>
        </div>
      </div>
    </div>
  );

  const DossiersView = () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
       <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h2 style={{ fontSize: '24px', fontWeight: '900' }}>Dosijei Putovanja</h2>
            <p style={{ opacity: 0.6, fontSize: '13px' }}>Upravljajte aktivnim i arhiviranim rezervacijama.</p>
          </div>
          <button className="btn-primary">+ NOVI DOSIJE</button>
       </div>

       <div className="glass-card" style={{ padding: '16px 24px', display: 'flex', gap: '20px', alignItems: 'center' }}>
          <div style={{ flex: 1, position: 'relative' }}>
             <SearchIcon size={16} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', opacity: 0.4 }} />
             <input type="text" placeholder="Pretraži Dossier..." style={{ width: '100%', padding: '10px 16px 10px 44px', borderRadius: '30px', border: '1px solid rgba(0,0,0,0.08)', background: 'transparent', outline: 'none' }} />
          </div>
          <button className="glass-card" style={{ padding: '8px 16px', fontSize: '12px', fontWeight: '800' }}><Filter size={14} style={{ marginRight: '8px' }} /> FILTERI</button>
          <button className="glass-card" style={{ padding: '8px 16px', fontSize: '12px', fontWeight: '800' }}><Download size={14} style={{ marginRight: '8px' }} /> IZVOZ</button>
       </div>

       <div className="glass-card" style={{ overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
             <thead style={{ background: 'rgba(0,0,0,0.02)' }}>
                <tr>
                   {['Dozije ID', 'Klijent', 'Destinacija', 'Datum', 'Ukupno', 'Status', ''].map(h => (
                      <th key={h} style={{ textAlign: 'left', padding: '16px 24px', fontSize: '11px', fontWeight: '900', opacity: 0.5, textTransform: 'uppercase' }}>{h}</th>
                   ))}
                </tr>
             </thead>
             <tbody>
                {MOCK_DOSSIERS.map((d, i) => (
                   <tr key={i} style={{ borderBottom: i < MOCK_DOSSIERS.length - 1 ? '1px solid rgba(0,0,0,0.05)' : 'none' }}>
                      <td style={{ padding: '16px 24px', fontWeight: '900', fontSize: '13px', color: 'var(--bordo)' }}>{d.id}</td>
                      <td style={{ padding: '16px 24px', fontWeight: '700', fontSize: '13px' }}>{d.client}</td>
                      <td style={{ padding: '16px 24px', fontSize: '13px', opacity: 0.8 }}>{d.destination}</td>
                      <td style={{ padding: '16px 24px', fontSize: '12px', fontWeight: '600', opacity: 0.6 }}>{d.dates}</td>
                      <td style={{ padding: '16px 24px', fontWeight: '900', fontSize: '14px' }}>{d.total}</td>
                      <td style={{ padding: '16px 24px' }}>
                         <span style={{ padding: '4px 12px', borderRadius: '30px', fontSize: '10px', fontWeight: '900', background: `${d.statusColor}22`, color: d.statusColor }}>{d.status.toUpperCase()}</span>
                      </td>
                      <td style={{ padding: '16px 24px', textAlign: 'right' }}>
                         <button style={{ background: 'none', border: 'none', cursor: 'pointer', opacity: 0.4 }}><MoreVertical size={16} /></button>
                      </td>
                   </tr>
                ))}
             </tbody>
          </table>
       </div>
    </div>
  );

  const SearchView = () => {
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
    
    // Dynamic field rendering logic
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
          <div className="search-type-tab" style={{ justifyContent: 'center', border: 'none' }}>
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
             <button className="btn-primary" style={{ height: '56px', borderRadius: '12px', fontSize: '14px' }}>PRETRAGA</button>
          </div>

          {/* Results Area (simplified for demo) */}
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
                      return true; // Packages & Others show all
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

  const NavigationItems = () => (
    <>
      <NavItem icon={<TrendingUp size={20}/>} label="Dashboard" active={activeTab === 'dashboard'} onClick={() => setActiveTab('dashboard')} horizontal={menuPosition === 'horizontal'} />
      <NavItem icon={<SearchIcon size={20}/>} label="Pretraga" active={activeTab === 'search'} onClick={() => setActiveTab('search')} horizontal={menuPosition === 'horizontal'} />
      <NavItem icon={<FileText size={20}/>} label="Dosijei" active={activeTab === 'dossiers'} onClick={() => setActiveTab('dossiers')} horizontal={menuPosition === 'horizontal'} />
      <NavItem icon={<Calendar size={20}/>} label="Kalendar" active={activeTab === 'calendar'} onClick={() => setActiveTab('calendar')} horizontal={menuPosition === 'horizontal'} />
      <NavItem icon={<Users size={20}/>} label="Rooming" active={activeTab === 'rooming'} onClick={() => setActiveTab('rooming')} horizontal={menuPosition === 'horizontal'} />
    </>
  );

  return (
    <div style={{ display: 'flex', flexDirection: menuPosition === 'horizontal' ? 'column' : 'row', height: '100vh', width: '100vw', background: 'var(--bg-app)', overflow: 'hidden' }}>
      
      {/* LEFT SIDEBAR (VERTICAL) */}
      {menuPosition === 'vertical' && (
        <div style={{ padding: '20px 0 20px 40px', display: 'flex' }}>
           <div className="floating-sidebar" style={{ width: '280px', height: '100%', padding: '32px 16px' }}>
              <div style={{ fontSize: '24px', fontWeight: '900', marginBottom: '60px', letterSpacing: '2px', textAlign: 'center', color: 'var(--text-main)', display: 'flex', justifyContent: 'center' }}>
                NEO<span style={{ color: 'var(--bordo)' }}>TRAVEL</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', flex: 1, padding: '0 8px' }}>
                <NavigationItems />
              </div>
              <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: '8px', padding: '0 8px' }}>
                <button onClick={() => setMenuPosition('horizontal')} className="glass-card" style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '10px 16px', width: '100%', border: 'none', background: 'rgba(0,0,0,0.03)' }}>
                   <Menu size={16} />
                   <span style={{ fontSize: '10px', fontWeight: '800' }}>HORIZONTAL MENU</span>
                </button>
                <button onClick={() => setIsDarkMode(!isDarkMode)} className="glass-card" style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '10px 16px', width: '100%', border: 'none', background: 'rgba(0,0,0,0.03)' }}>
                  {isDarkMode ? <Sun size={16} /> : <Moon size={16} />}
                  <span style={{ fontSize: '10px', fontWeight: '800' }}>{isDarkMode ? 'LIGHT MODE' : 'DARK MODE'}</span>
                </button>
              </div>
           </div>
        </div>
      )}

      {/* CENTRAL COLUMN */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>
        {/* TOP NAV (HORIZONTAL) */}
        {menuPosition === 'horizontal' && (
          <div className="top-nav" style={{ height: '70px', padding: '0 30px' }}>
             <div style={{ fontSize: '20px', fontWeight: '900', letterSpacing: '2px', marginRight: '40px' }}>NEO<span style={{ color: 'var(--bordo)' }}>TRAVEL</span></div>
             <NavigationItems />
             <div style={{ marginLeft: 'auto', display: 'flex', gap: '12px' }}>
                <button onClick={() => setMenuPosition('vertical')} className="glass-card" style={{ padding: '8px' }}><Layout size={16} /></button>
                <button onClick={() => setIsDarkMode(!isDarkMode)} className="glass-card" style={{ padding: '8px' }}>{isDarkMode ? <Sun size={16} /> : <Moon size={16} />}</button>
             </div>
          </div>
        )}

        {/* VIEWPORT AREA */}
        <main style={{ padding: '24px 40px', flex: 1, overflowY: 'auto' }}>
          <AnimatePresence mode="wait">
            <motion.div key={activeTab} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.2 }}>
              {activeTab === 'dashboard' && <DashboardView />}
              {activeTab === 'search' && <SearchView />}
              {activeTab === 'dossiers' && <DossiersView />}
              {activeTab === 'calendar' && <div className="glass-card" style={{ padding: '40px', textAlign: 'center' }}>Kalendar (U pripremi...)</div>}
              {activeTab === 'rooming' && <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}><h2 style={{ fontSize: '24px', fontWeight: '900' }}>Rooming Lista</h2><div className="glass-card" style={{ padding: '32px', textAlign: 'center', minHeight: '400px', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}><Users size={48} color="var(--bordo)" style={{ opacity: 0.2, marginBottom: '16px' }} /><h3 style={{ fontSize: '18px', fontWeight: '700' }}>U pripremi...</h3><p style={{ opacity: 0.5, maxWidth: '300px', marginTop: '8px' }}>Prikaz rasporeda soba po hotelima i datumima u formi Gantt charta.</p></div></div>}
            </motion.div>
          </AnimatePresence>
        </main>

        {/* FOOTER */}
        <div style={{ padding: '0 40px 20px 40px' }}>
           <Footer isDark={isDarkMode} />
        </div>
      </div>

      {/* RIGHT SIDEBAR (BASKET) */}
      {(activeTab === 'search' || activeTab === 'dashboard') && (
        <div style={{ padding: '20px 40px 20px 0', display: 'flex' }}>
           <div className="floating-sidebar" style={{ width: '380px', height: '100%', padding: '32px 24px' }}>
              <h4 style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '32px', fontSize: '13px', fontWeight: '900', letterSpacing: '1px' }}>
                <ShoppingBag size={18} color="var(--bordo)" /> REZERVACIJA
              </h4>
              <div style={{ flex: 1, overflowY: 'auto', marginBottom: '20px' }}>
                 {selectedServices.length === 0 && <div style={{ opacity: 0.3, textAlign: 'center', marginTop: '100px', fontSize: '13px' }}>Vaša korpa je prazna</div>}
                 {selectedServices.map(s => (
                    <div key={s.id} className="basket-item" style={{ padding: '12px 0' }}>
                       <div className="basket-icon-circle" style={{ width: '40px', height: '40px' }}>{s.icon}</div>
                       <div style={{ flex: 1 }}>
                         <div style={{ fontSize: '9px', fontWeight: '800', opacity: 0.5 }}>{s.type.toUpperCase()}</div>
                         <div style={{ fontWeight: '700', fontSize: '13px', margin: '2px 0' }}>{s.name}</div>
                       </div>
                       <div className="basket-price" style={{ fontSize: '14px' }}>€{s.price}</div>
                    </div>
                 ))}
              </div>
              {selectedServices.length > 0 && (
                <div className="total-summary-box" style={{ background: 'var(--bordo)', borderRadius: '16px', padding: '24px' }}>
                   <div style={{ fontSize: '10px', opacity: 0.8, marginBottom: '4px', fontWeight: '800' }}>UKUPNA CENA</div>
                   <div style={{ fontSize: '32px', fontWeight: '900' }}>€{totalPrice}</div>
                   <button className="btn-primary" style={{ borderRadius: '50px', background: 'white', color: 'var(--bordo)', fontWeight: '900', width: '100%', marginTop: '20px', padding: '14px' }}>DALJE</button>
                </div>
              )}
           </div>
        </div>
      )}
    </div>
  );
};

const NavItem = ({ icon, label, active, onClick, horizontal }: any) => (
  <div onClick={onClick} className={`nav-item ${active ? 'active' : ''}`} style={horizontal ? { borderLeft: 'none', borderBottom: active ? '3px solid var(--bordo)' : '3px solid transparent', borderRadius: 0, padding: '0 12px', height: '100%', display: 'flex', alignItems: 'center', gap: '8px' } : {}}>
    {icon}
    <span style={{ fontSize: '13px' }}>{label}</span>
  </div>
);

export default App;
