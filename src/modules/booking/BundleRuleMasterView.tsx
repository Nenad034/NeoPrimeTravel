import React, { useState, useEffect } from 'react';
import { Plus, Check, X, Shield, Activity, Save, Trash2, Edit2, RotateCcw } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { BundleRuleService } from './BundleRuleService';

export const BundleRuleMasterView: React.FC = () => {
  const [showCreate, setShowCreate] = useState(false);
  const [rules, setRules] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // Form State
  const [newRule, setNewRule] = useState({
    name: '',
    discountType: 'PERCENTAGE',
    value: '',
    types: ['HOTEL', 'FLIGHT']
  });

  const loadRules = async () => {
    setLoading(true);
    const data = await BundleRuleService.fetchAllRules();
    setRules(data);
    setLoading(false);
  };

  useEffect(() => {
    loadRules();
  }, []);

  const handleSave = async () => {
    if (!newRule.name || !newRule.value) return;
    setIsSaving(true);
    
    const props = {
      name: newRule.name,
      requiredItemTypes: newRule.types,
      discountType: newRule.discountType as any,
      discountPercentage: newRule.discountType === 'PERCENTAGE' ? Number(newRule.value) : undefined,
      discountFixedAmount: newRule.discountType === 'FIXED_AMOUNT' ? Number(newRule.value) : undefined,
      isActive: true,
      priority: 5
    };

    const result = await BundleRuleService.saveRuleToDb(props as any);
    if (result.isSuccess()) {
      await loadRules();
      setShowCreate(false);
      setNewRule({ name: '', discountType: 'PERCENTAGE', value: '', types: ['HOTEL', 'FLIGHT'] });
    }
    setIsSaving(false);
  };

  const handleApprove = async (id: string) => {
    const result = await BundleRuleService.approveRule(id, 'Admin');
    if (result.isSuccess()) {
      loadRules();
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2 style={{ fontSize: '24px', fontWeight: '900' }}>Bundle Rule Master</h2>
          <p style={{ opacity: 0.6, fontSize: '13px' }}>Definišite automatske i ručne popuste za pakete i usluge.</p>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button className="glass-card" onClick={loadRules} style={{ width: '40px', height: '40px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', border: 'none' }}>
            <RotateCcw size={16} className={loading ? 'animate-spin' : ''} />
          </button>
          <button className="btn-primary" onClick={() => setShowCreate(true)} style={{ padding: '12px 24px' }}>
             <Plus size={16} /> NOVO PRAVILO
          </button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(400px, 1fr))', gap: '24px' }}>
        {loading && rules.length === 0 ? (
          <div style={{ padding: '40px', textAlign: 'center', width: '100%', opacity: 0.5 }}>Učitavanje pravila iz baze...</div>
        ) : (
          rules.map(rule => (
            <div key={rule.id} className="glass-card" style={{ padding: '24px', position: 'relative' }}>
               {!rule.isApproved && (
                 <div style={{ position: 'absolute', top: '16px', right: '16px', fontSize: '9px', fontWeight: '900', background: 'var(--bordo)', color: 'white', padding: '4px 8px', borderRadius: '4px' }}>NA ČEKANJU</div>
               )}
               <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                  <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'rgba(128,0,32,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                     <Shield size={20} color="var(--bordo)" />
                  </div>
                  <div>
                     <h4 style={{ fontSize: '15px', fontWeight: '800' }}>{rule.name}</h4>
                     <div style={{ display: 'flex', gap: '4px', marginTop: '4px' }}>
                        {rule.requiredTypes.map((t: string) => (
                          <span key={t} style={{ fontSize: '8px', fontWeight: '900', background: 'rgba(0,0,0,0.05)', padding: '2px 6px', borderRadius: '3px' }}>{t}</span>
                        ))}
                     </div>
                  </div>
               </div>
               <p style={{ fontSize: '12px', opacity: 0.6, marginBottom: '20px' }}>
                 Popust: <strong>{rule.calculateDiscount(100)}% (procenjeno na bazu 100)</strong> | Prioritet: {rule.priority}
               </p>
               <div style={{ display: 'flex', gap: '8px' }}>
                  {!rule.isApproved ? (
                    <button className="btn-primary" onClick={() => handleApprove(rule.id)} style={{ flex: 1, fontSize: '10px', padding: '10px' }}>ODOBRI</button>
                  ) : (
                    <button className="glass-card" style={{ flex: 1, fontSize: '10px', padding: '10px', border: 'none' }}>AKTIVNO</button>
                  )}
                  <button className="glass-card" style={{ padding: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', border: 'none' }}><Trash2 size={14} /></button>
               </div>
            </div>
          ))
        )}
      </div>

      <AnimatePresence>
        {showCreate && (
          <div className="wizard-overlay" onClick={() => setShowCreate(false)}>
            <motion.div 
               className="capacity-wizard" 
               onClick={e => e.stopPropagation()}
               initial={{ scale: 0.9, opacity: 0 }}
               animate={{ scale: 1, opacity: 1 }}
               exit={{ scale: 0.9, opacity: 0 }}
            >
               <h3 style={{ fontSize: '18px', fontWeight: '900', marginBottom: '24px' }}>Kreiraj Novo Pravilo</h3>
               
               <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  <div>
                    <label style={{ fontSize: '11px', fontWeight: '900', opacity: 0.5 }}>NAZIV PRAVILA</label>
                    <input 
                      type="text" 
                      value={newRule.name}
                      onChange={e => setNewRule({...newRule, name: e.target.value})}
                      placeholder="Primer: Last Minute Hurgada" 
                      style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid rgba(0,0,0,0.1)', marginTop: '4px', outline: 'none' }} 
                    />
                  </div>
                  
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                     <div>
                        <label style={{ fontSize: '11px', fontWeight: '900', opacity: 0.5 }}>TIP POPUSTA</label>
                        <select 
                          value={newRule.discountType}
                          onChange={e => setNewRule({...newRule, discountType: e.target.value})}
                          style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid rgba(0,0,0,0.1)', marginTop: '4px' }}
                        >
                           <option value="PERCENTAGE">Procenat (%)</option>
                           <option value="FIXED_AMOUNT">Fiksni iznos (€)</option>
                        </select>
                     </div>
                     <div>
                        <label style={{ fontSize: '11px', fontWeight: '900', opacity: 0.5 }}>IZNOS</label>
                        <input 
                          type="number" 
                          value={newRule.value}
                          onChange={e => setNewRule({...newRule, value: e.target.value})}
                          placeholder="npr. 5" 
                          style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid rgba(0,0,0,0.1)', marginTop: '4px' }} 
                        />
                     </div>
                  </div>

                  <button 
                    className="btn-primary" 
                    onClick={handleSave}
                    disabled={isSaving}
                    style={{ marginTop: '20px', padding: '14px' }}
                  >
                    {isSaving ? 'ČUVANJE...' : 'SAČUVAJ PRAVILO'}
                  </button>
               </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
