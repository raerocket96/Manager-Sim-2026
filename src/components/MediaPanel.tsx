import React from 'react';
import { motion } from 'motion/react';
import { Newspaper, TrendingUp, TrendingDown, Minus, ExternalLink, Globe, AlertTriangle } from 'lucide-react';
import { useGame } from '../context/GameContext';
import { MEDIA_OUTLETS } from '../engines/mediaEngine';

export const MediaPanel: React.FC = () => {
  const { state } = useGame();
  const headlines = state.mediaHeadlines || [];

  const getSource = (id: string) => MEDIA_OUTLETS.find(o => o.id === id);

  const getToneIcon = (tone: 'positive' | 'neutral' | 'negative') => {
    switch (tone) {
      case 'positive': return <TrendingUp size={14} className="text-green-500" />;
      case 'negative': return <TrendingDown size={14} className="text-red-500" />;
      default: return <Minus size={14} className="text-zinc-500" />;
    }
  };

  const getStyleColor = (style: string) => {
    switch (style) {
      case 'tabloid': return 'text-red-400 border-red-900/30 bg-red-950/10';
      case 'analytical': return 'text-blue-400 border-blue-900/30 bg-blue-950/10';
      case 'fan': return 'text-yellow-400 border-yellow-900/30 bg-yellow-950/10';
      default: return 'text-zinc-400 border-zinc-700/30 bg-zinc-800/10';
    }
  };

  return (
    <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl overflow-hidden flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b border-zinc-800 bg-zinc-900/80 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-red-900/20 flex items-center justify-center border border-red-900/30">
            <Newspaper size={18} className="text-red-500" />
          </div>
          <div>
            <h3 className="text-sm font-black text-white uppercase tracking-tight">Media Center</h3>
            <p className="text-[10px] text-zinc-500 font-bold uppercase">Latest Headlines</p>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="flex flex-col items-end">
            <span className="text-[10px] text-zinc-500 font-bold uppercase">Media Pressure</span>
            <div className="flex items-center gap-2">
              <div className="w-24 h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                <div 
                  className={`h-full transition-all duration-500 ${state.mediaPressure > 70 ? 'bg-red-500' : state.mediaPressure > 40 ? 'bg-yellow-500' : 'bg-green-500'}`}
                  style={{ width: `${state.mediaPressure}%` }}
                />
              </div>
              <span className={`text-xs font-black ${state.mediaPressure > 70 ? 'text-red-500' : 'text-zinc-400'}`}>
                {state.mediaPressure}%
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Headlines List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {headlines.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-zinc-600 p-8 text-center">
            <Globe size={32} className="mb-2 opacity-20" />
            <p className="text-xs font-bold uppercase tracking-widest">No recent headlines</p>
            <p className="text-[10px] mt-1">Play a match to see media reactions</p>
          </div>
        ) : (
          headlines.map((headline, idx) => {
            const source = getSource(headline.sourceId);
            return (
              <motion.div
                key={headline.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.05 }}
                className="group relative bg-zinc-800/30 hover:bg-zinc-800/50 border border-zinc-800 hover:border-zinc-700 p-4 rounded-xl transition-all cursor-default"
              >
                <div className="flex items-start justify-between gap-4 mb-2">
                  <div className="flex items-center gap-2">
                    <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded border ${getStyleColor(source?.style || '')}`}>
                      {source?.name}
                    </span>
                    <span className="text-[9px] text-zinc-600 font-bold uppercase">
                      {new Date(headline.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  {getToneIcon(headline.tone)}
                </div>
                
                <h4 className="text-sm font-bold text-zinc-100 leading-snug group-hover:text-white transition-colors">
                  {headline.title}
                </h4>

                <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <ExternalLink size={12} className="text-zinc-600" />
                </div>
              </motion.div>
            );
          })
        )}
      </div>

      {/* Footer / Narrative Pressure */}
      {state.mediaPressure > 60 && (
        <div className="p-3 bg-red-950/20 border-t border-red-900/30 flex items-center gap-3">
          <AlertTriangle size={16} className="text-red-500 shrink-0" />
          <p className="text-[10px] text-red-200 font-medium leading-tight">
            The media is circling. High pressure is affecting squad morale and board trust.
          </p>
        </div>
      )}
    </div>
  );
};
