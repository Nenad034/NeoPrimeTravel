import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Calendar as CalendarIcon, 
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
  Clock,
  Briefcase,
  History,
  TrendingDown,
  ChevronLeft
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Footer from './components/Footer';
import { GeometricBrain } from './components/icons/GeometricBrain';
import { DynamicPackagingEngine } from './modules/booking/DynamicPackagingEngine';
import { BundleRuleService } from './modules/booking/BundleRuleService';
import { OperationalReportsView } from './modules/production/OperationalReportsView';
import { BundleRuleMasterView } from './modules/booking/BundleRuleMasterView';

// --- Types & Mock Data ---
interface Selection { id: string; type: string; name: string; price: number; icon: React.ReactNode; }

const SEARCH_RESULTS = [
  { id: 'h-1', type: 'Accommodation', name: 'Rixos Premium Magawish', location: 'Hurghada, Egypt', price: 145, rating: 5, tags: ['UAI', 'Luxury'], aiSummary: 'Idealno za porodice.', prediction: 'Only 3 left', icon: <Building2 className="text-bordo" size={24} /> },
  { id: 'h-2', type: 'Accommodation', name: 'Steigenberger ALDAU Beach', location: 'Hurghada, Egypt', price: 125, rating: 5, tags: ['AI', 'Beachfront'], aiSummary: 'Vrhunski spa centar.', prediction: 'High demand', icon: <Building2 className="text-bordo" size={24} /> },
  { id: 'h-4', type: 'Accommodation', name: 'Baron Palace Sahl Hasheesh', location: 'Sahl Hasheesh, Egypt', price: 180, rating: 5, tags: ['UAI', 'Palace'], aiSummary: 'Ultimativni luksuz.', prediction: 'Member Deal', icon: <Building2 className="text-bordo" size={24} /> },
  { id: 'f-1', type: 'Flight', name: 'Air Cairo SM381', location: 'BEG -> HRG', price: 320, rating: 4.5, tags: ['Direct', '7KG Cabin'], aiSummary: 'Najbrži let direktno do Hurgade.', prediction: 'Good price', icon: <Plane className="text-bordo" size={24} /> },
  { id: 'f-2', type: 'Flight', name: 'Turkish Airlines TK1082', location: 'BEG -> IST -> HRG', price: 410, rating: 5, tags: ['1 Stop', '30KG Luggage'], aiSummary: 'Vrhunski komfor.', prediction: 'Premium', icon: <Plane className="text-bordo" size={24} /> },
  { id: 'a-1', type: 'Activity', name: 'Giftun Island Speedboat', location: 'Hurghada Port', price: 65, rating: 5, tags: ['Snorkeling', 'Lunch'], aiSummary: 'Must see!', prediction: 'Popular', icon: <Map className="text-bordo" size={24} /> }
];

const MOCK_DOSSIERS = [
  { id: 'D-842', client: 'Petar Petrović', destination: 'Egipat, Hurgada', dates: '12.06 - 22.06.2026', total: '€2,450', status: 'Plaćeno', statusColor: '#10B981', agent: 'Nevena' },
  { id: 'D-843', client: 'Jelena Jović', destination: 'Turska, Antalija', dates: '05.07 - 15.07.2026', total: '€3,120', status: 'Pending', statusColor: '#F59E0B', agent: 'Marko' },
  { id: 'D-844', client: 'Marko Marković', destination: 'Grčka, Krit', dates: '18.08 - 28.08.2026', total: '€1,890', status: 'Plaćeno', statusColor: '#10B981', agent: 'Nevena' },
  { id: 'D-845', client: 'Ana Antić', destination: 'Egipat, Šarm el Šeik', dates: '10.09 - 20.09.2026', total: '€2,700', status: 'Otkazano', statusColor: '#EF4444', agent: 'Maja' },
  { id: 'D-846', client: 'Dragan Nikolić', destination: 'Kipar, Aja Napa', dates: '01.06 - 10.06.2026', total: '€1,550', status: 'Plaćeno', statusColor: '#10B981', agent: 'Nevena' },
  { id: 'D-847', client: 'Milica Pavlović', destination: 'Španija, Majorka', dates: '15.07 - 25.07.2026', total: '€3,400', status: 'U obradi', statusColor: '#3B82F6', agent: 'Jovana' }
];

