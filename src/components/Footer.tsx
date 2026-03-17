import React, { useState, useEffect, useMemo } from 'react';
import { 
    Clock, 
    Calculator, 
    FileText, 
    Euro,
    RefreshCw,
    ArrowLeftRight,
    Sun,
    X,
    Cloud
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import DailyWisdom from './DailyWisdom';
import { ModernNotepad } from './ModernNotepad';
import { GeometricBrain } from './icons/GeometricBrain';

// --- Types ---
interface FooterProps {
    isDark: boolean;
}

// --- Components ---

const TimeDisplay: React.FC<{ timezone: string }> = ({ timezone }) => {
    const [time, setTime] = useState(new Date());
    useEffect(() => {
        const timer = setInterval(() => setTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    const timeString = useMemo(() => {
        return new Intl.DateTimeFormat('sr-RS', {
            timeZone: timezone,
            hour: '2-digit',
            minute: '2-digit',
            hour12: false
        }).format(time);
    }, [time, timezone]);

    return <span style={{ fontFamily: 'monospace', fontWeight: '800', fontSize: '11px', color: 'inherit' }}>{timeString}</span>;
};

const ToolPanel: React.FC<{
    title: string;
    icon: React.ReactNode;
    onClose: () => void;
    children: React.ReactNode;
    isDark: boolean;
}> = ({ title, icon, onClose, children, isDark }) => (
    <motion.div
        initial={{ opacity: 0, y: 10, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 10, scale: 0.95 }}
        style={{
            position: 'absolute',
            bottom: '50px',
            right: '0',
            width: '320px',
            background: isDark ? 'rgba(30, 41, 59, 0.95)' : '#fff',
            borderRadius: '16px',
            boxShadow: '0 10px 40px rgba(0,0,0,0.3)',
            border: `1px solid ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}`,
            zIndex: 10001,
            overflow: 'hidden',
            backdropFilter: 'blur(10px)'
        }}
    >
        <div style={{
            padding: '12px 16px',
            borderBottom: isDark ? '1px solid rgba(255,255,255,0.05)' : '1px solid rgba(0,0,0,0.05)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            background: isDark ? 'rgba(0,0,0,0.2)' : 'rgba(0,0,0,0.02)'
        }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--bordo)', fontWeight: '800', fontSize: '11px' }}>
                {icon}
                <span style={{ textTransform: 'uppercase', letterSpacing: '1px' }}>{title}</span>
            </div>
            <button
                onClick={onClose}
                style={{ background: 'transparent', border: 'none', color: isDark ? '#94a3b8' : '#64748b', cursor: 'pointer' }}
            >
                <X size={14} />
            </button>
        </div>
        <div style={{ padding: '16px' }}>
            {children}
        </div>
    </motion.div>
);

const CalculatorTool: React.FC<{ isDark: boolean }> = ({ isDark }) => {
    const [expr, setExpr] = useState('');
    const [res, setRes] = useState('0');
    
    const calculate = () => {
        try {
            // eslint-disable-next-line no-eval
            const result = eval(expr.replace(/[^-+*/0-9.()]/g, ''));
            setRes(String(result));
        } catch {
            setRes('Error');
        }
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <input 
                value={expr} 
                onChange={e => setExpr(e.target.value)}
                placeholder="npr. 150 * 1.2"
                style={{ 
                    width: '100%', 
                    background: isDark ? 'rgba(0,0,0,0.2)' : '#f1f5f9', 
                    border: `1px solid ${isDark ? '#3b82f644' : '#ddd'}`, 
                    borderRadius: '8px', 
                    padding: '8px', 
                    color: 'inherit',
                    outline: 'none'
                }}
                onKeyDown={e => e.key === 'Enter' && calculate()}
            />
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '18px', fontWeight: '900', color: 'var(--bordo)' }}>= {res}</span>
                <button onClick={calculate} style={{ padding: '6px 12px', background: 'var(--bordo)', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: '800' }}>Izračunaj</button>
            </div>
        </div>
    );
};

const CurrencyTool: React.FC<{ isDark: boolean }> = ({ isDark }) => {
    const [amount, setAmount] = useState('100');
    const [from, setFrom] = useState('EUR');
    const rates: any = { EUR: 117.2, USD: 108.5, RSD: 1 };
    
    const result = useMemo(() => {
        const amt = parseFloat(amount) || 0;
        const inRsd = amt * rates[from];
        return (inRsd).toFixed(2);
    }, [amount, from]);

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <div style={{ display: 'flex', gap: '8px' }}>
                <input 
                    type="number" 
                    value={amount} 
                    onChange={e => setAmount(e.target.value)}
                    style={{ flex: 1, background: isDark ? 'rgba(0,0,0,0.2)' : '#f1f5f9', border: '1px solid var(--border)', borderRadius: '8px', padding: '8px', color: 'inherit' }}
                />
                <select value={from} onChange={e => setFrom(e.target.value)} style={{ background: isDark ? 'rgba(0,0,0,0.2)' : '#f1f5f9', border: '1px solid var(--border)', borderRadius: '8px', padding: '6px', color: 'inherit' }}>
                    <option>EUR</option>
                    <option>USD</option>
                </select>
            </div>
            <div style={{ background: 'rgba(59,130,246,0.1)', padding: '12px', borderRadius: '8px', textAlign: 'center' }}>
                <span style={{ fontSize: '18px', fontWeight: '900', color: 'var(--bordo)' }}>{result} RSD</span>
            </div>
        </div>
    );
};

const UnitsTool: React.FC<{ isDark: boolean }> = ({ isDark }) => {
    const [val, setVal] = useState('1');
    const [type, setType] = useState('ft-m');
    const res = useMemo(() => {
        const n = parseFloat(val) || 0;
        if (type === 'ft-m') return (n * 0.3048).toFixed(2) + ' m';
        if (type === 'm-ft') return (n / 0.3048).toFixed(2) + ' ft';
        return n;
    }, [val, type]);

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <select value={type} onChange={e => setType(e.target.value)} style={{ width: '100%', background: isDark ? 'rgba(0,0,0,0.2)' : '#f1f5f9', border: '1px solid var(--border)', borderRadius: '8px', padding: '8px', color: 'inherit' }}>
                <option value="ft-m">Feet (ft) → Meters (m)</option>
                <option value="m-ft">Meters (m) → Feet (ft)</option>
            </select>
            <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                <input type="number" value={val} onChange={e => setVal(e.target.value)} style={{ flex: 1, background: isDark ? 'rgba(0,0,0,0.2)' : '#f1f5f9', border: '1px solid var(--border)', borderRadius: '8px', padding: '8px', color: 'inherit' }} />
                <span style={{ fontWeight: 900, color: 'var(--bordo)' }}>= {res}</span>
            </div>
        </div>
    );
};

