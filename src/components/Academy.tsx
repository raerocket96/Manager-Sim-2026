import React from 'react';
import { useGame } from '../context/GameContext';
import { GraduationCap, Star, TrendingUp, UserPlus, Award, Search } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Card } from './ui/Card';

const Academy: React.FC = () => {
  const { state, dispatch } = useGame();

  const handlePromote = (id: string) => {
    dispatch({ type: 'PROMOTE_ACADEMY', payload: id });
  };

  const handleAcademyAction = (type: 'invest' | 'mentor', payload?: any) => {
    dispatch({ type: 'ACADEMY_ACTION', payload: { type, payload } });
  };

  return (
    <div className="space-y-8">
      {/* Header Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-zinc-900/50 backdrop-blur-md border border-zinc-800 p-6 rounded-2xl flex items-center justify-between group transition-all" style={{ borderColor: `${state.clubProfile?.primaryColor}33` }}>
          <div>
            <p className="text-[10px] text-zinc-500 uppercase font-black tracking-widest mb-1">Club Identity</p>
            <p className="text-3xl font-black text-white italic tracking-tighter">{state.clubIdentityScore}%</p>
          </div>
          <div 
            className="w-14 h-14 rounded-2xl flex items-center justify-center border shadow-lg"
            style={{ 
              backgroundColor: `${state.clubProfile?.primaryColor}1a`,
              borderColor: `${state.clubProfile?.primaryColor}33`,
              boxShadow: `0 0 15px ${state.clubProfile?.primaryColor}1a`
            }}
          >
            <Star style={{ color: state.clubProfile?.primaryColor }} size={28} />
          </div>
        </div>
        
        <div className="bg-zinc-900/50 backdrop-blur-md border border-zinc-800 p-6 rounded-2xl flex items-center justify-between group transition-all">
          <div>
            <p className="text-[10px] text-zinc-500 uppercase font-black tracking-widest mb-1">Academy Status</p>
            <p className="text-3xl font-black text-white italic tracking-tighter">Elite</p>
          </div>
          <div className="w-14 h-14 bg-emerald-600/10 rounded-2xl flex items-center justify-center border border-emerald-500/20">
            <Award className="text-emerald-500" size={28} />
          </div>
        </div>

        <div className="bg-zinc-900/50 backdrop-blur-md border border-zinc-800 p-6 rounded-2xl flex items-center justify-between group transition-all">
          <div>
            <p className="text-[10px] text-zinc-500 uppercase font-black tracking-widest mb-1">Class</p>
            <p className="text-3xl font-black text-white italic tracking-tighter">'{new Date().getFullYear().toString().slice(-2)}</p>
          </div>
          <div className="w-14 h-14 bg-blue-600/10 rounded-2xl flex items-center justify-center border border-blue-500/20">
            <GraduationCap className="text-blue-500" size={28} />
          </div>
        </div>

        <button 
          onClick={() => handleAcademyAction('invest')}
          className="bg-zinc-950 border border-zinc-800 p-6 rounded-2xl flex flex-col items-center justify-center group hover:border-emerald-500/50 transition-all gap-2"
        >
          <Search className="text-zinc-600 group-hover:text-emerald-500 transition-colors" size={24} />
          <span className="text-[9px] font-black text-zinc-500 uppercase tracking-widest">Invest in scouting (£10M)</span>
        </button>
      </div>

      {/* Academy Players */}
      <Card title="Future Stars" subtitle="Youth Academy" badge={`${state.academyPlayers.length} Talents`} icon={GraduationCap}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence mode="popLayout">
            {state.academyPlayers.map((player, idx) => (
              <motion.div
                key={player.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: idx * 0.05 }}
                className="bg-zinc-950 border border-zinc-800 rounded-2xl overflow-hidden group transition-all duration-300 shadow-xl"
                style={{ borderColor: idx === 0 ? state.clubProfile?.primaryColor : undefined }}
              >
                <div className="p-6 space-y-6">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-black text-lg border-2 ${player.position === 'GK' ? 'bg-yellow-500/10 border-yellow-500/50 text-yellow-500' : player.position === 'DEF' ? 'bg-blue-500/10 border-blue-500/50 text-blue-500' : player.position === 'MID' ? 'bg-emerald-500/10 border-emerald-500/50 text-emerald-500' : ''}`} style={player.position === 'FWD' ? { backgroundColor: `${state.clubProfile?.primaryColor}1a`, borderColor: `${state.clubProfile?.primaryColor}80`, color: state.clubProfile?.primaryColor } : {}}>
                        {player.rating}
                      </div>
                      <div>
                        <h3 className="text-lg font-black text-white uppercase tracking-tighter italic group-hover:text-red-500 transition-colors" style={{ color: idx === 0 ? state.clubProfile?.primaryColor : undefined }}>{player.name}</h3>
                        <p className="text-zinc-500 text-[10px] font-black uppercase tracking-widest">{player.position} • {player.age} years</p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex justify-between text-[10px] font-black uppercase tracking-widest">
                      <span className="text-zinc-500">Potential</span>
                      <span className="text-white">{player.potential}</span>
                    </div>
                    <div className="w-full bg-zinc-900 h-2 rounded-full overflow-hidden border border-zinc-800">
                      <div 
                        className="h-full transition-all duration-1000 shadow-lg" 
                        style={{ 
                          width: `${(player.potential / 99) * 100}%`,
                          backgroundColor: state.clubProfile?.primaryColor || '#dc2626',
                          boxShadow: `0 0 10px ${state.clubProfile?.primaryColor}80`
                        }}
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-zinc-900 rounded-xl border border-zinc-800">
                    <div className="flex items-center gap-2">
                      <TrendingUp size={14} className="text-emerald-500" />
                      <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Identity Match</span>
                    </div>
                    <span className="text-xs font-black text-emerald-500">{player.clubIdentityMatch}%</span>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => handleAcademyAction('mentor', player.id)}
                      className="py-3 bg-zinc-950 hover:bg-zinc-900 text-zinc-400 font-black text-[9px] uppercase tracking-widest rounded-xl transition-all border border-zinc-800 hover:border-zinc-600"
                    >
                      Assign Mentor
                    </button>
                    <button
                      onClick={() => handlePromote(player.id)}
                      className="py-3 text-white font-black text-[9px] uppercase tracking-widest rounded-xl transition-all shadow-lg"
                      style={{ backgroundColor: state.clubProfile?.primaryColor || '#dc2626' }}
                    >
                      Promote
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {state.academyPlayers.length === 0 && (
          <div className="text-center py-24 bg-zinc-950/50 border border-dashed border-zinc-800 rounded-3xl">
            <GraduationCap size={64} className="mx-auto text-zinc-800 mb-6 opacity-20" />
            <p className="text-zinc-500 font-black uppercase tracking-widest text-xs opacity-40">No players in the academy right now</p>
            <p className="text-zinc-600 text-[10px] mt-2 font-bold uppercase tracking-widest">New talents appear at the end of the season</p>
          </div>
        )}
      </Card>
    </div>
  );
};

export default Academy;