const MOCK_ROOMING = [
  { hotel: 'Rixos Premium Magawish', room: 'Superior Suite #204', guest: 'Petar Petrović', checkIn: '12.06', checkOut: '22.06', occupancy: '90%' },
  { hotel: 'Steigenberger ALDAU', room: 'Deluxe Sea View #102', guest: 'Milica Pavlović', checkIn: '15.07', checkOut: '25.07', occupancy: '100%' },
  { hotel: 'Baron Palace', room: 'Swim-up Room #15', guest: 'Dragan Nikolić', checkIn: '01.06', checkOut: '10.06', occupancy: '85%' },
  { hotel: 'Titanic Royal', room: 'Family Suite #405', guest: 'Jelena Jović', checkIn: '05.07', checkOut: '15.07', occupancy: '95%' }
];

const MOCK_CALENDAR_EVENTS = [
  { day: 12, month: 'Jun', title: 'Check-in: Rixos Premium (D-842)', type: 'hotel', color: '#800020' },
  { day: 15, month: 'Jun', title: 'Let BEG-HRG SM381', type: 'flight', color: '#3B82F6' },
  { day: 18, month: 'Jun', title: 'Izlet Giftun Island', type: 'activity', color: '#10B981' },
  { day: 22, month: 'Jun', title: 'Check-out & Transfer', type: 'transfer', color: '#F59E0B' }
];

