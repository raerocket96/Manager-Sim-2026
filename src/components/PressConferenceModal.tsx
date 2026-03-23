import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Mic2, Users, MessageSquare, TrendingUp, TrendingDown, AlertCircle } from 'lucide-react';
import { useGame } from '../context/GameContext';

export const PressConferenceModal: React.FC = () => {
  const { state, dispatch } = useGame();
  const pc = state.activePressConference;

  if (!pc) return null;

  const currentQuestion = pc.questions[0];

  const handleOptionSelect = (optionIndex: number) => {
    dispatch({
      type: 'RESOLVE_PRESS_QUESTION',
      payload: { questionIndex: 0, optionIndex }
    });
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-2xl overflow-hidden bg-zinc-900 border border-red-900/30 rounded-2xl shadow-2xl"
        >
          {/* Header */}
          <div className="relative h-32 bg-gradient-to-b from-red-950/50 to-zinc-900 p-6 flex items-end">
            <div className="absolute top-4 right-4 opacity-10">
              <Mic2 size={80} className="text-red-500" />
            </div>
            <div>
              <div className="flex items-center gap-2 text-red-500 text-xs font-bold uppercase tracking-widest mb-1">
                <Mic2 size={14} />
                <span>Press Conference</span>
              </div>
              <h2 className="text-2xl font-black text-white uppercase tracking-tight">{pc.title}</h2>
            </div>
          </div>

          <div className="p-8">
            <p className="text-zinc-400 text-sm mb-8 leading-relaxed italic">
              "{pc.description}"
            </p>

            {currentQuestion && (
              <div className="space-y-6">
                <div className="bg-zinc-800/50 p-6 rounded-xl border border-zinc-700/50">
                  <div className="flex gap-4">
                    <div className="w-10 h-10 rounded-full bg-zinc-700 flex items-center justify-center flex-shrink-0">
                      <Users size={20} className="text-zinc-400" />
                    </div>
                    <div>
                      <span className="text-xs text-zinc-500 font-bold uppercase mb-1 block">Journalist Question</span>
                      <p className="text-white text-lg font-medium leading-snug">
                        {currentQuestion.text}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-3">
                  {currentQuestion.options.map((option, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleOptionSelect(idx)}
                      className="group relative flex items-center justify-between p-4 bg-zinc-800 hover:bg-red-900/20 border border-zinc-700 hover:border-red-900/50 rounded-xl transition-all text-left"
                    >
                      <div className="flex items-center gap-4">
                        <div className={`w-2 h-2 rounded-full ${
                          option.tone === 'Confident' ? 'bg-blue-500' :
                          option.tone === 'Calm' ? 'bg-green-500' :
                          option.tone === 'Defensive' ? 'bg-yellow-500' : 'bg-red-500'
                        }`} />
                        <div>
                          <span className="text-[10px] text-zinc-500 font-bold uppercase block mb-0.5">{option.tone}</span>
                          <span className="text-zinc-200 font-medium group-hover:text-white transition-colors">
                            {option.label}
                          </span>
                        </div>
                      </div>
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                        <MessageSquare size={16} className="text-red-500" />
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Footer Stats Preview */}
          <div className="bg-black/40 p-4 border-t border-zinc-800 flex justify-center gap-8">
            <div className="flex items-center gap-2 text-[10px] text-zinc-500 font-bold uppercase">
              <TrendingUp size={12} className="text-green-500" />
              <span>Morale</span>
            </div>
            <div className="flex items-center gap-2 text-[10px] text-zinc-500 font-bold uppercase">
              <TrendingDown size={12} className="text-red-500" />
              <span>Pressure</span>
            </div>
            <div className="flex items-center gap-2 text-[10px] text-zinc-500 font-bold uppercase">
              <AlertCircle size={12} className="text-blue-500" />
              <span>Board Trust</span>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
