import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useGame } from '../context/GameContext';
import { AlertTriangle, User, Building2, Newspaper, HeartPulse, MessageSquare, ChevronRight } from 'lucide-react';

const EventModal = () => {
  const { state, dispatch } = useGame();
  const event = state.activeEvent;

  if (!event) return null;

  const getIcon = () => {
    switch (event.category) {
      case 'player': return <User className="text-blue-400" size={32} />;
      case 'board': return <Building2 className="text-amber-400" size={32} />;
      case 'media': return <Newspaper className="text-purple-400" size={32} />;
      case 'injury': return <HeartPulse className="text-rose-400" size={32} />;
      case 'locker_room': return <MessageSquare className="text-emerald-400" size={32} />;
      default: return <AlertTriangle className="text-zinc-400" size={32} />;
    }
  };

  const severityColors = {
    high: 'text-rose-500 bg-rose-500/10 border-rose-500/20',
    medium: 'text-amber-500 bg-amber-500/10 border-amber-500/20',
    low: 'text-zinc-400 bg-zinc-400/10 border-zinc-400/20'
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 bg-zinc-950/95 backdrop-blur-2xl flex items-center justify-center z-[200] p-4 overflow-hidden">
        {/* Background Decorative Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-red-600/5 rounded-full blur-[120px]"></div>
          <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-blue-600/5 rounded-full blur-[120px]"></div>
        </div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.95, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 30 }}
          className="bg-zinc-900 border border-zinc-800 p-8 md:p-12 rounded-[3rem] max-w-2xl w-full shadow-[0_0_100px_rgba(0,0,0,0.5)] relative z-10"
        >
          {/* Header Section */}
          <div className="flex flex-col items-center text-center mb-10">
            <div className="w-20 h-20 bg-zinc-950 rounded-3xl flex items-center justify-center border border-zinc-800 shadow-inner mb-6">
              {getIcon()}
            </div>
            
            <div className={`px-4 py-1 rounded-full border text-[10px] font-black uppercase tracking-[0.2em] mb-4 ${severityColors[event.severity]}`}>
              {event.severity} Priority
            </div>

            <h2 className="text-4xl md:text-5xl font-black text-white uppercase italic tracking-tighter leading-tight mb-4">
              {event.title}
            </h2>
            
            <div className="w-12 h-1 bg-red-600 rounded-full mb-6"></div>

            <p className="text-zinc-400 text-lg md:text-xl font-medium italic leading-relaxed max-w-lg">
              "{event.description}"
            </p>
          </div>

          {/* Choices Section */}
          <div className="grid grid-cols-1 gap-4">
            {event.choices.map((choice, idx) => (
              <button
                key={idx}
                onClick={() => dispatch({ type: 'RESOLVE_EVENT', payload: { choiceIndex: idx } })}
                className="group relative flex items-center justify-between p-6 bg-zinc-950/50 border border-zinc-800 rounded-2xl hover:border-red-600/50 hover:bg-zinc-950 transition-all text-left overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-red-600/0 via-red-600/0 to-red-600/5 translate-x-full group-hover:translate-x-0 transition-transform duration-500"></div>
                
                <div className="relative z-10 flex-1">
                  <span className="text-sm font-black text-zinc-100 uppercase tracking-widest group-hover:text-red-500 transition-colors block mb-2">
                    {choice.label}
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {Object.entries(choice.effects).map(([key, val]) => {
                      const numVal = val as number;
                      if (numVal === 0) return null;
                      return (
                        <span key={key} className={`text-[9px] font-black px-2 py-0.5 rounded-md bg-zinc-900 border border-zinc-800 ${numVal > 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
                          {numVal > 0 ? '+' : ''}{numVal} {key.replace(/([A-Z])/g, ' $1').trim()}
                        </span>
                      );
                    })}
                  </div>
                </div>

                <ChevronRight className="relative z-10 text-zinc-700 group-hover:text-red-500 group-hover:translate-x-1 transition-all" size={20} />
              </button>
            ))}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default EventModal;
