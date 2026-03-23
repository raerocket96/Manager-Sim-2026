import React from 'react';
import { useGame } from '../context/GameContext';
import { Stethoscope, Activity, Heart, AlertCircle, Zap, ShieldAlert, Thermometer, Pill } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Card } from './ui/Card';

const MedicalCentre: React.FC = () => {
  const { state, dispatch } = useGame();

  const injuredPlayers = state.squad.filter(p => p.injuryWeeks > 0);
  const lowStaminaPlayers = state.squad.filter(p => p.stamina < 70 && p.injuryWeeks === 0);

  const handleTreatment = (playerId: string, type: 'rest' | 'injection') => {
    dispatch({ type: 'MEDICAL_TREATMENT', payload: { playerId, type } });
  };

  const physioRating = state.staff.find(s => s.role === 'Physio')?.rating || 0;

  return (
    <div className="space-y-8">
      {/* Medical Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-zinc-900/50 backdrop-blur-md border border-zinc-800 p-6 rounded-2xl flex items-center justify-between group hover:border-emerald-500/30 transition-all">
          <div>
            <p className="text-[10px] text-zinc-500 uppercase font-black tracking-widest mb-1">Medisinsk Stab</p>
            <p className="text-3xl font-black text-white italic tracking-tighter">{physioRating}/99</p>
          </div>
          <div className="w-14 h-14 bg-emerald-600/10 rounded-2xl flex items-center justify-center border border-emerald-500/20 shadow-[0_0_15px_rgba(16,185,129,0.1)]">
            <Stethoscope className="text-emerald-500" size={28} />
          </div>
        </div>
        
        <div className="bg-zinc-900/50 backdrop-blur-md border border-zinc-800 p-6 rounded-2xl flex items-center justify-between group hover:border-emerald-500/30 transition-all">
          <div>
            <p className="text-[10px] text-zinc-500 uppercase font-black tracking-widest mb-1">Skader</p>
            <p className="text-3xl font-black text-white italic tracking-tighter">{injuredPlayers.length}</p>
          </div>
          <div className="w-14 h-14 bg-red-600/10 rounded-2xl flex items-center justify-center border border-red-500/20">
            <Thermometer className="text-red-500" size={28} />
          </div>
        </div>

        <div className="bg-zinc-900/50 backdrop-blur-md border border-zinc-800 p-6 rounded-2xl flex items-center justify-between group hover:border-emerald-500/30 transition-all">
          <div>
            <p className="text-[10px] text-zinc-500 uppercase font-black tracking-widest mb-1">Restitusjon</p>
            <p className="text-3xl font-black text-white italic tracking-tighter">{lowStaminaPlayers.length}</p>
          </div>
          <div className="w-14 h-14 bg-yellow-600/10 rounded-2xl flex items-center justify-center border border-yellow-500/20">
            <Activity className="text-yellow-500" size={28} />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Injured Players */}
        <Card title="Skadestue" subtitle="Aktive skader" badge={`${injuredPlayers.length} Spillere`} icon={AlertCircle}>
          <div className="space-y-3">
            <AnimatePresence mode="popLayout">
              {injuredPlayers.map((player, idx) => (
                <motion.div
                  key={player.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className="bg-zinc-950/50 border border-zinc-800 p-5 rounded-2xl flex items-center justify-between group hover:border-red-500/30 transition-all duration-300"
                >
                  <div className="flex items-center gap-5">
                    <div className="w-12 h-12 bg-red-600/10 rounded-xl flex items-center justify-center border border-red-500/20">
                      <Heart className="text-red-500" size={24} />
                    </div>
                    <div>
                      <h4 className="text-lg font-black text-white uppercase tracking-tighter italic group-hover:text-red-500 transition-colors">{player.name}</h4>
                      <p className="text-[10px] text-zinc-500 font-black uppercase tracking-widest">{player.injuryType || 'Muskelskade'} • {player.injuryWeeks} uker igjen</p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleTreatment(player.id, 'injection')}
                    className="px-6 py-3 bg-red-600 hover:bg-red-500 text-white text-[10px] font-black uppercase tracking-widest rounded-xl transition-all flex items-center gap-2 shadow-lg shadow-red-600/20"
                  >
                    <Zap size={14} />
                    Injisering
                  </button>
                </motion.div>
              ))}
            </AnimatePresence>
            {injuredPlayers.length === 0 && (
              <div className="py-16 bg-zinc-950/30 border border-dashed border-zinc-800 rounded-2xl text-center">
                <p className="text-zinc-600 font-black uppercase tracking-widest text-[10px] opacity-40">Ingen spillere er skadet akkurat nå</p>
              </div>
            )}
          </div>
        </Card>

        {/* Low Stamina Players */}
        <Card title="Restitusjon" subtitle="Lav utholdenhet" badge={`${lowStaminaPlayers.length} Spillere`} icon={ShieldAlert}>
          <div className="space-y-3">
            <AnimatePresence mode="popLayout">
              {lowStaminaPlayers.map((player, idx) => (
                <motion.div
                  key={player.id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className="bg-zinc-950/50 border border-zinc-800 p-5 rounded-2xl flex items-center justify-between group hover:border-yellow-500/30 transition-all duration-300"
                >
                  <div className="flex items-center gap-5">
                    <div className="w-12 h-12 bg-yellow-600/10 rounded-xl flex items-center justify-center border border-yellow-500/20">
                      <Activity className="text-yellow-500" size={24} />
                    </div>
                    <div>
                      <h4 className="text-lg font-black text-white uppercase tracking-tighter italic group-hover:text-yellow-500 transition-colors">{player.name}</h4>
                      <div className="flex items-center gap-3 mt-1">
                        <div className="w-24 bg-zinc-900 h-2 rounded-full overflow-hidden border border-zinc-800">
                          <div 
                            className={`h-full transition-all duration-1000 ${player.stamina < 50 ? 'bg-red-500' : 'bg-yellow-500'}`} 
                            style={{ width: `${player.stamina}%` }}
                          />
                        </div>
                        <span className="text-[10px] text-zinc-500 font-black uppercase tracking-widest">{player.stamina}%</span>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => handleTreatment(player.id, 'rest')}
                    className="px-6 py-3 bg-zinc-900 hover:bg-zinc-800 text-white text-[10px] font-black uppercase tracking-widest rounded-xl transition-all border border-zinc-800 hover:border-yellow-500/50"
                  >
                    Ekstra hvile
                  </button>
                </motion.div>
              ))}
            </AnimatePresence>
            {lowStaminaPlayers.length === 0 && (
              <div className="py-16 bg-zinc-950/30 border border-dashed border-zinc-800 rounded-2xl text-center">
                <p className="text-zinc-600 font-black uppercase tracking-widest text-[10px] opacity-40">Alle spillere er uthvilte og klare</p>
              </div>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default MedicalCentre;
