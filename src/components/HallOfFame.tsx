import React from 'react';
import { useGame } from '../context/GameContext';
import { Trophy, Star, History, User, Award, Shield, TrendingUp } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Card } from './ui/Card';

const HallOfFame: React.FC = () => {
  const { state } = useGame();

  return (
    <div className="space-y-8">
      {/* Hall of Fame Stats Header */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-zinc-900/50 backdrop-blur-md border border-zinc-800 p-6 rounded-2xl flex items-center justify-between group hover:border-yellow-500/30 transition-all">
          <div>
            <p className="text-[10px] text-zinc-500 uppercase font-black tracking-widest mb-1">Legender</p>
            <p className="text-3xl font-black text-white italic tracking-tighter">{(state.hallOfFame || []).length}</p>
          </div>
          <div className="w-14 h-14 bg-yellow-600/10 rounded-2xl flex items-center justify-center border border-yellow-500/20 shadow-[0_0_15px_rgba(234,179,8,0.1)]">
            <Star className="text-yellow-500" size={28} />
          </div>
        </div>
        
        <div className="bg-zinc-900/50 backdrop-blur-md border border-zinc-800 p-6 rounded-2xl flex items-center justify-between group hover:border-red-500/30 transition-all">
          <div>
            <p className="text-[10px] text-zinc-500 uppercase font-black tracking-widest mb-1">Klubb-identitet</p>
            <p className="text-3xl font-black text-white italic tracking-tighter">Elite</p>
          </div>
          <div className="w-14 h-14 bg-red-600/10 rounded-2xl flex items-center justify-center border border-red-500/20">
            <Shield className="text-red-500" size={28} />
          </div>
        </div>

        <div className="bg-zinc-900/50 backdrop-blur-md border border-zinc-800 p-6 rounded-2xl flex items-center justify-between group hover:border-blue-500/30 transition-all">
          <div>
            <p className="text-[10px] text-zinc-500 uppercase font-black tracking-widest mb-1">Historisk Status</p>
            <p className="text-3xl font-black text-white italic tracking-tighter">Ikonisk</p>
          </div>
          <div className="w-14 h-14 bg-blue-600/10 rounded-2xl flex items-center justify-center border border-blue-500/20">
            <Award className="text-blue-500" size={28} />
          </div>
        </div>
      </div>

      {/* Hall of Fame Main Section */}
      <Card title="Klubbens Legender" subtitle={`De største navnene i ${state.clubProfile?.name}s historie`} icon={Trophy}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <AnimatePresence mode="popLayout">
            {(state.hallOfFame || []).length === 0 ? (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="col-span-full py-32 bg-zinc-900/20 border border-dashed border-zinc-800 rounded-3xl text-center flex flex-col items-center justify-center space-y-4"
              >
                <div className="w-20 h-20 bg-zinc-900 rounded-full flex items-center justify-center border border-zinc-800">
                  <Star className="text-zinc-700" size={40} />
                </div>
                <div>
                  <p className="text-zinc-500 font-black uppercase tracking-widest text-sm italic">Ingen legender registrert ennå</p>
                  <p className="text-[10px] text-zinc-600 font-bold uppercase tracking-widest mt-1">Skap historie for å bli udødeliggjort her</p>
                </div>
              </motion.div>
            ) : (
              (state.hallOfFame || []).map((entry, idx) => (
                <motion.div 
                  key={entry.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className="group relative overflow-hidden bg-zinc-950 border border-zinc-800 p-8 rounded-3xl hover:border-yellow-500/40 transition-all duration-500 shadow-2xl"
                >
                  <div className="absolute top-0 right-0 w-48 h-48 bg-yellow-500/5 rounded-full blur-3xl -mr-16 -mt-16 transition-all group-hover:bg-yellow-500/10 duration-700"></div>
                  
                  <div className="flex items-start gap-6 relative z-10">
                    <div className="w-20 h-20 bg-zinc-900 border border-zinc-800 rounded-2xl flex items-center justify-center text-yellow-500 shrink-0 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-500 shadow-inner">
                      <User size={40} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-black text-white text-2xl uppercase tracking-tighter italic group-hover:text-yellow-500 transition-colors duration-300">{entry.name}</h4>
                        <span className="text-[10px] font-black text-yellow-500 uppercase tracking-widest bg-yellow-500/10 px-3 py-1 rounded-full border border-yellow-500/20 shadow-[0_0_10px_rgba(234,179,8,0.1)]">{entry.era}</span>
                      </div>
                      <div className="flex items-center gap-3 mb-4">
                        <div className="flex items-center gap-1.5 text-[10px] text-zinc-500 font-black uppercase tracking-widest">
                          <History size={14} className="text-red-500" />
                          <span>{entry.stats}</span>
                        </div>
                        <div className="w-1 h-1 bg-zinc-800 rounded-full" />
                        <div className="flex items-center gap-1.5 text-[10px] text-zinc-500 font-black uppercase tracking-widest">
                          <TrendingUp size={14} className="text-emerald-500" />
                          <span>Ikon</span>
                        </div>
                      </div>
                      <div className="relative">
                        <div className="absolute -left-4 top-0 bottom-0 w-1 bg-yellow-500/20 rounded-full" />
                        <p className="text-zinc-400 text-sm leading-relaxed italic pl-4 border-l border-zinc-800">
                          "{entry.description}"
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-8 pt-6 border-t border-zinc-900 flex items-center justify-between relative z-10">
                    <div className="flex -space-x-2">
                      {[1, 2, 3].map((i) => (
                        <div key={i} className="w-6 h-6 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center">
                          <Trophy size={10} className="text-yellow-500/50" />
                        </div>
                      ))}
                    </div>
                    <button className="text-[9px] font-black text-zinc-500 uppercase tracking-widest hover:text-yellow-500 transition-colors">
                      Se Full Profil
                    </button>
                  </div>
                </motion.div>
              ))
            )}
          </AnimatePresence>
        </div>
      </Card>
    </div>
  );
};

export default HallOfFame;
