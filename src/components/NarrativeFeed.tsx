import React from 'react';
import { useGame } from '../context/GameContext';
import { motion, AnimatePresence } from 'motion/react';
import { Activity, Bell, AlertCircle, CheckCircle, Info } from 'lucide-react';

const NarrativeFeed = () => {
  const { state } = useGame();

  const getTypeStyles = (type: string) => {
    switch (type) {
      case 'positive': return {
        color: 'text-emerald-400',
        bg: 'bg-emerald-500/10',
        border: 'border-emerald-500/20',
        icon: <CheckCircle size={14} className="text-emerald-500" />
      };
      case 'negative': return {
        color: 'text-red-400',
        bg: 'bg-red-500/10',
        border: 'border-red-500/20',
        icon: <AlertCircle size={14} className="text-red-500" />
      };
      case 'urgent': return {
        color: 'text-yellow-400',
        bg: 'bg-yellow-500/10',
        border: 'border-yellow-500/20',
        icon: <Bell size={14} className="text-yellow-500" />
      };
      default: return {
        color: 'text-zinc-400',
        bg: 'bg-zinc-800/20',
        border: 'border-zinc-800',
        icon: <Info size={14} className="text-zinc-500" />
      };
    }
  };

  return (
    <div className="bg-zinc-950 border border-zinc-800 rounded-3xl shadow-2xl flex flex-col h-full overflow-hidden group hover:border-zinc-700 transition-all duration-500">
      <div className="p-6 border-b border-zinc-900 bg-zinc-900/20 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-red-600/10 rounded-xl flex items-center justify-center border border-red-500/20">
            <Activity className="text-red-500" size={20} />
          </div>
          <div>
            <h3 className="text-sm font-black text-white uppercase tracking-widest italic">Live Feed</h3>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.8)]"></span>
              <span className="text-[9px] font-black text-zinc-500 uppercase tracking-widest">Operational Status</span>
            </div>
          </div>
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar bg-zinc-950/50">
        <AnimatePresence mode="popLayout">
          {state.newsFeed.map((news, idx) => {
            const styles = getTypeStyles(news.type);
            return (
              <motion.div 
                key={news.id} 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.05 }}
                className={`p-4 rounded-2xl border ${styles.border} ${styles.bg} group/item hover:scale-[1.02] transition-all duration-300 shadow-lg`}
              >
                <div className="flex items-start gap-3">
                  <div className="mt-1 shrink-0">
                    {styles.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1.5">
                      <span className={`text-[8px] font-black uppercase tracking-widest ${styles.color}`}>
                        {news.type === 'urgent' ? 'Urgent' : news.type === 'positive' ? 'Success' : news.type === 'negative' ? 'Crisis' : 'Info'}
                      </span>
                      <span className="text-[8px] font-black text-zinc-600 uppercase tracking-widest">
                        {new Date(news.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    <p className="text-xs font-bold text-zinc-200 leading-relaxed italic">
                      {news.text}
                    </p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>

        {state.newsFeed.length === 0 && (
          <div className="py-20 flex flex-col items-center justify-center space-y-4 opacity-20">
            <Activity size={48} className="text-zinc-500" />
            <p className="text-[10px] text-zinc-500 font-black uppercase tracking-widest">No activity logged</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default NarrativeFeed;
