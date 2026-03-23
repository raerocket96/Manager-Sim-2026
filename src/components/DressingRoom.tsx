import React from 'react';
import { useGame } from '../context/GameContext';
import { Users, User, Shield, Zap, AlertTriangle, Heart, MessageSquare, TrendingUp, Info } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Card } from './ui/Card';

const DressingRoom: React.FC = () => {
  const { state, dispatch } = useGame();

  const handleDressingRoomAction = (type: 'resolve_conflict' | 'punish' | 'leadership') => {
    dispatch({ type: 'DRESSING_ROOM_ACTION', payload: { type } });
  };

  const getPersonalityIcon = (personality: string) => {
    switch (personality) {
      case 'Professional': return <Shield size={14} className="text-blue-400" />;
      case 'Ego': return <Zap size={14} className="text-yellow-400" />;
      case 'Loyal': return <Heart size={14} className="text-red-400" />;
      case 'Troublemaker': return <AlertTriangle size={14} className="text-orange-400" />;
      case 'Leader': return <User size={14} className="text-emerald-400" />;
      default: return <User size={14} />;
    }
  };

  return (
    <div className="space-y-8">
      {/* Dressing Room Stats Header */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-zinc-900/50 backdrop-blur-md border border-zinc-800 p-6 rounded-2xl flex items-center justify-between group hover:border-red-500/30 transition-all">
          <div>
            <p className="text-[10px] text-zinc-500 uppercase font-black tracking-widest mb-1">Dressing Room Atmosphere</p>
            <p className="text-3xl font-black text-white italic tracking-tighter">Harmonious</p>
          </div>
          <div className="w-14 h-14 bg-emerald-600/10 rounded-2xl flex items-center justify-center border border-emerald-500/20 shadow-[0_0_15px_rgba(16,185,129,0.1)]">
            <Heart className="text-emerald-500" size={28} />
          </div>
        </div>
        
        <div className="bg-zinc-900/50 backdrop-blur-md border border-zinc-800 p-6 rounded-2xl flex items-center justify-between group hover:border-red-500/30 transition-all">
          <div>
            <p className="text-[10px] text-zinc-500 uppercase font-black tracking-widest mb-1">Cliques</p>
            <p className="text-3xl font-black text-white italic tracking-tighter">{state.dressingRoomCliques.length}</p>
          </div>
          <div className="w-14 h-14 bg-red-600/10 rounded-2xl flex items-center justify-center border border-red-500/20">
            <Users className="text-red-500" size={28} />
          </div>
        </div>

        <div className="bg-zinc-900/50 backdrop-blur-md border border-zinc-800 p-6 rounded-2xl flex items-center justify-between group hover:border-red-500/30 transition-all">
          <div>
            <p className="text-[10px] text-zinc-500 uppercase font-black tracking-widest mb-1">Leaders</p>
            <p className="text-3xl font-black text-white italic tracking-tighter">3</p>
          </div>
          <div className="w-14 h-14 bg-blue-600/10 rounded-2xl flex items-center justify-center border border-blue-500/20">
            <Shield className="text-blue-500" size={28} />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-2">
          <button 
            onClick={() => handleDressingRoomAction('resolve_conflict')}
            className="bg-zinc-950 border border-zinc-800 p-3 rounded-xl flex items-center gap-3 group hover:border-emerald-500/50 transition-all"
          >
            <MessageSquare size={16} className="text-zinc-600 group-hover:text-emerald-500" />
            <span className="text-[8px] font-black text-zinc-500 uppercase tracking-widest">Resolve conflicts</span>
          </button>
          <button 
            onClick={() => handleDressingRoomAction('punish')}
            className="bg-zinc-950 border border-zinc-800 p-3 rounded-xl flex items-center gap-3 group hover:border-red-500/50 transition-all"
          >
            <AlertTriangle size={16} className="text-zinc-600 group-hover:text-red-500" />
            <span className="text-[8px] font-black text-zinc-500 uppercase tracking-widest">Fine players</span>
          </button>
        </div>
      </div>

      {/* Cliques Section */}
      <Card title="Dressing Room Power Structure" subtitle="Social groups and cliques" icon={Users}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <AnimatePresence mode="popLayout">
            {state.dressingRoomCliques.map((clique, idx) => (
              <motion.div 
                key={clique.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="bg-zinc-950 border border-zinc-800 rounded-3xl p-6 group hover:border-red-500/30 transition-all duration-300 shadow-2xl"
              >
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Users size={24} className="text-red-500" />
                    </div>
                    <div>
                      <h3 className="text-lg font-black text-white uppercase tracking-tighter italic group-hover:text-red-500 transition-colors">{clique.name}</h3>
                      <div className="flex items-center gap-2">
                        <TrendingUp size={10} className="text-emerald-500" />
                        <p className="text-[9px] text-zinc-500 font-black uppercase tracking-widest">Influence: {clique.influence}%</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  {clique.playerIds.length === 0 ? (
                    <div className="py-8 flex flex-col items-center justify-center bg-zinc-900/30 rounded-2xl border border-dashed border-zinc-800">
                      <p className="text-[9px] text-zinc-600 font-black uppercase tracking-widest">No members</p>
                    </div>
                  ) : (
                    state.squad.filter(p => clique.playerIds.includes(p.id)).map(p => (
                      <div key={p.id} className="flex items-center justify-between p-3 bg-zinc-900/50 rounded-xl border border-zinc-800/50 hover:border-zinc-700 transition-all">
                        <div className="flex items-center gap-3">
                          <span className="text-[10px] font-black text-white uppercase tracking-tighter italic">{p.name}</span>
                          {getPersonalityIcon(p.personality)}
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-16 bg-zinc-950 h-1.5 rounded-full overflow-hidden border border-zinc-800">
                            <div 
                              className={`h-full transition-all duration-1000 ${p.morale > 70 ? 'bg-emerald-500' : p.morale > 40 ? 'bg-yellow-500' : 'bg-red-500'}`} 
                              style={{ width: `${p.morale}%` }}
                            ></div>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </Card>

      {/* Player Status Section */}
      <Card title="Player Status & Personalities" subtitle="Individual morale and satisfaction" icon={User}>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <AnimatePresence mode="popLayout">
            {state.squad.map((p, idx) => (
              <motion.div 
                key={p.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: idx * 0.02 }}
                className="p-5 bg-zinc-950 border border-zinc-800 rounded-2xl space-y-4 group hover:border-zinc-700 transition-all duration-300 shadow-xl"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <div className="text-sm font-black text-white uppercase tracking-tighter italic group-hover:text-red-500 transition-colors">{p.name}</div>
                    <div className="text-[9px] text-zinc-500 font-black uppercase tracking-widest">{p.position} | {p.rating} OVR</div>
                  </div>
                  <div className="flex items-center gap-2 bg-zinc-900 px-2 py-1 rounded-lg border border-zinc-800">
                    {getPersonalityIcon(p.personality)}
                    <span className="text-[8px] font-black text-zinc-400 uppercase tracking-widest">{p.personality}</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-[8px] font-black uppercase tracking-widest text-zinc-500">
                    <span>Morale</span>
                    <span className={p.morale > 70 ? 'text-emerald-500' : p.morale > 40 ? 'text-yellow-500' : 'text-red-500'}>{p.morale}%</span>
                  </div>
                  <div className="h-2 bg-zinc-900 rounded-full overflow-hidden border border-zinc-800">
                    <div 
                      className={`h-full transition-all duration-1000 ${p.morale > 70 ? 'bg-emerald-500' : p.morale > 40 ? 'bg-yellow-500' : 'bg-red-500'}`} 
                      style={{ width: `${p.morale}%` }}
                    ></div>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2 pt-2 border-t border-zinc-900">
                  <div className="text-center p-2 bg-zinc-900/50 rounded-xl border border-zinc-800/50">
                    <div className="text-[7px] text-zinc-600 font-black uppercase tracking-widest mb-1">Playing Time</div>
                    <div className="text-[10px] text-white font-black italic">{p.happiness?.playingTime || 80}%</div>
                  </div>
                  <div className="text-center p-2 bg-zinc-900/50 rounded-xl border border-zinc-800/50">
                    <div className="text-[7px] text-zinc-600 font-black uppercase tracking-widest mb-1">Wage</div>
                    <div className="text-[10px] text-white font-black italic">{p.happiness?.wage || 80}%</div>
                  </div>
                  <div className="text-center p-2 bg-zinc-900/50 rounded-xl border border-zinc-800/50">
                    <div className="text-[7px] text-zinc-600 font-black uppercase tracking-widest mb-1">Status</div>
                    <div className="text-[10px] text-white font-black italic">{p.happiness?.clubStatus || 80}%</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </Card>
    </div>
  );
};

export default DressingRoom;
