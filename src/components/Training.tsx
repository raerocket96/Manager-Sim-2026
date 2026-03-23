import React from 'react';
import { useGame } from '../context/GameContext';
import { Zap, Target, Dumbbell, Move, Shield, Users, Activity, TrendingUp, Brain } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Player } from '../types';
import { Card } from './ui/Card';

const Training: React.FC = () => {
  const { state, dispatch } = useGame();

  const handleSetFocus = (playerId: string, focus: Player['trainingFocus']) => {
    dispatch({ type: 'SET_TRAINING_FOCUS', payload: { playerId, focus } });
  };

  const focusOptions: { id: Player['trainingFocus'], icon: React.ReactNode, label: string, color: string }[] = [
    { id: 'Pace', icon: <Zap size={14} />, label: 'Hurtighet', color: 'text-blue-500' },
    { id: 'Shooting', icon: <Target size={14} />, label: 'Avslutninger', color: 'text-red-500' },
    { id: 'Passing', icon: <Move size={14} />, label: 'Pasninger', color: 'text-emerald-500' },
    { id: 'Dribbling', icon: <Users size={14} />, label: 'Dribling', color: 'text-purple-500' },
    { id: 'Defending', icon: <Shield size={14} />, label: 'Forsvar', color: 'text-zinc-400' },
    { id: 'Physical', icon: <Dumbbell size={14} />, label: 'Fysisk', color: 'text-yellow-500' },
    { id: 'Stamina', icon: <Activity size={14} />, label: 'Utholdenhet', color: 'text-orange-500' },
  ];

  const coachRating = state.staff.find(s => s.role === 'Coach')?.rating || 0;

  return (
    <div className="space-y-8">
      {/* Training Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-zinc-900/50 backdrop-blur-md border border-zinc-800 p-6 rounded-2xl flex items-center justify-between group hover:border-yellow-500/30 transition-all">
          <div>
            <p className="text-[10px] text-zinc-500 uppercase font-black tracking-widest mb-1">Trener-rating</p>
            <p className="text-3xl font-black text-white italic tracking-tighter">{coachRating}/99</p>
          </div>
          <div className="w-14 h-14 bg-yellow-600/10 rounded-2xl flex items-center justify-center border border-yellow-500/20 shadow-[0_0_15px_rgba(234,179,8,0.1)]">
            <Brain className="text-yellow-500" size={28} />
          </div>
        </div>
        
        <div className="bg-zinc-900/50 backdrop-blur-md border border-zinc-800 p-6 rounded-2xl flex items-center justify-between group hover:border-yellow-500/30 transition-all">
          <div>
            <p className="text-[10px] text-zinc-500 uppercase font-black tracking-widest mb-1">Intensitet</p>
            <p className="text-3xl font-black text-white italic tracking-tighter">Høy</p>
          </div>
          <div className="w-14 h-14 bg-red-600/10 rounded-2xl flex items-center justify-center border border-red-500/20">
            <Activity className="text-red-500" size={28} />
          </div>
        </div>

        <div className="bg-zinc-900/50 backdrop-blur-md border border-zinc-800 p-6 rounded-2xl flex items-center justify-between group hover:border-yellow-500/30 transition-all">
          <div>
            <p className="text-[10px] text-zinc-500 uppercase font-black tracking-widest mb-1">Utvikling</p>
            <p className="text-3xl font-black text-white italic tracking-tighter">+2.4%</p>
          </div>
          <div className="w-14 h-14 bg-emerald-600/10 rounded-2xl flex items-center justify-center border border-emerald-500/20">
            <TrendingUp className="text-emerald-500" size={28} />
          </div>
        </div>
      </div>

      <Card title="Treningsfeltet" subtitle="Individuelle fokusområder" icon={Dumbbell}>
        <div className="space-y-3">
          <AnimatePresence mode="popLayout">
            {state.squad.map((player, idx) => (
              <motion.div
                key={player.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.02 }}
                className="bg-zinc-950/50 border border-zinc-800 p-4 rounded-2xl flex flex-col lg:flex-row lg:items-center justify-between gap-6 group hover:border-yellow-500/30 transition-all duration-300"
              >
                <div className="flex items-center gap-5 min-w-[240px]">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-black text-lg border-2 ${player.position === 'GK' ? 'bg-yellow-500/10 border-yellow-500/50 text-yellow-500' : player.position === 'DEF' ? 'bg-blue-500/10 border-blue-500/50 text-blue-500' : player.position === 'MID' ? 'bg-emerald-500/10 border-emerald-500/50 text-emerald-500' : 'bg-red-500/10 border-red-500/50 text-red-500'}`}>
                    {player.rating}
                  </div>
                  <div>
                    <h4 className="text-lg font-black text-white uppercase tracking-tighter italic group-hover:text-yellow-500 transition-colors">{player.name}</h4>
                    <p className="text-[10px] text-zinc-500 font-black uppercase tracking-widest">{player.position} • {player.age} år</p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 flex-1">
                  {focusOptions.map((option) => (
                    <button
                      key={option.id}
                      onClick={() => handleSetFocus(player.id, option.id)}
                      className={`px-4 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2 transition-all border ${
                        player.trainingFocus === option.id
                          ? 'bg-yellow-600 text-white border-yellow-500 shadow-lg shadow-yellow-600/20'
                          : 'bg-zinc-900 text-zinc-500 border-zinc-800 hover:bg-zinc-800 hover:text-zinc-300'
                      }`}
                    >
                      <span className={player.trainingFocus === option.id ? 'text-white' : option.color}>
                        {option.icon}
                      </span>
                      {option.label}
                    </button>
                  ))}
                </div>

                <div className="flex items-center gap-8 px-6 py-3 bg-zinc-900 rounded-xl border border-zinc-800">
                  <div className="text-center">
                    <p className="text-zinc-600 uppercase font-black text-[8px] tracking-widest mb-1">Form</p>
                    <p className="text-sm font-black text-white italic">{player.form}/10</p>
                  </div>
                  <div className="w-px h-8 bg-zinc-800"></div>
                  <div className="text-center">
                    <p className="text-zinc-600 uppercase font-black text-[8px] tracking-widest mb-1">Morale</p>
                    <p className={`text-sm font-black italic ${player.morale > 70 ? 'text-emerald-500' : 'text-red-500'}`}>{player.morale}%</p>
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

export default Training;
