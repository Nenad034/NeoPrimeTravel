import React, { useState, useMemo } from 'react';
import { InventoryGrid } from './InventoryGrid';
import { FileText, Download, Users, Zap, TrendingUp, Calendar, Search } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import './OperationalIntelligence.css';

// Mocked Hotels for Demo
const MOCK_HOTELS = [
  { id: 'h-1', name: 'Rixos Premium Magawish', location: 'Hurghada, Egypt', rooms: ['Superior Suite', 'Pool Villa'] },
  { id: 'h-2', name: 'Steigenberger ALDAU Beach', location: 'Hurghada, Egypt', rooms: ['Standard Sea View', 'Family Room'] },
  { id: 'h-4', name: 'Baron Palace Sahl Hasheesh', location: 'Sahl Hasheesh, Egypt', rooms: ['Swim-up Room', 'Palace Suite'] }
];

export const OperationalReportsView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'inventory' | 'rooming' | 'stats'>('inventory');
  const [searchTerm, setSearchTerm] = useState('');

  // Initial capacity setup
  const initialCapacities = useMemo(() => {
    const caps: any[] = [];
    MOCK_HOTELS.forEach(hotel => {
      hotel.rooms.forEach(room => {
        const records: any = {};
        const start = new Date('2026-06-01');
        for (let i = 0; i < 90; i++) {
          const d = new Date(start);
          d.setDate(start.getDate() + i);
          const dateStr = d.toISOString().split('T')[0];
          const sold = Math.floor(Math.random() * 4);
          const all = (i % 10 === 0) ? sold : (sold + Math.floor(Math.random() * 5));
          records[dateStr] = {
            date: dateStr,
            totalAll: all,
            totalSold: sold,
            masterStatus: all <= sold ? 'Stop' : 'Alotman'
          };
        }
        caps.push({ hotelId: hotel.id, hotelName: hotel.name, roomType: room, records });
      });
    });
    return caps;
  }, []);

  const [capacities, setCapacities] = useState(initialCapacities);

  const filteredCapacities = useMemo(() => {
    if (!searchTerm) return capacities;
    return capacities.filter(c => 
      c.hotelName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.roomType.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [capacities, searchTerm]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2 style={{ fontSize: '24px', fontWeight: '900' }}>Operational Intelligence</h2>
          <p style={{ opacity: 0.6, fontSize: '13px' }}>Upravljanje inventarom, rooming listama i popunjenošću u realnom vremenu.</p>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <div className="glass-card" style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 16px', border: '1px solid rgba(0,0,0,0.05)' }}>
            <Search size={16} opacity={0.5} />
            <input 
               type="text" 
               placeholder="Pretraži hotel..." 
               value={searchTerm}
               onChange={(e) => setSearchTerm(e.target.value)}
               style={{ border: 'none', background: 'transparent', fontSize: '11px', outline: 'none', width: '200px' }}
            />
          </div>
        </div>
      </div>

      <div className="ops-tabs">
        <div className={`ops-tab ${activeTab === 'inventory' ? 'active' : ''}`} onClick={() => setActiveTab('inventory')}>
           <Zap size={14} style={{ marginRight: '8px' }} /> INVENTAR & KVOTE
        </div>
        <div className={`ops-tab ${activeTab === 'rooming' ? 'active' : ''}`} onClick={() => setActiveTab('rooming')}>
           <Users size={14} style={{ marginRight: '8px' }} /> ROOMING LISTA
        </div>
        <div className={`ops-tab ${activeTab === 'stats' ? 'active' : ''}`} onClick={() => setActiveTab('stats')}>
           <TrendingUp size={14} style={{ marginRight: '8px' }} /> STATISTIKA PRODAJE
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
           key={activeTab}
           initial={{ opacity: 0, x: 20 }}
           animate={{ opacity: 1, x: 0 }}
           exit={{ opacity: 0, x: -20 }}
           transition={{ duration: 0.2 }}
        >
           {activeTab === 'inventory' && (
             <InventoryGrid 
               capacities={filteredCapacities}
               onCapacityEdit={(hId, room, date) => console.log('Edit Capacity', hId, room, date)}
             />
           )}

           {activeTab === 'rooming' && (
             <div className="glass-card" style={{ padding: '60px', textAlign: 'center' }}>
                <Users size={48} opacity={0.1} style={{ margin: '0 auto 20px' }} />
                <h3 style={{ fontSize: '16px', fontWeight: '900' }}>Rooming Logika (U pripremi)</h3>
                <p style={{ fontSize: '12px', opacity: 0.6 }}>Ovaj modul će prikazivati spiskove putnika i omogućiti bulk slanje hotelu.</p>
             </div>
           )}

           {activeTab === 'stats' && (
             <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                {[
                  { label: 'Popularnost Hotela', value: '78%', trend: '+4%', color: '#3B82F6' },
                  { label: 'Prosek Noćenja', value: '9.4', trend: 'Stabilno', color: '#10B981' }
                ].map(stat => (
                  <div key={stat.label} className="glass-card" style={{ padding: '24px' }}>
                     <div style={{ fontSize: '10px', fontWeight: '900', opacity: 0.5 }}>{stat.label.toUpperCase()}</div>
                     <div style={{ fontSize: '24px', fontWeight: '900', marginTop: '4px' }}>{stat.value}</div>
                     <div style={{ fontSize: '10px', color: stat.color, fontWeight: '900', marginTop: '8px' }}>{stat.trend}</div>
                  </div>
                ))}
             </div>
           )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};
