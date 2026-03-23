import React from 'react';
import { useGame } from '../context/GameContext';
import { Mail, AlertCircle, CheckCircle2, History, Inbox, MessageSquare, ArrowRight } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { motion, AnimatePresence } from 'motion/react';

const Office = () => {
  const { state, dispatch } = useGame();

  const handleMarkRead = (id: string) => {
    dispatch({ type: 'MARK_NEWS_READ', payload: id });
  };

  const handleEventChoice = (newsId: string, effect: any) => {
    dispatch({ type: 'HANDLE_EVENT', payload: effect });
    dispatch({ type: 'MARK_NEWS_READ', payload: newsId });
  };

  const unreadCount = state.news.filter(n => !n.read).length;

  return (
    <div className="space-y-10 pb-20">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div 
              className="w-12 h-12 rounded-2xl flex items-center justify-center border"
              style={{ 
                backgroundColor: `${state.clubProfile?.primaryColor}1A`,
                borderColor: `${state.clubProfile?.primaryColor}33`
              }}
            >
              <Inbox style={{ color: state.clubProfile?.primaryColor }} size={24} />
            </div>
            <h1 className="text-4xl font-black text-white uppercase tracking-tighter italic drop-shadow-2xl">Manager's Office</h1>
          </div>
          <p className="text-zinc-500 font-black uppercase tracking-[0.2em] text-[10px] ml-1">Manage media, board, and club history</p>
        </div>
        
        <div className="flex gap-4">
          <div className="px-6 py-3 bg-zinc-900/50 border border-zinc-800 rounded-2xl flex flex-col items-center justify-center min-w-[120px]">
            <span className="text-[8px] text-zinc-600 font-black uppercase tracking-widest mb-1">Unread Messages</span>
            <span className="text-xl font-black tabular-nums" style={{ color: state.clubProfile?.primaryColor }}>{unreadCount}</span>
          </div>
          <div className="px-6 py-3 bg-zinc-900/50 border border-zinc-800 rounded-2xl flex flex-col items-center justify-center min-w-[120px]">
            <span className="text-[8px] text-zinc-600 font-black uppercase tracking-widest mb-1">Seasons Completed</span>
            <span className="text-xl font-black text-white tabular-nums">{state.history.length}</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Inbox Section */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between px-2">
            <h3 className="text-sm font-black text-white uppercase tracking-widest italic flex items-center gap-2">
              <Mail size={16} style={{ color: state.clubProfile?.primaryColor }} />
              Inbox
            </h3>
            <span className="text-[9px] font-black text-zinc-500 uppercase tracking-widest">{state.news.length} Total</span>
          </div>

          <div className="space-y-4">
            <AnimatePresence mode="popLayout">
              {state.news.map((item, idx) => (
                <motion.div 
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className={`group relative overflow-hidden p-6 rounded-3xl border transition-all duration-500 ${
                    !item.read 
                      ? item.type === 'crisis' 
                        ? 'border-red-500/50 bg-red-950/20 shadow-[0_0_30px_rgba(239,68,68,0.1)]' 
                        : 'border-zinc-800 bg-zinc-900/40 hover:border-zinc-700 shadow-xl' 
                      : 'border-zinc-900 bg-zinc-950/30 opacity-60 grayscale'
                  }`}
                >
                  <div className="flex items-start gap-6">
                    <div className={`w-14 h-14 rounded-2xl shrink-0 flex items-center justify-center transition-transform group-hover:scale-110 duration-500 ${
                      item.type === 'crisis' ? 'bg-red-600/20 text-red-500 border border-red-500/20' : 
                      item.type === 'match' ? 'bg-blue-600/20 text-blue-500 border border-blue-500/20' : 
                      'bg-zinc-800 text-zinc-400 border border-zinc-700'
                    }`}
                    style={item.type === 'match' ? { backgroundColor: `${state.clubProfile?.primaryColor}33`, color: state.clubProfile?.primaryColor, borderColor: `${state.clubProfile?.primaryColor}33` } : {}}
                    >
                      {item.type === 'crisis' ? <AlertCircle size={28} /> : <Mail size={28} />}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <div className="flex items-center gap-3 mb-1">
                            <h3 className={`text-xl font-black uppercase tracking-tighter italic ${!item.read ? 'text-white' : 'text-zinc-400'}`}>
                              {item.title}
                            </h3>
                            {!item.read && (
                              <span 
                                className="w-2 h-2 rounded-full animate-pulse"
                                style={{ 
                                  backgroundColor: item.type === 'crisis' ? '#ef4444' : state.clubProfile?.primaryColor,
                                  boxShadow: `0 0 8px ${item.type === 'crisis' ? '#ef4444' : state.clubProfile?.primaryColor}CC`
                                }}
                              ></span>
                            )}
                          </div>
                          <span className="text-[9px] text-zinc-500 font-black uppercase tracking-widest">Week {item.week} • {item.type === 'crisis' ? 'CRITICAL' : 'MESSAGE'}</span>
                        </div>
                      </div>
                      <p className={`text-sm leading-relaxed mb-8 font-bold italic ${!item.read ? 'text-zinc-300' : 'text-zinc-500'}`}>
                        {item.content}
                      </p>
                      
                      {!item.read && (
                        <div className="flex flex-wrap gap-4 pt-6 border-t border-zinc-800/50">
                          {item.type === 'crisis' ? (
                            <>
                              <button 
                                onClick={() => handleEventChoice(item.id, { mediaPressure: -15, boardTrust: 5, squadMorale: -10 })}
                                className="group/btn px-8 py-4 bg-red-600 hover:bg-red-500 text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all shadow-xl shadow-red-600/20 flex items-center gap-2"
                              >
                                Go hard on the players <ArrowRight size={14} className="group-hover/btn:translate-x-1 transition-transform" />
                              </button>
                              <button 
                                onClick={() => handleEventChoice(item.id, { mediaPressure: 10, squadMorale: 5, boardTrust: -5 })}
                                className="px-8 py-4 bg-zinc-800 hover:bg-zinc-700 text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all border border-zinc-700"
                              >
                                Protect the team, take the blame
                              </button>
                            </>
                          ) : (
                            <button 
                              onClick={() => handleMarkRead(item.id)}
                              className="flex items-center gap-3 px-8 py-4 bg-zinc-900 hover:bg-zinc-800 text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all border border-zinc-800 group/btn"
                            >
                              <CheckCircle2 size={16} className="text-emerald-500" /> Mark as read
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
            
            {state.news.length === 0 && (
              <div className="bg-zinc-950 border border-zinc-900 rounded-3xl p-20 flex flex-col items-center justify-center text-zinc-600">
                <div className="w-20 h-20 bg-zinc-900 rounded-full flex items-center justify-center mb-6 opacity-20">
                  <MessageSquare size={40} />
                </div>
                <p className="font-black uppercase tracking-widest text-xs opacity-40">No messages in inbox</p>
              </div>
            )}
          </div>
        </div>

        {/* Sidebar Section: History & Stats */}
        <div className="space-y-8">
          <div className="flex items-center gap-2 px-2">
            <h3 className="text-sm font-black text-white uppercase tracking-widest italic flex items-center gap-2">
              <History size={16} style={{ color: state.clubProfile?.primaryColor }} />
              History
            </h3>
          </div>

          <div className="space-y-4">
            {state.history.length > 0 ? (
              state.history.map((h, i) => (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="p-6 bg-zinc-900/40 border border-zinc-800 rounded-3xl group hover:border-red-500/30 transition-all duration-500"
                >
                  <div className="flex justify-between items-start mb-6">
                    <div>
                      <h4 
                        className="text-2xl font-black text-white uppercase tracking-tighter italic transition-colors"
                        style={{ '--hover-color': state.clubProfile?.primaryColor } as any}
                      >Season {h.season}</h4>
                      <span className="text-[8px] text-zinc-600 font-black uppercase tracking-widest">Premier League Campaign</span>
                    </div>
                    <div className="text-right">
                      <div className="text-[8px] text-zinc-500 uppercase font-black tracking-widest mb-1">Final Position</div>
                      <div 
                        className="text-4xl font-black tracking-tighter italic"
                        style={{ color: state.clubProfile?.primaryColor, filter: `drop-shadow(0 0 10px ${state.clubProfile?.primaryColor}4D)` }}
                      >#{h.position}</div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-3 bg-zinc-950/50 rounded-2xl border border-zinc-800/50">
                      <span className="text-[8px] text-zinc-600 font-black uppercase tracking-widest block mb-1">Points</span>
                      <span className="text-lg font-black text-white tabular-nums">{h.points}</span>
                    </div>
                    <div className="p-3 bg-zinc-950/50 rounded-2xl border border-zinc-800/50">
                      <span className="text-[8px] text-zinc-600 font-black uppercase tracking-widest block mb-1">Goal Difference</span>
                      <span className={`text-lg font-black tabular-nums ${h.goalsFor - h.goalsAgainst >= 0 ? 'text-emerald-500' : 'text-red-500'}`}>
                        {h.goalsFor - h.goalsAgainst > 0 ? '+' : ''}{h.goalsFor - h.goalsAgainst}
                      </span>
                    </div>
                  </div>
                </motion.div>
              ))
            ) : (
              <div className="bg-zinc-950 border border-zinc-900 rounded-3xl p-12 flex flex-col items-center justify-center text-zinc-600 opacity-40">
                <History size={32} className="mb-4" />
                <p className="font-black uppercase tracking-widest text-[9px] text-center">First season in progress</p>
              </div>
            )}
          </div>

          {/* Manager Stats Card */}
          <div 
            className="p-8 rounded-3xl shadow-2xl relative overflow-hidden group"
            style={{ 
              background: `linear-gradient(to bottom right, ${state.clubProfile?.primaryColor}, ${state.clubProfile?.primaryColor}CC)`,
              boxShadow: `0 20px 40px ${state.clubProfile?.primaryColor}33`
            }}
          >
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform duration-700">
              <History size={120} />
            </div>
            <div className="relative z-10">
              <h4 className="text-sm font-black text-white/60 uppercase tracking-widest mb-6">Manager Profile</h4>
              <div className="space-y-6">
                <div>
                  <span className="text-[9px] text-white/40 font-black uppercase tracking-widest block mb-1">Manager Style</span>
                  <span className="text-2xl font-black text-white uppercase tracking-tighter italic">{state.managerPerk}</span>
                </div>
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <span className="text-[9px] text-white/40 font-black uppercase tracking-widest block mb-1">Trust</span>
                    <span className="text-xl font-black text-white">{state.boardTrust}%</span>
                  </div>
                  <div>
                    <span className="text-[9px] text-white/40 font-black uppercase tracking-widest block mb-1">Identity</span>
                    <span className="text-xl font-black text-white">{state.clubIdentityScore}%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Office;
