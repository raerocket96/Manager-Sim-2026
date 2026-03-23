import React from 'react';
import { useGame } from '../context/GameContext';
import { PoundSterling, TrendingUp, ShieldCheck, Zap, Star, DollarSign, Building2 } from 'lucide-react';
import { Card } from './ui/Card';
import { motion } from 'motion/react';

const Commercial = () => {
  const { state } = useGame();

  const commStrength = state.clubProfile?.commercialStrength || 80;
  const multiplier = commStrength / 100;

  const sponsors = state.databaseYear === 2008 ? [
    { id: 's1', name: 'Global Sportswear', type: 'Kit Supplier', value: Math.round(25 * multiplier), duration: 5, status: 'Active' },
    { id: 's2', name: 'Financial Group', type: 'Main Shirt', value: Math.round(14 * multiplier), duration: 2, status: 'Active' },
    { id: 's3', name: 'Beverage Corp', type: 'Global Partner', value: Math.round(5 * multiplier), duration: 3, status: 'Active' },
  ] : [
    { id: 's1', name: 'Elite Apparel', type: 'Kit Supplier', value: Math.round(75 * multiplier), duration: 10, status: 'Active' },
    { id: 's2', name: 'Tech Solutions', type: 'Main Shirt', value: Math.round(60 * multiplier), duration: 3, status: 'Active' },
    { id: 's3', name: 'Digital Systems', type: 'Sleeve', value: Math.round(20 * multiplier), duration: 3, status: 'Active' },
  ];

  return (
    <div className="w-full space-y-10 animate-in fade-in duration-700">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-zinc-900/50 pb-10">
        <div>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(16,185,129,0.5)]"></div>
            <span className="text-[10px] font-black text-zinc-600 uppercase tracking-[0.4em]">Commercial Operations</span>
          </div>
          <h2 className="text-6xl font-black tracking-tighter text-white uppercase italic leading-none">
            Sponsorship <span style={{ color: state.clubProfile?.primaryColor || '#dc2626' }}>Deals</span>
          </h2>
          <p className="text-zinc-500 mt-4 font-bold italic text-lg">Maximize club revenue to increase PSR headroom.</p>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <Card title="Active Deals" subtitle="Current Partners" badge="3 Active">
            <div className="space-y-4">
              {sponsors.map((s, idx) => (
                <motion.div 
                  key={s.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className="p-6 bg-zinc-950/50 border border-zinc-800/50 rounded-2xl hover:border-zinc-700 transition-all flex items-center justify-between group"
                >
                  <div className="flex items-center gap-6">
                    <div 
                      className="w-16 h-16 bg-zinc-900 rounded-2xl flex items-center justify-center border border-zinc-800 transition-colors"
                      style={{ borderColor: idx === 0 ? `${state.clubProfile?.primaryColor}33` : undefined }}
                    >
                      <Building2 size={24} className="text-zinc-600 group-hover:text-white transition-colors" style={{ color: idx === 0 ? state.clubProfile?.primaryColor : undefined }} />
                    </div>
                    <div>
                      <h4 className="text-xl font-black text-white uppercase italic tracking-tighter mb-1">{s.name}</h4>
                      <p className="text-[10px] text-zinc-500 font-black uppercase tracking-widest">{s.type}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-12">
                    <div className="text-right">
                      <p className="text-2xl font-black text-emerald-500 italic tracking-tighter">£{s.value}M</p>
                      <p className="text-[9px] text-zinc-600 font-black uppercase tracking-widest">Per Year</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xl font-black text-white italic tracking-tighter">{s.duration} YRS</p>
                      <p className="text-[9px] text-zinc-600 font-black uppercase tracking-widest">Remaining</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </Card>

          <Card title="New Opportunities" subtitle="Potential Partners" badge="2 Available">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <OpportunityCard name="Aviation Global" type="Stadium Naming Rights" value={Math.round(25 * multiplier)} duration={10} />
              <OpportunityCard name="Industrial Corp" type="Training Kit" value={Math.round(12 * multiplier)} duration={3} />
            </div>
          </Card>
        </div>

        <div className="space-y-8">
          <Card title="Financial Status" subtitle="PSR Analysis" badge="Live">
            <div className="space-y-6">
              <div className="p-5 bg-zinc-950/50 border border-zinc-800/50 rounded-2xl">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">PSR Headroom</span>
                  <span className={`text-xl font-black italic tracking-tighter ${state.psrHeadroom > 50 ? 'text-emerald-500' : 'text-yellow-500'}`}>£{state.psrHeadroom}M</span>
                </div>
                <div className="h-2 bg-zinc-900 rounded-full overflow-hidden border border-zinc-800/50">
                  <div className={`h-full transition-all duration-1000 ${state.psrHeadroom > 50 ? 'bg-emerald-500' : 'bg-yellow-500'}`} style={{ width: `${Math.min(100, state.psrHeadroom)}%` }}></div>
                </div>
              </div>

              <div className="space-y-4">
                <FinanceRow label="Gate Receipts" value="£4.2M" trend={5} />
                <FinanceRow label="Merchandise" value="£2.8M" trend={12} />
                <FinanceRow label="TV Rights" value="£15.5M" trend={0} />
                <FinanceRow label="Wage Costs" value="-£8.5M" trend={-2} />
              </div>

              <button 
                className="w-full py-4 text-white text-[10px] font-black uppercase tracking-widest rounded-xl transition-all shadow-lg"
                style={{ backgroundColor: state.clubProfile?.primaryColor || '#dc2626' }}
              >
                Generate Financial Report
              </button>
            </div>
          </Card>

          <Card title="Market Value" subtitle="Global Reach" badge="Top 3">
            <div className="flex flex-col items-center py-6">
              <div 
                className="w-32 h-32 bg-zinc-900 rounded-full flex items-center justify-center relative mb-6 border-4"
                style={{ borderColor: `${state.clubProfile?.primaryColor}33` }}
              >
                <div 
                  className="absolute inset-0 border-4 rounded-full animate-ping opacity-20"
                  style={{ borderColor: state.clubProfile?.primaryColor }}
                ></div>
                <Star size={48} style={{ color: state.clubProfile?.primaryColor }} />
              </div>
              <h4 className="text-2xl font-black text-white uppercase italic tracking-tighter mb-2">World Class</h4>
              <p className="text-zinc-500 text-center text-xs font-bold italic px-6">{state.clubProfile?.name} remains one of the most valuable brands in sport.</p>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

const OpportunityCard = ({ name, type, value, duration }: any) => (
  <div className="p-6 bg-zinc-900/50 border border-zinc-800/50 rounded-2xl hover:border-emerald-900/30 transition-all group cursor-pointer">
    <div className="flex justify-between items-start mb-6">
      <div>
        <h4 className="text-lg font-black text-white uppercase italic tracking-tighter mb-1">{name}</h4>
        <p className="text-[9px] text-zinc-600 font-black uppercase tracking-widest">{type}</p>
      </div>
      <div className="w-10 h-10 bg-emerald-900/20 rounded-xl flex items-center justify-center border border-emerald-500/20">
        <TrendingUp size={18} className="text-emerald-500" />
      </div>
    </div>
    <div className="flex items-center justify-between">
      <div className="flex flex-col">
        <span className="text-[8px] text-zinc-700 font-black uppercase tracking-widest">Offer</span>
        <span className="text-xl font-black text-emerald-500 italic tracking-tighter">£{value}M / yr</span>
      </div>
      <button className="px-4 py-2 bg-zinc-950 hover:bg-zinc-900 text-white text-[9px] font-black uppercase tracking-widest rounded-lg transition-all border border-zinc-800">View Details</button>
    </div>
  </div>
);

const FinanceRow = ({ label, value, trend }: any) => (
  <div className="flex justify-between items-center p-3 bg-zinc-900/20 rounded-xl border border-zinc-800/30">
    <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">{label}</span>
    <div className="flex items-center gap-3">
      <span className="text-xs font-black text-white italic tracking-tighter">{value}</span>
      {trend !== 0 && (
        <span className={`text-[9px] font-black ${trend > 0 ? 'text-emerald-500' : 'text-red-500'}`}>
          {trend > 0 ? '+' : ''}{trend}%
        </span>
      )}
    </div>
  </div>
);

export default Commercial;
