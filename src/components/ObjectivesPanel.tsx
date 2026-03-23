import React from 'react';
import { useGame } from '../context/GameContext';
import { Target, Trophy, CheckCircle2, XCircle, Clock, TrendingUp, Users, Goal } from 'lucide-react';
import { motion } from 'motion/react';

const ObjectivesPanel = () => {
  const { state } = useGame();

  const getIcon = (type: string) => {
    switch (type) {
      case 'league': return <Trophy className="text-amber-400" size={18} />;
      case 'goals': return <Goal className="text-blue-400" size={18} />;
      case 'academy': return <Users className="text-emerald-400" size={18} />;
      case 'morale': return <TrendingUp className="text-rose-400" size={18} />;
      default: return <Target className="text-zinc-400" size={18} />;
    }
  };

  return (
    <div className="bg-zinc-900/50 border border-zinc-800 rounded-3xl p-6 backdrop-blur-sm">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h3 className="text-2xl font-black text-white uppercase italic tracking-tighter">Club Objectives</h3>
          <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Season 2025/26</p>
        </div>
        <div className="w-10 h-10 bg-zinc-950 rounded-xl flex items-center justify-center border border-zinc-800">
          <Target className="text-red-500" size={20} />
        </div>
      </div>

      <div className="space-y-6">
        {state.objectives.map((obj, idx) => {
          const progress = Math.min(100, (obj.progress / obj.target) * 100);
          const isCompleted = obj.status === 'completed';
          const isFailed = obj.status === 'failed';

          return (
            <motion.div 
              key={obj.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.1 }}
              className={`relative group p-5 rounded-2xl border transition-all ${
                isCompleted ? 'bg-emerald-500/5 border-emerald-500/20' :
                isFailed ? 'bg-rose-500/5 border-rose-500/20' :
                'bg-zinc-950/50 border-zinc-800 hover:border-zinc-700'
              }`}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center border ${
                    isCompleted ? 'bg-emerald-500/10 border-emerald-500/20' :
                    isFailed ? 'bg-rose-500/10 border-rose-500/20' :
                    'bg-zinc-900 border-zinc-800'
                  }`}>
                    {isCompleted ? <CheckCircle2 className="text-emerald-500" size={20} /> :
                     isFailed ? <XCircle className="text-rose-500" size={20} /> :
                     getIcon(obj.type)}
                  </div>
                  <div>
                    <h4 className={`text-sm font-black uppercase tracking-tight italic ${
                      isCompleted ? 'text-emerald-400' : isFailed ? 'text-rose-400' : 'text-zinc-100'
                    }`}>
                      {obj.title}
                    </h4>
                    <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
                      Target: {obj.target}
                    </p>
                  </div>
                </div>

                {!isCompleted && !isFailed && (
                  <div className="flex items-center gap-1.5 px-2 py-1 bg-zinc-900 border border-zinc-800 rounded-lg">
                    <Clock className="text-zinc-500" size={10} />
                    <span className="text-[9px] font-black text-zinc-400 uppercase tracking-tighter">
                      Week {obj.deadline}
                    </span>
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-end">
                  <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Progress</span>
                  <span className={`text-xs font-black italic ${
                    isCompleted ? 'text-emerald-500' : isFailed ? 'text-rose-500' : 'text-white'
                  }`}>
                    {obj.progress} / {obj.target}
                  </span>
                </div>
                <div className="h-1.5 bg-zinc-900 rounded-full overflow-hidden border border-zinc-800/50">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    className={`h-full rounded-full ${
                      isCompleted ? 'bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.3)]' :
                      isFailed ? 'bg-rose-500 shadow-[0_0_10px_rgba(244,63,94,0.3)]' :
                      'bg-gradient-to-r from-red-600 to-red-500'
                    }`}
                  />
                </div>
              </div>

              {/* Status Overlay for finished objectives */}
              {(isCompleted || isFailed) && (
                <div className="mt-4 pt-4 border-t border-zinc-800/50 flex items-center justify-between">
                  <span className={`text-[10px] font-black uppercase tracking-[0.2em] ${
                    isCompleted ? 'text-emerald-500' : 'text-rose-500'
                  }`}>
                    {isCompleted ? 'Objective Completed' : 'Objective Failed'}
                  </span>
                  <div className="flex gap-2">
                    {Object.entries(isCompleted ? obj.reward : obj.penalty).map(([key, val]) => {
                      const numVal = val as number;
                      return (
                        <span key={key} className={`text-[8px] font-black px-1.5 py-0.5 rounded border ${
                          isCompleted ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-500' : 'bg-rose-500/10 border-rose-500/20 text-rose-500'
                        }`}>
                          {numVal > 0 ? '+' : ''}{numVal} {key.slice(0, 3).toUpperCase()}
                        </span>
                      );
                    })}
                  </div>
                </div>
              )}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default ObjectivesPanel;
