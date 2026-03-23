import React from 'react';
import { useGame } from '../context/GameContext';
import { 
  Calendar, 
  PoundSterling, 
  ShieldCheck,
  Play,
  Save,
  CloudRain,
  CloudSnow,
  Sun,
  Activity,
  Zap
} from 'lucide-react';

const TopBar = ({ onPlayMatch, onOpenSave }: { onPlayMatch: () => void, onOpenSave: () => void }) => {
  const { state } = useGame();

  const getStatColor = (val: number, invert: boolean = false) => {
    if (invert) {
      if (val > 70) return 'text-red-500';
      if (val > 40) return 'text-yellow-500';
      return 'text-emerald-500';
    }
    if (val > 70) return 'text-emerald-500';
    if (val > 40) return 'text-yellow-500';
    return 'text-red-500';
  };

  const weatherIcons: Record<string, React.ReactNode> = {
    'Clear': <Sun className="text-yellow-500" size={14} />,
    'Rain': <CloudRain className="text-blue-400" size={14} />,
    'Snow': <CloudSnow className="text-white" size={14} />,
    'Heatwave': <Sun className="text-orange-500 animate-pulse" size={14} />
  };

  return (
    <div className="h-20 bg-zinc-950/90 backdrop-blur-2xl border-b border-zinc-900 flex items-center justify-between px-10 shrink-0 z-40 sticky top-0 shadow-2xl">
      <div className="flex items-center gap-10">
        <div className="flex items-center gap-4 group cursor-default">
          <div 
            className="w-10 h-10 rounded-xl flex items-center justify-center border transition-all"
            style={{ 
              backgroundColor: `${state.clubProfile?.primaryColor}1A`, // 10% opacity
              borderColor: `${state.clubProfile?.primaryColor}33` // 20% opacity
            }}
          >
            <Calendar size={18} style={{ color: state.clubProfile?.primaryColor }} />
          </div>
          <div className="flex flex-col">
            <span className="text-[9px] font-black text-zinc-600 uppercase tracking-[0.3em] mb-0.5">Operational Week</span>
            <span className="text-sm font-black text-white uppercase tracking-tighter italic">Week {state.week} • {state.databaseYear}</span>
          </div>
        </div>

        <div className="h-10 w-px bg-zinc-900/50"></div>

        <div className="flex items-center gap-10">
          <Stat icon={PoundSterling} label="PSR Headroom" value={`£${state.psrHeadroom}M`} color="text-emerald-400" />
          <Stat icon={ShieldCheck} label="Board Trust" value={`${state.boardTrust}%`} color={getStatColor(state.boardTrust)} />
          <Stat icon={Activity} label="Atmosphere" value={`${state.supporterAtmosphere}%`} color={getStatColor(state.supporterAtmosphere)} />
          
          <div className="flex flex-col items-center group cursor-default">
            <div className="flex items-center gap-2 text-[9px] text-zinc-600 font-black uppercase tracking-widest mb-1 group-hover:text-zinc-400 transition-colors">
              {weatherIcons[state.weather] || <Sun size={14} />}
              <span>Weather</span>
            </div>
            <span className="text-[11px] font-black text-zinc-300 uppercase tracking-tighter italic">{state.weather}</span>
          </div>
        </div>
      </div>
      
      <div className="flex items-center gap-4">
        <button 
          onClick={onOpenSave}
          className="w-12 h-12 bg-zinc-900/50 hover:bg-zinc-800 text-zinc-500 hover:text-white rounded-2xl transition-all border border-zinc-800 flex items-center justify-center group shadow-lg" 
          title="Save / Load Game"
        >
          <Save size={20} className="group-hover:scale-110 transition-transform" />
        </button>
        
        <div className="w-px h-10 bg-zinc-900/50 mx-2"></div>
        
        <button 
          onClick={onPlayMatch}
          className="relative group flex items-center gap-4 px-8 py-4 text-white rounded-2xl font-black uppercase tracking-[0.2em] text-[11px] transition-all hover:-translate-y-1 overflow-hidden"
          style={{ 
            backgroundColor: state.clubProfile?.primaryColor,
            boxShadow: `0 10px 30px ${state.clubProfile?.primaryColor}66` // 40% opacity
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
          <Zap size={16} className="text-yellow-400 fill-yellow-400 animate-pulse" />
          <span className="relative z-10 italic">Play Next Match</span>
          <Play size={14} fill="currentColor" className="relative z-10 ml-1 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
    </div>
  );
};

const Stat = ({ icon: Icon, label, value, color }: any) => (
  <div className="flex flex-col items-center group cursor-default">
    <div className="flex items-center gap-2 text-[9px] text-zinc-600 font-black uppercase tracking-widest mb-1 group-hover:text-zinc-400 transition-colors">
      <Icon size={12} className="text-zinc-500" />
      <span>{label}</span>
    </div>
    <span className={`font-black text-xs tracking-tight italic ${color} group-hover:scale-110 transition-transform`}>{value}</span>
  </div>
);

export default TopBar;
