import React from 'react';
import { useGame } from '../context/GameContext';
import { 
  Users, 
  PlayCircle, 
  PoundSterling, 
  GraduationCap, 
  Activity, 
  Stethoscope, 
  Building2, 
  MessageSquare, 
  History, 
  Trophy,
  LayoutDashboard,
  Target,
  Crown,
  ShieldCheck,
  Settings,
  LogOut
} from 'lucide-react';

interface SidebarProps {
  currentScreen: string;
  setCurrentScreen: (screen: any) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ currentScreen, setCurrentScreen }) => {
  const { state } = useGame();
  const sections = [
    {
      title: 'Core Operations',
      items: [
        { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { id: 'squad', label: 'First Team', icon: Users },
        { id: 'match', label: 'Matchday', icon: PlayCircle },
        { id: 'tactics', label: 'Tactical Centre', icon: Target },
        { id: 'league', label: 'League Table', icon: Trophy },
      ]
    },
    {
      title: 'Management & Development',
      items: [
        { id: 'transfers', label: 'Transfers', icon: PoundSterling },
        { id: 'academy', label: 'Academy', icon: GraduationCap },
        { id: 'training', label: 'Training Ground', icon: Activity },
        { id: 'medical', label: 'Medical Centre', icon: Stethoscope },
        { id: 'staff', label: 'Coaching Staff', icon: ShieldCheck },
      ]
    },
    {
      title: 'Club Identity',
      items: [
        { id: 'facilities', label: 'Infrastructure', icon: Building2 },
        { id: 'commercial', label: 'Commercial', icon: PoundSterling },
        { id: 'dressing', label: 'Dressing Room', icon: MessageSquare },
        { id: 'history', label: 'Club History', icon: History },
      ]
    }
  ];

  return (
    <div className="w-72 bg-zinc-950 border-r border-zinc-900 flex flex-col h-full shrink-0 z-50 shadow-[20px_0_50px_rgba(0,0,0,0.5)]">
      {/* Brand Header */}
      <div className="p-10 flex items-center gap-5 border-b border-zinc-900/50 mb-6 bg-gradient-to-b from-zinc-900/20 to-transparent">
        <div className="relative group">
          <div 
            className="absolute -inset-1 rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"
            style={{ backgroundColor: state.clubProfile?.primaryColor }}
          ></div>
          <div 
            className="relative w-14 h-14 bg-zinc-900 border rounded-2xl flex items-center justify-center font-black text-2xl shadow-2xl transform -rotate-3 group-hover:rotate-0 transition-transform duration-500"
            style={{ borderColor: state.clubProfile?.primaryColor, color: state.clubProfile?.primaryColor }}
          >
            {state.clubProfile?.shortName.slice(0, 2).toUpperCase()}
          </div>
        </div>
        <div>
          <h1 className="font-black text-2xl tracking-tighter text-white uppercase leading-none italic">{state.clubProfile?.name.split(' ')[0]}</h1>
          <p className="text-[9px] text-zinc-600 font-black uppercase tracking-[0.4em] mt-2 flex items-center gap-2">
            <Crown size={10} className="text-yellow-600" />
            {state.clubProfile?.shortName.toUpperCase()} OPERATIONS
          </p>
        </div>
      </div>
      
      {/* Navigation */}
      <nav className="flex-1 px-6 space-y-10 overflow-y-auto custom-scrollbar pb-10">
        {sections.map((section) => (
          <div key={section.title} className="animate-in fade-in slide-in-from-left-4 duration-500">
            <h3 className="px-4 text-[9px] font-black text-zinc-700 uppercase tracking-[0.3em] mb-4 flex items-center gap-3">
              <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: state.clubProfile?.primaryColor }}></span>
              {section.title}
            </h3>
            <div className="space-y-1.5">
              {section.items.map((item) => {
                const Icon = item.icon;
                const isActive = currentScreen === item.id;
                return (
                    <button
                      key={item.id}
                      onClick={() => setCurrentScreen(item.id)}
                      className={`w-full flex items-center gap-4 px-5 py-3.5 rounded-2xl transition-all duration-300 group relative overflow-hidden ${
                        isActive 
                          ? 'text-white shadow-[0_15px_30px_rgba(220,38,38,0.25)]' 
                          : 'text-zinc-500 hover:bg-zinc-900/50 hover:text-zinc-200'
                      }`}
                      style={isActive ? { backgroundColor: state.clubProfile?.primaryColor } : {}}
                    >
                    {isActive && (
                      <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 -translate-x-full animate-[shimmer_2s_infinite]"></div>
                    )}
                    <Icon size={20} className={`${isActive ? 'text-white' : 'text-zinc-600 group-hover:text-red-500'} transition-colors duration-300`} />
                    <span className={`text-[11px] font-black uppercase tracking-[0.15em] ${isActive ? 'italic' : ''}`}>{item.label}</span>
                    {isActive && <div className="ml-auto w-1.5 h-1.5 bg-white rounded-full shadow-[0_0_10px_#fff]"></div>}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </nav>
      
      {/* Footer Info */}
      <div className="p-8 border-t border-zinc-900/50 bg-gradient-to-t from-zinc-900/20 to-transparent">
        <div className="bg-zinc-900/30 rounded-[2rem] p-5 border border-zinc-800/50 hover:border-red-900/30 transition-colors group cursor-default">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(16,185,129,0.5)]"></div>
            <p className="text-[9px] text-zinc-600 font-black uppercase tracking-[0.3em]">System Status</p>
          </div>
          <p className="text-[11px] text-zinc-400 font-black uppercase tracking-tighter italic group-hover:text-white transition-colors">{state.clubProfile?.stadium}</p>
          <div className="mt-4 flex items-center justify-between">
            <button className="text-zinc-700 hover:text-zinc-400 transition-colors">
              <Settings size={14} />
            </button>
            <button className="text-zinc-700 hover:text-red-900 transition-colors">
              <LogOut size={14} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
