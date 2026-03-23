import React from 'react';
import { useGame } from '../context/GameContext';
import { Trophy, Award, Calendar, Star, History, Target, TrendingUp } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Card } from './ui/Card';

const TrophyRoom: React.FC = () => {
  const { state } = useGame();

  const historicalTrophies = [
    { id: 'h1', name: 'Premier League', count: state.clubProfile?.historicalTrophies.league || 0, icon: <Trophy className="text-yellow-500" size={32} />, color: 'bg-yellow-500/10', border: 'border-yellow-500/20' },
    { id: 'h2', name: 'Champions League', count: state.clubProfile?.historicalTrophies.championsLeague || 0, icon: <Award className="text-blue-400" size={32} />, color: 'bg-blue-500/10', border: 'border-blue-500/20' },
    { id: 'h3', name: 'FA Cup', count: state.clubProfile?.historicalTrophies.faCup || 0, icon: <Trophy className="text-red-500" size={32} />, color: 'bg-red-500/10', border: 'border-red-500/20' },
    { id: 'h4', name: 'League Cup', count: state.clubProfile?.historicalTrophies.leagueCup || 0, icon: <Award className="text-emerald-400" size={32} />, color: 'bg-emerald-500/10', border: 'border-emerald-500/20' },
  ];

  const totalHistorical = (state.clubProfile?.historicalTrophies.league || 0) + 
                         (state.clubProfile?.historicalTrophies.championsLeague || 0) + 
                         (state.clubProfile?.historicalTrophies.faCup || 0) + 
                         (state.clubProfile?.historicalTrophies.leagueCup || 0);

  const clubAge = new Date().getFullYear() - (state.clubProfile?.foundedYear || 1900);

  return (
    <div className="space-y-8">
      {/* Trophy Stats Header */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-zinc-900/50 backdrop-blur-md border border-zinc-800 p-6 rounded-2xl flex items-center justify-between group hover:border-yellow-500/30 transition-all">
          <div>
            <p className="text-[10px] text-zinc-500 uppercase font-black tracking-widest mb-1">Totale Trofeer</p>
            <p className="text-3xl font-black text-white italic tracking-tighter">{totalHistorical + state.trophies.length}</p>
          </div>
          <div className="w-14 h-14 bg-yellow-600/10 rounded-2xl flex items-center justify-center border border-yellow-500/20 shadow-[0_0_15px_rgba(234,179,8,0.1)]">
            <Trophy className="text-yellow-500" size={28} />
          </div>
        </div>
        
        <div className="bg-zinc-900/50 backdrop-blur-md border border-zinc-800 p-6 rounded-2xl flex items-center justify-between group hover:border-red-500/30 transition-all">
          <div>
            <p className="text-[10px] text-zinc-500 uppercase font-black tracking-widest mb-1">Dine Bragder</p>
            <p className="text-3xl font-black text-white italic tracking-tighter">{state.trophies.length}</p>
          </div>
          <div className="w-14 h-14 bg-red-600/10 rounded-2xl flex items-center justify-center border border-red-500/20">
            <Star className="text-red-500" size={28} />
          </div>
        </div>

        <div className="bg-zinc-900/50 backdrop-blur-md border border-zinc-800 p-6 rounded-2xl flex items-center justify-between group hover:border-blue-500/30 transition-all">
          <div>
            <p className="text-[10px] text-zinc-500 uppercase font-black tracking-widest mb-1">Klubbens Arv</p>
            <p className="text-3xl font-black text-white italic tracking-tighter">{clubAge} År</p>
          </div>
          <div className="w-14 h-14 bg-blue-600/10 rounded-2xl flex items-center justify-center border border-blue-500/20">
            <History className="text-blue-500" size={28} />
          </div>
        </div>
      </div>

      {/* Historical Trophies Section */}
      <Card title="Klubbens Historiske Kabinett" subtitle={`${state.clubProfile?.name}s stolte historie`} icon={History}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <AnimatePresence mode="popLayout">
            {historicalTrophies.map((t, idx) => (
              <motion.div
                key={t.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: idx * 0.1 }}
                className={`bg-zinc-950 border border-zinc-800 p-8 rounded-3xl text-center space-y-6 group hover:border-yellow-500/40 transition-all duration-500 shadow-2xl relative overflow-hidden`}
              >
                <div className={`absolute inset-0 ${t.color} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
                
                <div className="relative z-10">
                  <div className="w-20 h-20 bg-zinc-900 border border-zinc-800 rounded-2xl flex items-center justify-center mx-auto group-hover:scale-110 group-hover:rotate-3 transition-transform duration-500">
                    {t.icon}
                  </div>
                  <div className="mt-6">
                    <h3 className="text-zinc-500 font-black uppercase tracking-widest text-[10px] mb-1">{t.name}</h3>
                    <p className="text-5xl font-black text-white italic tracking-tighter group-hover:text-yellow-500 transition-colors">{t.count}</p>
                  </div>
                </div>

                <div className="pt-4 border-t border-zinc-900 relative z-10">
                  <div className="flex items-center justify-center gap-2 text-[9px] text-zinc-600 font-black uppercase tracking-widest">
                    <Target size={10} />
                    <span>Rekordholdere</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </Card>

      {/* Manager Achievements Section */}
      <Card title="Dine Bragder" subtitle="Trofeer vunnet under din ledelse" icon={Star}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence mode="popLayout">
            {state.trophies.map((t, idx) => (
              <motion.div
                key={t.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="bg-zinc-950 border border-zinc-800 p-6 rounded-2xl flex items-center gap-6 group hover:border-red-500/30 transition-all duration-300 shadow-xl"
              >
                <div className="w-16 h-16 bg-yellow-600/10 rounded-2xl flex items-center justify-center border border-yellow-500/20 group-hover:scale-110 transition-transform">
                  <Trophy className="text-yellow-500" size={32} />
                </div>
                <div>
                  <h4 className="text-lg font-black text-white uppercase tracking-tighter italic group-hover:text-red-500 transition-colors">{t.name}</h4>
                  <div className="flex items-center gap-3 mt-1">
                    <div className="flex items-center gap-1.5 text-[10px] text-zinc-500 font-black uppercase tracking-widest">
                      <Calendar size={12} className="text-red-500" />
                      <span>Sesong {t.year}</span>
                    </div>
                    <div className="w-1 h-1 bg-zinc-800 rounded-full" />
                    <div className="flex items-center gap-1.5 text-[10px] text-zinc-500 font-black uppercase tracking-widest">
                      <TrendingUp size={12} className="text-emerald-500" />
                      <span>Suksess</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
          
          {state.trophies.length === 0 && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="col-span-full py-20 bg-zinc-900/20 border border-dashed border-zinc-800 rounded-3xl text-center flex flex-col items-center justify-center space-y-4"
            >
              <div className="w-16 h-16 bg-zinc-900 rounded-full flex items-center justify-center border border-zinc-800">
                <Trophy className="text-zinc-700" size={32} />
              </div>
              <div>
                <p className="text-zinc-500 font-black uppercase tracking-widest text-xs italic">Ingen trofeer vunnet ennå</p>
                <p className="text-[10px] text-zinc-600 font-bold uppercase tracking-widest mt-1">Jobb hardere for å fylle kabinettet, sjef!</p>
              </div>
            </motion.div>
          )}
        </div>
      </Card>
    </div>
  );
};

export default TrophyRoom;