const App = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [menuPosition, setMenuPosition] = useState<'vertical' | 'horizontal'>('vertical');
  const [searchFilter, setSearchFilter] = useState('Packages');
  const [showCalendar, setShowCalendar] = useState(false);
  const [packageStep, setPackageStep] = useState(0); 
  const [selectedServices, setSelectedServices] = useState<Selection[]>([]);
  const [activeModule, setActiveModule] = useState<string | null>(null);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', isDarkMode ? 'dark' : 'light');
    // Seed initial rules (Standard Discount)
    BundleRuleService.seedInitialRules();
  }, [isDarkMode]);

  const handleServiceSelect = (service: any) => {
    const newService: Selection = {
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

  const validation = DynamicPackagingEngine.validatePackage(
    selectedServices.map(s => ({ type: s.type.toUpperCase() } as any))
  );

  const totalPrice = DynamicPackagingEngine.calculateBundlePrice(selectedServices);

  // --- View Components ---

  const DashboardView = () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: '28px', fontWeight: '900', marginBottom: '4px' }}>Zdravo, Nevena 👋</h1>
          <p style={{ opacity: 0.6, fontSize: '14px' }}>Dobrodošli u vaš v1.5 travel ekosistem.</p>
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
          { label: 'Ukupan Promet', value: '€184,250', trend: '+18.5%', icon: <DollarSign size={20} />, color: '#10B981' },
          { label: 'Aktivni Dossieri', value: '1,248', trend: '+14', icon: <FileText size={20} />, color: '#3B82F6' },
          { label: 'Stope Konverzije', value: '24.2%', trend: '+2.1%', icon: <TrendingUp size={20} />, color: '#F59E0B' },
          { label: 'Zadovoljstvo', value: '4.8/5', trend: 'Optimum', icon: <Star size={20} />, color: '#EC4899' }
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

      <div className="glass-card" style={{ padding: '24px', border: '1px solid rgba(128,0,32,0.1)', background: 'rgba(128,0,32,0.02)' }}>
         <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
               <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'var(--bordo)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Zap size={20} color="white" />
               </div>
               <div>
                  <h3 style={{ fontSize: '16px', fontWeight: '900' }}>AI PRICING INTELLIGENCE</h3>
                  <p style={{ fontSize: '12px', opacity: 0.6 }}>Agent predlaže optimizaciju cena na osnovu potražnje.</p>
               </div>
            </div>
            <button className="btn-primary" style={{ padding: '8px 20px', fontSize: '11px' }}>OSVEŽI ANALIZU</button>
         </div>
         
         <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            <div style={{ padding: '16px', background: 'white', borderRadius: '12px', border: '1px solid rgba(0,0,0,0.05)' }}>
               <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                  <span style={{ fontSize: '10px', fontWeight: '900', color: 'var(--bordo)' }}>SUGESTIJA: EGIPAT LUKSUZ BUNDLE</span>
                  <span style={{ fontSize: '10px', fontWeight: '800', opacity: 0.5 }}>POVERENJE: 94%</span>
               </div>
               <p style={{ fontSize: '12px', fontWeight: '600', marginBottom: '16px' }}>Uočen 3x veći trend pretraga za Rixos hotele + Air Cairo letove. Predlog: -7% popusta na paket.</p>
               <div style={{ display: 'flex', gap: '8px' }}>
                  <button className="btn-primary" onClick={() => setActiveModule('bundle')} style={{ flex: 1, fontSize: '10px', padding: '10px' }}>ODOBRI PRAVILO</button>
                  <button className="glass-card" style={{ flex: 1, fontSize: '10px', padding: '10px', border: 'none' }}>IGNORIŠI</button>
               </div>
            </div>
            <div style={{ padding: '16px', background: 'white', borderRadius: '12px', border: '1px solid rgba(0,0,0,0.05)' }}>
               <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                  <span style={{ fontSize: '10px', fontWeight: '900', color: 'var(--bordo)' }}>SUGESTIJA: HYBRID TRANSFER DISCOUNT</span>
                  <span style={{ fontSize: '10px', fontWeight: '800', opacity: 0.5 }}>POVERENJE: 82%</span>
               </div>
               <p style={{ fontSize: '12px', fontWeight: '600', marginBottom: '16px' }}>Kombinacija Hotel + Transfer ima nizak conversion rate. Predlog: -€20 fiksno + 3% popusta.</p>
               <div style={{ display: 'flex', gap: '8px' }}>
                  <button className="btn-primary" onClick={() => setActiveModule('bundle')} style={{ flex: 1, fontSize: '10px', padding: '10px' }}>ODOBRI PRAVILO</button>
                  <button className="glass-card" style={{ flex: 1, fontSize: '10px', padding: '10px', border: 'none' }}>IGNORIŠI</button>
               </div>
            </div>
         </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.8fr 1.2fr', gap: '24px' }}>
        <div className="glass-card" style={{ padding: '24px' }}>
           <h3 style={{ fontSize: '16px', fontWeight: '900', marginBottom: '24px' }}>ANALITIKA PRODAJE PO DESTINACIJAMA</h3>
           <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {[
                { name: 'Egipat, Hurgada', share: '45%', amount: '€82,100', color: 'var(--bordo)' },
                { name: 'Turska, Antalija', share: '30%', amount: '€55,275', color: '#10B981' },
                { name: 'Grčka, Krit', share: '15%', amount: '€27,630', color: '#3B82F6' },
                { name: 'Kipar, Protaras', share: '10%', amount: '€19,245', color: '#F59E0B' }
              ].map(dest => (
                <div key={dest.name} style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <div style={{ width: '120px', fontSize: '12px', fontWeight: '700' }}>{dest.name}</div>
                  <div style={{ flex: 1, height: '8px', background: 'rgba(0,0,0,0.05)', borderRadius: '4px', overflow: 'hidden' }}>
                    <motion.div initial={{ width: 0 }} animate={{ width: dest.share }} style={{ height: '100%', background: dest.color }} />
                  </div>
                  <div style={{ width: '80px', textAlign: 'right', fontSize: '12px', fontWeight: '800' }}>{dest.amount}</div>
                </div>
              ))}
           </div>
        </div>
        <div className="glass-card" style={{ padding: '24px', background: 'rgba(59,130,246,0.05)' }}>
           <h3 style={{ fontSize: '16px', fontWeight: '900', marginBottom: '16px' }}>AKTIVNOST AGENTA</h3>
           <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {[
                { icon: <History size={14} />, text: 'Nevena je kreirala dossier D-852', time: 'Pre 2m' },
                { icon: <DollarSign size={14} />, text: 'Uplata od €1,200 proknjižena za D-844', time: 'Pre 5m' },
                { icon: <MessageSquare size={14} />, text: 'Novi upit za Rixos Premium Magawish', time: 'Pre 12m' },
                { icon: <Plane size={14} />, text: 'Sistem: Automatska provera karata za Air Cairo', time: 'Pre 45m' }
              ].map((n, i) => (
                <div key={i} style={{ display: 'flex', gap: '12px', padding: '12px', background: 'rgba(255,255,255,0.5)', borderRadius: '10px', fontSize: '12px' }}>
                   <div style={{ marginTop: '2px', opacity: 0.5 }}>{n.icon}</div>
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
            <h2 style={{ fontSize: '24px', fontWeight: '900' }}>Centralni Dosijei</h2>
            <p style={{ opacity: 0.6, fontSize: '13px' }}>Baza svih rezervacija i operativnih statusa.</p>
          </div>
          <div style={{ display: 'flex', gap: '12px' }}>
            <button className="glass-card" style={{ padding: '10px 20px', fontWeight: '800', fontSize: '11px' }}>ARHIVA</button>
            <button className="btn-primary">+ NOVI DOSIJE</button>
          </div>
       </div>

       <div className="glass-card" style={{ padding: '16px 24px', display: 'flex', gap: '20px', alignItems: 'center' }}>
          <div style={{ flex: 1, position: 'relative' }}>
             <SearchIcon size={16} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', opacity: 0.4 }} />
             <input type="text" placeholder="Pretraži Dossier (ID, Ime klijenta, Hotel)..." style={{ width: '100%', padding: '12px 16px 12px 48px', borderRadius: '12px', border: '1px solid rgba(0,0,0,0.08)', background: 'transparent', outline: 'none', fontSize: '13px' }} />
          </div>
          <button className="glass-card" style={{ padding: '12px 20px', fontSize: '12px', fontWeight: '800', border: 'none', background: 'rgba(0,0,0,0.03)' }}><Filter size={14} style={{ marginRight: '8px' }} /> FILTERI</button>
       </div>

       <div className="glass-card" style={{ overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
             <thead style={{ background: 'rgba(0,0,0,0.02)' }}>
                <tr>
                   {['Dozije ID', 'Klijent', 'Destinacija / Hotel', 'Period', 'Agent', 'Ukupno', 'Status', ''].map(h => (
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
                      <td style={{ padding: '16px 24px', fontSize: '12px', fontWeight: '700' }}>{d.agent}</td>
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

  const RoomingView = () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
       <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h2 style={{ fontSize: '24px', fontWeight: '900' }}>Rooming Lista</h2>
            <p style={{ opacity: 0.6, fontSize: '13px' }}>Dnevni raspored i popunjenost smeštajnih kapaciteta.</p>
          </div>
          <button className="btn-primary">PREUZMI XLSX</button>
       </div>

       <div className="glass-card" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {MOCK_ROOMING.map((r, i) => (
              <div key={i} className="glass-card" style={{ padding: '16px', display: 'grid', gridTemplateColumns: '1.5fr 1fr 1fr 1fr 1fr 100px', alignItems: 'center', background: 'rgba(0,0,0,0.02)', border: 'none' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <Building2 size={16} color="var(--bordo)" />
                  <span style={{ fontWeight: '800', fontSize: '13px' }}>{r.hotel}</span>
                </div>
                <div style={{ fontSize: '12px', fontWeight: '600' }}>{r.room}</div>
                <div style={{ fontSize: '12px', fontWeight: '800' }}>{r.guest}</div>
                <div style={{ fontSize: '12px', opacity: 0.6 }}>{r.checkIn} - {r.checkOut}</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div style={{ flex: 1, height: '4px', background: 'rgba(0,0,0,0.1)', borderRadius: '2px' }}>
                    <div style={{ width: r.occupancy, height: '100%', background: '#10B981', borderRadius: '2px' }} />
                  </div>
                  <span style={{ fontSize: '10px', fontWeight: '900' }}>{r.occupancy}</span>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <button style={{ background: 'none', border: 'none', color: 'var(--bordo)', fontWeight: '900', fontSize: '11px', cursor: 'pointer' }}>DETALJI</button>
                </div>
              </div>
            ))}
          </div>
       </div>

       <div className="glass-card" style={{ padding: '40px', textAlign: 'center', minHeight: '300px', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
          <Layout size={48} color="rgba(0,0,0,0.1)" style={{ marginBottom: '16px' }} />
          <h3 style={{ fontSize: '18px', fontWeight: '800' }}>Gantt Chart (U razvoju)</h3>
          <p style={{ opacity: 0.5, fontSize: '13px', marginTop: '4px' }}>Puna interaktivna mapa rasporeda soba biće dostupna u v1.6.</p>
       </div>
    </div>
  );

  const CalendarView = () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
       <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <h2 style={{ fontSize: '24px', fontWeight: '900' }}>Operativni Kalendar</h2>
            <div style={{ display: 'flex', background: 'rgba(0,0,0,0.05)', borderRadius: '10px', padding: '4px' }}>
               <button className="glass-card" style={{ padding: '6px 16px', background: 'white', border: 'none', fontSize: '11px', fontWeight: '800' }}>MESEC</button>
               <button style={{ padding: '6px 16px', background: 'transparent', border: 'none', fontSize: '11px', fontWeight: '800', opacity: 0.4 }}>NEDELJA</button>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button className="glass-card" style={{ padding: '10px' }}><ChevronLeft size={18} /></button>
            <div className="glass-card" style={{ padding: '10px 24px', fontWeight: '900' }}>JUN 2026</div>
            <button className="glass-card" style={{ padding: '10px' }}><ChevronRight size={18} /></button>
          </div>
       </div>

       <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '24px' }}>
          <div className="glass-card" style={{ padding: '24px', minHeight: '500px' }}>
             <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', textAlign: 'center', gap: '1px', background: 'rgba(0,0,0,0.1)', border: '1px solid rgba(0,0,0,0.1)', borderRadius: '12px', overflow: 'hidden' }}>
                {['PON', 'UTO', 'SRE', 'ČET', 'PET', 'SUB', 'NED'].map(day => (
                  <div key={day} style={{ background: 'rgba(255,255,255,0.8)', padding: '12px', fontSize: '11px', fontWeight: '900', opacity: 0.4 }}>{day}</div>
                ))}
                {Array.from({ length: 30 }).map((_, i) => {
                  const dayNum = i + 1;
                  const event = MOCK_CALENDAR_EVENTS.find(e => e.day === dayNum);
                  return (
                    <div key={i} style={{ background: 'white', height: '100px', padding: '8px', position: 'relative' }}>
                       <div style={{ fontSize: '12px', fontWeight: '800', opacity: 0.3 }}>{dayNum}</div>
                       {event && (
                         <div style={{ position: 'absolute', top: '30px', left: '4px', right: '4px', padding: '6px', background: `${event.color}11`, borderLeft: `3px solid ${event.color}`, borderRadius: '4px', fontSize: '9px', fontWeight: '800', color: event.color }}>
                            {event.title}
                         </div>
                       )}
                    </div>
                  );
                })}
             </div>
          </div>
          <div className="glass-card" style={{ padding: '24px' }}>
             <h3 style={{ fontSize: '14px', fontWeight: '900', marginBottom: '20px' }}>DANAŠNJI DOGAĐAJI</h3>
             <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {MOCK_CALENDAR_EVENTS.map((ev, i) => (
                  <div key={i} style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                     <div style={{ width: '40px', textAlign: 'center' }}>
                        <div style={{ fontSize: '16px', fontWeight: '900' }}>{ev.day}</div>
                        <div style={{ fontSize: '9px', fontWeight: '800', opacity: 0.5 }}>{ev.month.toUpperCase()}</div>
                     </div>
                     <div style={{ flex: 1, padding: '12px', background: 'rgba(0,0,0,0.02)', borderRadius: '12px' }}>
                        <div style={{ fontSize: '12px', fontWeight: '700' }}>{ev.title}</div>
                        <div style={{ fontSize: '10px', marginTop: '4px', color: ev.color, fontWeight: '800' }}>{ev.type.toUpperCase()}</div>
                     </div>
                  </div>
                ))}
             </div>
          </div>
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
      <NavItem icon={<CalendarIcon size={20}/>} label="Kalendar" active={activeTab === 'calendar'} onClick={() => setActiveTab('calendar')} horizontal={menuPosition === 'horizontal'} />
      <NavItem icon={<Users size={20}/>} label="Rooming" active={activeTab === 'rooming'} onClick={() => { setActiveTab('rooming'); setActiveModule(null); }} horizontal={menuPosition === 'horizontal'} />
      <NavItem icon={<Activity size={20}/>} label="Moduli" active={activeTab === 'modules'} onClick={() => { setActiveTab('modules'); setActiveModule(null); }} horizontal={menuPosition === 'horizontal'} />
    </>
  );

  const ModulesView = () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
      <div>
        <h2 style={{ fontSize: '24px', fontWeight: '900' }}>Sistemski Moduli</h2>
        <p style={{ opacity: 0.6, fontSize: '13px' }}>Upravljanje nezavisnim komponentama NeoTravel platforme.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px' }}>
        {/* Kategorija 1: Operativa */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ fontSize: '11px', fontWeight: '900', opacity: 0.4, letterSpacing: '1px' }}>OPERATIVNI MODULI</div>
          {[
            { name: 'Booking Engine', desc: 'Centralna logika za kreiranje rezervacija.', status: 'AKTIVAN', icon: <ShoppingBag size={18} /> },
            { name: 'Dossier Director', desc: 'Orkestracija dokumenata i statusa dosijea.', status: 'AKTIVAN', icon: <FileText size={18} /> },
            { name: 'Ops List Generator', desc: 'Rooming, Manifest i Transfer liste.', status: 'AKTIVAN', icon: <Layout size={18} /> }
          ].map(m => (
            <div key={m.name} className="glass-card" style={{ padding: '20px', border: '1px solid rgba(0,0,0,0.05)' }}>
              <div style={{ display: 'flex', gap: '12px', marginBottom: '12px' }}>
                <div style={{ color: 'var(--bordo)' }}>{m.icon}</div>
                <div style={{ fontSize: '14px', fontWeight: '800' }}>{m.name}</div>
              </div>
              <p style={{ fontSize: '11px', opacity: 0.6, lineHeight: '1.5', marginBottom: '16px' }}>{m.desc}</p>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '9px', fontWeight: '900', color: '#10B981' }}>{m.status}</span>
                <button 
                  onClick={() => (m.name === 'Ops List Generator') ? setActiveModule('ops') : null}
                  style={{ background: 'none', border: 'none', color: 'var(--bordo)', fontSize: '10px', fontWeight: '900', cursor: 'pointer' }}
                >
                  KONFIGURACIJA
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Kategorija 2: Finansije i Regulativa */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ fontSize: '11px', fontWeight: '900', opacity: 0.4, letterSpacing: '1px' }}>FINANSIJE I REGULATIVA</div>
          {[
            { name: 'Finance Service', desc: 'Procesiranje uplata i finansijska analitika.', status: 'AKTIVAN', icon: <Euro size={18} /> },
            { name: 'Regulatory (CIS/SEF)', desc: 'Fiskalizacija, eTurista i eFakture.', status: 'SINHRONIZOVAN', icon: <CheckCircle size={18} /> },
            { name: 'Inventory Master', desc: 'Upravljanje zakupljenim kapacitetima.', status: 'AKTIVAN', icon: <Building2 size={18} /> }
          ].map(m => (
            <div key={m.name} className="glass-card" style={{ padding: '20px', border: '1px solid rgba(0,0,0,0.05)' }}>
              <div style={{ display: 'flex', gap: '12px', marginBottom: '12px' }}>
                <div style={{ color: 'var(--bordo)' }}>{m.icon}</div>
                <div style={{ fontSize: '14px', fontWeight: '800' }}>{m.name}</div>
              </div>
              <p style={{ fontSize: '11px', opacity: 0.6, lineHeight: '1.5', marginBottom: '16px' }}>{m.desc}</p>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '9px', fontWeight: '900', color: '#10B981' }}>{m.status}</span>
                <button 
                  onClick={() => (m.name === 'Inventory Master') ? setActiveModule('ops') : null}
                  style={{ background: 'none', border: 'none', color: 'var(--bordo)', fontSize: '10px', fontWeight: '900', cursor: 'pointer' }}
                >
                  KONFIGURACIJA
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Kategorija 3: Intelligence */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ fontSize: '11px', fontWeight: '900', opacity: 0.4, letterSpacing: '1px' }}>AI & INTELLIGENCE</div>
          {[
            { name: 'DP Engine (DPE)', desc: 'Dinamičko pakovanje i validacija.', status: 'AKTIVAN', icon: <Zap size={18} /> },
            { name: 'Bundle Rule Master', desc: 'Upravljanje popustima i AI sugestije.', status: 'POTREBNO ODOBRENJE', icon: <Activity size={18} />, highlight: true },
            { name: 'Guardian Angel', desc: 'Proaktivna detekcija rizika u korpi.', status: 'AKTIVAN', icon: <GeometricBrain size={18} /> }
          ].map(m => (
            <div key={m.name} className="glass-card" style={{ padding: '20px', border: m.highlight ? '1px solid var(--bordo)' : '1px solid rgba(0,0,0,0.05)', background: m.highlight ? 'rgba(128,0,32,0.02)' : 'transparent' }}>
              <div style={{ display: 'flex', gap: '12px', marginBottom: '12px' }}>
                <div style={{ color: 'var(--bordo)' }}>{m.icon}</div>
                <div style={{ fontSize: '14px', fontWeight: '800' }}>{m.name}</div>
              </div>
              <p style={{ fontSize: '11px', opacity: 0.6, lineHeight: '1.5', marginBottom: '16px' }}>{m.desc}</p>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '9px', fontWeight: '900', color: m.highlight ? 'var(--bordo)' : '#10B981' }}>{m.status}</span>
                <button 
                  onClick={() => m.name === 'Bundle Rule Master' ? setActiveModule('bundle') : null}
                  style={{ background: 'none', border: 'none', color: 'var(--bordo)', fontSize: '10px', fontWeight: '900', cursor: 'pointer' }}
                >
                  KONFIGURACIJA
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
      {activeModule === 'ops' && (
        <div style={{ position: 'fixed', top: 0, left: menuPosition === 'vertical' ? '320px' : 0, right: 0, bottom: 0, background: 'var(--bg-app)', zIndex: 1000, padding: '40px', overflowY: 'auto' }}>
           <div style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', opacity: 0.6 }} onClick={() => setActiveModule(null)}>
              <ChevronLeft size={16} /> <span style={{ fontSize: '11px', fontWeight: '900' }}>NAZAD NA MODULE</span>
           </div>
           <OperationalReportsView />
        </div>
      )}
      {activeModule === 'bundle' && (
        <div style={{ position: 'fixed', top: 0, left: menuPosition === 'vertical' ? '320px' : 0, right: 0, bottom: 0, background: 'var(--bg-app)', zIndex: 1000, padding: '40px', overflowY: 'auto' }}>
           <div style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', opacity: 0.6 }} onClick={() => setActiveModule(null)}>
              <ChevronLeft size={16} /> <span style={{ fontSize: '11px', fontWeight: '900' }}>NAZAD NA MODULE</span>
           </div>
           <BundleRuleMasterView />
        </div>
      )}
    </div>
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', width: '100vw', background: 'var(--bg-app)', overflow: 'hidden' }}>
      
      {/* TOP HEADER */}
      {menuPosition === 'horizontal' && (
        <div className="top-nav" style={{ height: '70px', padding: '0 40px', display: 'flex', alignItems: 'center', borderBottom: '1px solid var(--border-color)', background: 'var(--sidebar-bg)' }}>
           <div style={{ fontSize: '24px', fontWeight: '900', letterSpacing: '2px', marginRight: '60px', color: 'var(--text-main)' }}>NEO<span style={{ color: 'var(--bordo)' }}>TRAVEL</span></div>
           <div style={{ display: 'flex', gap: '32px', height: '100%' }}>
              <NavigationItems />
           </div>
           <div style={{ marginLeft: 'auto', display: 'flex', gap: '16px' }}>
              <button onClick={() => setMenuPosition('vertical')} className="glass-card" style={{ padding: '8px', border: 'none', background: 'transparent' }}><Layout size={18} /></button>
              <button onClick={() => setIsDarkMode(!isDarkMode)} className="glass-card" style={{ padding: '8px', border: 'none', background: 'transparent' }}>{isDarkMode ? <Sun size={18} /> : <Moon size={18} />}</button>
           </div>
        </div>
      )}

      <div style={{ flex: 1, display: 'flex', flexDirection: 'row', overflow: 'hidden' }}>
        
        {/* LEFT SIDEBAR */}
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

        {/* CENTRAL AREA */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>
          <main style={{ padding: '24px 40px', flex: 1, overflowY: 'auto' }}>
            <AnimatePresence mode="wait">
              <motion.div key={activeTab} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.2 }}>
                {activeTab === 'dashboard' && <DashboardView />}
                {activeTab === 'search' && <SearchView />}
                {activeTab === 'dossiers' && <DossiersView />}
                 {activeTab === 'calendar' && <CalendarView />}
                {activeTab === 'rooming' && <RoomingView />}
                {activeTab === 'modules' && <ModulesView />}
              </motion.div>
            </AnimatePresence>
          </main>
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

                   {/* Guardian Angel Suggestions */}
                   {validation.suggestions.length > 0 && (
                     <div style={{ marginTop: '20px', padding: '16px', background: 'rgba(128,0,32,0.05)', borderRadius: '12px', border: '1px solid rgba(128,0,32,0.1)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                           <Zap size={14} color="var(--bordo)" />
                           <span style={{ fontSize: '10px', fontWeight: '900', color: 'var(--bordo)', letterSpacing: '0.5px' }}>GUARDIAN ANGEL SUGESTIJA</span>
                        </div>
                        {validation.suggestions.map((s, i) => (
                          <div key={i} style={{ fontSize: '11px', fontWeight: '600', opacity: 0.8, lineHeight: '1.4' }}>{s}</div>
                        ))}
                     </div>
                   )}
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
    </div>
  );
};

const NavItem = ({ icon, label, active, onClick, horizontal }: any) => (
  <div onClick={onClick} className={`nav-item ${active ? 'active' : ''}`} style={horizontal ? { borderLeft: 'none', borderBottom: active ? '3px solid var(--bordo)' : '3px solid transparent', borderRadius: 0, padding: '0 20px', height: '100%', display: 'flex', alignItems: 'center', gap: '8px' } : {}}>
    {icon}
    <span style={{ fontSize: '13px' }}>{label}</span>
  </div>
);

export default App;
