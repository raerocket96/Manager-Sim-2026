import React from 'react';
import { useGame } from '../context/GameContext';
import { ShieldCheck, Users, Zap, Star, TrendingUp, DollarSign } from 'lucide-react';
import { Card } from './ui/Card';
import { motion } from 'motion/react';

const Staff = () => {
  const { state } = useGame();

  const coaches = state.staff.filter(s => s.role === 'Coach');
  const scouts = state.staff.filter(s => s.role === 'Scout');
  const physios = state.staff.filter(s => s.role === 'Physio');

  return (
    <div className="w-full space-y-10 animate-in fade-in duration-700">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-zinc-900/50 pb-10">
        <div>
          <div className="flex items-center gap-3 mb-4">
            <div 
              className="w-2 h-2 rounded-full animate-pulse"
              style={{ 
                backgroundColor: state.clubProfile?.primaryColor || '#10b981',
                boxShadow: `0 0 10px ${state.clubProfile?.primaryColor || '#10b981'}80`
              }}
            ></div>
            <span className="text-[10px] font-black text-zinc-600 uppercase tracking-[0.4em]">Support Staff</span>
          </div>
          <h2 className="text-6xl font-black tracking-tighter text-white uppercase italic leading-none">
            Coaching<span style={{ color: state.clubProfile?.primaryColor || '#dc2626' }}>Team</span>
          </h2>
          <p className="text-zinc-500 mt-4 font-bold italic text-lg">The experts behind the scenes shaping the future.</p>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <StaffSection title="Coaches" icon={Zap} staff={coaches} color={state.clubProfile?.primaryColor || '#dc2626'} />
        <StaffSection title="Scouts" icon={Users} staff={scouts} color="#3b82f6" />
        <StaffSection title="Physios" icon={ShieldCheck} staff={physios} color="#10b981" />
      </div>

      <Card title="Recruitment" subtitle="Open Positions" badge="Active">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <HireCard role="Assistant Manager" rating={85} wage={15} primaryColor={state.clubProfile?.primaryColor} />
          <HireCard role="Chief Scout" rating={82} wage={12} primaryColor={state.clubProfile?.primaryColor} />
          <HireCard role="Head Physio" rating={88} wage={18} primaryColor={state.clubProfile?.primaryColor} />
        </div>
      </Card>
    </div>
  );
};

const StaffSection = ({ title, icon: Icon, staff, color }: any) => (
  <div className="space-y-6">
    <div className="flex items-center justify-between px-4">
      <div className="flex items-center gap-3">
        <Icon size={18} style={{ color }} />
        <h3 className="text-sm font-black text-white uppercase tracking-widest italic">{title}</h3>
      </div>
      <span className="text-[10px] font-black text-zinc-600 uppercase tracking-widest">{staff.length} Employees</span>
    </div>
    
    <div className="space-y-4">
      {staff.length > 0 ? staff.map((s: any) => (
        <motion.div 
          key={s.id}
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          className="p-5 bg-zinc-900/30 border border-zinc-800/50 rounded-2xl hover:border-zinc-700 transition-all group"
        >
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-zinc-950 rounded-xl flex items-center justify-center font-black text-xs text-zinc-500 border border-zinc-800">
                {s.name.charAt(0)}
              </div>
              <div>
                <p className="text-xs font-black text-white uppercase tracking-tight italic">{s.name}</p>
                <p className="text-[9px] text-zinc-600 font-black uppercase tracking-widest">{s.role}</p>
              </div>
            </div>
            <div className="text-right">
              <div className="flex items-center gap-1 justify-end">
                <Star size={10} className="text-yellow-500" />
                <span className="text-sm font-black text-white italic tracking-tighter">{s.rating}</span>
              </div>
              <p className="text-[9px] text-zinc-600 font-black uppercase tracking-widest">Rating</p>
            </div>
          </div>
          <div className="flex justify-between items-center pt-4 border-t border-zinc-800/50">
            <div className="flex items-center gap-2">
              <DollarSign size={12} className="text-emerald-500" />
              <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">£{s.wage}k / week</span>
            </div>
            <button className="text-[9px] font-black text-red-600 uppercase tracking-widest hover:text-red-500 transition-colors">Fire</button>
          </div>
        </motion.div>
      )) : (
        <div className="p-10 bg-zinc-900/20 border border-dashed border-zinc-800 rounded-2xl text-center">
          <p className="text-[10px] font-black text-zinc-700 uppercase tracking-widest italic">No employees in this category</p>
        </div>
      )}
    </div>
  </div>
);

const HireCard = ({ role, rating, wage, primaryColor }: any) => (
  <div className="p-6 bg-zinc-950/50 border border-zinc-800/50 rounded-2xl hover:border-zinc-700 transition-all group cursor-pointer">
    <div className="flex justify-between items-start mb-6">
      <div>
        <h4 className="text-sm font-black text-white uppercase tracking-tight italic mb-1">{role}</h4>
        <div className="flex items-center gap-2">
          <TrendingUp size={12} className="text-emerald-500" />
          <span className="text-[9px] font-black text-zinc-600 uppercase tracking-widest">Open Position</span>
        </div>
      </div>
      <div className="w-12 h-12 bg-zinc-900 rounded-xl flex items-center justify-center border border-zinc-800">
        <span className="text-lg font-black italic tracking-tighter" style={{ color: primaryColor || '#dc2626' }}>{rating}</span>
      </div>
    </div>
    <div className="flex items-center justify-between">
      <div className="flex flex-col">
        <span className="text-[8px] text-zinc-700 font-black uppercase tracking-widest">Wage Requirement</span>
        <span className="text-xs font-black text-white italic tracking-tighter">£{wage}k / week</span>
      </div>
      <button 
        className="px-4 py-2 text-white text-[9px] font-black uppercase tracking-widest rounded-lg transition-all shadow-lg"
        style={{ 
          backgroundColor: primaryColor || '#dc2626',
          boxShadow: `0 4px 14px 0 ${primaryColor}33`
        }}
      >
        Hire
      </button>
    </div>
  </div>
);

export default Staff;
