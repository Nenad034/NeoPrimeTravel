import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Zap, AlertTriangle, Download, Calendar } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface CapacityRecord {
  date: string;
  totalAll: number;
  totalSold: number;
  masterStatus: 'Alotman' | 'Fix' | 'On Request' | 'Stop';
}

interface RoomCapacity {
  hotelId: string;
  hotelName: string;
  roomType: string;
  records: Record<string, CapacityRecord>;
}

// Mocking initial generator for demo
const generateDates = (startDate: Date, days: number) => {
  const dates = [];
  for (let i = 0; i < days; i++) {
    const d = new Date(startDate);
    d.setDate(startDate.getDate() + i);
    dates.push(d);
  }
  return dates;
};

export const InventoryGrid: React.FC<{
  capacities: RoomCapacity[];
  onCapacityEdit: (hotelId: string, room: string, date: Date) => void;
}> = ({ capacities, onCapacityEdit }) => {
  const [viewDate, setViewDate] = useState(new Date('2026-06-20'));
  const daysInView = 12;
  const dates = generateDates(viewDate, daysInView);

  const getStatusClass = (record: CapacityRecord) => {
    if (record.masterStatus === 'Stop') return 'capacity-stop';
    const avail = record.totalAll - record.totalSold;
    if (avail <= 0) return 'capacity-stop';
    if (avail === 1) return 'capacity-critical';
    if (avail === 2) return 'capacity-warning';
    return 'capacity-ok';
  };

  const shiftDays = (days: number) => {
    const next = new Date(viewDate);
    next.setDate(viewDate.getDate() + days);
    setViewDate(next);
  };

  return (
    <div className="ops-grid-container">
      <div className="ops-header">
        <div>
           <div style={{ fontSize: '10px', fontWeight: '900', opacity: 0.5, marginBottom: '4px' }}>PERIOD PREGLEDA</div>
           <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <button onClick={() => shiftDays(-daysInView)} className="glass-card" style={{ padding: '8px', border: 'none' }}><ChevronLeft size={16} /></button>
              <h4 style={{ fontSize: '13px', fontWeight: '900', minWidth: '200px', textAlign: 'center' }}>
                 {dates[0].toLocaleDateString('sr-RS')} - {dates[dates.length-1].toLocaleDateString('sr-RS')}
              </h4>
              <button onClick={() => shiftDays(daysInView)} className="glass-card" style={{ padding: '8px', border: 'none' }}><ChevronRight size={16} /></button>
           </div>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
           <button className="glass-card" style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 16px', border: 'none', fontSize: '11px', fontWeight: '900' }}>
              <Download size={14} /> EXPORT XLSX
           </button>
           <button className="btn-primary" style={{ padding: '8px 20px', fontSize: '11px' }}>
              AZURIRAJ MASOVNO
           </button>
        </div>
      </div>

      <div className="inventory-grid glass-card">
        <table className="inventory-table">
          <thead>
            <tr>
              <th style={{ textAlign: 'left', paddingLeft: '16px', minWidth: '250px' }}>HOTEL / TIP SOBE</th>
              {dates.map(d => (
                <th key={d.toISOString()}>
                   <div style={{ fontSize: '10px' }}>{d.toLocaleDateString('sr-RS', { weekday: 'short' })}</div>
                   <div>{d.getDate()}/{d.getMonth() + 1}</div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {capacities.map(cap => (
              <tr key={`${cap.hotelId}-${cap.roomType}`}>
                <td className="hotel-row-header">
                   <div>{cap.hotelName}</div>
                   <div style={{ fontSize: '9px', fontWeight: '800', opacity: 0.6, color: 'rgba(0,0,0,0.5)' }}>{cap.roomType.toUpperCase()}</div>
                </td>
                {dates.map(date => {
                  const dateStr = date.toISOString().split('T')[0];
                  const rec = cap.records[dateStr] || { date: dateStr, totalAll: 0, totalSold: 0, masterStatus: 'On Request' };
                  const avail = rec.totalAll - rec.totalSold;
                  return (
                    <td key={dateStr}>
                       <div 
                         className={`capacity-cell ${getStatusClass(rec as any)}`}
                         onClick={() => onCapacityEdit(cap.hotelId, cap.roomType, date)}
                       >
                          <div style={{ fontSize: '13px', fontWeight: '900' }}>{rec.masterStatus === 'Stop' ? 'X' : avail}</div>
                          <div style={{ fontSize: '10px', opacity: 0.7 }}>{rec.totalSold}</div>
                       </div>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      <div style={{ display: 'flex', gap: '24px', padding: '12px', background: 'rgba(0,0,0,0.02)', borderRadius: '10px' }}>
         {[
           { label: 'Stop Sale / Nema kvote', class: 'capacity-stop' },
           { label: 'Kritično (1)', class: 'capacity-critical' },
           { label: 'Upozorenje (2)', class: 'capacity-warning' },
           { label: 'Slobodno (3+)', class: 'capacity-ok' }
         ].map(legend => (
           <div key={legend.label} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ width: '12px', height: '12px', borderRadius: '3px' }} className={legend.class} />
              <span style={{ fontSize: '10px', fontWeight: '800', opacity: 0.6 }}>{legend.label.toUpperCase()}</span>
           </div>
         ))}
      </div>
    </div>
  );
};
