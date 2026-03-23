import React from 'react';
import { useGame } from '../context/GameContext';
import { 
  AlertTriangle, 
  ChevronRight, 
  Trophy, 
  Target, 
  Zap, 
  TrendingUp,
  Activity,
  ShieldCheck,
  Users,
  MessageSquare
} from 'lucide-react';
import { motion } from 'motion/react';

const Dashboard = ({ setCurrentScreen }: { setCurrentScreen: (s: string) => void }) => {
  const { state } = useGame();
  
  const nextFixture = state.fixtures[state.currentFixtureIndex];
  const unreadNews = state.news.filter(n => !n.read).length;

  return (
    <div className="w-full space-y-10 animate-in fade-in duration-700">
      {/* Header Section */}
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-zinc-900/50 pb-10">
        <div>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-2 h-2 bg-red-600 rounded-full animate-pulse shadow-[0_0_10px_rgba(220,38,38,0.5)]"></div>
            <span className="text-[10px] font-black text-zinc-600 uppercase tracking-[0.4em]">Operational Status: Active</span>
          </div>
          <h2 className="text-6xl font-black tracking-tighter text-white uppercase italic leading-none">
            Football Operations <span className="text-red-600">Dashboard</span>
          </h2>
          <p className="text-zinc-500 mt-4 font-bold italic text-lg">Welcome back, Boss. The whole world is watching "{state.clubProfile?.stadium}".</p>
        </div>
        
        <div className="flex gap-4">
          <QuickStat label="Club Identity" value={`${state.clubIdentityScore}%`} icon={Zap} color="text-red-500" />
          <QuickStat label="PSR Status" value="Safe" icon={TrendingUp} color="text-emerald-500" />
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Next Match Card */}
        <div className="lg:col-span-8 group">
          <div className="h-full bg-zinc-900/40 border border-zinc-800/50 rounded-[2.5rem] p-10 relative overflow-hidden hover:border-red-900/30 transition-all duration-500 shadow-2xl">
            <div className="absolute top-0 right-0 w-96 h-96 bg-red-600/5 rounded-full blur-[100px] -mr-32 -mt-32 pointer-events-none group-hover:bg-red-600/10 transition-colors duration-700"></div>
            
            <div className="flex justify-between items-start mb-12 relative z-10">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <Target size={16} style={{ color: state.clubProfile?.primaryColor }} />
                  <h3 className="text-[10px] font-black uppercase tracking-[0.3em]" style={{ color: state.clubProfile?.primaryColor }}>Next Operation</h3>
                </div>
                <p className="text-zinc-500 text-xs font-bold uppercase tracking-widest italic">Premier League • Week {state.week}</p>
              </div>
              <button 
                onClick={() => setCurrentScreen('match')}
                className="group/btn relative px-8 py-4 bg-zinc-950 text-white rounded-2xl font-black uppercase tracking-[0.2em] text-[10px] transition-all transform hover:-translate-y-1 border border-zinc-800 shadow-xl overflow-hidden"
                style={{ '--hover-bg': state.clubProfile?.primaryColor, '--hover-border': `${state.clubProfile?.primaryColor}CC` } as any}
              >
                <span className="relative z-10 flex items-center gap-3">Go to Matchday <ChevronRight size={14} className="group-hover/btn:translate-x-1 transition-transform" /></span>
                <div 
                  className="absolute inset-0 -translate-x-full group-hover/btn:translate-x-0 transition-transform duration-500"
                  style={{ backgroundColor: state.clubProfile?.primaryColor }}
                ></div>
              </button>
            </div>

            {nextFixture ? (
              <div className="flex items-center justify-between px-10 py-6 relative z-10">
                <TeamDisplay name={nextFixture.isHome ? (state.clubProfile?.shortName || 'Club') : nextFixture.opponent} isPlayerClub={nextFixture.isHome} />
                
                <div className="flex flex-col items-center gap-4">
                  <div className="w-16 h-16 bg-zinc-950 rounded-full flex items-center justify-center border border-zinc-800 shadow-inner">
                    <span className="text-zinc-700 font-black italic text-xl">VS</span>
                  </div>
                  <div className="px-4 py-1.5 bg-zinc-950 rounded-full border border-zinc-800">
                    <span className="text-[9px] font-black text-zinc-500 uppercase tracking-widest">{nextFixture.isHome ? state.clubProfile?.stadium : 'Away'}</span>
                  </div>
                </div>
                
                <TeamDisplay name={!nextFixture.isHome ? (state.clubProfile?.shortName || 'Club') : nextFixture.opponent} isPlayerClub={!nextFixture.isHome} />
              </div>
            ) : (
              <div className="py-20 text-center">
                <p className="text-zinc-600 font-black uppercase tracking-[0.5em] italic">Season Completed</p>
              </div>
            )}
          </div>
        </div>

        {/* Season Status Card */}
        <div className="lg:col-span-4">
          <div className="h-full bg-zinc-900/40 border border-zinc-800/50 rounded-[2.5rem] p-10 shadow-2xl hover:border-yellow-900/20 transition-all duration-500">
            <div className="flex items-center gap-4 mb-10">
              <div 
                className="w-12 h-12 rounded-2xl flex items-center justify-center border shadow-inner"
                style={{ 
                  backgroundColor: `${state.clubProfile?.primaryColor}1A`,
                  borderColor: `${state.clubProfile?.primaryColor}33`
                }}
              >
                <Trophy size={24} style={{ color: state.clubProfile?.primaryColor }} />
              </div>
              <div>
                <h3 className="text-[10px] font-black text-zinc-600 uppercase tracking-[0.3em] mb-1">Season Status</h3>
                <p className="text-white font-black uppercase tracking-tighter italic">Premier League Table</p>
              </div>
            </div>
            
            <div className="space-y-4">
              <StatusRow label="Matches Played" value={state.played} />
              <StatusRow label="Points" value={state.points} />
              <StatusRow label="Goal Difference" value={state.goalsFor - state.goalsAgainst} highlight />
              
              <div className="pt-6 border-t border-zinc-800/50">
                <p className="text-[9px] text-zinc-600 font-black uppercase tracking-[0.3em] mb-4">Last 5 Matches</p>
                <div className="flex gap-2.5">
                  {state.fixtures.filter(f => f.played).slice(-5).map((f, i) => {
                    const win = f.result!.goalsFor > f.result!.goalsAgainst;
                    const draw = f.result!.goalsFor === f.result!.goalsAgainst;
                    return (
                      <motion.div 
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: i * 0.1 }}
                        key={i} 
                        className={`w-10 h-10 rounded-xl flex items-center justify-center text-xs font-black italic shadow-lg ${
                          win ? 'text-white' : 
                          draw ? 'bg-yellow-600 text-white shadow-yellow-900/20' : 
                          'bg-red-600 text-white shadow-red-900/20'
                        }`}
                        style={win ? { 
                          backgroundColor: state.clubProfile?.primaryColor,
                          boxShadow: `0 5px 15px ${state.clubProfile?.primaryColor}4D`
                        } : {}}
                      >
                        {win ? 'W' : draw ? 'D' : 'L'}
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Inbox Section */}
        <div className="lg:col-span-12">
          <div className="bg-zinc-900/40 border border-zinc-800/50 rounded-[2.5rem] p-10 shadow-2xl">
            <div className="flex justify-between items-center mb-10">
              <div className="flex items-center gap-4">
                <div 
                  className="w-12 h-12 rounded-2xl flex items-center justify-center border shadow-inner"
                  style={{ 
                    backgroundColor: `${state.clubProfile?.primaryColor}1A`,
                    borderColor: `${state.clubProfile?.primaryColor}33`
                  }}
                >
                  <MessageSquare size={24} style={{ color: state.clubProfile?.primaryColor }} />
                </div>
                <div>
                  <h3 className="text-[10px] font-black text-zinc-600 uppercase tracking-[0.3em] mb-1">Inbox</h3>
                  <p className="text-white font-black uppercase tracking-tighter italic flex items-center gap-3">
                    Latest Messages
                    {unreadNews > 0 && (
                      <span 
                        className="text-white text-[9px] px-2 py-0.5 rounded-full animate-pulse"
                        style={{ 
                          backgroundColor: state.clubProfile?.primaryColor,
                          boxShadow: `0 0 10px ${state.clubProfile?.primaryColor}80`
                        }}
                      >
                        {unreadNews} NEW
                      </span>
                    )}
                  </p>
                </div>
              </div>
              <button 
                onClick={() => setCurrentScreen('office')}
                className="text-[10px] font-black text-zinc-500 hover:text-white uppercase tracking-widest transition-colors border-b border-transparent hover:border-white pb-1"
              >
                See all messages
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {state.news.slice(0, 3).map((item, i) => (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  key={item.id} 
                  className={`p-6 rounded-3xl border transition-all duration-300 group cursor-pointer ${
                    !item.read 
                      ? 'bg-zinc-950/20 hover:bg-zinc-900/30' 
                      : 'border-zinc-800/50 bg-zinc-950/20 hover:bg-zinc-900/30'
                  }`}
                  style={!item.read ? { borderColor: `${state.clubProfile?.primaryColor}4D` } : {}}
                >
                  <div className="flex items-start gap-4">
                    <div 
                      className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                        item.type === 'crisis' ? '' : 'bg-zinc-800/50 text-zinc-500'
                      }`}
                      style={item.type === 'crisis' ? { 
                        backgroundColor: `${state.clubProfile?.primaryColor}33`, 
                        color: state.clubProfile?.primaryColor 
                      } : {}}
                    >
                      {item.type === 'crisis' ? <AlertTriangle size={18} /> : <Zap size={18} />}
                    </div>
                    <div>
                      <h4 className={`text-sm font-black uppercase tracking-tight mb-2 ${!item.read ? 'text-white' : 'text-zinc-400'}`}>
                        {item.title}
                      </h4>
                      <p className="text-xs text-zinc-500 font-bold italic line-clamp-2 leading-relaxed">
                        {item.content}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const QuickStat = ({ label, value, icon: Icon, color }: any) => (
  <div className="px-6 py-4 bg-zinc-900/50 border border-zinc-800/50 rounded-2xl flex items-center gap-4 group cursor-default hover:border-zinc-700 transition-all">
    <div className={`w-10 h-10 rounded-xl flex items-center justify-center bg-zinc-950 border border-zinc-800 group-hover:scale-110 transition-transform ${color}`}>
      <Icon size={18} />
    </div>
    <div>
      <p className="text-[9px] text-zinc-600 font-black uppercase tracking-widest mb-0.5">{label}</p>
      <p className="text-sm font-black text-white italic">{value}</p>
    </div>
  </div>
);

const TeamDisplay = ({ name, isPlayerClub }: { name: string, isPlayerClub: boolean }) => {
  const { state } = useGame();
  return (
    <div className="flex flex-col items-center gap-6 group cursor-default">
      <div 
        className={`w-28 h-28 rounded-[2rem] flex items-center justify-center text-4xl font-black italic border-4 transition-all duration-500 shadow-2xl ${
          isPlayerClub ? 'text-white rotate-3 group-hover:rotate-0' : 'bg-zinc-800 border-zinc-700 text-zinc-400 -rotate-3 group-hover:rotate-0'
        }`}
        style={isPlayerClub ? { 
          backgroundColor: state.clubProfile?.primaryColor, 
          borderColor: `${state.clubProfile?.primaryColor}CC`,
          boxShadow: `0 20px 40px ${state.clubProfile?.primaryColor}33`
        } : {}}
      >
        {name.substring(0, 2).toUpperCase()}
      </div>
      <span 
        className="font-black text-xl text-white uppercase tracking-tighter italic transition-colors"
        style={{ '--hover-color': state.clubProfile?.primaryColor } as any}
      >
        {name}
      </span>
    </div>
  );
};

const StatusRow = ({ label, value, highlight }: { label: string, value: any, highlight?: boolean }) => {
  const { state } = useGame();
  return (
    <div className="flex justify-between items-center p-5 bg-zinc-950/50 rounded-2xl border border-zinc-800/30 hover:border-zinc-700 transition-all group">
      <span className="text-[11px] text-zinc-500 font-black uppercase tracking-widest group-hover:text-zinc-300 transition-colors">{label}</span>
      <span 
        className={`font-black text-2xl italic tracking-tighter ${highlight ? '' : 'text-white'}`}
        style={highlight ? { color: state.clubProfile?.primaryColor } : {}}
      >
        {value}
      </span>
    </div>
  );
};

export default Dashboard;