const WeatherTool: React.FC<{ isDark: boolean }> = ({ isDark }) => {
    const citiesWeather = [
        { name: 'Hurgada', temp: '28°C', icon: <Sun size={14} color="#f59e0b" /> },
        { name: 'Beograd', temp: '16°C', icon: <Cloud size={14} color="#94a3b8" /> },
        { name: 'Dubai', temp: '32°C', icon: <Sun size={14} color="#f59e0b" /> }
    ];
    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {citiesWeather.map(c => (
                <div key={c.name} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px', background: isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.03)', borderRadius: '10px' }}>
                    <span style={{ fontSize: '12px', fontWeight: '800' }}>{c.name}</span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ fontWeight: 700 }}>{c.temp}</span>
                        {c.icon}
                    </div>
                </div>
            ))}
        </div>
    );
};

// --- Footer ---

const Footer: React.FC<FooterProps> = ({ isDark }) => {
    const [activeTool, setActiveTool] = useState<string | null>(null);
    const [isClockExpanded, setIsClockExpanded] = useState(false);
    
    const cities = [
        { name: 'BEG', tz: 'Europe/Belgrade' },
        { name: 'LON', tz: 'Europe/London' },
        { name: 'NYC', tz: 'America/New_York' },
        { name: 'TOK', tz: 'Asia/Tokyo' }
    ];

    const toggleTool = (id: string) => setActiveTool(activeTool === id ? null : id);

    return (
        <div style={{
            position: 'relative',
            height: '38px',
            background: isDark ? 'rgba(15, 23, 42, 0.9)' : 'rgba(255, 255, 255, 0.95)',
            border: `1px solid ${isDark ? 'rgba(59,130,246,0.2)' : 'rgba(0,0,0,0.08)'}`,
            borderRadius: '14px',
            padding: '0 20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            zIndex: 1000,
            boxShadow: '0 10px 40px rgba(0,0,0,0.2)',
            backdropFilter: 'blur(20px)',
            userSelect: 'none',
            transition: 'all 0.3s',
            width: '100%'
        }}>
            {/* Left: Branding & World Clocks */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '24px', borderRight: `1px solid ${isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'}`, paddingRight: '20px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--bordo)' }}>
                    <GeometricBrain size={18} color="var(--bordo)" />
                    <span style={{ fontSize: '10px', fontWeight: '900', letterSpacing: '2px', opacity: 0.8 }}>NEO</span>
                </div>

                <div 
                    onClick={() => setIsClockExpanded(!isClockExpanded)}
                    style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', padding: '4px 8px', borderRadius: '8px', background: isClockExpanded ? 'rgba(0,0,0,0.05)' : 'transparent' }}
                >
                    <Clock size={14} color="var(--bordo)" style={{ opacity: 0.7 }} />
                    <div style={{ display: 'flex', gap: '4px', alignItems: 'baseline' }}>
                        <span style={{ fontSize: '8px', fontWeight: '900', color: 'var(--bordo)', opacity: 0.6 }}>BEG</span>
                        <TimeDisplay timezone="Europe/Belgrade" />
                    </div>
                </div>
                
                <AnimatePresence>
                    {isClockExpanded && (
                        <motion.div
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -10 }}
                            style={{ display: 'flex', gap: '14px' }}
                        >
                            {cities.slice(1).map(c => (
                                <div key={c.name} style={{ display: 'flex', gap: '4px', alignItems: 'baseline' }}>
                                    <span style={{ fontSize: '8px', fontWeight: '900', color: 'var(--bordo)', opacity: 0.6 }}>{c.name}</span>
                                    <TimeDisplay timezone={c.tz} />
                                </div>
                            ))}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Middle: Daily Wisdom */}
            <div style={{ flex: 1, padding: '0 24px', overflow: 'hidden' }}>
                <DailyWisdom isDark={isDark} />
            </div>

            {/* Right: Toolbox */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', borderLeft: `1px solid ${isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'}`, paddingLeft: '20px' }}>
                
                <div style={{ display: 'flex', alignItems: 'center', gap: '2px' }}>
                    <ToolButton active={activeTool === 'weather'} onClick={() => toggleTool('weather')} icon={<Cloud size={14} />} title="Meteo" />
                    <ToolButton active={activeTool === 'calc'} onClick={() => toggleTool('calc')} icon={<Calculator size={14} />} title="Kalkulator" />
                    <ToolButton active={activeTool === 'currency'} onClick={() => toggleTool('currency')} icon={<Euro size={14} />} title="Kurs" />
                    <ToolButton active={activeTool === 'units'} onClick={() => toggleTool('units')} icon={<ArrowLeftRight size={14} />} title="Konverzija" />
                    <ToolButton active={activeTool === 'notepad'} onClick={() => toggleTool('notepad')} icon={<FileText size={14} />} title="Beleške" />
                </div>

                <div style={{ height: '16px', width: '1px', background: 'rgba(0,0,0,0.05)', margin: '0 8px' }} />
                <div style={{ fontSize: '8px', fontWeight: '900', opacity: 0.4, letterSpacing: '1px', color: 'var(--text-main)' }}>V1.4.2</div>
            </div>

            {/* Tool Panels */}
            <AnimatePresence>
                {activeTool === 'weather' && (
                    <ToolPanel isDark={isDark} title="Vremenska Prognoza" icon={<Cloud size={14} />} onClose={() => setActiveTool(null)}>
                        <WeatherTool isDark={isDark} />
                    </ToolPanel>
                )}
                {activeTool === 'calc' && (
                    <ToolPanel isDark={isDark} title="Poslovni Kalkulator" icon={<Calculator size={14} />} onClose={() => setActiveTool(null)}>
                        <CalculatorTool isDark={isDark} />
                    </ToolPanel>
                )}
                {activeTool === 'currency' && (
                    <ToolPanel isDark={isDark} title="Konvertor Valuta" icon={<Euro size={14} />} onClose={() => setActiveTool(null)}>
                        <CurrencyTool isDark={isDark} />
                    </ToolPanel>
                )}
                {activeTool === 'units' && (
                    <ToolPanel isDark={isDark} title="Pretvaranje Jedinica" icon={<ArrowLeftRight size={14} />} onClose={() => setActiveTool(null)}>
                        <UnitsTool isDark={isDark} />
                    </ToolPanel>
                )}
                {activeTool === 'notepad' && (
                    <ModernNotepad onClose={() => setActiveTool(null)} isDark={isDark} />
                )}
            </AnimatePresence>
        </div>
    );
};

const ToolButton = ({ active, onClick, icon, title }: any) => (
    <motion.button 
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        onClick={onClick}
        title={title}
        style={{
            background: active ? 'var(--bordo)' : 'transparent',
            color: active ? '#fff' : 'var(--bordo)',
            width: '28px', height: '28px', borderRadius: '7px', border: 'none', cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s', opacity: active ? 1 : 0.7
        }}
    >
        {icon}
    </motion.button>
);

export default Footer;
