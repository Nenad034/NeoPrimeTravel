import React, { useState, useMemo } from 'react';
import { 
  Plug, Database, Globe, Plane, CheckCircle, XCircle, 
  AlertTriangle, Settings, Activity, ArrowRight, Shield, 
  LayoutGrid, List, Search, Zap, CreditCard, Link, Ticket, Mountain,
  Filter, Bell, History, Server, ShieldCheck, Heart, Info, MoreVertical,
  Cpu, MousePointer2, Terminal
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface APIConnection {
  id: string;
  name: string;
  provider: string;
  description: string;
  icon: React.ReactNode;
  status: 'active' | 'inactive' | 'error' | 'testing';
  category: 'flights' | 'supplier' | 'systems' | 'payments' | 'mapping' | 'ski' | 'automation';
  color: string;
  metrics: {
    latency: number;
    uptime: number;
    successRate: number;
  };
  features: string[];
}

const CONNECTIONS: APIConnection[] = [
  {
    id: 'travelgate',
    name: 'Travelgate Hotel-X',
    provider: 'Travelgate Network',
    description: 'Glavni agregator hotelskog sadržaja. GraphQL konekcija sa 600+ dobavljača.',
    icon: <Globe size={24} />,
    status: 'active',
    category: 'supplier',
    color: '#6366f1',
    metrics: { latency: 450, uptime: 99.9, successRate: 98.5 },
    features: ['Multi-Supplier', 'GraphQL', 'Dynamic Inventory']
  },
  {
    id: 'solvex',
    name: 'Solvex (Master-Interlook)',
    provider: 'B&A e-Travel SA',
    description: 'Specijalizovan inventar za Bugarsku i Crnu Goru. SOAP integracija.',
    icon: <Database size={24} />,
    status: 'active',
    category: 'supplier',
    color: '#e91e63',
    metrics: { latency: 1200, uptime: 98.2, successRate: 92.0 },
    features: ['Ski Resorts', 'Beach Hotels', 'B2B Contracts']
  },
  {
    id: 'santsg',
    name: 'San TSG (TourVisio)',
    provider: 'San Tourism Software Group',
    description: 'Povezuje Filip Travel i Big Blue. Čarteri i direktni zakupli u Turskoj i Egiptu.',
    icon: <Zap size={24} />,
    status: 'testing',
    category: 'supplier',
    color: '#f59e0b',
    metrics: { latency: 850, uptime: 97.5, successRate: 88.4 },
    features: ['Charter Management', 'TourVisio API', 'Direct Contracts']
  },
  {
    id: 'kyte',
    name: 'Kyte (Wizz Air NDC)',
    provider: 'Kyte API',
    description: 'Moderni NDC agregator za Low-Cost kompanije. Direktan pristup Wizz Air i Ryanair.',
    icon: <Plane size={24} />,
    status: 'active',
    category: 'flights',
    color: '#06b6d4',
    metrics: { latency: 320, uptime: 99.8, successRate: 99.1 },
    features: ['Direct NDC', 'LCC Content', 'Ancillaries']
  },
  {
    id: 'amadeus',
    name: 'Amadeus GDS',
    provider: 'Amadeus IT Group',
    description: 'Globalni distribucioni sistem za redovne avio linije i ticketing.',
    icon: <Plane size={24} />,
    status: 'active',
    category: 'flights',
    color: '#3b82f6',
    metrics: { latency: 2100, uptime: 99.9, successRate: 97.2 },
    features: ['GDS Flights', 'Fare Rules', 'Ticketing']
  },
  {
    id: 'giata',
    name: 'GIATA Drive',
    provider: 'GIATA GmbH',
    description: 'Mapiranje hotelskih ID-jeva i čišćenje duplih unosa (Deduplication).',
    icon: <Link size={24} />,
    status: 'active',
    category: 'mapping',
    color: '#10b981',
    metrics: { latency: 150, uptime: 100, successRate: 100 },
    features: ['Content Mapping', 'Multicodes', 'De-duplication']
  },
  {
    id: 'openclaw-bigblue',
    name: 'OpenClaw: BigBlue Portal Agent',
    provider: 'NeoTravel AI Automation',
    description: 'Autonomni digitalni radnik koji skrepuje ponude sa portala BigBlue. Simulacija browsera.',
    icon: <Cpu size={24} />,
    status: 'testing',
    category: 'automation',
    color: '#8b5cf6',
    metrics: { latency: 8500, uptime: 95.5, successRate: 99.0 },
    features: ['Web Scraping', 'Browser Automation', 'Portal Entry']
  }
];

export const PartnerHubView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'monitoring' | 'watchdog'>('overview');
  const [filterCategory, setFilterCategory] = useState<'all' | string>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState('');

  const filtered = useMemo(() => {
    return CONNECTIONS.filter(c => {
      const matchCategory = filterCategory === 'all' || c.category === filterCategory;
      const matchSearch = c.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          c.provider.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCategory && matchSearch;
    });
  }, [filterCategory, searchQuery]);

  return (
    <div className="partner-hub-container">
      {/* Header Section */}
      <div style={{ marginBottom: '40px' }}>
        <h2 style={{ fontSize: '32px', fontWeight: '900', marginBottom: '8px', letterSpacing: '-0.5px' }}>Partner Integrations</h2>
        <p style={{ opacity: 0.5, fontSize: '14px' }}>Upravljajte globalnim hub-om svih API konekcija platforme NeoTravel.</p>
      </div>

      {/* Control Bar */}
      <div className="glass-card" style={{ padding: '16px', marginBottom: '32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '24px' }}>
        <div style={{ display: 'flex', gap: '8px' }}>
          {['all', 'flights', 'supplier', 'mapping', 'automation'].map(cat => (
            <button
              key={cat}
              onClick={() => setFilterCategory(cat)}
              className={`filter-tag ${filterCategory === cat ? 'active' : ''}`}
            >
              {cat.toUpperCase()}
            </button>
          ))}
        </div>

        <div style={{ flex: 1, position: 'relative' }}>
          <Search size={16} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', opacity: 0.4 }} />
          <input 
            type="text" 
            placeholder="Pretraži provajdere ili sisteme..." 
            className="search-input-alt"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div style={{ display: 'flex', gap: '8px' }}>
           <button className={`view-toggle ${viewMode === 'grid' ? 'active' : ''}`} onClick={() => setViewMode('grid')}><LayoutGrid size={18} /></button>
           <button className={`view-toggle ${viewMode === 'list' ? 'active' : ''}`} onClick={() => setViewMode('list')}><List size={18} /></button>
        </div>
      </div>

      {/* Grid View */}
      <AnimatePresence mode="wait">
        <motion.div 
          layout
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className={viewMode === 'grid' ? "integrations-grid" : "integrations-list"}
        >
          {filtered.map(conn => (
            <motion.div 
              key={conn.id} 
              layout 
              className="glass-card integration-card"
              style={{ padding: '24px', border: '1px solid rgba(0,0,0,0.05)', position: 'relative', overflow: 'hidden' }}
            >
              <div style={{ position: 'absolute', top: 0, right: 0, width: '4px', height: '100%', background: conn.color }} />
              
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
                <div style={{ width: '56px', height: '56px', borderRadius: '14px', background: `${conn.color}10`, color: conn.color, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {conn.icon}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: conn.status === 'active' ? '#10B981' : '#F59E0B' }} />
                  <span style={{ fontSize: '10px', fontWeight: '900', opacity: 0.6 }}>{conn.status.toUpperCase()}</span>
                </div>
              </div>

              <h3 style={{ fontSize: '18px', fontWeight: '800', marginBottom: '4px' }}>{conn.name}</h3>
              <div style={{ fontSize: '11px', fontWeight: '700', color: conn.color, marginBottom: '12px', letterSpacing: '0.5px' }}>{conn.provider}</div>
              
              <p style={{ fontSize: '12px', opacity: 0.6, lineHeight: '1.6', marginBottom: '20px', minHeight: '38px' }}>{conn.description}</p>

              <div className="metrics-row">
                 <div className="metric">
                    <span className="label">LATENCY</span>
                    <span className="value">{conn.metrics.latency}ms</span>
                 </div>
                 <div className="metric">
                    <span className="label">UPTIME</span>
                    <span className="value">{conn.metrics.uptime}%</span>
                 </div>
              </div>

              <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '24px' }}>
                {conn.features.map(f => (
                  <span key={f} style={{ fontSize: '9px', fontWeight: '900', background: 'rgba(0,0,0,0.03)', padding: '4px 8px', borderRadius: '4px', opacity: 0.4 }}>{f}</span>
                ))}
              </div>

              <button className="btn-secondary" style={{ width: '100%', padding: '12px', fontSize: '11px' }}>
                UPRAVLJAJ KONEKCIJOM <ArrowRight size={14} />
              </button>
            </motion.div>
          ))}
        </motion.div>
      </AnimatePresence>

      <style>{`
        .partner-hub-container {
           animation: fadeIn 0.5s ease-out;
        }

        .integrations-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
          gap: 24px;
        }

        .filter-tag {
          padding: 8px 16px;
          border-radius: 12px;
          border: 1px solid rgba(0,0,0,0.05);
          background: white;
          font-size: 10px;
          fontWeight: 900;
          cursor: pointer;
          transition: all 0.2s ease;
          color: rgba(0,0,0,0.4);
        }

        .filter-tag.active {
          background: var(--bordo);
          color: white;
          border-color: var(--bordo);
          box-shadow: 0 4px 12px rgba(128,0,32,0.2);
        }

        .view-toggle {
          width: 40px;
          height: 40px;
          border-radius: 10px;
          border: 1px solid rgba(0,0,0,0.05);
          background: white;
          display: flex;
          alignItems: center;
          justifyContent: center;
          cursor: pointer;
          color: rgba(0,0,0,0.4);
          transition: all 0.2s ease;
        }

        .view-toggle.active {
          background: rgba(128,0,32,0.05);
          color: var(--bordo);
          border-color: rgba(128,0,32,0.1);
        }

        .search-input-alt {
          width: 100%;
          padding: 12px 12px 12px 42px;
          border-radius: 14px;
          border: 1px solid rgba(0,0,0,0.05);
          background: rgba(0,0,0,0.02);
          font-size: 13px;
          outline: none;
          transition: all 0.2s ease;
        }

        .search-input-alt:focus {
          background: white;
          border-color: var(--bordo);
          box-shadow: 0 0 0 4px rgba(128,0,32,0.05);
        }

        .metrics-row {
          display: flex;
          gap: 24px;
          margin-bottom: 20px;
          padding-top: 16px;
          border-top: 1px dashed rgba(0,0,0,0.05);
        }

        .metric {
          display: flex;
          flex-direction: column;
        }

        .metric .label {
          font-size: 8px;
          font-weight: 900;
          opacity: 0.4;
          margin-bottom: 2px;
        }

        .metric .value {
          font-size: 13px;
          font-weight: 800;
        }

        .integration-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 12px 32px rgba(0,0,0,0.08);
          border-color: rgba(128,0,32,0.1) !important;
        }
      `}</style>
    </div>
  );
};
