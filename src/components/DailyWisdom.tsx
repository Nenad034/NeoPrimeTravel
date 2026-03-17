import React, { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Plus, X } from 'lucide-react';

interface Wisdom {
    text: string;
    author: string;
    role: string;
}

const wisdoms: Wisdom[] = [
    { text: "Nema ništa izvan tebe što ti može ikada dopustiti da postaneš bolji, jači, bogatiji, brži ili pametniji. Sve je unutra.", author: "Miyamoto Musashi", role: "Legendardni Mačevalac" },
    { text: "Sreća tvog života zavisi od kvaliteta tvojih misli.", author: "Marko Aurelije", role: "Rimski Imperator" },
    { text: "Nije da imamo malo vremena, već da ga mnogo gubimo.", author: "Seneka", role: "Stoički Filozof" },
    { text: "Ako želite da saznate tajne univerzuma, razmišljajte o energiji, frekvenciji i vibraciji.", author: "Nikola Tesla", role: "Vizionar" },
    { text: "Vreme je ograničeno, zato ga ne trošite živeći tuđi život.", author: "Steve Jobs", role: "Inovator" },
    { text: "Sve što vidimo je perspektiva, a ne istina.", author: "Marko Aurelije", role: "Filozof" },
    { text: "Najbolja osveta je ne biti poput onoga ko je naneo nepravdu.", author: "Marko Aurelije", role: "Rimski Car" },
    { text: "Onaj ko je pobedio sebe je moćniji od onoga ko je pobedio hiljadu ljudi u bici.", author: "Buda", role: "Duhovni Učitelj" },
    { text: "Mašta je važnija od znanja.", author: "Albert Einstein", role: "Fizičar" },
    { text: "Jednom kada upoznaš Put, videćeš ga u svim stvarima.", author: "Miyamoto Musashi", role: "Mačevalac" },
    { text: "Priroda ne žuri, a ipak je sve postignuto.", author: "Lao Ce", role: "Filozof" }
];

interface DailyWisdomProps {
    isDark: boolean;
}

const DailyWisdom: React.FC<DailyWisdomProps> = ({ isDark }) => {
    const [showAll, setShowAll] = useState(false);

    const wisdomLogic = useMemo(() => {
        const now = new Date();
        const startOfYear = new Date(now.getFullYear(), 0, 0);
        const diff = (now as any) - (startOfYear as any);
        const oneDay = 1000 * 60 * 60 * 24;
        const dayOfYear = Math.floor(diff / oneDay);
        const current = wisdoms[dayOfYear % wisdoms.length];
        const next7 = [];
        for (let i = 1; i <= 7; i++) {
            next7.push(wisdoms[(dayOfYear + i) % wisdoms.length]);
        }
        return { current, next7 };
    }, []);

    const { current: todayWisdom, next7: upcomingWisdoms } = wisdomLogic;

    return (
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', overflow: 'hidden', height: '100%' }}>
            <div style={{
                background: isDark ? 'rgba(59, 130, 246, 0.1)' : 'rgba(128, 0, 32, 0.1)',
                width: '20px', height: '20px', borderRadius: '4px',
                display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0
            }}>
                <Sparkles size={10} color={isDark ? '#3B82F6' : '#800020'} />
            </div>

            <span style={{
                fontSize: '10px', fontWeight: '800', textTransform: 'uppercase',
                color: isDark ? '#3B82F6' : '#800020', whiteSpace: 'nowrap', opacity: 0.8
            }}>
                Misao Dana:
            </span>

            <span style={{
                fontSize: '11px', fontWeight: '500', color: isDark ? '#fff' : '#333',
                whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                maxWidth: '300px', opacity: 0.9, fontStyle: 'italic'
            }}>
                "{todayWisdom.text}"
            </span>

            <span style={{
                fontSize: '10px', fontWeight: '700', color: isDark ? '#3B82F6' : '#800020',
                whiteSpace: 'nowrap', opacity: 0.7
            }}>
                — {todayWisdom.author}
            </span>

            <button 
                onClick={() => setShowAll(!showAll)}
                style={{
                    background: 'transparent', border: 'none', cursor: 'pointer',
                    color: isDark ? '#3B82F6' : '#800020', display: 'flex', alignItems: 'center'
                }}
            >
                <Plus size={12} />
            </button>

            <AnimatePresence>
                {showAll && (
                    <>
                        <motion.div 
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            onClick={() => setShowAll(false)}
                            style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(2px)', zIndex: 10000 }}
                        />
                        <motion.div 
                            initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 50 }}
                            style={{
                                position: 'fixed', bottom: '60px', left: '50%', transform: 'translateX(-50%)',
                                width: '400px', background: isDark ? '#1e1e1e' : '#fff',
                                border: `1px solid ${isDark ? '#333' : '#e2e8f0'}`, borderRadius: '12px',
                                padding: '20px', zIndex: 10001, boxShadow: '0 20px 40px rgba(0,0,0,0.3)'
                            }}
                        >
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px' }}>
                                <h4 style={{ margin: 0, fontSize: '13px', fontWeight: 900, color: isDark ? '#3B82F6' : '#800020' }}>NARODNE MUDROSTI</h4>
                                <X size={16} onClick={() => setShowAll(false)} style={{ cursor: 'pointer', opacity: 0.5 }} />
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                {upcomingWisdoms.map((w, i) => (
                                    <div key={i} style={{ borderBottom: `1px solid ${isDark ? '#333' : '#f1f5f9'}`, paddingBottom: '8px' }}>
                                        <p style={{ margin: '0 0 4px', fontSize: '12px', fontStyle: 'italic' }}>"{w.text}"</p>
                                        <span style={{ fontSize: '10px', fontWeight: 700, color: isDark ? '#3B82F6' : '#800020' }}>{w.author}</span>
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
};

export default DailyWisdom;
