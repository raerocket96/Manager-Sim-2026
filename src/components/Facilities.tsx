import React from 'react';
import { useGame } from '../context/GameContext';
import { Building2, Home, GraduationCap, TrendingUp, ArrowUpCircle, PoundSterling, ShieldCheck, Zap } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Card } from './ui/Card';

const Facilities: React.FC = () => {
  const { state, dispatch } = useGame();

  const handleUpgrade = (type: 'stadium' | 'training' | 'youth') => {
    dispatch({ type: 'UPGRADE_FACILITY', payload: type });
  };

  const facilityData = [
    {
      id: 'stadium',
      name: state.clubProfile?.stadium || 'Stadium',
      level: state.facilities.stadium,
      icon: <Home size={28} />,
      color: `text-[${state.clubProfile?.primaryColor || '#ef4444'}]`,
      bgColor: `${state.clubProfile?.primaryColor || '#ef4444'}1a`,
      borderColor: `border-[${state.clubProfile?.primaryColor || '#ef4444'}]/20`,
      description: 'Increases weekly income from ticket sales and fans.',
      effect: `+£${state.facilities.stadium * 5}M per week`,
      cost: state.facilities.stadium * 50
    },
    {
      id: 'training',
      name: `${state.clubProfile?.shortName || 'Club'} Training Ground`,
      level: state.facilities.training,
      icon: <TrendingUp size={28} />,
      color: 'text-emerald-500',
      bgColor: 'bg-emerald-500/10',
      borderColor: 'border-emerald-500/20',
      description: 'Improves player development and recovery.',
      effect: `+${state.facilities.training * 5}% development rate`,
      cost: state.facilities.training * 50
    },
    {
      id: 'youth',
      name: 'Youth Academy Facilities',
      level: state.facilities.youth,
      icon: <GraduationCap size={28} />,
      color: 'text-blue-500',
      bgColor: 'bg-blue-500/10',
      borderColor: 'border-blue-500/20',
      description: 'Higher chance of finding top talents.',
      effect: `+${state.facilities.youth * 10} potential on regens`,
      cost: state.facilities.youth * 50
    }
  ];

  return (
    <div className="space-y-8">
      {/* Financial Status Header */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-zinc-900/50 backdrop-blur-md border border-zinc-800 p-6 rounded-2xl flex items-center justify-between group hover:border-red-500/30 transition-all">
          <div>
            <p className="text-[10px] text-zinc-500 uppercase font-black tracking-widest mb-1">PSR Headroom</p>
            <p className="text-3xl font-black text-emerald-500 italic tracking-tighter">£{state.psrHeadroom}M</p>
          </div>
          <div className="w-14 h-14 bg-emerald-600/10 rounded-2xl flex items-center justify-center border border-emerald-500/20 shadow-[0_0_15px_rgba(16,185,129,0.1)]">
            <PoundSterling className="text-emerald-500" size={28} />
          </div>
        </div>
        
        <div className="bg-zinc-900/50 backdrop-blur-md border border-zinc-800 p-6 rounded-2xl flex items-center justify-between group hover:border-red-500/30 transition-all">
          <div>
            <p className="text-[10px] text-zinc-500 uppercase font-black tracking-widest mb-1">Club Value</p>
            <p className="text-3xl font-black text-white italic tracking-tighter">£4.2B</p>
          </div>
          <div className="w-14 h-14 bg-zinc-800 rounded-2xl flex items-center justify-center border border-zinc-700">
            <Building2 className="text-zinc-400" size={28} />
          </div>
        </div>

        <div className="bg-zinc-900/50 backdrop-blur-md border border-zinc-800 p-6 rounded-2xl flex items-center justify-between group hover:border-red-500/30 transition-all">
          <div>
            <p className="text-[10px] text-zinc-500 uppercase font-black tracking-widest mb-1">Facility Level</p>
            <p className="text-3xl font-black text-white italic tracking-tighter">Elite</p>
          </div>
          <div className="w-14 h-14 bg-blue-600/10 rounded-2xl flex items-center justify-center border border-blue-500/20">
            <ShieldCheck className="text-blue-500" size={28} />
          </div>
        </div>
      </div>

      <Card title="Club Facilities" subtitle="Invest in the club's future" icon={Building2}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <AnimatePresence mode="popLayout">
            {facilityData.map((facility, idx) => (
              <motion.div
                key={facility.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: idx * 0.1 }}
                className="bg-zinc-950 border border-zinc-800 rounded-3xl overflow-hidden flex flex-col group hover:border-zinc-700 transition-all duration-300 shadow-2xl"
              >
                <div className="p-8 flex-1 space-y-8">
                  <div className="flex justify-between items-start">
                    <div 
                      className={facility.bgColor.startsWith('bg-') 
                        ? `w-16 h-16 ${facility.bgColor} rounded-2xl flex items-center justify-center border ${facility.borderColor} shadow-lg group-hover:scale-110 transition-transform` 
                        : `w-16 h-16 rounded-2xl flex items-center justify-center border shadow-lg group-hover:scale-110 transition-transform`
                      }
                      style={{ 
                        backgroundColor: facility.bgColor.startsWith('bg-') ? undefined : facility.bgColor,
                        borderColor: facility.borderColor.startsWith('border-') ? undefined : facility.borderColor.split('/')[0]
                      }}
                    >
                      <span className={facility.color.startsWith('text-') ? facility.color : undefined} style={facility.color.startsWith('text-') ? undefined : { color: facility.color.match(/\[(.*?)\]/)?.[1] }}>{facility.icon}</span>
                    </div>
                    <div className="bg-zinc-900 px-4 py-1.5 rounded-full border border-zinc-800">
                      <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Level {facility.level}</span>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <h3 className="text-2xl font-black text-white uppercase tracking-tighter italic group-hover:text-red-500 transition-colors" style={{ '--hover-color': state.clubProfile?.primaryColor } as any}>{facility.name}</h3>
                    <p className="text-zinc-500 text-xs leading-relaxed font-medium">{facility.description}</p>
                  </div>

                  <div className="p-4 bg-zinc-900 rounded-2xl border border-zinc-800/50">
                    <div className="flex items-center gap-2 mb-2">
                      <Zap size={12} className="text-yellow-500" />
                      <p className="text-[8px] text-zinc-600 uppercase font-black tracking-widest">Current Effect</p>
                    </div>
                    <p className="text-sm font-black text-white italic">{facility.effect}</p>
                  </div>
                </div>

                <div className="p-6 bg-zinc-900/50 border-t border-zinc-800">
                  <button
                    onClick={() => handleUpgrade(facility.id as any)}
                    disabled={state.psrHeadroom < facility.cost}
                    className={`w-full py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-3 transition-all border ${
                      state.psrHeadroom >= facility.cost 
                        ? 'text-white shadow-lg' 
                        : 'bg-zinc-950 text-zinc-700 border-zinc-800 cursor-not-allowed'
                    }`}
                    style={state.psrHeadroom >= facility.cost ? { 
                      backgroundColor: state.clubProfile?.primaryColor || '#dc2626',
                      borderColor: state.clubProfile?.primaryColor || '#dc2626',
                      boxShadow: `0 10px 15px -3px ${state.clubProfile?.primaryColor}33`
                    } : {}}
                  >
                    <ArrowUpCircle size={18} />
                    Upgrade (£{facility.cost}M)
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </Card>
    </div>
  );
};

export default Facilities;
